Player.prototype.Init = function()
{
	this.playerID = undefined;
	this.color = undefined;
	this.popUsed = 0; // Population of units owned or trained by this player.
	this.popBonuses = 0; // Sum of population bonuses of player's entities.
	this.maxPop = 300; // Maximum population.
	this.trainingBlocked = false; // Indicates whether any training queue is currently blocked.
	this.resourceCount = {};
	this.resourceGatherers = {};
	this.tradingGoods = []; // Goods for next trade-route and its probabilities * 100.
	this.state = this.STATE_ACTIVE;
	this.formations = this.template.Formations._string.split(" ");
	this.startCam = undefined;
	this.controlAllUnits = false;
	this.isAI = false;
	this.isRemoved = false;
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
	const resCodes = Resources.GetCodes();
	for (const res of resCodes)
	{
		this.resourceCount[res] = 300;
		this.resourceNames[res] = Resources.GetResource(res).name;
		this.resourceGatherers[res] = 0;
	}
	// Trading goods probability in steps of 5.
	const resTradeCodes = Resources.GetTradableCodes();
	const quotient = Math.floor(20 / resTradeCodes.length);
	const remainder = 20 % resTradeCodes.length;
	for (const i in resTradeCodes)
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

	const diplomacy = Engine.QueryInterface(this.entity, IID_Diplomacy).IsAlly(player) ? "Allied" : Engine.QueryInterface(this.entity, IID_Diplomacy).IsNeutral(player) ? "Neutral" : "Enemy";

	Engine.QueryInterface(SYSTEM_ENTITY, IID_GuiInterface).PushNotification({
		"type": "discovered",
		"target": ent,
		"players": [this.GetPlayerID()],
		"playerFound": player,
		"position": Engine.QueryInterface(ent, IID_Position).GetPosition(),
		"diplomacy": diplomacy
	});

	this.hasSeenPlayers.push(player);

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
