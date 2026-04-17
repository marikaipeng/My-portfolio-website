document.addEventListener('DOMContentLoaded', () => {

    const API_URL = "https://postgresql://my_portfolio_website_j2ng_user:password@hostname:5432/dbname"; //

    window.scrollToProjects = () => {
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    };

    const projectGrid = document.getElementById('project-grid');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // FETCH PROJECTS
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

        } catch {
            projectGrid.innerHTML = `<p>Failed to load projects</p>`;
        }
    };

    // CONTACT FORM
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: name.value,
            email: email.value,
            message: message.value
        };

        try {
            formStatus.textContent = 'Sending...';

            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                formStatus.textContent = '✅ Message sent!';
                contactForm.reset();
            } else {
                throw new Error();
            }

        } catch {
            formStatus.textContent = '❌ Error sending message';
        }
    });

    fetchProjects();
});
