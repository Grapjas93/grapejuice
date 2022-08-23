Player.prototype.Init = function()
{
	this.playerID = undefined;
	this.civ = Engine.QueryInterface(this.entity, IID_Identity).GetCiv();
	this.color = undefined;
	this.diplomacyColor = undefined;
	this.displayDiplomacyColor = false;
	this.popUsed = 0; // Population of units owned or trained by this player.
	this.popBonuses = 0; // Sum of population bonuses of player's entities.
	this.maxPop = 300; // Maximum population.
	this.trainingBlocked = false; // Indicates whether any training queue is currently blocked.
	this.resourceCount = {};
	this.resourceGatherers = {};
	this.tradingGoods = []; // Goods for next trade-route and its probabilities * 100.
	this.team = -1;	// Team number of the player, players on the same team will always have ally diplomatic status. Also this is useful for team emblems, scoring, etc.
	this.teamsLocked = false;
	this.state = "active"; // Game state. One of "active", "defeated", "won".
	this.diplomacy = [];	// Array of diplomatic stances for this player with respect to other players (including gaia and self).
	this.sharedDropsites = false;
	this.formations = this.template.Formations._string.split(" ");
	this.startCam = undefined;
	this.controlAllUnits = false;
	this.isAI = false;
	this.cheatsEnabled = false;
	this.panelEntities = [];
	this.resourceNames = {};
	this.hasSeenPlayers = []; // grapejuice
	this.hasSpyTech = false; // grapejuice
	this.disabledTemplates = {};
	this.disabledTechnologies = {};
	this.spyCostMultiplier = +this.template.SpyCostMultiplier;
	this.barterEntities = [];
	this.barterMultiplier = {
		"buy": clone(this.template.BarterMultiplier.Buy),
		"sell": clone(this.template.BarterMultiplier.Sell)
	};

	// Initial resources.
	let resCodes = Resources.GetCodes();
	for (let res of resCodes)
	{
		this.resourceCount[res] = 300;
		this.resourceNames[res] = Resources.GetResource(res).name;
		this.resourceGatherers[res] = 0;
	}
	// Trading goods probability in steps of 5.
	let resTradeCodes = Resources.GetTradableCodes();
	let quotient = Math.floor(20 / resTradeCodes.length);
	let remainder = 20 % resTradeCodes.length;
	for (let i in resTradeCodes)
		this.tradingGoods.push({
			"goods": resTradeCodes[i],
			"proba": 5 * (quotient + (+i < remainder ? 1 : 0))
		});
};

/**
 * Check if a player has been seen before, excluding gaia.
 */
Player.prototype.HasSeenPlayer = function(player)
{
	if (!this.GetSeenPlayers().includes(player) && player != this.GetPlayerID() && player != 0)
		return false;

	return true;
};

/**
 * Add a seen player to the array and push a notification with sound about it with a location.
 * A player is count as seen if you found an enemy structure.
 * @param {number} player - needed for diplomacy
 * @param {number} ent - needed for pushing notification of the spotted entity location
 */
Player.prototype.AddSeenPlayer = function(player, ent)
{
	if (this.HasSeenPlayer(player))
		return;

	const diplomacy = this.IsAlly(player) ? "Allied" : this.IsNeutral(player) ? "Neutral" : "Enemy";

	Engine.QueryInterface(SYSTEM_ENTITY, IID_GuiInterface).PushNotification({
		"type": "discovered",
		"target": ent,
		"players": [this.GetPlayerID()],
		"playerFound": player,
		"position": Engine.QueryInterface(ent, IID_Position).GetPosition(),
		"diplomacy": diplomacy
	});

	this.hasSeenPlayers.push(player);
	Engine.QueryInterface(SYSTEM_ENTITY, IID_SoundManager).PlaySoundGroupForPlayer("interface/alarm/alarm_discovered_player.xml", this.GetPlayerID());
	warn(uneval(`DETECTED NEW PLAYER <player = ${this.GetPlayerID()}> <playerFound = ${player}> <HasSeenPlayers = ${this.GetSeenPlayers()}> <diplomacy = ${diplomacy}>`));

};

Player.prototype.GetSeenPlayers = function()
{
	return this.hasSeenPlayers;
};

Player.prototype.HasSpyTech = function()
{
	return this.hasSpyTech;
};

Player.prototype.OnResearchFinished = function(msg)
{
	if (msg.tech == this.template.SharedLosTech)
		this.UpdateSharedLos();
	else if (msg.tech == this.template.SharedDropsitesTech)
		this.sharedDropsites = true;
	else if (msg.tech == "unlock_spies")
		this.hasSpyTech = true;
};

Engine.ReRegisterComponentType(IID_Player, "Player", Player);
