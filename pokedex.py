import json
from urllib.request import Request, urlopen
from urllib.error import HTTPError
from urllib.parse import quote
from pathlib import Path

team_file = Path(__file__).with_name("team.json")

if team_file.exists():
    with team_file.open() as file:
        team = json.load(file)
else:
    team = []

def save_team(team, team_file):
    with team_file.open("w") as file:
        json.dump(team, file, indent=2)

while True:
    name = input("Enter a Pokémon, 'team', 'remove', or 'q': ").strip().lower()

    if name == "q":
        raise SystemExit

    if name == "team":
        if team:
            print(f"Your team ({len(team)}/6):", ", ".join(team))
        else:
            print("Your team is empty.")
        continue

    if name == "remove":
        if not team:
            print("Your team is empty.")
            continue

        for slot, member in enumerate(team, start=1):
            print(f"{slot}. {member}")

        choice = input("Remove which slot? (Enter to cancel): ").strip()
        if not choice:
            continue

        valid_slots = [str(slot) for slot in range(1, len(team) + 1)]
        if choice not in valid_slots:
            print(f"Choose a slot from 1 to {len(team)}.")
            continue

        removed = team.pop(int(choice) - 1)
        save_team(team, team_file)
        print(f"Removed {removed}.")
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

    answer = input("Add this Pokémon to your team? (y/n): ").strip().lower()
    
    if answer == "y":
        if len(team) >= 6:
            print("Your team already has six Pokémon.")
        else:
            team.append(pokemon["name"].title())

            save_team(team, team_file)

            print("Your team:", ", ".join(team))