/**
 * @param {object} enstState - used to check the entity player id and entity type
 * @returns {boolean}
 * Check if the player has permission to view unit statistics.
 * Returns true if the player has the Espionage tech, the entity is Gaia, Allied or a Resource.
 * Or if the player is an observer or anything else but an active state.
 */

if (!globalThis._grapejuiceDisplaySinglePatched)
{
	const _origDisplaySingle = displaySingle;

	displaySingle = function(entState)
	{
		// Call vanilla first
		_origDisplaySingle.apply(this, arguments);

		Engine.GetGUIObjectByName("captureSection").hidden = true;

		// realtime update rankup stats tooltip to reflect current bonus on current rank
		Engine.GetGUIObjectByName("rankIcon").tooltip = '[color="252 186 3"]Current Rank: ' + translateWithContext("Rank", entState.identity.rank) + `[color="255 255 255"]`
		if (entState.identity.rank != "Basic")
		{
			let baseMult = entState.identity.classes.includes("Hero") || entState.identity.classes.includes("Champion") ? 2 : 0;
			let isRanged = entState.identity.classes.includes("Ranged")
			let isWorker = entState.identity.classes.includes("Worker") && !entState.identity.classes.includes("Mercenary")
			let isSupport = entState.identity.classes.includes("Support") && !entState.identity.classes.includes("AmmoSupply")
			let isSiege = entState.identity.classes.includes("Siege") && !entState.identity.classes.includes("Ram")
			let isJav = entState.identity.classes.includes("Javelineer")
			let ranks = [ "Basic", "Advanced", "Elite", "Champion", "Hero", "Hero I", "Hero II", "Hero III", "Hero IV", "Hero V" ]
			let rank = 0;
			for (let index = 0; index < ranks.length; index++) {
				const unitClass = ranks[index];
				if (unitClass == entState.identity.rank)
					rank += baseMult+index
			}
			Engine.GetGUIObjectByName("rankIcon").tooltip += `\nCurrent Rank Bonus: `
			if (!isSupport)
			{
				Engine.GetGUIObjectByName("rankIcon").tooltip += `\n+${5*rank}% Attack Speed`
				if (!isSiege)
					Engine.GetGUIObjectByName("rankIcon").tooltip += `\n+${isRanged ? 5*rank : 10*rank}% Melee Attack Damage`
			}
			Engine.GetGUIObjectByName("rankIcon").tooltip += `\n+${10*rank}% Max Health`
			if (isJav)
				Engine.GetGUIObjectByName("rankIcon").tooltip += `\n+${1*(rank+1)} Max Ammo`
			if (isRanged)
				Engine.GetGUIObjectByName("rankIcon").tooltip += `\n+${5*rank}% Accuracy`
			if (isWorker)
				Engine.GetGUIObjectByName("rankIcon").tooltip += `\n+${5*rank}% gathering speed \n+${10*rank}% Build Speed`

			Engine.GetGUIObjectByName("rankIcon").tooltip += `\n+${10*rank}% Loot`
		}
		Engine.GetGUIObjectByName("rankIcon").tooltip += `\nRanks in order: Basic, Advanced, Elite, Champion, Hero, Hero I, Hero II, Hero III, Hero IV, Hero V`
		Engine.GetGUIObjectByName("rankIcon").size = "0 0 32 32"

		let energySection = Engine.GetGUIObjectByName("energySection");
		let ammoSection = Engine.GetGUIObjectByName("ammoSection");
		let borderSection = Engine.GetGUIObjectByName("borderSection");
		let shaderSection = Engine.GetGUIObjectByName("shaderSection");

		let captureSection = Engine.GetGUIObjectByName("captureSection_gj");
		let resourceSection = Engine.GetGUIObjectByName("resourceSection");
		let sectionPosTop = Engine.GetGUIObjectByName("sectionPosTop");
		let sectionPosMiddle = Engine.GetGUIObjectByName("sectionPosMiddle");
		let sectionPosBottom = Engine.GetGUIObjectByName("sectionPosBottom");

		let showHealth = entState.hitpoints;
		let showEnergy = entState.energy;
		let showAmmo = entState.ammo;
		let showResource = entState.resourceSupply;
		let showCapture = entState.capturePoints

		// technically we are duplicating the capture bar logic, but it's only called when 1 entity is selected and ~2-3x a second so perf impact is negligible
		Engine.GetGUIObjectByName("captureSection_gj").hidden = !entState.capturePoints;
		if (showCapture)
		{
			let setCaptureBarPart = function(playerID, startSize) {
				let unitCaptureBar = Engine.GetGUIObjectByName("captureBar_gj[" + playerID + "]");
				let sizeObj = unitCaptureBar.size;
				let size = 100 * Math.max(0, Math.min(1, entState.capturePoints[playerID] / entState.maxCapturePoints));
				if (showAmmo && CheckViewPermission(entState))
				{
					startSize = 49
					size = 50 * Math.max(0, Math.min(1, entState.capturePoints[playerID] / entState.maxCapturePoints));
				}

				sizeObj.rleft = startSize;
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
			Engine.GetGUIObjectByName("captureStats_gj").caption = showSmallCapture ? "" : captureText;
			Engine.GetGUIObjectByName("capture_gj").tooltip = showSmallCapture ? captureText : "";
			captureSection.size = showResource ? sectionPosMiddle.size : sectionPosBottom.size;
		}

		// grapejuice, energy
		let	currentEnergy = 0;
		let	maxEnergy = 0;
		if (showEnergy)
		{
			currentEnergy = entState.energy.currEnergy;
			maxEnergy = entState.energy.maxEnergy;
		}

		// grapejuice, ammo
		let	currentAmmo = 0;
		let	maxAmmo = 0;
		if (showAmmo)
		{
			currentAmmo = entState.ammo.currAmmo;
			maxAmmo = entState.ammo.maxAmmo;
		}

		let activeBars = 0
		if (showEnergy)
			activeBars++
		else if (showAmmo)
			activeBars++
		else if (showCapture)
			activeBars++

		if (activeBars == 0)
		{
			borderSection.hidden = true;
			shaderSection.hidden = true;
		}
		else if (activeBars == 1)
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
		else if (activeBars == 2)
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

		// grapejuice, ammo
		ammoSection.hidden = !showAmmo;
		if (showAmmo)
		{
			let unitAmmoBar = Engine.GetGUIObjectByName("ammoBar");
			let unitAmmoBarBG = Engine.GetGUIObjectByName("ammoBarBG");
			let ammoSize = unitAmmoBar.size;

			if (showEnergy || showCapture)
			{
				ammoSize.rright = 100 * Math.max(0, Math.min(1, currentAmmo / maxAmmo));
			}
			else
			{
				ammoSize.rright = 210 * Math.max(0, Math.min(1, currentAmmo / maxAmmo));
			}
			unitAmmoBar.size = ammoSize;
			unitAmmoBarBG.size = ammoSize;
			Engine.GetGUIObjectByName("ammoLabel").caption = sprintf(translate("%(CurrentAmmo)s / %(MaxAmmo)s"), {
				"CurrentAmmo": Math.ceil(currentAmmo),
				"MaxAmmo": Math.ceil(maxAmmo)
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
			let unitEnergyBarBG = Engine.GetGUIObjectByName("energyBarBG");
			let energySize = unitEnergyBar.size;

			if (showAmmo)
			{
				energySize.rright = 100 * Math.max(0, Math.min(1, currentEnergy / maxEnergy));
			}
			else
			{
				energySize.rright = 196 * Math.max(0, Math.min(1, currentEnergy / maxEnergy));
			}
			unitEnergyBar.size = energySize;
			unitEnergyBarBG.size = energySize;
			Engine.GetGUIObjectByName("energyLabel").caption = sprintf(translate("%(currentEnergy)s / %(maxEnergy)s"), {
				"currentEnergy": Math.ceil(currentEnergy),
				"maxEnergy": Math.ceil(maxEnergy)
			});
			energySection.size = sectionPosBottom.size;
			captureSection.size = showResource ? sectionPosMiddle.size : sectionPosBottom.size;
			resourceSection.size = showResource ? sectionPosBottom.size : sectionPosMiddle.size;
		}

		if (!CheckViewPermission(entState))
			HideInfo(showResource, showCapture)
	};

	const _origDisplayMultiple = displayMultiple;

	// Fills out information for multiple entities
	displayMultiple = function(entStates)
	{
		_origDisplayMultiple.apply(this, arguments);
		Engine.GetGUIObjectByName("captureSection_gj").hidden = true;
		Engine.GetGUIObjectByName("ammoSection").hidden = true;
		Engine.GetGUIObjectByName("energySection").hidden = true;
		Engine.GetGUIObjectByName("borderSection").hidden = true;
		Engine.GetGUIObjectByName("shaderSection").hidden = true;
		let averageAmmo = 0;
		let maxAmmo = 0;
		let averageEnergy = 0;
		let maxEnergy = 0;

		for (let entState of entStates)
		{
			if (!!entState.ammo)
			{
				averageAmmo += entState.ammo.currAmmo;
				maxAmmo += entState.ammo.maxAmmo;
			}
			if (!!entState.energy)
			{
				averageEnergy += entState.energy.currEnergy;
				maxEnergy += entState.energy.maxEnergy;
			}
		}

		Engine.GetGUIObjectByName("ammoMultiple").hidden = averageAmmo <= 0;
		if (averageAmmo > 0)
		{
			let unitAmmoBar = Engine.GetGUIObjectByName("ammoBarMultiple");
			let ammoSize = unitAmmoBar.size;
			ammoSize.rtop = 100 - 100 * Math.max(0, Math.min(1, averageAmmo / maxAmmo));
			unitAmmoBar.size = ammoSize;

			Engine.GetGUIObjectByName("ammoMultiple").tooltip = getCurrentAmmoTooltip({
				"hitpoints": averageAmmo,
				"maxHitpoints": maxAmmo
			});
		}

		Engine.GetGUIObjectByName("energyMultiple").hidden = averageEnergy <= 0;
		if (averageEnergy > 0)
		{
			let unitEnergyBar = Engine.GetGUIObjectByName("energyBarMultiple");
			let energySize = unitEnergyBar.size;
			energySize.rtop = 100 - 100 * Math.max(0, Math.min(1, averageEnergy / maxEnergy));
			unitEnergyBar.size = energySize;

			Engine.GetGUIObjectByName("energyMultiple").tooltip = getCurrentEnergyTooltip({
				"hitpoints": averageEnergy,
				"maxHitpoints": maxEnergy
			});
		}
	}

	globalThis._grapejuiceDisplaySinglePatched = true;
}

function CheckViewPermission(entState)
{
	const playerID = Engine.GetPlayerID();
	const playerState = Engine.GuiInterfaceCall("GetState", { "player": playerID });

	// observers
	if (playerID == -1 || playerState != 'active')
	{
		return true;
	}

	const entityPlayerID = entState.player;
	const technologyEnabled = Engine.GuiInterfaceCall("HasSpyTech", { "player": playerID });

	// If the player has the tech no need to check further, full permission granted.
	if (technologyEnabled)
		return true;


	if (g_Players[entityPlayerID].isAlly[playerID] || playerID == entityPlayerID || !!entState.resourceSupply)
		return true;

	return false;
}

function HideInfo(showResource, showCapture)
{
	Engine.GetGUIObjectByName("player").caption = sprintf(translate("?"));
	Engine.GetGUIObjectByName("player").tooltip = sprintf(translate("Espionage tech required"));
	Engine.GetGUIObjectByName("primary").caption = sprintf(translate("Espionage tech required"));
	Engine.GetGUIObjectByName("secondary").caption = sprintf(translate("can be researched at the civic center"));
	Engine.GetGUIObjectByName("playerCivIcon").hidden = true;

	Engine.GetGUIObjectByName("rankIcon").hidden = true;
	Engine.GetGUIObjectByName("rankIcon").tooltip = "";
	if (!showResource && !showCapture)
	{
		Engine.GetGUIObjectByName("shaderSection").hidden = true;
		Engine.GetGUIObjectByName("borderSection").hidden = true;
	}
	Engine.GetGUIObjectByName("healthSection").hidden = true;
	Engine.GetGUIObjectByName("ammoSection").hidden = true;
	Engine.GetGUIObjectByName("energySection").hidden = true;
	Engine.GetGUIObjectByName("experience").hidden = true
	Engine.GetGUIObjectByName("phaseEmblems").hidden = true;

	Engine.GetGUIObjectByName("iconBorder").onPressRight = () => {return false};
	Engine.GetGUIObjectByName("attackAndResistanceStats").hidden = true
}


