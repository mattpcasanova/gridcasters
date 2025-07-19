import requests
import difflib

# Ordered lists for each position (copy-paste your lists here)
RB_LIST = [
    "Bijan Robinson",
    "Jahmyr Gibbs",
    "Saquon Barkley",
    "Christian McCaffrey",
    "Ashton Jeanty",
    "Derrick Henry",
    "De'Von Achane",
    "Josh Jacobs",
    "Jonathan Taylor",
    "Bucky Irving",
    "Kyren Williams",
    "James Cook",
    "Chase Brown",
    "Kenneth Walker III",
    "Breece Hall",
    "Alvin Kamara",
    "Chuba Hubbard",
    "James Conner",
    "Omarion Hampton",
    "Joe Mixon",
    "Quinshon Judkins",
    "D'Andre Swift",
    "RJ Harvey",
    "David Montgomery",
    "Aaron Jones",
    "Tony Pollard",
    "TreVeyon Henderson",
    "Isiah Pacheco",
    "Kaleb Johnson",
    "Javonte Williams",
    "Tyrone Tracy Jr.",
    "Brian Robinson Jr.",
    "Jaylen Warren",
    "Rhamondre Stevenson",
    "J.K. Dobbins",
    "Travis Etienne Jr.",
    "Cam Skattebo",
    "Austin Ekeler",
    "Gus Edwards",
    "Zach Charbonnet",
    "Jordan Mason",
    "Tank Bigsby",
    "Rico Dowdle",
    "Rachaad White",
    "Miles Sanders",
    "Kareem Hunt",
    "Nick Chubb",
    "Elijah Mitchell",
    "Braelon Allen",
    "Ray Davis",
    "Jaydon Blue",
    "Phil Mafah",
    "Bhayshul Tuten",
    "Trey Benson",
    "Kimani Vidal",
    "Justice Hill",
    "Tyler Allgeier",
    "Samaje Perine",
    "Emanuel Wilson",
    "Dameon Pierce"
]
WR_LIST = [
    "Ja'Marr Chase",
    "Justin Jefferson",
    "CeeDee Lamb",
    "Puka Nacua",
    "Malik Nabers",
    "Amon-Ra St. Brown",
    "Nico Collins",
    "Brian Thomas Jr.",
    "A.J. Brown",
    "Drake London",
    "Tee Higgins",
    "Ladd McConkey",
    "Tyreek Hill",
    "Davante Adams",
    "Rashee Rice",
    "Jaxon Smith-Njigba",
    "Terry McLaurin",
    "Mike Evans",
    "Garrett Wilson",
    "Marvin Harrison Jr.",
    "DJ Moore",
    "DK Metcalf",
    "Xavier Worthy",
    "Zay Flowers",
    "Courtland Sutton",
    "DeVonta Smith",
    "Calvin Ridley",
    "Jaylen Waddle",
    "Jerry Jeudy",
    "Jordan Addison",
    "Tetairoa McMillan",
    "Chris Olave",
    "George Pickens",
    "Jameson Williams",
    "Travis Hunter",
    "Rome Odunze",
    "Chris Godwin",
    "Jakobi Meyers",
    "Jauan Jennings",
    "Khalil Shakir",
    "Deebo Samuel Sr.",
    "Cooper Kupp",
    "Ricky Pearsall",
    "Stefon Diggs",
    "Jayden Reed",
    "Josh Downs",
    "Rashid Shaheed",
    "Matthew Golden",
    "Michael Pittman Jr.",
    "Darnell Mooney",
    "Keon Coleman",
    "Tre Harris",
    "Emeka Egbuka",
    "Luther Burden III",
    "Christian Kirk",
    "Brandon Aiyuk",
    "Adam Thielen",
    "Cedric Tillman",
    "Hollywood Brown",
    "Wan'Dale Robinson"
]
QB_LIST = [
    "Josh Allen",
    "Lamar Jackson",
    "Jayden Daniels",
    "Jalen Hurts",
    "Joe Burrow",
    "Patrick Mahomes",
    "Baker Mayfield",
    "Brock Purdy",
    "Caleb Williams",
    "C.J. Stroud",
    "Bo Nix",
    "Kyler Murray",
    "Jared Goff",
    "Tua Tagovailoa",
    "Jordan Love",
    "Anthony Richardson",
    "Trevor Lawrence",
    "Drake Maye",
    "Dak Prescott",
    "Justin Herbert",
    "Sam Darnold",
    "Justin Fields",
    "Russell Wilson",
    "J.J. McCarthy",
    "Michael Penix Jr.",
    "Cam Ward",
    "Matthew Stafford",
    "Geno Smith",
    "Aaron Rodgers",
    "Joe Flacco"
]
TE_LIST = [
    "Brock Bowers",
    "Trey McBride",
    "George Kittle",
    "Sam LaPorta",
    "T.J. Hockenson",
    "Travis Kelce",
    "Jonnu Smith",
    "Evan Engram",
    "David Njoku",
    "Mark Andrews",
    "Dallas Goedert",
    "Colston Loveland",
    "Tyler Warren",
    "Tucker Kraft",
    "Jake Ferguson",
    "Dalton Kincaid",
    "Pat Freiermuth",
    "Hunter Henry",
    "Zach Ertz",
    "Cole Kmet",
    "Brenton Strange",
    "Will Dissly",
    "Juwan Johnson",
    "Theo Johnson",
    "Kyle Pitts",
    "Noah Gray",
    "Mike Gesicki",
    "Cade Otton",
    "Isaiah Likely",
    "Dawson Knox"
]

