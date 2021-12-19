/**
 * @param {string} newState - Either "defeated" or "won".
 * @param {string|undefined} message - A string to be shown in chat, for example
 *     markForTranslation("%(player)s has been defeated (failed objective).").
 *     If it is undefined, the caller MUST send that GUI notification manually.
 */
Player.prototype.SetState = function(newState, message)
{
	if (this.state != "active")
		return;

	if (newState != "won" && newState != "defeated")
	{
		warn("Can't change playerstate to " + this.state);
		return;
	}

	if (!this.playerID)
	{
		warn("Gaia can't change state.");
		return;
	}

	this.state = newState;

	let won = newState == "won";
	let cmpRangeManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_RangeManager);
	if (won)
		cmpRangeManager.SetLosRevealAll(this.playerID, true);
	else
	{
		// Reassign all player's entities to Gaia.
		let entities = cmpRangeManager.GetEntitiesByPlayer(this.playerID);

		// The ownership change is done in two steps so that entities don't hit idle
		// (and thus possibly look for "enemies" to attack) before nearby allies get
		// converted to Gaia as well.
		for (let entity of entities)
		{
			let cmpOwnership = Engine.QueryInterface(entity, IID_Ownership);
			cmpOwnership.SetOwnerQuiet(0);
		}

		// With the real ownership change complete, send OwnershipChanged messages.
		for (let entity of entities)
			Engine.PostMessage(entity, MT_OwnershipChanged, {
				"entity": entity,
				"from": this.playerID,
				"to": 0
			});

		// grapejuice, give resiging/defeated players the spies tech as a workaround for when they're becoming observers and not being able to see unit stats
		let cmpTechnologyManager = Engine.QueryInterface(this.entity, IID_TechnologyManager);
		cmpTechnologyManager.ResearchTechnology("unlock_spies");	
	}

	Engine.PostMessage(this.entity, won ? MT_PlayerWon : MT_PlayerDefeated, { "playerId": this.playerID });

	if (message)
	{
		let cmpGUIInterface = Engine.QueryInterface(SYSTEM_ENTITY, IID_GuiInterface);
		cmpGUIInterface.PushNotification({
			"type": won ? "won" : "defeat",
			"players": [this.playerID],
			"allies": [this.playerID],
			"message": message
		});
	}

};

Engine.ReRegisterComponentType(IID_Player, "Player", Player);
