async function renderProjects() {
    const projectContainer = document.getElementById("projects-grid");
    const projectTemplate = document.getElementById("project-card-template");

    console.log("Container:", projectContainer);
    console.log("Template:", projectTemplate);

    try {
        const response = await fetch("./src/projects.json");

        if (!response.ok) {
            throw new Error("Failed to load projects.json");
        }

        const projects = await response.json();


        // Remove existing content
        projectContainer.innerHTML = "";

        // Better performance
        const fragment = document.createDocumentFragment();

        projects.forEach((project) => {
            const clone = projectTemplate.content.cloneNode(true);

            // Image
            const image = clone.querySelector(".project-card__image");
            image.src = project.image;
            image.alt = project.alt;

            // Title
            clone.querySelector(".project-card__title").textContent =
                project.title;

            // Description
            clone.querySelector(".project-card__description").textContent =
                project.description;

            // Tags
            const tagsContainer = clone.querySelector(".project-card__tags");

            project.tags.forEach((tag) => {
                const li = document.createElement("li");
                li.textContent = tag;
                tagsContainer.appendChild(li);
            });

            // View Project Button
            clone
                .querySelector(".project-view-btn")
                .dataset.projectModal = project.modal;

            // Github Button
            clone.querySelector(".project-github-btn").href =
                project.github;

            fragment.appendChild(clone);
        });

        projectContainer.appendChild(fragment);
        if (window.initScrollReveal) {
            window.initScrollReveal();
        }
    } catch (error) {
        console.error(error);
    }
}

renderProjects();