# Pokédex CLI

A command-line Pokédex built with Python and PokéAPI. Enter a Pokémon’s name to see its Pokédex number, types, base HP, Attack, and Speed.

## Run it

You’ll need Python 3 and an internet connection. The project uses Python’s standard library, so there are no packages to install.

From the project folder, run:

```bash
python3 pokedex.py
```

## Example

```text
Enter a Pokémon (or q to quit): gengar
#094 Gengar
Type: Ghost / Poison
Base HP: 60
Base Attack: 65
Base Speed: 110
Enter a Pokémon (or q to quit): q
```

Names are case-insensitive. If a name isn’t found, you can try again in the same session.