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
            const projects = await response.json();

            projectGrid.innerHTML = projects.map(project => `
                <div class="card">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <small>Tech: ${project.techstack.join(', ')}</small>
                </div>
            `).join('');

        } catch (err) {
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

            const data = await response.json();

            if (response.ok) {
                formStatus.textContent = "✅ Message sent successfully!";
                contactForm.reset();
            } else {
                formStatus.textContent = "❌ Failed to send message";
            }

        } catch (error) {
            formStatus.textContent = "❌ Server error";
        }
    });

    fetchProjects();
});
