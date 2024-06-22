function setupCompanyFormListeners() {
    document.getElementById('updateMottoForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const motto = formData.get('new-motto'); // Assuming 'motto' is the input name
        console.log(motto)
        const token = localStorage.getItem('jwtToken');

        fetch('/api/company/motto', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ motto })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Handle successful response
                console.log('PUT request successful:', data);
                // Optionally, update UI or notify user
            })
            .catch(error => {
                // Handle errors
                console.error('Error in PUT request:', error);
                // Optionally, update UI to show error
            });
    });


    document.getElementById('profilePictureForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const form = document.getElementById('profilePictureForm');
        const fileInput = document.getElementById('profilePictureInput');

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append('profilePicture', file);

            try {
                const response = await fetch('/api/company/profile-picture', {
                    method: 'PUT',
                    body: formData
                });

                if (response.ok) {
                    console.log('Profile picture updated successfully');
                } else {
                    console.error('Error updating profile picture:', response.statusText);
                }
            } catch (error) {
                console.error('Error updating profile picture:', error);
            }
        });
    });


    document.getElementById('updateDescriptionForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const description = formData.get('new-description');
        console.log(description)
        const token = localStorage.getItem('jwtToken');

        fetch('/api/company/description', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ description })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('PUT request successful:', data);
            })
            .catch(error => {
                console.error('Error in PUT request:', error);
            });
    });


    document.getElementById('updatePhoneForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const phone = formData.get('new-phone');
        console.log(phone)
        const token = localStorage.getItem('jwtToken');

        fetch('/api/company/phone', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ phone })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('PUT request successful:', data);
            })
            .catch(error => {
                console.error('Error in PUT request:', error);
            });
    });


    document.getElementById('updateAddressForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const address = formData.get('new-address');
        console.log(address)
        const token = localStorage.getItem('jwtToken');

        fetch('/api/company/address', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ address })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('PUT request successful:', data);
            })
            .catch(error => {
                console.error('Error in PUT request:', error);
            });
    });

    document.getElementById('updateNameForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const name = formData.get('new-name');
        console.log(name)
        const token = localStorage.getItem('jwtToken');

        fetch('/api/company/name', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('PUT request successful:', data);
            })
            .catch(error => {
                console.error('Error in PUT request:', error);
            });
    });
}

