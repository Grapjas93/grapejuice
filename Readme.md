# grapejuice
Follow progress for the next update(s) in this prototype branch.

Also check out [this spreadsheet](https://docs.google.com/spreadsheets/d/1g1GSy4thCCHUi5xWPgrDzG91Ty0kjowU_7ZluccuqoA/) to follow the complete re-balancing progess of units.

Overview of new features so far:

**Units with ranged weapons have ammo.** Units with low ammo (jav) will have very high damage. Slingers will regain ammo slowly anywhere.

**Most units have 2 attack types**, ranged and melee. Weapon swapping will **not** be manual. 
The unit will swap to melee if 
- It has no ammo
- A targetted unit is getting to close
- The target is a wall
- The target is a siege unit

**New aura called "Re-arm".** All military structures *(Barracks, Stables, Arsenals, Fortresses, Armycamps, Colony's)* and also the forge will have this aura. Units that require ammo, simply need to stay inside it for at least 3 seconds for a complete ammo refill. This aura will only work if you have at least 1 forge. Some of these military buildings will have a large aura, and most have a small aura. Armycamp has a limited ammo pool units can Re-Arm from, and the Armycamp consumes ammo from the pool while shooting arrows. Once the pool is empty, the armycamp can't shoot arrows, or Re-arm units.

**Units will be rebalanced according to their visuals.** Check this [balancing sheet](https://docs.google.com/spreadsheets/d/1g1GSy4thCCHUi5xWPgrDzG91Ty0kjowU_7ZluccuqoA/) for more info (also check the additional changes tab).

**4th rank: Champion.** If there is a champion counterpart of the soldier, it will be able to promote as one. For example, the athenian hoplite will promote into a city guard.

**Promotion rework.** Units will not get bonus armor on promotion. They will receive a small heal, and (originally) ranged units will get a 10% bonus attack damage for all weapons. Melee only units have their default attack bonus on promotion (20%).

**Technology changes.** Instead of 4 defensive upgrades for units there are now just 2. They give both a positive and a negative bonus. Example: Soldiers +3 crush, +1 hack and pierce resistance. 50ms attack and 0.25 movement speed penalty. 
