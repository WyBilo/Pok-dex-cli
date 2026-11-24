# Pokédex CLI

A command-line Pokédex built with Python and PokéAPI. Look up a Pokémon’s types and base stats, build a team of up to six, and inspect your teammates by slot. Your team carries over between sessions.

## Run it

You’ll need Python 3 and an internet connection for Pokémon lookups. The project uses Python’s standard library, so there are no extra packages to install.

From the project folder, run:

```bash
python3 pokedex.py
```

## Commands

| Enter | What it does |
| --- | --- |
| A Pokémon name | Shows its Pokédex number, types, base HP, Attack, and Speed. Enter `y` to add it to your team or `n` to keep browsing. |
| `team` | Shows your roster and how many of the six slots you’ve filled. |
| `inspect` | Lets you choose a teammate by slot and view its stat card. |
| `remove` | Lets you choose a teammate by slot and removes it from your roster. |
| `q` | Quits the Pokédex. |

Names are case-insensitive. If you misspell a name, you can try again. Press Enter at either slot prompt to cancel.

Your roster saves automatically to `team.json` beside `pokedex.py` whenever you add or remove a teammate.

## Example

Starting with an empty team, look up Squirtle, add it, and inspect it from slot 1:

```text
Enter a Pokémon, 'team', 'inspect', 'remove', or 'q': squirtle
#007 Squirtle
Type: Water
Base HP: 44
Base Attack: 48
Base Speed: 43
Add this Pokémon to your team? (y/n): y
Your team: Squirtle
Enter a Pokémon, 'team', 'inspect', 'remove', or 'q': inspect
1. Squirtle
Inspect which slot? (Enter to cancel): 1
#007 Squirtle
Type: Water
Base HP: 44
Base Attack: 48
Base Speed: 43
Enter a Pokémon, 'team', 'inspect', 'remove', or 'q': q
```