document.addEventListener("DOMContentLoaded", () => {

    // 🔥 YOUR LIVE BACKEND URL (FIXED)
    const API_URL = "https://my-portfolio-website-1-ot32.onrender.com";

    // =========================
    // SCROLL FUNCTION
    // =========================
    window.scrollToProjects = () => {
        const section = document.getElementById("projects");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Elements
    const projectGrid = document.getElementById("project-grid");
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    if (!projectGrid || !contactForm) {
        console.error("Missing required HTML elements");
        return;
    }

    // =========================
    // LOAD PROJECTS FROM API
    // =========================
    const fetchProjects = async () => {
        try {
            projectGrid.innerHTML = "<p>Loading projects...</p>";

            const response = await fetch(`${API_URL}/projects`);

            if (!response.ok) {
                throw new Error("Failed to fetch projects");
            }

            const projects = await response.json();

            if (!Array.isArray(projects) || projects.length === 0) {
                projectGrid.innerHTML = "<p>No projects found</p>";
                return;
            }

            projectGrid.innerHTML = projects.map(project => `
                <div class="card">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <small>Tech: ${project.techstack?.join(", ") || "N/A"}</small>
                </div>
            `).join("");

        } catch (error) {
            console.error("Project Fetch Error:", error);
            projectGrid.innerHTML = "<p>❌ Failed to load projects</p>";
        }
    };

    // =========================
    // CONTACT FORM SUBMIT
    // =========================
    contactForm.addEventListener("submit", async (e) => {
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
                throw new Error("Failed to send message");
            }

            formStatus.textContent = "✅ Message sent successfully!";
            contactForm.reset();

        } catch (error) {
            console.error("Contact Error:", error);
            formStatus.textContent = "❌ Server error. Try again.";
        }
    });

    // Load projects on page load
    fetchProjects();
});

const messagesBox = document.getElementById("messages-box");

// Load messages from backend
async function loadMessages() {
    try {
        messagesBox.innerHTML = "<p>Loading messages...</p>";

        const res = await fetch(`${API_URL}/messages`);

        if (!res.ok) throw new Error("Failed to fetch");

        const messages = await res.json();

        if (!Array.isArray(messages) || messages.length === 0) {
            messagesBox.innerHTML = "<p>No messages found</p>";
            return;
        }

        messagesBox.innerHTML = messages.map(msg => `
            <div class="card">
                <h3>${msg.name}</h3>
                <p><b>Email:</b> ${msg.email}</p>
                <p>${msg.message}</p>
                <small>ID: ${msg.id}</small>
            </div>
        `).join("");

    } catch (err) {
        console.error(err);
        messagesBox.innerHTML = "<p>❌ Failed to load messages</p>";
    }
}