# Position limits from constants (using displayLimit for more comprehensive rankings)
POSITION_LIMITS = {
    'QB': 30,  # displayLimit
    'RB': 60,  # displayLimit
    'WR': 60,  # displayLimit
    'TE': 30,  # displayLimit
    'OVR': 150,  # displayLimit
    'FLX': 120  # displayLimit
}

POSITION_MAP = {
    'RB': RB_LIST,
    'WR': WR_LIST,
    'QB': QB_LIST,
    'TE': TE_LIST,
}

SEASON = 2025
TYPE = 'preseason'
WEEK = 'NULL'
TOTAL_RANKINGS = 2

# Download Sleeper player data
print('Downloading Sleeper NFL player database...')
resp = requests.get('https://api.sleeper.com/v1/players/nfl')
resp.raise_for_status()
players = resp.json()
print(f"Loaded {len(players)} players from Sleeper.")

# Build a name->player mapping (case-insensitive, fuzzy)
name_to_player = {}
for player_id, p in players.items():
    # Build a canonical name for matching
    names = set()
    if p.get('full_name'):
        names.add(p['full_name'].strip().lower())
    if p.get('first_name') and p.get('last_name'):
        names.add(f"{p['first_name'].strip()} {p['last_name'].strip()}".lower())
    if p.get('last_name'):
        names.add(p['last_name'].strip().lower())
    for n in names:
        name_to_player.setdefault(n, []).append(p)

# Helper to match a name to a player

def match_player(name):
    # Try exact match first
    key = name.strip().lower()
    if key in name_to_player:
        # If multiple, prefer active, then highest fantasy positions
        candidates = name_to_player[key]
        candidates = sorted(candidates, key=lambda p: (
            p.get('status') == 'Active',
            p.get('position') in ['RB', 'WR', 'QB', 'TE'],
            p.get('team') is not None
        ), reverse=True)
        return candidates[0]
    # Fuzzy match
    all_names = list(name_to_player.keys())
    close = difflib.get_close_matches(key, all_names, n=1, cutoff=0.8)
    if close:
        candidates = name_to_player[close[0]]
        candidates = sorted(candidates, key=lambda p: (
            p.get('status') == 'Active',
            p.get('position') in ['RB', 'WR', 'QB', 'TE'],
            p.get('team') is not None
        ), reverse=True)
        return candidates[0]
    return None

sql_lines = [
    '-- SQL to add new rankings as contribution to existing average rankings for 2025 preseason',
    'BEGIN;',
    ''
]

unmatched = []

for position, name_list in POSITION_MAP.items():
    sql_lines.append(f'-- {position} average rankings (adding new contribution)')
    limit = POSITION_LIMITS.get(position, 50)  # Default to 50 if position not found
    limited_list = name_list[:limit]  # Only take the first N players based on limit
    
    for idx, name in enumerate(limited_list, 1):
        player = match_player(name)
        if not player:
            unmatched.append((position, name))
            continue
        player_id = player['player_id']
        player_name = player.get('full_name') or f"{player.get('first_name', '')} {player.get('last_name', '')}".strip()
        team = player.get('team', 'FA')
        # Use a simpler approach - just update the existing record
        sql_line = f"UPDATE player_average_rankings SET average_rank = (average_rank + {idx}) / 2.0, total_rankings = total_rankings + 1, last_updated = NOW() WHERE player_id = '{player_id}' AND position = '{position}' AND season = {SEASON} AND type = '{TYPE}' AND week IS NULL;"
        sql_lines.append(sql_line)
    sql_lines.append('')

sql_lines.append('COMMIT;')

# Write to file
with open('average_rankings_upsert.sql', 'w') as f:
    f.write('\n'.join(sql_lines))

print(f"\nSQL written to average_rankings_upsert.sql")
if unmatched:
    print("\nUnmatched players:")
    for pos, name in unmatched:
        print(f"  [{pos}] {name}")
    print("\nPlease review these names and adjust as needed.")
else:
    print("\nAll players matched successfully!") 