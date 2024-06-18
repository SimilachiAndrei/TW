// document.getElementById('licitationForm').addEventListener('submit', function (e) {
//     e.preventDefault();
//     const projectName = document.getElementById('projectName').value;
//     const description = document.getElementById('description').value;
//     const files = document.getElementById('files').files;

//     const licitationItem = document.createElement('li');
//     licitationItem.innerHTML = `<strong>${projectName}</strong> <br> ${description} <br> ${files.length} files uploaded`;
//     document.getElementById('licitationItems').appendChild(licitationItem);

//     document.getElementById('licitationForm').reset();
// });







document.addEventListener('DOMContentLoaded', () => {
    const licitations = [
        { id: 1, title: 'Building Construction', description: 'Full building construction including foundation, structure, and finishing.', client: 'John Doe', budget: '$500,000' },
        { id: 2, title: 'Interior Finishing', description: 'Interior finishing works including painting, flooring, and electrical installations.', client: 'Jane Smith', budget: '$150,000' },
        // Add more licitations here
    ];

    const licitationList = document.getElementById('licitationList');
    const licitationSelect = document.getElementById('licitationSelect');

    // Populate licitation list
    licitations.forEach(licitation => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${licitation.title}</strong><br>
                        <em>${licitation.description}</em><br>
                        <strong>Client:</strong> ${licitation.client}<br>
                        <strong>Budget:</strong> ${licitation.budget}`;
        licitationList.appendChild(li);

        const option = document.createElement('option');
        option.value = licitation.id;
        option.textContent = licitation.title;
        licitationSelect.appendChild(option);
    });

    // Handle form submission
    const applyForm = document.getElementById('applyForm');
    applyForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const selectedLicitation = licitations.find(licitation => licitation.id == licitationSelect.value);
        if (selectedLicitation) {
            const companyName = document.getElementById('companyName').value;
            const contactDetails = document.getElementById('contactDetails').value;
            const proposal = document.getElementById('proposal').value;

            console.log('Licitation Application Submitted:');
            console.log('Licitation:', selectedLicitation.title);
            console.log('Company Name:', companyName);
            console.log('Contact Details:', contactDetails);
            console.log('Proposal:', proposal);

            alert('Your application has been submitted successfully!');
            applyForm.reset();
        } else {
            alert('Please select a valid licitation.');
        }
    });
});
