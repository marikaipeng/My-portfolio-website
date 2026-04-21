const API_URL = "https://my-portfolio-backend-8di4.onrender.com";

// Smooth scroll
window.scrollToProjects = () => {
    const section = document.getElementById("projects");
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
    }
};

// Helper: fetch with timeout (important for Render cold start)
const fetchWithTimeout = (url, options = {}, timeout = 8000) => {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Request timeout")), timeout)
        )
    ]);
};

// LOAD PROJECTS
async function loadProjects() {
    const grid = document.getElementById("project-grid");
    if (!grid) return;

    try {
        grid.innerHTML = "Loading...";

        const res = await fetchWithTimeout(`${API_URL}/projects`);

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();

        if (!Array.isArray(data)) throw new Error("Invalid data format");

        grid.innerHTML = data.map(p => `
            <div class="card">
                <h3>${p.title || "No title"}</h3>
                <p>${p.description || "No description"}</p>
                <small>${Array.isArray(p.techstack) ? p.techstack.join(", ") : "N/A"}</small>
            </div>
        `).join("");

    } catch (err) {
        console.error(err);
        grid.innerHTML = "Failed to load projects ❌";
    }
}

// CONTACT FORM
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const data = {
                name: document.getElementById("name")?.value || "",
                email: document.getElementById("email")?.value || "",
                message: document.getElementById("message")?.value || ""
            };

            if (!data.name || !data.email || !data.message) {
                status.textContent = "Please fill all fields ⚠️";
                return;
            }

            status.textContent = "Sending...";

            try {
                const res = await fetchWithTimeout(`${API_URL}/contact`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                const text = await res.text();

                let result;
                try {
                    result = JSON.parse(text);
                } catch {
                    throw new Error("Invalid JSON from server");
                }

                if (!res.ok) throw new Error(result.error || "Request failed");

                status.textContent = "Message sent successfully ✅";
                form.reset();

            } catch (err) {
                console.error(err);
                status.textContent = err.message || "Failed to send message ❌";
            }
        });
    }

    loadProjects();
});
