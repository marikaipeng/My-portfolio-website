const API_URL = "https://my-portfolio-website-1-ot32.onrender.com";

// smooth scroll
window.scrollToProjects = () => {
    document.getElementById("projects").scrollIntoView({ behavior: "smooth" });
};

// LOAD PROJECTS
async function loadProjects() {
    const grid = document.getElementById("project-grid");

    try {
        grid.innerHTML = "Loading...";

        const res = await fetch(`${API_URL}/projects`);
        const data = await res.json();

        grid.innerHTML = data.map(p => `
            <div class="card">
                <h3>${p.title}</h3>
                <p>${p.description}</p>
                <small>${p.techstack.join(", ")}</small>
            </div>
        `).join("");

    } catch (err) {
        grid.innerHTML = "Failed to load projects";
    }
}

// CONTACT FORM
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value
        };

        status.textContent = "Sending...";

        try {
            const res = await fetch(`${API_URL}/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.error);

            status.textContent = "Message sent successfully ✅";
            form.reset();

        } catch (err) {
            status.textContent = "Failed to send message ❌";
        }
    });

    loadProjects();
});
