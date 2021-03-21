var SkirmishRandomizer = {};

SkirmishRandomizer.Randomize = function(civilCentrePositions, g_atlasEditor, g_grapjasIber, g_breakCircularPattern, g_mapMaxPlayers)
{
	const cmpPlayerManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_PlayerManager);	
	const g_numPlayers = cmpPlayerManager.GetNumPlayers() -1;
	const g_numPlayersIsNumLoops = cmpPlayerManager.GetNumPlayers() -1;

	var arrayLength = "";
	var g_maxPlayers = [1, 2, 3, 4, 5, 6, 7, 8];
	var g_Positions = [];
	var g_selectedTeam = 0;
	var g_cmpPlayer = [];
	var	position = civilCentrePositions;
	var g_team0 = [];
	var g_team1 = [];
	var g_team2 = [];
	var g_team3 = [];
	var g_team4 = [];
	var g_playersShuffledAsTeams = [];
	var g_selectedPlayer = []; 
	var g_selectCC = [];
	var g_parseSelectCC = [];
	var g_shiftEntPlayer = []; 
	var	cmpEntPosition = ""; 

	// removes starting walls	
	for (let i = 0; i < 8; i++) {
		let player = g_maxPlayers.shift();
		let gates = TriggerHelper.GetPlayerEntitiesByClass(player, "WallTower");
		let towers = TriggerHelper.GetPlayerEntitiesByClass(player, "Wall");
		let walls = TriggerHelper.GetPlayerEntitiesByClass(player, "Gate");
		let pop = "";
		arrayLength = towers.length;
		for (let i = 0; i < arrayLength; i++) {
			pop = towers.pop();
			Engine.DestroyEntity(pop);
		}
		arrayLength = walls.length;
		for (let i = 0; i < arrayLength; i++) {
			pop = walls.pop();
			Engine.DestroyEntity(pop);
		}
		arrayLength = gates.length;
		for (let i = 0; i < arrayLength; i++) {
			pop = gates.pop();
			Engine.DestroyEntity(pop);
		}	

	}
	g_maxPlayers = [1, 2, 3, 4, 5, 6, 7, 8];
	// Check each player's team
	// Then we assign them to the corresponding team array
	for (let i = 0; i < g_numPlayersIsNumLoops; i++) {
		g_selectedPlayer = g_maxPlayers.shift();
		g_cmpPlayer = QueryPlayerIDInterface(g_selectedPlayer);
		let playerTeam = g_cmpPlayer.GetTeam(g_selectedPlayer);
		playerTeam = playerTeam+1;
		if (playerTeam == 0) {
			g_team0.push(g_selectedPlayer);
			} else if (playerTeam == 1) {
			g_team1.push(g_selectedPlayer);
			} else if (playerTeam == 2) {
			g_team2.push(g_selectedPlayer);
			} else if (playerTeam == 3) {
			g_team3.push(g_selectedPlayer);
			} else if (playerTeam == 4) {
			g_team4.push(g_selectedPlayer);
			}
	}


	// If the team array has players push & shuffle them into the next array
	if (g_team1.length > 0) {
		g_playersShuffledAsTeams.push(g_team1);
		g_team1 = shuffleArray(g_team1);
	} 
	if (g_team2.length > 0) {
		g_playersShuffledAsTeams.push(g_team2);
		g_team2 = shuffleArray(g_team2);
	} 
	if (g_team3.length > 0) {
		g_playersShuffledAsTeams.push(g_team3);
		g_team3 = shuffleArray(g_team3);
	} 
	if (g_team4.length > 0) {
		g_playersShuffledAsTeams.push(g_team4);
		g_team4 = shuffleArray(g_team4);
	} 
		
		
	// Check how many teams there are playing to find out how many arrays needs to be shuffle
	// Then shuffle the team arrays inside the parent array for randomnization
	let numberOfTeams = g_playersShuffledAsTeams.length;
	if (numberOfTeams == 2) {
		g_playersShuffledAsTeams = shuffleArray([g_team1, g_team2]);
		} else if (numberOfTeams == 3) {
		g_playersShuffledAsTeams = shuffleArray([g_team1, g_team2, g_team3]);
		} else if (numberOfTeams == 4) {
		g_playersShuffledAsTeams = shuffleArray([g_team1, g_team2, g_team3, g_team4]);
		}
	// Put the players without a team in the back of the array
	g_team0 = shuffleArray(g_team0);
	g_playersShuffledAsTeams.push(g_team0);


	/* Used to make the positions feel more random if there are only 2 teams. 
		Without this the map will always be split the same way when there are just 2 teams */
	let positionSplit = [];
		g_Positions = ["A", "B", "C", "D", "E", "F", "G", "H"]; // if none of the below is true (FFA), fall back on this
	if (numberOfTeams === 2 && g_numPlayers === 8 && g_breakCircularPattern === "true"){
		positionSplit = pickRandom([1, 2, 3, 4, 5, 6, 7]);
		g_Positions = ["A", "B", "C", "D", "E", "F", "G", "H"];
		}
		
	if (numberOfTeams === 2 && g_numPlayers === 6 && g_mapMaxPlayers === "6" && g_breakCircularPattern === "true") {
		g_Positions = ["A", "B", "C", "D", "E", "F"];
		positionSplit = pickRandom([1, 2, 3, 4, 5]);
		} else if (numberOfTeams === 2 && g_numPlayers > 6 && g_mapMaxPlayers > "6" && g_breakCircularPattern === "true"){
			positionSplit = pickRandom([3, 5]);
		}
		
	if (numberOfTeams === 2 && g_numPlayers === 4 && g_mapMaxPlayers === "4" && g_breakCircularPattern === "true") {
		g_Positions = ["A", "B", "C", "D"];
		positionSplit = pickRandom([1, 2, 3]);
		} else if (numberOfTeams === 2 && g_numPlayers > 4 && g_mapMaxPlayers > "4" && g_breakCircularPattern === "true"){	
			positionSplit = pickRandom([2, 4, 6]);
		}	
		// Delete anything in the array thats in front of the picked spot
		let deleted = g_Positions.splice(0, positionSplit);
		/* Then put the deleted part back into the array at the end.
		So instead of ABCDEFGH its now randomized to something like CDEFGHAB. */
		g_Positions = g_Positions.concat(deleted);
			
	// reset player entities to the original location (useful for atlas).
	if (g_atlasEditor === "true"){
		g_Positions = ["A", "B", "C", "D", "E", "F", "G", "H"];
		g_playersShuffledAsTeams = [1, 2, 3, 4, 5, 6, 7, 8];
	}


	for (let i = 0; i < g_numPlayersIsNumLoops; i++) {
		
		if (g_atlasEditor === "true"){
			g_selectedPlayer = g_playersShuffledAsTeams.shift(); 
		}

		// The team arrays inside g_playersShuffledAsTeams get targetted and emptied
		// If it returns undefined because its empty, target the next team array 
		if (g_atlasEditor === "false"){
			g_selectedPlayer = g_playersShuffledAsTeams[g_selectedTeam].shift(); 
			if (g_selectedPlayer == undefined) {
				g_selectedTeam = g_selectedTeam +1; 
				g_selectedPlayer = g_playersShuffledAsTeams[g_selectedTeam].shift();
		}}
		
		// Organize organic entities in groups, for better control over repositioning
		let supportUnits = TriggerHelper.GetPlayerEntitiesByClass(g_selectedPlayer, "Support"); // Females + Special starting unit
		let citizenSoldier = TriggerHelper.GetPlayerEntitiesByClass(g_selectedPlayer, "Infantry");
		let cavalrySoldier = TriggerHelper.GetPlayerEntitiesByClass(g_selectedPlayer, "Cavalry");
		let organicUnits = [];
		organicUnits = organicUnits.concat(supportUnits, citizenSoldier, cavalrySoldier);
				
		// poppedPosition is used to form the variable name to get the corresponding coordinates
		let poppedPosition = g_Positions.shift();	 
		let shiftPositionX = position[poppedPosition + "x"].shift();		
		let shiftPositionZ = position[poppedPosition + "z"].shift(); 
		let shiftX = [];		
		let shiftZ = []; 

		// reposition the camera
		let cmpGuiInterface = Engine.QueryInterface(SYSTEM_ENTITY, IID_GuiInterface);				
		cmpGuiInterface.PushNotification({
		"type": "myCameraMoveTo",
		"players": [g_selectedPlayer],
		"positionX": shiftPositionX,
		"positionY": shiftPositionZ
		});
		
		// Select currently selected player's CC
		g_selectCC = TriggerHelper.GetPlayerEntitiesByClass(g_selectedPlayer, "CivCentre"); 
		
		// break g_selectCC down to integers
		g_parseSelectCC = +g_selectCC; 
				
		// Reposition CC 
		cmpEntPosition = Engine.QueryInterface(g_parseSelectCC, IID_Position); 	
		cmpEntPosition.JumpTo(shiftPositionX, shiftPositionZ); 
		
		// Make array of positions for the organic units with an offset - based off CC position
		let	organicPositionX = [shiftPositionX +20, shiftPositionX +25, shiftPositionX +20, shiftPositionX +20, shiftPositionX + 20, shiftPositionX -20, shiftPositionX -25, shiftPositionX -20, shiftPositionX -20, shiftPositionX +20]; 
		let	organicPositionZ = [shiftPositionZ +20, shiftPositionZ +20, shiftPositionZ +15, shiftPositionZ +25, shiftPositionZ + 30, shiftPositionZ -20, shiftPositionZ -20, shiftPositionZ -15, shiftPositionZ -25, shiftPositionZ -20];
		
		// Reposition organic entities
		arrayLength = organicUnits.length;	
		for (let i = 0; i < arrayLength; i++) { 	
			shiftX = organicPositionX.shift();		
			shiftZ = organicPositionZ.shift();
			g_shiftEntPlayer = organicUnits.shift(); 
			cmpEntPosition = Engine.QueryInterface(g_shiftEntPlayer, IID_Position);
			cmpEntPosition.JumpTo(shiftX, shiftZ); 
		}
				
		// Make iber defenses if playerCiv is === iber
		g_cmpPlayer = QueryPlayerIDInterface(g_selectedPlayer);
		let getPlayerCiv = g_cmpPlayer.GetCiv(g_parseSelectCC);
		if (getPlayerCiv === "iber" && g_grapjasIber === "true"){
			
			let shiftAngle = [];
			
			let	wallPositionX = [shiftPositionX -2, shiftPositionX +54, shiftPositionX +69, shiftPositionX +51, shiftPositionX -1, shiftPositionX -52, shiftPositionX -74, shiftPositionX -57]; 
			let	wallPositionZ = [shiftPositionZ -69, shiftPositionZ -53, shiftPositionZ +2, shiftPositionZ +51, shiftPositionZ +71, shiftPositionZ +51, shiftPositionZ +5, shiftPositionZ -48];
			let	wallAngle = [3.15, 2.4, 1.55, 0.74, -3.1, 2.3, 1.6, 0.76];
			TriggerHelper.SpawnUnits(g_parseSelectCC, "skirmish/structures/default_wall_long", 8, g_selectedPlayer);
			let iberWall = TriggerHelper.GetPlayerEntitiesByClass(g_selectedPlayer, "Wall");
			arrayLength = iberWall.length;	
			for (let i = 0; i < arrayLength; i++) {
				shiftX = wallPositionX.shift();		
				shiftZ = wallPositionZ.shift();
				shiftAngle = wallAngle.shift();
				g_shiftEntPlayer = iberWall.shift(); 
				cmpEntPosition = Engine.QueryInterface(g_shiftEntPlayer, IID_Position);
				cmpEntPosition.JumpTo(shiftX, shiftZ); 
				cmpEntPosition.SetYRotation(shiftAngle);
			}
			
			let	wallTowerPositionX = [shiftPositionX -46, shiftPositionX -42, shiftPositionX -73, shiftPositionX -68, shiftPositionX -18, shiftPositionX +68, shiftPositionX +64, shiftPositionX -15, shiftPositionX +69, shiftPositionX +39, shiftPositionX +17, shiftPositionX -64, shiftPositionX -74, shiftPositionX +65, shiftPositionX +42, shiftPositionX +14]; 
			let	wallTowerPositionZ = [shiftPositionZ -59, shiftPositionZ +63, shiftPositionZ +20, shiftPositionZ -37, shiftPositionZ -68, shiftPositionZ -13, shiftPositionZ +40, shiftPositionZ +71, shiftPositionZ +18, shiftPositionZ +62, shiftPositionZ +71, shiftPositionZ +40, shiftPositionZ -10, shiftPositionZ -42, shiftPositionZ -63, shiftPositionZ -69];	
			TriggerHelper.SpawnUnits(g_parseSelectCC, "skirmish/structures/default_wall_tower", 16, g_selectedPlayer);
			let iberWallTower = TriggerHelper.GetPlayerEntitiesByClass(g_selectedPlayer, "WallTower");
			arrayLength = iberWallTower.length;	
			for (let i = 0; i < arrayLength; i++) { 	
				shiftX = wallTowerPositionX.shift();		
				shiftZ = wallTowerPositionZ.shift();
				g_shiftEntPlayer = iberWallTower.shift(); 
				cmpEntPosition = Engine.QueryInterface(g_shiftEntPlayer, IID_Position);
				cmpEntPosition.JumpTo(shiftX, shiftZ); 
				cmpEntPosition.SetYRotation(pickRandom(0, 0.5, 1, 1.5, 2, 2.5, 3));
			}
			
			let	wallPalisadePositionX = [shiftPositionX -40, shiftPositionX -30, shiftPositionX +74, shiftPositionX +75, shiftPositionX +36, shiftPositionX +26, shiftPositionX -75.5, shiftPositionX -78]; 
			let	wallPalisadePositionZ = [shiftPositionZ -70, shiftPositionZ -73, shiftPositionZ -34, shiftPositionZ -23.5, shiftPositionZ +73, shiftPositionZ +77, shiftPositionZ +37, shiftPositionZ +28];
			let	wallPalisadeAngle = [4.15, 5.83, 2.38, 4.06, 7.37, 9.05, 5.85, 7.23];
			TriggerHelper.SpawnUnits(g_parseSelectCC, "structures/palisades_long", 8, g_selectedPlayer);
			let iberPalisade = TriggerHelper.GetPlayerEntitiesByClass(g_selectedPlayer, "Palisade");
			arrayLength = iberPalisade.length;
			for (let i = 0; i < arrayLength; i++) { 	
				shiftX = wallPalisadePositionX.shift();		
				shiftZ = wallPalisadePositionZ.shift();
				shiftAngle = wallPalisadeAngle.shift();
				g_shiftEntPlayer = iberPalisade.shift(); 
				cmpEntPosition = Engine.QueryInterface(g_shiftEntPlayer, IID_Position);
				cmpEntPosition.JumpTo(shiftX, shiftZ); 
				cmpEntPosition.SetYRotation(shiftAngle);
			}
				
			let	wallOutpostPositionX = [shiftPositionX -34, shiftPositionX +72, shiftPositionX +30, shiftPositionX -75]; 
			let	wallOutpostPositionZ = [shiftPositionZ -69, shiftPositionZ -28, shiftPositionZ +74, shiftPositionZ +33];
			let	wallOutpostAngle = [7.32, 5.55, 15.27, 9.01];
			TriggerHelper.SpawnUnits(g_parseSelectCC, "skirmish/structures/default_outpost", 4, g_selectedPlayer);
			let iberOutpost = TriggerHelper.GetPlayerEntitiesByClass(g_selectedPlayer, "Village Outpost");
			arrayLength = iberOutpost.length;
			for (let i = 0; i < arrayLength; i++) { 	
				shiftX = wallOutpostPositionX.shift();		
				shiftZ = wallOutpostPositionZ.shift();
				shiftAngle = wallOutpostAngle.shift();
				g_shiftEntPlayer = iberOutpost.shift(); 
				cmpEntPosition = Engine.QueryInterface(g_shiftEntPlayer, IID_Position);
				cmpEntPosition.JumpTo(shiftX, shiftZ); 
				cmpEntPosition.SetYRotation(shiftAngle);
			}
		}
	}


	 if (g_atlasEditor === "corner"){
		
		let allPlayerEntities = TriggerHelper.GetAllPlayersEntities();
		arrayLength = allPlayerEntities.length;
		for (let i = 0; i < arrayLength; i++) {
			g_shiftEntPlayer = allPlayerEntities.shift(); 
			cmpEntPosition = Engine.QueryInterface(g_shiftEntPlayer, IID_Position);
			cmpEntPosition.JumpTo(0, 0); 
		}
	}

};


