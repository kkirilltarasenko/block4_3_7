class App {
    constructor() {
        this.app = document.querySelector('.app');
        this.app.classList.add('app');

        this.box = document.createElement('div');
        this.box.classList.add('box');

        this.searchInput = document.createElement('input');
        this.searchInput.classList.add('searchInput');

        this.repositories = document.createElement('div');
        this.pinnedRepositories = document.createElement('div');
        this.error = document.createElement('div');

        this.pinnedRepositories.classList.add('pinnedRepositoriesBox')

        this.app.appendChild(this.box);
        this.box.appendChild(this.searchInput);
        this.box.appendChild(this.error);
        this.box.appendChild(this.repositories);
        this.box.appendChild(this.pinnedRepositories);
    }

    createPinned(repository) {
        const pinnedRepository = document.createElement('div');
        const pinnedRepositoryCross = document.createElement('img');
        pinnedRepositoryCross.src = './cross.png';

        pinnedRepository.classList.add('pinnedRepositoryBox');
        pinnedRepositoryCross.classList.add('cross');
        pinnedRepository.innerHTML = `<div class="pinnedRepositoryBox__wrapper">
            <div>
                <p>Name: ${repository.name}</p>
                <p>Owner: ${repository.owner.login}</p>
                <p>Stars: ${repository.stargazers_count}</p>
            </div>
        </div>`;

        pinnedRepository.appendChild(pinnedRepositoryCross);
        this.pinnedRepositories.appendChild(pinnedRepository);

        pinnedRepositoryCross.addEventListener('click', () => {
            this.deletePinned.call(this, pinnedRepository);
        });
    }

    deletePinned(repository) {
        this.pinnedRepositories.removeChild(repository);
    }

    createRepository(repository) {
        const repositoryBox = document.createElement('div');
        repositoryBox.classList.add('repositoryBox');
        repositoryBox.textContent = repository.name;

        repositoryBox.addEventListener('click', () => {
            this.createPinned.call(this, repository);
        } );

        this.repositories.appendChild(repositoryBox);
    }

    createError(error) {
        const errorBox = document.createElement('div');
        errorBox.classList.add('errorBox');
        errorBox.textContent = error;

        this.error.appendChild(errorBox);
    }
}

class AppAPI extends App {
    constructor() {
        super();
        this.searchInput.addEventListener('keyup', this.debounceSearch(this.searchRepositories.bind(this), 500));
    }

    debounceSearch(fn, timeDelay) {
        let timer;
        return function () {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn();
            }, timeDelay);
        }
    }

    clearHistory(source) {
        let child = source.lastChild;
        while (child) {
            source.removeChild(child);
            child = source.lastChild;
        }
    }

    async searchRepositories() {
        this.clearHistory(this.repositories);
        this.clearHistory(this.error);

        try {
            if (this.searchInput.value.length > 0) {
                return await fetch(`https://api.github.com/search/repositories?q=${this.searchInput.value}`)
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        const items = [data.items[0], data.items[1], data.items[2], data.items[3], data.items[4]]
                        items.forEach((el, index) => {
                            this.createRepository(el);
                        })
                    });
            }
        } catch (e) {
            this.createError(`Error: null amount of '${this.searchInput.value}' repositories`)
        }
    }
}

new AppAPI();