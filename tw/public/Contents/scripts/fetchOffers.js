document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/offers', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        });

        if (response.status === 401) {
            // Unauthorized, redirect to login page
            window.location.href = '/login';
            return;
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check if data is an array
        if (!Array.isArray(data)) {
            throw new Error('Data is not an array');
        }

        const licitationList = document.getElementById('licitationList');
        licitationList.innerHTML = '';

        data.forEach(offer => {
            const licitationItem = document.createElement('div');
            licitationItem.classList.add('licitation-item');
            licitationItem.innerHTML = `
                <h3>Phase: ${offer.phase_id}</h3>
                <h4>Company: ${offer.company_name}</h4>
                <p>Start Date: ${offer.start_date}</p>
                <p>End Date: ${offer.end_date}</p>
                <p>Price: ${offer.price}</p>
                <button class="accept-button" data-offer-id="${offer.id}">Accept Offer</button>
            `;
            licitationList.appendChild(licitationItem);

            // Add event listener for accept button
            const acceptButton = licitationItem.querySelector('.accept-button');
            acceptButton.addEventListener('click', async () => {
                try {
                    const offerId = acceptButton.getAttribute('data-offer-id');
                    const acceptResponse = await fetch('/api/acceptoffer', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                        },
                        body: JSON.stringify({ offerId })
                    });
                    
                    if (!acceptResponse.ok) {
                        throw new Error('Failed to accept offer');
                    }
                    
                    // Optionally, you can update UI or show a success message
                    acceptButton.textContent = 'Offer Accepted';
                    acceptButton.disabled = true;
                } catch (error) {
                    console.error('Error accepting offer:', error);
                    // Handle error scenario, show error message, etc.
                }
            });
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error scenario, show error message, etc.
    }
});
