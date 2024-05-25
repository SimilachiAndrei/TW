// src/Database/databaseManager.js

const { Pool } = require('pg');
const bcrypt = require('bcrypt');

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

    try {
        const { projectName, description } = postData; // Extract necessary fields
        const result = await pool.query(
            'INSERT INTO projects (client_id, project_name, description) VALUES ($1, $2, $3) RETURNING *',
            [clientId, projectName, description]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error adding post:', error);
        throw error;
    }
}
//TO DO later for my account and other stuff
const getAllUserData = async (username) => {
    const query = `
        SELECT 
            u.id, 
            u.username, 
            u.email, 
            u.role,
            c.additional_data,
            co.company_name,
            co.company_address,
            co.company_phone,
            co.company_profile,
            p.project_name,
            p.description,
            p.start_date,
            p.end_date
        FROM 
            users u
        LEFT JOIN 
            clients c ON u.id = c.user_id
        LEFT JOIN 
            companies co ON u.id = co.user_id
        LEFT JOIN 
            projects p ON co.id = p.company_id
        WHERE 
            u.username = $1;
    `;
    const values = [username];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error retrieving all user data:', error);
        throw error;
    }
};


module.exports = { getUserByUsername, addUser, getAllUserData, addPost };
