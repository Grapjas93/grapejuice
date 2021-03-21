/* General info: The skirmish randomizer supports max 10 organic starting units. 
   5 support units (4 females + special starting unit), infantry units (2 melee, 2 ranged), and 1 cavalry.
   For more info check the forum: https://wildfiregames.com/forum/topic/35914-new-mod-grapejuice/ */

/* 	Map X and Z coördinates for CC here.
	You can find the CC coördinates in your map.xml file.
	Only change the values, not the variable names.
    Position A belongs to the first civil centre you encounter when reading the xml file top to bottom.
    Work your way down from there.
	Please also note that in your map.xml it is important that
	SkirmishRandomizer.js gets loaded before map.js*/
var	civilCentrePositions = {
	// 1
Ax: [341], 
Az: [148], 
	// 2
Bx: [682], 
Bz: [860],
 };

// Setting this to "true" returns player entities to their original spot before randomnization (useful for atlas).
// Setting this to "corner" will place all player entities in a corner for you the next time you open your map.
// Set this to "false" otherwise.
var g_atlasEditor = "false";

// Set this to false if you want to disable my custom iber defenses but note this:
/* My custom iber structures are spawned (they are not placed in atlas). 
   Iber defenses placed in atlas will NOT be repositioned by the randomizer. Maybe in A24 i can work that out (because of more visible classes). 
   Setting this to false leaves the iber civ without starting defensive structures */
var g_grapjasIber = "false";

/* If set to true the randomizer will try to break the circular pattern (e.g. A Path Beyond II, Mainland) for better spawning 
   randomnization IF there are only 2 teams. 
   Otherwise the map will always be devided the same way between teams if there are only 2.
   In other words, set this to true if your map does NOT need teams to be on specific locations (e.g. duelling cliffs, X).
   For this to work correctly, players need to have been positioned in either ascending or descending (doesnt matter which) 
   order in atlas, like: 1, 2, 3, 4 etc. Not: 1, 3, 4, 2 etc. */
var g_breakCircularPattern = "false";

// Set the max number of players the map can be played with (important for breakCircularPattern)
var g_mapMaxPlayers = "2";

SkirmishRandomizer.Randomize(civilCentrePositions, g_atlasEditor, g_grapjasIber, g_breakCircularPattern, g_mapMaxPlayers);
