const form = document.querySelector("#search-form");
const nameInput = document.querySelector("#pokemon-name");
const statusText = document.querySelector("#status");

const card = document.querySelector("#pokemon-card");
const cardName = document.querySelector("#card-name");
const cardSprite = document.querySelector("#card-sprite");
const cardTypes = document.querySelector("#card-types");
const cardStats = document.querySelector("#card-stats");

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function showPokemonCard(pokemon) {
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