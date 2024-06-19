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

}
