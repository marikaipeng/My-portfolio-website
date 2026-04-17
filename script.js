document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "https://my-portfolio-website-1-ot32.onrender.com";

    window.scrollToProjects = () => {
        document.getElementById("projects").scrollIntoView({ behavior: "smooth" });
    };

    const projectGrid = document.getElementById("project-grid");
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    // LOAD PROJECTS
    async function loadProjects() {
        try {
            projectGrid.innerHTML = "<p>Loading...</p>";

            const res = await fetch(`${API_URL}/projects`);
            const data = await res.json();

            projectGrid.innerHTML = data.map(p => `
                <div class="card">
                    <h3>${p.title}</h3>
                    <p>${p.description}</p>
                    <small>${p.techstack?.join(", ") || ""}</small>
                </div>
            `).join("");

        } catch (err) {
            projectGrid.innerHTML = "❌ Failed to load projects";
        }
    }

    // CONTACT FORM
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            name: name.value,
            email: email.value,
            message: message.value
        };

        formStatus.textContent = "Sending...";

        try {
            const res = await fetch(`${API_URL}/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error();

            formStatus.textContent = "✅ Message Sent!";
            contactForm.reset();

        } catch {
            formStatus.textContent = "❌ Error sending message";
        }
    });

    loadProjects();
});
