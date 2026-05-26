const githubUrl = 'https://api.github.com/users/xKynn/repos?per_page=100&page=1&sort=updated&order=desc&type=owner';
const targetContainer = document.getElementById('v-pills-other');
function renderRepos(repos) {
    let listItems = ''
    const data = repos;
    data.sort((a, b) => b.stargazers_count - a.stargazers_count);

    repos.forEach(repo => {
        const desc = repo.description ? escapeHtml(repo.description) : "Description not provided";
        const languages = repo.language

        listItems += `<div class="mb-2">
                            <span class="project-section-title d-block">// ${repo.name}</span>
                            <span class="project-section-others-title d-block">// Languages</span>
                            <p class="project-section-others-text mb-1">${languages}</p>
                            <span class="project-section-others-title d-block">// Stars</span>
                            <p class="project-section-others-text mb-1">${repo.stargazers_count}</p>
                            <span class="project-section-others-title d-block">// Description</span>
                            <p class="project-section-others-text mb-1">
                                ${desc}
                            </p>
                            <span class="project-section-others-title d-block">// Links</span>
                            <a href="${repo.html_url}" class="project-section-others-text d-block text-decoration-none target-link">${repo.html_url}</a>
                        </div>
                        `
    })

    targetContainer.innerHTML = listItems;
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}

window.addEventListener('load', () => {
    fetch(githubUrl, {
    headers: {
        'Accept': 'application/vnd.github.v3+json'
    }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Unable to retreive GitHub repos.');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            renderRepos(data);
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
});

