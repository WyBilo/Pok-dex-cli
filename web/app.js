const form = document.querySelector("#search-form");
const nameInput = document.querySelector("#pokemon-name");
const statusText = document.querySelector("#status");

const card = document.querySelector("#pokemon-card");
const cardName = document.querySelector("#card-name");
const cardSprite = document.querySelector("#card-sprite");
const cardTypes = document.querySelector("#card-types");
const cardStats = document.querySelector("#card-stats");

const addButton = document.querySelector("#add-to-team");
const teamHeading = document.querySelector("#team-heading");
const teamSlots = document.querySelector("#team-slots");

const TEAM_KEY = "pokedex.team.v1";

function loadTeam() {
    try {
        const saved = localStorage.getItem(TEAM_KEY);
        if (saved === null) return [];

        const members = JSON.parse(saved);
        if (!Array.isArray(members)) return [];

        return members
            .filter(member => member && typeof member.name === "string")
            .slice(0, 6);
    } catch {
        return [];
    }
}

const team = loadTeam();

let currentPokemon = null;

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function showPokemonCard(pokemon) {
    currentPokemon = pokemon;
    const name = capitalize(pokemon.name);
    const number = String(pokemon.id).padStart(3, "0");
    cardName.textContent = `#${number} ${name}`;

    const sprite = pokemon.sprites.front_default;
    cardSprite.hidden = !sprite;
    if (sprite) {
        cardSprite.src = sprite;
        cardSprite.alt = `${name} sprite`;
    }

    const types = pokemon.types.map((entry) => capitalize(entry.type.name));
    cardTypes.textContent = `Type: ${types.join(" / ")}`;

    const statLabels = {
        hp: "Base HP",
        attack: "Base Attack",
        speed: "Base Speed"
    };

    cardStats.replaceChildren();
    for (const entry of pokemon.stats) {
        const label = statLabels[entry.stat.name];
        if (label) {
            const item = document.createElement("li");
            item.textContent = `${label}: ${entry.base_stat}`;
            cardStats.append(item);
        }
    }

    card.hidden = false;
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    card.hidden = true;

    const name = nameInput.value.trim().toLowerCase();

    if (!name) {
        statusText.textContent = "Enter a Pokémon name.";
        return;
    }

    statusText.textContent = `Looking up ${name}…`;
    try {
        const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}/`;
        const response = await fetch(url);

        if (response.status === 404) {
            statusText.textContent = `No Pokémon found for "${name}". Check the spelling and try again.`;
            return;
        }

        if (!response.ok) {
            statusText.textContent = `PokéAPI returned an error (${response.status}).`;
            return;
        }

        const pokemon = await response.json();
        showPokemonCard(pokemon);
        statusText.textContent = "";
    } catch {
        statusText.textContent = "Couldn’t reach PokéAPI. Try again.";
    }
});

function saveTeam() {
    try {
        localStorage.setItem(TEAM_KEY, JSON.stringify(team));
    } catch {
        statusText.textContent = "Team updated for this session. Browser storage is unavailable.";
    }
}

function renderTeam() {
    teamHeading.textContent = `My team (${team.length}/6)`;
    teamSlots.replaceChildren();

    for (let index = 0; index < 6; index++) {
        const slot = document.createElement("li");
        const member = team[index];

        if (member) {
            if (member.sprite) {
                const image = document.createElement("img");
                image.src = member.sprite;
                image.alt = "";
                slot.append(image);
            }

            const label = document.createElement("span");
            label.textContent = member.name;
            slot.append(label);
            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.textContent = "Remove";
            removeButton.setAttribute("aria-label", `Remove ${member.name} from slot ${index + 1}`);

            removeButton.addEventListener("click", () => {
                team.splice(index, 1);
                saveTeam();
                renderTeam();
            });

            slot.append(removeButton);
        } else {
            slot.textContent = "Empty";
        }

        teamSlots.append(slot);
    }

    addButton.disabled = team.length >= 6;
    addButton.textContent = addButton.disabled ? "Team full" : "Add to team";
}

addButton.addEventListener("click", () => {
    if (!currentPokemon || team.length >= 6) {
        return;
    }

    team.push({
        name: capitalize(currentPokemon.name),
        sprite: currentPokemon.sprites.front_default
    });

    saveTeam();
    renderTeam();
});

renderTeam();