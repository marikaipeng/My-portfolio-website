document.addEventListener('DOMContentLoaded', () => {

    const API_URL = "https://my-portfolio-website-1-ot32.onrender.com";

    // Scroll button
    window.scrollToProjects = () => {
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    };

    const projectGrid = document.getElementById('project-grid');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // =========================
    // FETCH PROJECTS
    // =========================
    const fetchProjects = async () => {
        try {
            const response = await fetch(`${API_URL}/projects`);

            if (!response.ok) {
                throw new Error("API error");
            }

            const projects = await response.json();

            // Handle empty or invalid data
            if (!Array.isArray(projects) || projects.length === 0) {
                projectGrid.innerHTML = `<p>No projects found</p>`;
                return;
            }

            projectGrid.innerHTML = projects.map(project => `
                <div class="card">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <small>Tech: ${project.techstack?.join(', ') || 'N/A'}</small>
                </div>
            `).join('');

        } catch (err) {
            console.error("Project Fetch Error:", err);
            projectGrid.innerHTML = `<p>❌ Failed to load projects</p>`;
        }
    };

    // =========================
    // CONTACT FORM
    // =========================
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value
        };

        try {
            formStatus.textContent = "Sending...";

            const response = await fetch(`${API_URL}/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Failed request");
            }

            formStatus.textContent = "✅ Message sent successfully!";
            contactForm.reset();

        } catch (error) {
            console.error("Contact Error:", error);
            formStatus.textContent = "❌ Server error";
        }
    });

    fetchProjects();
});
