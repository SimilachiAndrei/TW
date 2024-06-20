// src/Database/databaseManager.js

const { Pool } = require('pg');
const bcrypt = require('bcrypt');
// const { getCompany } = require('../Models/companyModel');

const pool = new Pool({
    user: 'web',
    host: 'localhost',
    database: 'tw',
    password: 'web',
    port: 5432,
    max: 20,
});

// Function to get a user by username
async function getUserByUsername(username) {
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return result.rows[0];
    } catch (error) {
        console.error('Error getting user:', error);
        throw error; // Re-throw the error for handling elsewhere
    }
}

// Function to add a user 
async function addUser(userData) {
    try {
        const { username, email, password, role, ...additionalData } = userData;
        if (!role) {
            throw new Error("Role is required");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, email, hashedPassword, role]
        );

        const userId = result.rows[0].id; // Get the newly created user ID

        if (role === 'client') {
            // Insert client-specific data into the clients table
            await pool.query(
                'INSERT INTO clients (user_id) VALUES ($1)',
                [userId]
            );
        } else if (role === 'company') {
            // Insert company-specific data into the companies table
            await pool.query(
                'INSERT INTO companies (user_id, company_name, company_address, company_phone, company_profile) VALUES ($1, $2, $3, $4, $5)',
                [userId, additionalData.companyName, additionalData.companyAddress, additionalData.companyPhone, additionalData.companyProfile]
            );
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
}

async function addPost(postData, clientId) {
    if (!clientId) {
        throw new Error('Client ID is required');
    }

    const { projectName, description, ...phasesObj } = postData;

    try {
        // Insert project
        const result = await pool.query(
            'INSERT INTO projects (client_id, project_name, description) VALUES ($1, $2, $3) RETURNING *',
            [clientId, projectName, description]
        );

        const projectId = result.rows[0].id; // Get the newly created project ID

        const phaseList = Object.values(phasesObj);

        // Insert phases
        for (const phase of phaseList) {
            await pool.query(
                'INSERT INTO phases (project_id, description,state) VALUES ($1, $2,$3)',
                [projectId, phase, 'notpending']
            );
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error adding post:', error);
        throw error;
    }
}

async function addLicitation(postData, clientId) {
    if (!clientId) {
        throw new Error('Client ID is required');
    }

    try {
        const jsonString = Object.keys(postData)[0]; // Get the JSON string key
        const data = JSON.parse(jsonString); // Parse the JSON string into an object
        const id = data.phaseId; // Access the id from the parsed object

        // Assuming you have a pool for database queries
        const result = await pool.query(
            'UPDATE phases SET state = $1 WHERE id = $2',
            ['pending', id]
        );

        return result.rows[0]; // Return the updated row
    } catch (error) {
        console.error('Error adding post:', error);
        throw error; // Throw error to handle it upstream
    }
}

// Assuming you have a database connection pool initialized (e.g., 'pool')

async function addOffer(data, companyId) {
    const jsonString = Object.keys(data)[0]; // Get the JSON string key
    const dates = JSON.parse(jsonString); // Parse the JSON string into an object
    const { phase_id, start_date, end_date, price } = dates;
    console.log(data);
    console.log(phase_id);
    try {
        // Check if the phase exists and its state is 'pending'
        const phaseQuery = 'SELECT state FROM phases WHERE id = $1';
        const phaseResult = await pool.query(phaseQuery, [phase_id]);

        if (phaseResult.rows.length === 0) {
            throw new Error('Phase not found');
        }

        const phaseState = phaseResult.rows[0].state;

        if (phaseState !== 'pending') {
            throw new Error('Cannot add offer for phases with state other than pending');
        }

        // Insert the offer into the offers table
        const insertQuery = `
            INSERT INTO offers (phase_id, start_date, end_date, company_id, price)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id`;
        
        const values = [phase_id, start_date, end_date, companyId, price];
        const result = await pool.query(insertQuery, values);

        return { offerId: result.rows[0].id };
    } catch (error) {
        console.error('Error adding offer:', error);
        throw error; // Re-throw the error to be handled in the controller
    }
}

module.exports = {
    addOffer,
};




//TO DO later for my account and other stuff
const getAllUserData = async (username) => {
    const query = `
        SELECT 
            u.id AS user_id, 
            u.username, 
            u.email, 
            u.role,
            p.id AS project_id,
            p.project_name,
            p.description AS project_description,
            ph.id AS phase_id,
            ph.description AS phase_description,
            ph.start_date,
            ph.end_date,
            ph.state,
            ph.company_id,
            co.company_name,
            co.company_address,
            co.company_phone,
            co.company_profile
        FROM 
            users u
        LEFT JOIN 
            clients c ON c.user_id = u.id
        LEFT JOIN 
            projects p ON p.client_id = c.user_id
        LEFT JOIN 
            phases ph ON ph.project_id = p.id
        LEFT JOIN 
            companies co ON co.id = ph.company_id
        WHERE 
            u.username = $1;
    `;
    const values = [username];

    try {
        const result = await pool.query(query, values);
        const userData = {
            user: {
                id: result.rows[0].user_id,
                username: result.rows[0].username,
                email: result.rows[0].email,
                role: result.rows[0].role
            },
            projects: result.rows.reduce((projects, row) => {
                let project = projects.find(project => project.id === row.project_id);
                if (!project) {
                    project = {
                        id: row.project_id,
                        name: row.project_name,
                        description: row.project_description,
                        phases: []
                    };
                    projects.push(project);
                }
                if (row.phase_id) {
                    project.phases.push({
                        id: row.phase_id,
                        description: row.phase_description,
                        startDate: row.start_date,
                        endDate: row.end_date,
                        state: row.state,
                        company: row.company_id ? {
                            id: row.company_id,
                            name: row.company_name,
                            address: row.company_address,
                            phone: row.company_phone,
                            profile: row.company_profile
                        } : null
                    });
                }
                return projects;
            }, [])
        };
        return userData;
    } catch (error) {
        console.error('Error retrieving all user data:', error);
        throw error;
    }
};

const getCompanies = async () => {
    const query = `
        SELECT 
            co.id AS company_id,
            co.company_name,
            co.company_address,
            co.company_phone,
            co.company_profile,
            i.id AS image_id,
            i.name AS image_name,
            i.data AS image_data
        FROM 
            companies co
        LEFT JOIN 
            images i ON i.profile_picture = co.user_id;
    `;

    try {
        const result = await pool.query(query);
        const companiesData = result.rows.map(row => ({
            company: {
                id: row.company_id,
                name: row.company_name,
                address: row.company_address,
                phone: row.company_phone,
                profile: row.company_profile
            },
            image: {
                id: row.image_id,
                name: row.image_name,
                data: row.image_data
            }
        }));
        return companiesData;
    } catch (error) {
        console.error('Error retrieving company data:', error);
        throw error;
    }
};

async function addMotto(userData, id) {
    try {
        // Parse userData to extract the motto property
        const data = JSON.parse(Object.keys(userData)[0]); // Parse the first key (which is the JSON string)

        const motto = data.motto; // Extract the motto property

        console.log('Received motto:', motto);

        // Update the companies table with the motto
        const result = await pool.query(
            'UPDATE companies SET motto = $1 WHERE user_id = $2 RETURNING id',
            [motto, id]
        );

        const companyId = result.rows[0].id; // Get the updated company ID

        // Return the updated company information
        return result.rows[0];
    } catch (error) {
        console.error('Error adding motto:', error);
        throw error;
    }
}

async function updateOrInsertProfilePicture(userId, fileData) {
    try {
        const query = `
            INSERT INTO images (name, profile_picture, data)
            VALUES ($1, $2, $3)
            ON CONFLICT (profile_picture) DO UPDATE
            SET data = EXCLUDED.data
        `;
        const values = ['profile', userId, fileData];
        await pool.query(query, values);
    } catch (error) {
        console.error('Error in companyModel.updateOrInsertProfilePicture:', error);
        throw error;
    }
}


async function getCompany(id) {
    const query = `
        SELECT 
            co.company_name,
            co.company_address,
            co.company_phone,
            co.company_profile,
            co.motto,
            co.description,
            i.id AS image_id,
            i.name AS image_name,
            i.data AS image_data
        FROM 
            companies co
        LEFT JOIN 
            images i ON i.profile_picture = co.user_id
        WHERE 
            co.user_id = $1;
    `;

    try {
        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            throw new Error(`Company with id ${id} not found`);
        }

        const row = result.rows[0];
        const companyData = {
            company: {
                id: row.company_id,
                name: row.company_name,
                address: row.company_address,
                phone: row.company_phone,
                profile: row.company_profile,
                motto: row.motto,
                description: row.description
            },
            image: {
                id: row.image_id,
                name: row.image_name,
                data: row.image_data,
            },
        };

        return companyData;
    } catch (error) {
        console.error('Error retrieving company data:', error);
        throw error;
    }
}

// select * from phases ph join projects pr on ph.project_id = pr.id join users u on pr.client_id=u.id;

const getAvailableLicitations = async () => {
    const query = `
        SELECT
            ph.id,
            ph.project_id,
            ph.description,
            ph.start_date,
            ph.end_date,
            ph.state,
            ph.company_id,
            ph.price,
            u.username,
            u.id AS user_id,
            pr.project_name
        FROM
            phases ph
            join projects pr on ph.project_id = pr.id 
            join users u on pr.client_id=u.id
        WHERE
            ph.state = 'pending'
    `;

    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error retrieving available licitations:', error);
        throw error;
    }
};

module.exports = {
    getUserByUsername, addUser, getAllUserData, addPost,
    getCompanies, addMotto, getCompany, updateOrInsertProfilePicture, addLicitation,
    getAvailableLicitations, addOffer
};