Engine.RegisterGlobal("SkirmishRandomizer", SkirmishRandomizer);

// ignore this

/* The code below does all the location mapping automatically and works, 
but has 1 major issue: the old spot where the CC was before repositioning, is discovered. 
Meaning that at your old CC spot you can now see who is there currently (not realtime though).
There seems to be no workaround for this issue and therefore it is not used. 
Maybe in the future (hopefully) there will be a function where we can set explored data back to none. 

// First save all Civic Centers entities to variables
// Then save the coĂ¶rdinates of each Civic Centers to variables.
// Now we mapped all starting locations as designed by the map maker. 
let g_selectCC = TriggerHelper.GetPlayerEntitiesByClass(1, "CivCentre");
g_selectCC = parseInt(g_selectCC);
let g_parseSelectCC = +g_selectCC;
let CCpositionP1 = TriggerHelper.GetEntityPosition2D(g_parseSelectCC);
civilCentrePositions.Ax = [CCpositionP1.x];
civilCentrePositions.Az = [CCpositionP1.y];
g_selectCC = TriggerHelper.GetPlayerEntitiesByClass(2, "CivCentre");
g_parseSelectCC = +g_selectCC;
let CCpositionP2 = TriggerHelper.GetEntityPosition2D(g_parseSelectCC);
civilCentrePositions.Bx = [CCpositionP2.x];
civilCentrePositions.Bz = [CCpositionP2.y];
if (g_numPlayers >= 3) {
g_selectCC = TriggerHelper.GetPlayerEntitiesByClass(3, "CivCentre"); 
g_parseSelectCC = +g_selectCC;
let CCpositionP3 = TriggerHelper.GetEntityPosition2D(g_parseSelectCC);
civilCentrePositions.Cx = [CCpositionP3.x];
civilCentrePositions.Cz = [CCpositionP3.y];
} if (g_numPlayers >= 4) {
g_selectCC = TriggerHelper.GetPlayerEntitiesByClass(4, "CivCentre"); 
g_parseSelectCC = +g_selectCC;
let CCpositionP4 = TriggerHelper.GetEntityPosition2D(g_parseSelectCC);
civilCentrePositions.Dx = [CCpositionP4.x];
civilCentrePositions.Dz = [CCpositionP4.y];
} if (g_numPlayers >= 5) {
g_selectCC = TriggerHelper.GetPlayerEntitiesByClass(5, "CivCentre"); 
g_parseSelectCC = +g_selectCC;
let CCpositionP5 = TriggerHelper.GetEntityPosition2D(g_parseSelectCC);
civilCentrePositions.Ex = [CCpositionP5.x];
civilCentrePositions.Ez = [CCpositionP5.y];
} if (g_numPlayers >= 6) {
g_selectCC = TriggerHelper.GetPlayerEntitiesByClass(6, "CivCentre"); 
g_parseSelectCC = +g_selectCC;
let CCpositionP6 = TriggerHelper.GetEntityPosition2D(g_parseSelectCC);
civilCentrePositions.Fx = [CCpositionP6.x];
civilCentrePositions.Fz = [CCpositionP6.y];
} if (g_numPlayers >= 7) {
g_selectCC = TriggerHelper.GetPlayerEntitiesByClass(7, "CivCentre"); 
g_parseSelectCC = +g_selectCC;
let CCpositionP7 = TriggerHelper.GetEntityPosition2D(g_parseSelectCC);
civilCentrePositions.Gx = [CCpositionP7.x];
civilCentrePositions.Gz = [CCpositionP7.y];
} if (g_numPlayers >= 8) {
g_selectCC = TriggerHelper.GetPlayerEntitiesByClass(8, "CivCentre");
g_parseSelectCC = +g_selectCC;
let CCpositionP8 = TriggerHelper.GetEntityPosition2D(g_parseSelectCC);
civilCentrePositions.Hx = [CCpositionP8.x];
civilCentrePositions.Hz = [CCpositionP8.y];
}
*/