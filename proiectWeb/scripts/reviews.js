document.addEventListener("DOMContentLoaded", () => {
    const companies = ["Houses", "Installations", "Exterior", "Interior"];
    const companyNameSelect = document.getElementById("companyName");
    const selectCompanyReviews = document.getElementById("selectCompanyReviews");
    const reviewForm = document.getElementById("reviewForm");
    const reviewItems = document.getElementById("reviewItems");
    const viewReviewsButton = document.getElementById("viewReviewsButton");

    // Populate the company dropdowns
    companies.forEach(company => {
        const option = document.createElement("option");
        option.value = company;
        option.textContent = company;
        companyNameSelect.appendChild(option);
        selectCompanyReviews.appendChild(option.cloneNode(true));
    });

    // Handle form submission
    reviewForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const companyName = companyNameSelect.value;
        const rating = document.getElementById("rating").value;
        const comments = document.getElementById("comments").value;
        const photos = document.getElementById("photos").files;

        const review = document.createElement("li");
        review.innerHTML = `<strong>${companyName}</strong><br>Rating: ${rating}<br>${comments}`;

        // Handle photos
        if (photos.length > 0) {
            const photoContainer = document.createElement("div");
            Array.from(photos).forEach(photo => {
                const img = document.createElement("img");
                img.src = URL.createObjectURL(photo);
                img.style.maxWidth = "100px";
                img.style.margin = "5px";
                photoContainer.appendChild(img);
            });
            review.appendChild(photoContainer);
        }

        reviewItems.appendChild(review);

        reviewForm.reset();
    });

    // Handle viewing reviews for a selected company
    viewReviewsButton.addEventListener("click", () => {
        const selectedCompany = selectCompanyReviews.value;
        const reviews = reviewItems.querySelectorAll("li");
        
        reviews.forEach(review => {
            review.style.display = review.innerHTML.includes(selectedCompany) ? "block" : "none";
        });
    });
});
