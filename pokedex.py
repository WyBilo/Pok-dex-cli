import json
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from urllib.parse import quote

while True:
    name = input("Enter a Pokémon (or q to quit): ").strip().lower()

    if name == "q":
        raise SystemExit

    if not name:
        print("Enter a Pokémon name.")
        continue

    url = f"https://pokeapi.co/api/v2/pokemon/{quote(name, safe='')}/"
    request = Request(url, headers={"User-Agent": "Wyatt-Pokedex/0.1"})

    try:
        with urlopen(request, timeout=10) as response:
            pokemon = json.load(response)
    except HTTPError as error:
        if error.code == 404:
            print(f"No Pokémon found for '{name}'. Check the spelling and try again.")
            continue
        raise

    print(f"#{pokemon['id']:03d} {pokemon['name'].title()}")
    type_names = []

    for entry in pokemon["types"]:
        type_names.append(entry["type"]["name"].title())

    print("Type:", " / ".join(type_names))
    stat_labels = {
        "hp": "Base HP",
        "attack": "Base Attack",
        "speed": "Base Speed",
    }

    for entry in pokemon["stats"]:
        stat_name = entry["stat"]["name"]
        if stat_name in stat_labels:
            print(f"{stat_labels[stat_name]}: {entry['base_stat']}")