# grapejuice

Changes so far:
+ update to A28
+ Germans got the grapejuice balance overhaul
+ Fixed missing and wrong templates
+ Some animations were missing, fixed
+ Obstruction walls were selectable, they shouldn't be
+ Exclude slingers from the brazier buff
+ Rewrote the ammo system, should expect performance increase and less bugs
+ Rewrote the energy system, should expect performance increase and less bugs
+ rams don't get extra energy from garrisons anymore, they have their own standalone pool. Each garrisoned soldier adds to attack speed, damage and walkspeed as described in the "battering rams" aura tooltip.
+ new icons for: re-arm aura, brazier flaming projectiles aura
+ Units swap weapons much smoother now when out of ammo. Before, units would do the whole ranged attack animation until actually shooting to realise it's out of ammo, now they swap instantly after being out of ammo
+ civic center shoots no arrows by default, only when garrisoned, to motivate players to build actual defense structures like towers and fortresses
+ new tech at forge, upgrade stone towers and fortresses to shoot flaming arrows that apply burning
+ added 3x damage bonus to spearman cavalry against cavalry
+ ★ Units attack a random unit out of max 15 closest units in sight instead of just the closest one, meaning the battles- espcially big ones- are (imo) much more realistic and damage and ammo isnt wasted by dumping 20 arrows into 1 unit for example. Probably needs further tweaking as units can get stuck in big battles (vanilla has this issue too though), and sometimes a unit decides to attack a unit all the way in the back (though not as much with picking one of 15 closest targets), possibly passing alot of perfectly fine units to attack which can look weird. For a ranged unit it's not that much of an issue but if a melee unit does it makes no sense honestly.
+ Big promotion rework. Units get stronger buffs from promotion. Some units can get to 10 ranks (just heroes for now), each rank gives a buff to certain stats like attack speed, melee attack damage, health increase, and more. Siege (including rams and siege towers) can also gain ranks now. In theory any "unit" can gain ranks now, including wildlife like crocodiles.