document.addEventListener('DOMContentLoaded', () => {

    // ✅ PUT IT HERE (TOP)
    window.scrollToProjects = () => {
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
};

    const projectGrid = document.getElementById('project-grid');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // Fetch Projects
    const fetchProjects = async () => {
        try {
            const response = await fetch('http://localhost:5000/projects');
            if (!response.ok) throw new Error('Failed to fetch projects');
            
            const projects = await response.json();
            displayProjects(projects);
        } catch (error) {
            projectGrid.innerHTML = `<p class="error">Unable to load projects.</p>`;
        }
    };

    const displayProjects = (projects) => {
        projectGrid.innerHTML = projects.map(project => `
            <div class="card">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <small>Tech: ${project.techStack.join(', ')}</small>
            </div>
        `).join('');
    };

    // Contact Form
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value
};

        try {
            formStatus.textContent = 'Sending...';

            const response = await fetch('http://localhost:5000/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                formStatus.innerHTML = '✅ Message sent!';
                contactForm.reset();
            } else {
                throw new Error();
            }

        } catch {
            formStatus.innerHTML = '❌ Error sending message';
        }
    });

    fetchProjects();
});
