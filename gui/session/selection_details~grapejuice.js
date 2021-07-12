// grapejuice, block elements if the players select an unowned entity and hasn't researched the spy tech
function blockDisplaySingle(entState)
{
	let template = GetTemplateData(entState.template);

	let primaryName = "Espionage tech required";
	let secondaryName;
	if (g_ShowSecondaryNames)
		secondaryName = "can be researched at the civic center";

	// If packed, add that to the generic name (reduces template clutter).
	if (template.pack && template.pack.state == "packed")
	{
		if (secondaryName && g_ShowSecondaryNames)
			secondaryName = sprintf(translate("%(secondaryName)s — Packed"), { "secondaryName": secondaryName });
		else
			secondaryName = sprintf(translate("Packed"));
	}
	let playerState = g_Players[entState.player];

	let civName = "?";

	let playerName = "?";

	// Indicate disconnected players by prefixing their name
	if (g_Players[entState.player].offline)
		playerName = sprintf(translate("\\[OFFLINE] %(player)s"), { "player": playerName });

	// Rank
	if (entState.identity && entState.identity.rank && entState.identity.classes)
	{
		Engine.GetGUIObjectByName("rankIcon").tooltip = sprintf(translate("%(rank)s Rank"), {
			"rank": translateWithContext("Rank", entState.identity.rank)
		});
		Engine.GetGUIObjectByName("rankIcon").hidden = true;
		Engine.GetGUIObjectByName("rankIcon").tooltip = "";
	}
	else
	{
		Engine.GetGUIObjectByName("rankIcon").hidden = true;
		Engine.GetGUIObjectByName("rankIcon").tooltip = "";
	}

	if (entState.statusEffects)
	{
		let statusEffectsSection = Engine.GetGUIObjectByName("statusEffectsIcons");
		statusEffectsSection.hidden = true;
		let statusIcons = statusEffectsSection.children;
		let i = 0;
		for (let effectCode in entState.statusEffects)
		{
			let effect = entState.statusEffects[effectCode];
			statusIcons[i].hidden = false;
			statusIcons[i].sprite = "stretched:session/icons/status_effects/" + g_StatusEffectsMetadata.getIcon(effect.baseCode) + ".png";
			statusIcons[i].tooltip = getStatusEffectsTooltip(effect.baseCode, effect, false);
			let size = statusIcons[i].size;
			size.top = i * 18;
			size.bottom = i * 18 + 16;
			statusIcons[i].size = size;

			if (++i >= statusIcons.length)
				break;
		}
		for (; i < statusIcons.length; ++i)
			statusIcons[i].hidden = true;
	}
	else
		Engine.GetGUIObjectByName("statusEffectsIcons").hidden = true;

	let showHealth = entState.hitpoints;
	let showEnergy = 0;
	let showResource = entState.resourceSupply;
	let showCapture = entState.capturePoints;
	let showAmmo = 0;

	// grapejuice, energy
	let	CurrentEnergy = 0;
	let	MaxEnergy = 0;
	if (!!entState.attack && !!entState.attack["Melee"] && !!entState.attack["Melee"].MaxEnergy)
	{
		CurrentEnergy = entState.attack["Melee"].CurrentEnergy;
		MaxEnergy = entState.attack["Melee"].MaxEnergy;
		showEnergy = entState.attack["Melee"].MaxEnergy;	
	}	
	
	// grapejuice, ammo
	let	currentAmmo = 0;
	let	maxAmmo = 0;
	if (!!entState.attack && !!entState.attack["Ranged"] && !!entState.attack["Ranged"].ammoMax)
	{
		currentAmmo = entState.attack["Ranged"].ammoLeft;
		maxAmmo = entState.attack["Ranged"].ammoMax;
		showAmmo = entState.attack["Ranged"].ammoMax;	
	} 

	let energySection = Engine.GetGUIObjectByName("energySection");
	let borderSection = Engine.GetGUIObjectByName("borderSection");
	let shaderSection = Engine.GetGUIObjectByName("shaderSection");
	let ammoSection = Engine.GetGUIObjectByName("ammoSection");
	let healthSection = Engine.GetGUIObjectByName("healthSection");
	let captureSection = Engine.GetGUIObjectByName("captureSection");
	let resourceSection = Engine.GetGUIObjectByName("resourceSection");
	let sectionPosTop = Engine.GetGUIObjectByName("sectionPosTop");
	let sectionPosMiddle = Engine.GetGUIObjectByName("sectionPosMiddle");
	let sectionPosBottom = Engine.GetGUIObjectByName("sectionPosBottom");
		

	if (!showEnergy && !showAmmo && !showCapture)
	{
		borderSection.hidden = true;
		shaderSection.hidden = true;
	}
	else if (showEnergy && showAmmo || showAmmo && showCapture)
	{
		borderSection.hidden = false;
		shaderSection.hidden = false;

		let barShaderFull = Engine.GetGUIObjectByName("barShaderFull");
		barShaderFull.hidden = true;
		let barShaderSplit1 = Engine.GetGUIObjectByName("barShaderSplit1");
		barShaderSplit1.hidden = false;
		let barShaderSplit2 = Engine.GetGUIObjectByName("barShaderSplit2");
		barShaderSplit2.hidden = false;
		
		let barBorderFull = Engine.GetGUIObjectByName("barBorderFull");
		barBorderFull.hidden = true;
		let barBorderSplit1 = Engine.GetGUIObjectByName("barBorderSplit1");
		barBorderSplit1.hidden = false;
		let barBorderSplit2 = Engine.GetGUIObjectByName("barBorderSplit2");
		barBorderSplit2.hidden = false;
		
	}
	else
	{
		borderSection.hidden = false;
		shaderSection.hidden = false;

		let barShaderFull = Engine.GetGUIObjectByName("barShaderFull");
		barShaderFull.hidden = false;
		let barShaderSplit1 = Engine.GetGUIObjectByName("barShaderSplit1");
		barShaderSplit1.hidden = true;
		let barShaderSplit2 = Engine.GetGUIObjectByName("barShaderSplit2");
		barShaderSplit2.hidden = true;

		let barBorderFull = Engine.GetGUIObjectByName("barBorderFull");
		barBorderFull.hidden = false;
		let barBorderSplit1 = Engine.GetGUIObjectByName("barBorderSplit1");
		barBorderSplit1.hidden = true;
		let barBorderSplit2 = Engine.GetGUIObjectByName("barBorderSplit2");
		barBorderSplit2.hidden = true;
	}
		borderSection.size = sectionPosBottom.size;
		captureSection.size = showResource ? sectionPosMiddle.size : sectionPosBottom.size;
		resourceSection.size = showResource ? sectionPosBottom.size : sectionPosMiddle.size;

		shaderSection.size = sectionPosBottom.size;
		captureSection.size = showResource ? sectionPosMiddle.size : sectionPosBottom.size;
		resourceSection.size = showResource ? sectionPosBottom.size : sectionPosMiddle.size;		
	
	// Hitpoints
	healthSection.hidden = !showHealth;
	if (showHealth)
	{
		let unitHealthBar = Engine.GetGUIObjectByName("healthBar");
		let healthSize = unitHealthBar.size;
		healthSize.rright = 100;
		unitHealthBar.size = healthSize;
		Engine.GetGUIObjectByName("healthStats").caption = sprintf(translate("%(hitpoints)s / %(maxHitpoints)s"), {
			"hitpoints": "?",
			"maxHitpoints": "?"
		});
		healthSection.size = sectionPosTop.size;
		captureSection.size = showResource ? sectionPosMiddle.size : sectionPosBottom.size;
		resourceSection.size = showResource ? sectionPosBottom.size : sectionPosMiddle.size;
	}
	else if (showResource)
	{
		captureSection.size = sectionPosBottom.size;
		resourceSection.size = sectionPosTop.size;
	}
	else if (showCapture)
		captureSection.size = sectionPosTop.size;


	
	// grapejuice, ammo
	ammoSection.hidden = !showAmmo;
	if (showAmmo)
	{
		let unitAmmoBar = Engine.GetGUIObjectByName("ammoBar");
		let ammoSize = unitAmmoBar.size;	
		
		if (showEnergy || showCapture)
		{
			ammoSize.rright = 100;
		}
		else
		{
			ammoSize.rright = 210;
		}
		unitAmmoBar.size = ammoSize;
		Engine.GetGUIObjectByName("ammoStats").caption = sprintf(translate("%(CurrentAmmo)s / %(MaxAmmo)s"), {
			"CurrentAmmo": "?",
			"MaxAmmo": "?"
		});
		ammoSection.size = sectionPosBottom.size;
		captureSection.size = showResource ? sectionPosMiddle.size : sectionPosBottom.size;
		resourceSection.size = showResource ? sectionPosBottom.size : sectionPosMiddle.size;
	}

	// grapejuice, energy
	energySection.hidden = !showEnergy;
	if (showEnergy)
	{
		let unitEnergyBar = Engine.GetGUIObjectByName("energyBar");
		let energySize = unitEnergyBar.size;		
		
		if (showAmmo)
		{
			energySize.rright = 100;
		}
		else
		{
			energySize.rright = 196;
		}
		unitEnergyBar.size = energySize;
		Engine.GetGUIObjectByName("energyStats").caption = sprintf(translate("%(CurrentEnergy)s / %(MaxEnergy)s"), {
			"CurrentEnergy": "?",
			"MaxEnergy": "?"
		});
		energySection.size = sectionPosBottom.size;
		captureSection.size = showResource ? sectionPosMiddle.size : sectionPosBottom.size;
		resourceSection.size = showResource ? sectionPosBottom.size : sectionPosMiddle.size;
	}
	
	// CapturePoints
	captureSection.hidden = !entState.capturePoints;
	if (entState.capturePoints)
	{
		
		let setCaptureBarPart = function(playerID, startSize) {
			let unitCaptureBar = Engine.GetGUIObjectByName("captureBar[" + playerID + "]");		
			let sizeObj = unitCaptureBar.size;
			sizeObj.rleft = startSize;

			let size = 0;
			if (showAmmo)
			{
				size = 100 * Math.max(0, Math.min(1, entState.capturePoints[playerID] / entState.maxCapturePoints));
			}
			else
			{
				size = 196 * Math.max(0, Math.min(1, entState.capturePoints[playerID] / entState.maxCapturePoints));
			}
			sizeObj.rright = startSize + size;
			unitCaptureBar.size = sizeObj;
			unitCaptureBar.sprite = "color:" + g_DiplomacyColors.getPlayerColor(playerID, 128);
			unitCaptureBar.hidden = false;
			return startSize + size;
		};

		// first handle the owner's points, to keep those points on the left for clarity
		let size = setCaptureBarPart(entState.player, 0);

		for (let i in entState.capturePoints)
			if (i != entState.player)
				size = setCaptureBarPart(i, size);

		let captureText = sprintf(translate("%(capturePoints)s / %(maxCapturePoints)s"), {
			"capturePoints": Math.ceil(entState.capturePoints[entState.player]),
			"maxCapturePoints": Math.ceil(entState.maxCapturePoints)
		});

		let showSmallCapture = showResource && showHealth;
		Engine.GetGUIObjectByName("captureStats").caption = showSmallCapture ? "" : captureText;
		Engine.GetGUIObjectByName("capture").tooltip = showSmallCapture ? captureText : "";
	}

	// Experience
	Engine.GetGUIObjectByName("experience").hidden = true;
	if (entState.promotion)
	{
		let experienceBar = Engine.GetGUIObjectByName("experienceBar");
		let experienceSize = experienceBar.size;
		experienceSize.rtop = 100 - (100 * Math.max(0, Math.min(1, 1.0 * +entState.promotion.curr / +entState.promotion.req)));
		experienceBar.size = experienceSize;

		if (entState.promotion.curr < entState.promotion.req)
			Engine.GetGUIObjectByName("experience").tooltip = sprintf(translate("%(experience)s %(current)s / %(required)s"), {
				"experience": "[font=\"sans-bold-13\"]" + translate("Experience:") + "[/font]",
				"current": Math.floor(entState.promotion.curr),
				"required": entState.promotion.req
			});
		else
			Engine.GetGUIObjectByName("experience").tooltip = sprintf(translate("%(experience)s %(current)s"), {
				"experience": "[font=\"sans-bold-13\"]" + translate("Experience:") + "[/font]",
				"current": Math.floor(entState.promotion.curr)
			});
	}

	// Resource stats
	resourceSection.hidden = !showResource;
	if (entState.resourceSupply)
	{
		let resources = entState.resourceSupply.isInfinite ? translate("∞") :  // Infinity symbol
			sprintf(translate("%(amount)s / %(max)s"), {
				"amount": "?",
				"max": "?"
			});

		let unitResourceBar = Engine.GetGUIObjectByName("resourceBar");
		let resourceSize = unitResourceBar.size;

		resourceSize.rright = entState.resourceSupply.isInfinite ? 100 :
			100 * Math.max(0, Math.min(1, +entState.resourceSupply.amount / +entState.resourceSupply.max));
		unitResourceBar.size = resourceSize;

		Engine.GetGUIObjectByName("resourceLabel").caption = sprintf(translate("%(resource)s:"), {
			"resource": resourceNameFirstWord(entState.resourceSupply.type.generic)
		});
		Engine.GetGUIObjectByName("resourceStats").caption = resources;

	}

	let resourceCarryingIcon = Engine.GetGUIObjectByName("resourceCarryingIcon");
	let resourceCarryingText = Engine.GetGUIObjectByName("resourceCarryingText");
	resourceCarryingIcon.hidden = false;
	resourceCarryingText.hidden = false;

	// Resource carrying
	if (entState.resourceCarrying && entState.resourceCarrying.length)
	{
		// We should only be carrying one resource type at once, so just display the first
		let carried = entState.resourceCarrying[0];
		resourceCarryingIcon.sprite = "stretched:session/icons/resources/" + carried.type + ".png";
		resourceCarryingText.caption = sprintf(translate("%(amount)s / %(max)s"), { "amount": carried.amount, "max": carried.max });
		resourceCarryingIcon.tooltip = "";
	}
	// Use the same indicators for traders
	else if (entState.trader && entState.trader.goods.amount)
	{
		resourceCarryingIcon.sprite = "stretched:session/icons/resources/" + entState.trader.goods.type + ".png";
		let totalGain = entState.trader.goods.amount.traderGain;
		if (entState.trader.goods.amount.market1Gain)
			totalGain += entState.trader.goods.amount.market1Gain;
		if (entState.trader.goods.amount.market2Gain)
			totalGain += entState.trader.goods.amount.market2Gain;
		resourceCarryingText.caption = totalGain;
		resourceCarryingIcon.tooltip = sprintf(translate("Gain: %(gain)s"), {
			"gain": getTradingTooltip(entState.trader.goods.amount)
		});
	}
	// And for number of workers
	else if (entState.foundation)
	{
		resourceCarryingIcon.sprite = "stretched:session/icons/repair.png";
		resourceCarryingIcon.tooltip = getBuildTimeTooltip(entState);
		resourceCarryingText.caption = entState.foundation.numBuilders ? sprintf(translate("(%(number)s)\n%(time)s"), {
			"number": entState.foundation.numBuilders,
			"time": Engine.FormatMillisecondsIntoDateStringGMT(entState.foundation.buildTime.timeRemaining * 1000, translateWithContext("countdown format", "m:ss"))
		}) : "";
	}
	else if (entState.resourceSupply && (!entState.resourceSupply.killBeforeGather || !entState.hitpoints))
	{
		resourceCarryingIcon.sprite = "stretched:session/icons/repair.png";
		resourceCarryingText.caption = sprintf(translate("%(amount)s / %(max)s"), {
			"amount": entState.resourceSupply.numGatherers,
			"max": entState.resourceSupply.maxGatherers
		});
		Engine.GetGUIObjectByName("resourceCarryingIcon").tooltip = translate("Current/max gatherers");
	}
	else if (entState.repairable && entState.needsRepair)
	{
		resourceCarryingIcon.sprite = "stretched:session/icons/repair.png";
		resourceCarryingIcon.tooltip = getRepairTimeTooltip(entState);
		resourceCarryingText.caption = entState.repairable.numBuilders ? sprintf(translate("(%(number)s)\n%(time)s"), {
			"number": entState.repairable.numBuilders,
			"time": Engine.FormatMillisecondsIntoDateStringGMT(entState.repairable.buildTime.timeRemaining * 1000, translateWithContext("countdown format", "m:ss"))
		}) : "";
	}
	else
	{
		resourceCarryingIcon.hidden = true;
		resourceCarryingText.hidden = true;
	}

	Engine.GetGUIObjectByName("player").caption = playerName;

	Engine.GetGUIObjectByName("playerColorBackground").sprite =
		"color:" + g_DiplomacyColors.getPlayerColor(entState.player, 128);

	Engine.GetGUIObjectByName("primary").caption = primaryName;
	Engine.GetGUIObjectByName("secondary").caption = !secondaryName || primaryName == secondaryName ? "" :
		sprintf(translate("(%(secondaryName)s)"), {
			"secondaryName": secondaryName
		});

	let isGaia = playerState.civ == "gaia";
	Engine.GetGUIObjectByName("playerCivIcon").sprite = isGaia ? "" : "";
	Engine.GetGUIObjectByName("player").tooltip = isGaia ? "" : civName;

	// TODO: we should require all entities to have icons
	Engine.GetGUIObjectByName("icon").sprite = template.icon ? ("stretched:session/portraits/" + template.icon) : "BackgroundBlack";
	if (template.icon)
		Engine.GetGUIObjectByName("iconBorder").onPressRight = () => {
			"";
		};

	let detailedTooltip = [
		getAttackTooltip,
		getHealerTooltip,
		getResistanceTooltip,
		getGatherTooltip,
		getSpeedTooltip,
		getGarrisonTooltip,
		getTurretsTooltip,
		getPopulationBonusTooltip,
		getProjectilesTooltip,
		getResourceTrickleTooltip,
		getUpkeepTooltip,
		getLootTooltip
	].map(func => func(entState)).filter(tip => tip).join("\n");
	if (detailedTooltip)
	{
		Engine.GetGUIObjectByName("attackAndResistanceStats").hidden = true;
		Engine.GetGUIObjectByName("attackAndResistanceStats").tooltip = detailedTooltip;
	}
	else
		Engine.GetGUIObjectByName("attackAndResistanceStats").hidden = true;

	let iconTooltips = [];

	iconTooltips.push(setStringTags(primaryName, g_TooltipTextFormats.namePrimaryBig));
	iconTooltips = iconTooltips.concat([
	].map(func => func(template)));

	Engine.GetGUIObjectByName("iconBorder").tooltip = iconTooltips.filter(tip => tip).join("\n");

	Engine.GetGUIObjectByName("detailsAreaSingle").hidden = false;
	Engine.GetGUIObjectByName("detailsAreaMultiple").hidden = true;

		return;
}

