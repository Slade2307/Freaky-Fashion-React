document.addEventListener("DOMContentLoaded", function () {
    const accordionHeaders = document.querySelectorAll(".accordion-header");

    accordionHeaders.forEach((header) => {
        header.addEventListener("click", function () {
            const isExpanded = this.getAttribute("aria-expanded") === "true";
            this.setAttribute("aria-expanded", String(!isExpanded));

            const content = this.nextElementSibling;
            if (content && content.classList.contains("accordion-content")) {
                content.style.display = isExpanded ? "none" : "block";
            }

            // ✅ Close other open accordion items
            accordionHeaders.forEach((otherHeader) => {
                if (otherHeader !== this && otherHeader.getAttribute("aria-expanded") === "true") {
                    otherHeader.setAttribute("aria-expanded", "false");
                    const otherContent = otherHeader.nextElementSibling;
                    if (otherContent && otherContent.classList.contains("accordion-content")) {
                        otherContent.style.display = "none";
                    }
                }
            });
        });
    });
});
