// 🔥 GLOBAL API URL
const API_URL = "https://my-portfolio-website-1-ot32.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    
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
    const messagesBox = document.getElementById("messages-box");

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
            `).join(""
            );

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

        // Get form field elements
        const nameField = document.getElementById("name");
        const emailField = document.getElementById("email");
        const messageField = document.getElementById("message");

        // Validate fields exist
        if (!nameField || !emailField || !messageField) {
            console.error("Missing form fields");
            if (formStatus) formStatus.textContent = "❌ Form error";
            return;
        }

        const formData = {
            name: nameField.value.trim(),
            email: emailField.value.trim(),
            message: messageField.value.trim()
        };

        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            if (formStatus) formStatus.textContent = "❌ All fields are required";
            return;
        }

        try {
            if (formStatus) formStatus.textContent = "Sending...";

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

            if (formStatus) formStatus.textContent = "✅ Message sent successfully!";
            contactForm.reset();

        } catch (error) {
            console.error("Contact Error:", error);
            if (formStatus) formStatus.textContent = "❌ Server error. Try again.";
        }
    });

    // =========================
    // LOAD MESSAGES FROM BACKEND
    // =========================
    const loadMessages = async () => {
        if (!messagesBox) return;

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
            `).join(""
            );

        } catch (err) {
            console.error(err);
            messagesBox.innerHTML = "<p>❌ Failed to load messages</p>";
        }
    };

    // Load projects and messages on page load
    fetchProjects();
    loadMessages();
});