// Fills out information that most entities have
function displaySingle(entState)
{
	let technologyEnabled = Engine.GuiInterfaceCall("IsTechnologyResearched", {
		"tech": "unlock_spies",
		"player": Engine.GetPlayerID()
	});

	// grapejuice, block entity information of unowned units unless the espionage tech has been researched
	if (Engine.GetPlayerID() != entState.player && !entState.resourceSupply)
	{	
		if (technologyEnabled == false)
		{
			blockDisplaySingle(entState);
			return;
		}
	}

	let template = GetTemplateData(entState.template);
	
	let primaryName = g_SpecificNamesPrimary ? template.name.specific : template.name.generic;
	let secondaryName;
	if (g_ShowSecondaryNames)
		secondaryName = g_SpecificNamesPrimary ? template.name.generic : template.name.specific;

	// If packed, add that to the generic name (reduces template clutter).
	if (template.pack && template.pack.state == "packed")
	{
		if (secondaryName && g_ShowSecondaryNames)
			secondaryName = sprintf(translate("%(secondaryName)s — Packed"), { "secondaryName": secondaryName });
		else
			secondaryName = sprintf(translate("Packed"));
	}
	let playerState = g_Players[entState.player];

	let civName = g_CivData[playerState.civ].Name;
	let civEmblem = g_CivData[playerState.civ].Emblem;

	let playerName = playerState.name;

	// Indicate disconnected players by prefixing their name
	if (g_Players[entState.player].offline)
		playerName = sprintf(translate("\\[OFFLINE] %(player)s"), { "player": playerName });

	// Rank
	if (entState.identity && entState.identity.rank && entState.identity.classes)
	{
		Engine.GetGUIObjectByName("rankIcon").tooltip = sprintf(translate("%(rank)s Rank"), {
			"rank": translateWithContext("Rank", entState.identity.rank)
		});
		Engine.GetGUIObjectByName("rankIcon").sprite = "stretched:session/icons/ranks/" + entState.identity.rank + ".png";
		Engine.GetGUIObjectByName("rankIcon").hidden = false;
	}
	else
	{
		Engine.GetGUIObjectByName("rankIcon").hidden = true;
		Engine.GetGUIObjectByName("rankIcon").tooltip = "";
	}

	if (entState.statusEffects)
	{
		let statusEffectsSection = Engine.GetGUIObjectByName("statusEffectsIcons");
		statusEffectsSection.hidden = false;
		let statusIcons = statusEffectsSection.children;
		let i = 0;
		for (let effectCode in entState.statusEffects)
		{
			let effect = entState.statusEffects[effectCode];
			statusIcons[i].hidden = false;
			statusIcons[i].sprite = "stretched:session/icons/status_effects/" + g_StatusEffectsMetadata.getIcon(effect.baseCode) + ".png";
			statusIcons[i].tooltip = getStatusEffectsTooltip(effect.baseCode, effect, false);
			let size = statusIcons[i].size;
			size.top = i * 18;
			size.bottom = i * 18 + 16;
			statusIcons[i].size = size;

			if (++i >= statusIcons.length)
				break;
		}
		for (; i < statusIcons.length; ++i)
			statusIcons[i].hidden = true;
	}
	else
		Engine.GetGUIObjectByName("statusEffectsIcons").hidden = true;

	let showHealth = entState.hitpoints;
	let showEnergy = 0;
	let showResource = entState.resourceSupply;
	let showCapture = entState.capturePoints;
	let showAmmo = 0;

	// grapejuice, energy
	let	CurrentEnergy = 0;
	let	MaxEnergy = 0;
	if (!!entState.attack && !!entState.attack["Melee"] && !!entState.attack["Melee"].MaxEnergy)
	{
		CurrentEnergy = entState.attack["Melee"].CurrentEnergy;
		MaxEnergy = entState.attack["Melee"].MaxEnergy;
		showEnergy = entState.attack["Melee"].MaxEnergy;	
	}	
	
	// grapejuice, ammo
	let	currentAmmo = 0;
	let	maxAmmo = 0;
	if (!!entState.attack && !!entState.attack["Ranged"] && !!entState.attack["Ranged"].ammoMax)
	{
		currentAmmo = entState.attack["Ranged"].ammoLeft;
		maxAmmo = entState.attack["Ranged"].ammoMax;
		showAmmo = entState.attack["Ranged"].ammoMax;	
	} 

	let energySection = Engine.GetGUIObjectByName("energySection");
	let borderSection = Engine.GetGUIObjectByName("borderSection");
	let shaderSection = Engine.GetGUIObjectByName("shaderSection");
	let ammoSection = Engine.GetGUIObjectByName("ammoSection");
	let healthSection = Engine.GetGUIObjectByName("healthSection");
	let captureSection = Engine.GetGUIObjectByName("captureSection");
	let resourceSection = Engine.GetGUIObjectByName("resourceSection");
	let sectionPosTop = Engine.GetGUIObjectByName("sectionPosTop");
	let sectionPosMiddle = Engine.GetGUIObjectByName("sectionPosMiddle");
	let sectionPosBottom = Engine.GetGUIObjectByName("sectionPosBottom");
		

	if (!showEnergy && !showAmmo && !showCapture)
	{
		borderSection.hidden = true;
		shaderSection.hidden = true;
	}
	else if (showEnergy && showAmmo || showAmmo && showCapture)
	{
		borderSection.hidden = false;
		shaderSection.hidden = false;

		let barShaderFull = Engine.GetGUIObjectByName("barShaderFull");
		barShaderFull.hidden = true;
		let barShaderSplit1 = Engine.GetGUIObjectByName("barShaderSplit1");
		barShaderSplit1.hidden = false;
		let barShaderSplit2 = Engine.GetGUIObjectByName("barShaderSplit2");
		barShaderSplit2.hidden = false;
		
		let barBorderFull = Engine.GetGUIObjectByName("barBorderFull");
		barBorderFull.hidden = true;
		let barBorderSplit1 = Engine.GetGUIObjectByName("barBorderSplit1");
		barBorderSplit1.hidden = false;
		let barBorderSplit2 = Engine.GetGUIObjectByName("barBorderSplit2");
		barBorderSplit2.hidden = false;
		
	}
	else
	{
		borderSection.hidden = false;
		shaderSection.hidden = false;

		let barShaderFull = Engine.GetGUIObjectByName("barShaderFull");
		barShaderFull.hidden = false;
		let barShaderSplit1 = Engine.GetGUIObjectByName("barShaderSplit1");
		barShaderSplit1.hidden = true;
		let barShaderSplit2 = Engine.GetGUIObjectByName("barShaderSplit2");
		barShaderSplit2.hidden = true;

		let barBorderFull = Engine.GetGUIObjectByName("barBorderFull");
		barBorderFull.hidden = false;
		let barBorderSplit1 = Engine.GetGUIObjectByName("barBorderSplit1");
		barBorderSplit1.hidden = true;
		let barBorderSplit2 = Engine.GetGUIObjectByName("barBorderSplit2");
		barBorderSplit2.hidden = true;
	}
		borderSection.size = sectionPosBottom.size;
		captureSection.size = showResource ? sectionPosMiddle.size : sectionPosBottom.size;
		resourceSection.size = showResource ? sectionPosBottom.size : sectionPosMiddle.size;

		shaderSection.size = sectionPosBottom.size;
		captureSection.size = showResource ? sectionPosMiddle.size : sectionPosBottom.size;
		resourceSection.size = showResource ? sectionPosBottom.size : sectionPosMiddle.size;		
	
	// Hitpoints
	healthSection.hidden = !showHealth;
	if (showHealth)
	{
		let unitHealthBar = Engine.GetGUIObjectByName("healthBar");
		let healthSize = unitHealthBar.size;
		healthSize.rright = 100 * Math.max(0, Math.min(1, entState.hitpoints / entState.maxHitpoints));
		unitHealthBar.size = healthSize;
		Engine.GetGUIObjectByName("healthStats").caption = sprintf(translate("%(hitpoints)s / %(maxHitpoints)s"), {
			"hitpoints": Math.ceil(entState.hitpoints),
			"maxHitpoints": Math.ceil(entState.maxHitpoints)
		});
		healthSection.size = sectionPosTop.size;
		captureSection.size = showResource ? sectionPosMiddle.size : sectionPosBottom.size;
		resourceSection.size = showResource ? sectionPosBottom.size : sectionPosMiddle.size;
	}
	else if (showResource)
	{
		captureSection.size = sectionPosBottom.size;
		resourceSection.size = sectionPosTop.size;
	}
	else if (showCapture)
		captureSection.size = sectionPosTop.size;


	
	// grapejuice, ammo
	ammoSection.hidden = !showAmmo;
	if (showAmmo)
	{
		let unitAmmoBar = Engine.GetGUIObjectByName("ammoBar");
		let ammoSize = unitAmmoBar.size;	
		
		if (showEnergy || showCapture)
		{
			ammoSize.rright = 100 * Math.max(0, Math.min(1, entState.attack["Ranged"].ammoLeft / entState.attack["Ranged"].ammoMax));
		}
		else
		{
			ammoSize.rright = 210 * Math.max(0, Math.min(1, entState.attack["Ranged"].ammoLeft / entState.attack["Ranged"].ammoMax));
		}
		unitAmmoBar.size = ammoSize;
		Engine.GetGUIObjectByName("ammoStats").caption = sprintf(translate("%(CurrentAmmo)s / %(MaxAmmo)s"), {
			"CurrentAmmo": Math.ceil(entState.attack["Ranged"].ammoLeft),
			"MaxAmmo": Math.ceil(entState.attack["Ranged"].ammoMax)
		});
		ammoSection.size = sectionPosBottom.size;
		captureSection.size = showResource ? sectionPosMiddle.size : sectionPosBottom.size;
		resourceSection.size = showResource ? sectionPosBottom.size : sectionPosMiddle.size;
	}

	// grapejuice, energy
	energySection.hidden = !showEnergy;
	if (showEnergy)
	{
		let unitEnergyBar = Engine.GetGUIObjectByName("energyBar");
		let energySize = unitEnergyBar.size;		
		
		if (showAmmo)
		{
			energySize.rright = 100 * Math.max(0, Math.min(1, entState.attack["Melee"].CurrentEnergy / entState.attack["Melee"].MaxEnergy));
		}
		else
		{
			energySize.rright = 196 * Math.max(0, Math.min(1, entState.attack["Melee"].CurrentEnergy / entState.attack["Melee"].MaxEnergy));
		}
		unitEnergyBar.size = energySize;
		Engine.GetGUIObjectByName("energyStats").caption = sprintf(translate("%(CurrentEnergy)s / %(MaxEnergy)s"), {
			"CurrentEnergy": Math.ceil(entState.attack["Melee"].CurrentEnergy),
			"MaxEnergy": Math.ceil(entState.attack["Melee"].MaxEnergy)
		});
		energySection.size = sectionPosBottom.size;
		captureSection.size = showResource ? sectionPosMiddle.size : sectionPosBottom.size;
		resourceSection.size = showResource ? sectionPosBottom.size : sectionPosMiddle.size;
	}

	// CapturePoints
	captureSection.hidden = !entState.capturePoints;
	if (entState.capturePoints)
	{
		
		let setCaptureBarPart = function(playerID, startSize) {
			let unitCaptureBar = Engine.GetGUIObjectByName("captureBar[" + playerID + "]");		
			let sizeObj = unitCaptureBar.size;
			sizeObj.rleft = startSize;

			let size = 0;
			if (showAmmo)
			{
				size = 100 * Math.max(0, Math.min(1, entState.capturePoints[playerID] / entState.maxCapturePoints));
			}
			else
			{
				size = 196 * Math.max(0, Math.min(1, entState.capturePoints[playerID] / entState.maxCapturePoints));
			}
			sizeObj.rright = startSize + size;
			unitCaptureBar.size = sizeObj;
			unitCaptureBar.sprite = "color:" + g_DiplomacyColors.getPlayerColor(playerID, 128);
			unitCaptureBar.hidden = false;
			return startSize + size;
		};

		// first handle the owner's points, to keep those points on the left for clarity
		let size = setCaptureBarPart(entState.player, 0);

		for (let i in entState.capturePoints)
			if (i != entState.player)
				size = setCaptureBarPart(i, size);

		let captureText = sprintf(translate("%(capturePoints)s / %(maxCapturePoints)s"), {
			"capturePoints": Math.ceil(entState.capturePoints[entState.player]),
			"maxCapturePoints": Math.ceil(entState.maxCapturePoints)
		});

		let showSmallCapture = showResource && showHealth;
		Engine.GetGUIObjectByName("captureStats").caption = showSmallCapture ? "" : captureText;
		Engine.GetGUIObjectByName("capture").tooltip = showSmallCapture ? captureText : "";
	}

	// Experience
	Engine.GetGUIObjectByName("experience").hidden = !entState.promotion;
	if (entState.promotion)
	{
		let experienceBar = Engine.GetGUIObjectByName("experienceBar");
		let experienceSize = experienceBar.size;
		experienceSize.rtop = 100 - (100 * Math.max(0, Math.min(1, 1.0 * +entState.promotion.curr / +entState.promotion.req)));
		experienceBar.size = experienceSize;

		if (entState.promotion.curr < entState.promotion.req)
			Engine.GetGUIObjectByName("experience").tooltip = sprintf(translate("%(experience)s %(current)s / %(required)s"), {
				"experience": "[font=\"sans-bold-13\"]" + translate("Experience:") + "[/font]",
				"current": Math.floor(entState.promotion.curr),
				"required": entState.promotion.req
			});
		else
			Engine.GetGUIObjectByName("experience").tooltip = sprintf(translate("%(experience)s %(current)s"), {
				"experience": "[font=\"sans-bold-13\"]" + translate("Experience:") + "[/font]",
				"current": Math.floor(entState.promotion.curr)
			});
	}

	// Resource stats
	resourceSection.hidden = !showResource;
	if (entState.resourceSupply)
	{
		let resources = entState.resourceSupply.isInfinite ? translate("∞") :  // Infinity symbol
			sprintf(translate("%(amount)s / %(max)s"), {
				"amount": Math.ceil(+entState.resourceSupply.amount),
				"max": entState.resourceSupply.max
			});

		let unitResourceBar = Engine.GetGUIObjectByName("resourceBar");
		let resourceSize = unitResourceBar.size;

		resourceSize.rright = entState.resourceSupply.isInfinite ? 100 :
			100 * Math.max(0, Math.min(1, +entState.resourceSupply.amount / +entState.resourceSupply.max));
		unitResourceBar.size = resourceSize;

		Engine.GetGUIObjectByName("resourceLabel").caption = sprintf(translate("%(resource)s:"), {
			"resource": resourceNameFirstWord(entState.resourceSupply.type.generic)
		});
		Engine.GetGUIObjectByName("resourceStats").caption = resources;

	}

	let resourceCarryingIcon = Engine.GetGUIObjectByName("resourceCarryingIcon");
	let resourceCarryingText = Engine.GetGUIObjectByName("resourceCarryingText");
	resourceCarryingIcon.hidden = false;
	resourceCarryingText.hidden = false;

	// Resource carrying
	if (entState.resourceCarrying && entState.resourceCarrying.length)
	{
		// We should only be carrying one resource type at once, so just display the first
		let carried = entState.resourceCarrying[0];
		resourceCarryingIcon.sprite = "stretched:session/icons/resources/" + carried.type + ".png";
		resourceCarryingText.caption = sprintf(translate("%(amount)s / %(max)s"), { "amount": carried.amount, "max": carried.max });
		resourceCarryingIcon.tooltip = "";
	}
	// Use the same indicators for traders
	else if (entState.trader && entState.trader.goods.amount)
	{
		resourceCarryingIcon.sprite = "stretched:session/icons/resources/" + entState.trader.goods.type + ".png";
		let totalGain = entState.trader.goods.amount.traderGain;
		if (entState.trader.goods.amount.market1Gain)
			totalGain += entState.trader.goods.amount.market1Gain;
		if (entState.trader.goods.amount.market2Gain)
			totalGain += entState.trader.goods.amount.market2Gain;
		resourceCarryingText.caption = totalGain;
		resourceCarryingIcon.tooltip = sprintf(translate("Gain: %(gain)s"), {
			"gain": getTradingTooltip(entState.trader.goods.amount)
		});
	}
	// And for number of workers
	else if (entState.foundation)
	{
		resourceCarryingIcon.sprite = "stretched:session/icons/repair.png";
		resourceCarryingIcon.tooltip = getBuildTimeTooltip(entState);
		resourceCarryingText.caption = entState.foundation.numBuilders ? sprintf(translate("(%(number)s)\n%(time)s"), {
			"number": entState.foundation.numBuilders,
			"time": Engine.FormatMillisecondsIntoDateStringGMT(entState.foundation.buildTime.timeRemaining * 1000, translateWithContext("countdown format", "m:ss"))
		}) : "";
	}
	else if (entState.resourceSupply && (!entState.resourceSupply.killBeforeGather || !entState.hitpoints))
	{
		resourceCarryingIcon.sprite = "stretched:session/icons/repair.png";
		resourceCarryingText.caption = sprintf(translate("%(amount)s / %(max)s"), {
			"amount": entState.resourceSupply.numGatherers,
			"max": entState.resourceSupply.maxGatherers
		});
		Engine.GetGUIObjectByName("resourceCarryingIcon").tooltip = translate("Current/max gatherers");
	}
	else if (entState.repairable && entState.needsRepair)
	{
		resourceCarryingIcon.sprite = "stretched:session/icons/repair.png";
		resourceCarryingIcon.tooltip = getRepairTimeTooltip(entState);
		resourceCarryingText.caption = entState.repairable.numBuilders ? sprintf(translate("(%(number)s)\n%(time)s"), {
			"number": entState.repairable.numBuilders,
			"time": Engine.FormatMillisecondsIntoDateStringGMT(entState.repairable.buildTime.timeRemaining * 1000, translateWithContext("countdown format", "m:ss"))
		}) : "";
	}
	else
	{
		resourceCarryingIcon.hidden = true;
		resourceCarryingText.hidden = true;
	}

	Engine.GetGUIObjectByName("player").caption = playerName;

	Engine.GetGUIObjectByName("playerColorBackground").sprite =
		"color:" + g_DiplomacyColors.getPlayerColor(entState.player, 128);

	Engine.GetGUIObjectByName("primary").caption = primaryName;
	Engine.GetGUIObjectByName("secondary").caption = !secondaryName || primaryName == secondaryName ? "" :
		sprintf(translate("(%(secondaryName)s)"), {
			"secondaryName": secondaryName
		});

	let isGaia = playerState.civ == "gaia";
	Engine.GetGUIObjectByName("playerCivIcon").sprite = isGaia ? "" : "cropped:1.0, 0.15625 center:grayscale:" + civEmblem;
	Engine.GetGUIObjectByName("player").tooltip = isGaia ? "" : civName;

	// TODO: we should require all entities to have icons
	Engine.GetGUIObjectByName("icon").sprite = template.icon ? ("stretched:session/portraits/" + template.icon) : "BackgroundBlack";
	if (template.icon)
		Engine.GetGUIObjectByName("iconBorder").onPressRight = () => {
			showTemplateDetails(entState.template, playerState.civ);
		};

	let detailedTooltip = [
		getAttackTooltip,
		getHealerTooltip,
		getResistanceTooltip,
		getGatherTooltip,
		getSpeedTooltip,
		getGarrisonTooltip,
		getTurretsTooltip,
		getPopulationBonusTooltip,
		getProjectilesTooltip,
		getResourceTrickleTooltip,
		getUpkeepTooltip,
		getLootTooltip
	].map(func => func(entState)).filter(tip => tip).join("\n");
	if (detailedTooltip)
	{
		Engine.GetGUIObjectByName("attackAndResistanceStats").hidden = false;
		Engine.GetGUIObjectByName("attackAndResistanceStats").tooltip = detailedTooltip;
	}
	else
		Engine.GetGUIObjectByName("attackAndResistanceStats").hidden = true;

	let iconTooltips = [];

	iconTooltips.push(setStringTags(primaryName, g_TooltipTextFormats.namePrimaryBig));
	iconTooltips = iconTooltips.concat([
		getVisibleEntityClassesFormatted,
		getAurasTooltip,
		getEntityTooltip,
		getTreasureTooltip,
		showTemplateViewerOnRightClickTooltip
	].map(func => func(template)));

	Engine.GetGUIObjectByName("iconBorder").tooltip = iconTooltips.filter(tip => tip).join("\n");

	Engine.GetGUIObjectByName("detailsAreaSingle").hidden = false;
	Engine.GetGUIObjectByName("detailsAreaMultiple").hidden = true;
}
