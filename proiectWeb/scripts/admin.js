document.addEventListener("DOMContentLoaded", () => {
    const companies = ["Company A", "Company B", "Company C"];
    const filterCompanySelect = document.getElementById("filterCompany");
    const adminReviewItems = document.getElementById("adminReviewItems");

    // Example reviews data
    const reviews = [
        { id: 1, company: "Company A", rating: 5, comments: "Excellent service!", status: "pending" },
        { id: 2, company: "Company B", rating: 4, comments: "Very good, but room for improvement.", status: "pending" },
        { id: 3, company: "Company C", rating: 3, comments: "Average experience.", status: "pending" },
        { id: 4, company: "Company A", rating: 2, comments: "Not satisfied with the service.", status: "pending" },
        { id: 5, company: "Company B", rating: 1, comments: "Very poor experience.", status: "pending" },
    ];

    // Populate the company dropdown
    companies.forEach(company => {
        const option = document.createElement("option");
        option.value = company;
        option.textContent = company;
        filterCompanySelect.appendChild(option);
    });

    // Function to display reviews
    function displayReviews(filter = "") {
        adminReviewItems.innerHTML = "";
        reviews
            .filter(review => filter === "" || review.company === filter)
            .forEach(review => {
                const reviewItem = document.createElement("li");
                reviewItem.innerHTML = `
                    <div>
                        <strong>${review.company}</strong><br>
                        Rating: ${review.rating}<br>
                        ${review.comments}
                    </div>
                    <div class="admin-buttons">
                        <button class="approve" data-id="${review.id}">Approve</button>
                        <button class="reject" data-id="${review.id}">Reject</button>
                    </div>
                `;
                adminReviewItems.appendChild(reviewItem);
            });
    }

    // Initial display of all reviews
    displayReviews();

    // Filter reviews by company
    filterCompanySelect.addEventListener("change", () => {
        const selectedCompany = filterCompanySelect.value;
        displayReviews(selectedCompany);
    });

    // Approve or reject a review
    adminReviewItems.addEventListener("click", (event) => {
        if (event.target.classList.contains("approve") || event.target.classList.contains("reject")) {
            const reviewId = parseInt(event.target.dataset.id, 10);
            const reviewIndex = reviews.findIndex(review => review.id === reviewId);
            if (reviewIndex !== -1) {
                if (event.target.classList.contains("approve")) {
                    reviews[reviewIndex].status = "approved";
                    alert(`Review ${reviewId} approved.`);
                } else if (event.target.classList.contains("reject")) {
                    reviews[reviewIndex].status = "rejected";
                    alert(`Review ${reviewId} rejected.`);
                }
                // Remove the review from the UI
                reviews.splice(reviewIndex, 1);
                displayReviews(filterCompanySelect.value);
            }
        }
    });
});
