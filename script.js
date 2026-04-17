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

        const form = document.getElementById("contactForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value
  };

  const response = await fetch("https://your-backend-url.onrender.com/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  alert(result.message);
});

    fetchProjects();
});
