g_SelectionPanels.Training = {
	"getMaxNumberOfItems": function()
	{
		return 40 - getNumberOfRightPanelButtons();
	},
	"rowLength": 10,
	"getItems": function()
	{
		return getAllTrainableEntitiesFromSelection();
	},
	"setupButton": function(data)
	{
		const template = GetTemplateData(data.item, data.player);
		if (!template)
			return false;

		const requirementsMet = Engine.GuiInterfaceCall("AreRequirementsMet", {
			"requirements": template.requirements,
			"player": data.player
		});

		const unitIds = data.unitEntStates.map(status => status.id);
		const [buildingsCountToTrainFullBatch, fullBatchSize, remainderBatch] =
			getTrainingStatus(unitIds, data.item, data.playerState);

		const trainNum = buildingsCountToTrainFullBatch * fullBatchSize + remainderBatch;

		let neededResources;
		if (template.cost)
			neededResources = Engine.GuiInterfaceCall("GetNeededResources", {
				"cost": multiplyEntityCosts(template, trainNum),
				"player": data.player
			});

		data.button.onPress = function() {
			if (!neededResources)
				addTrainingToQueue(unitIds, data.item, data.playerState);
		};

		const showTemplateFunc = () => { showTemplateDetails(data.item, data.playerState.civ); };
		data.button.onPressRight = showTemplateFunc;
		data.button.onPressRightDisabled = showTemplateFunc;

		data.countDisplay.caption = trainNum > 1 ? trainNum : "";

		let tooltips = [
			"[font=\"sans-bold-16\"]" +
				colorizeHotkey("%(hotkey)s", "session.queueunit." + (data.i + 1)) +
				"[/font]" + " " + getEntityNamesFormatted(template),
			getVisibleEntityClassesFormatted(template),
			getAurasTooltip(template),
			getEntityTooltip(template),
			getEntityCostTooltip(template, data.player, unitIds[0], buildingsCountToTrainFullBatch, fullBatchSize, remainderBatch)
		];
		const limits = getEntityLimitAndCount(data.playerState, data.item);
		tooltips.push(formatLimitString(limits.entLimit, limits.entCount, limits.entLimitChangers),
			formatMatchLimitString(limits.matchLimit, limits.matchCount, limits.type));

		if (Engine.ConfigDB_GetValue("user", "showdetailedtooltips") === "true")
			tooltips = tooltips.concat([
				getHealthTooltip,
				getEnergyTooltip, //grapejuice
				getAmmoTooltip, //grapejuice
				getAttackTooltip,
				getHealerTooltip,
				getResistanceTooltip,
				getGarrisonTooltip,
				getTurretsTooltip,
				getProjectilesTooltip,
				getSpeedTooltip,
				getResourceDropsiteTooltip
			].map(func => func(template)));

		tooltips.push(getTemplateViewerOnRightClickTooltip());
		tooltips.push(
			formatBatchTrainingString(buildingsCountToTrainFullBatch, fullBatchSize, remainderBatch),
			getRequirementsTooltip(requirementsMet, template.requirements, GetSimState().players[data.player].civ),
			getNeededResourcesTooltip(neededResources));

		data.button.tooltip = tooltips.filter(tip => tip).join("\n");

		let modifier = "";
		if (!requirementsMet || limits.canBeAddedCount == 0)
		{
			data.button.enabled = false;
			modifier = "color:0 0 0 127:grayscale:";
		}
		else
		{
			data.button.enabled = controlsPlayer(data.player);
			if (neededResources)
				modifier = resourcesToAlphaMask(neededResources) + ":";
		}

		if (data.unitEntStates.every(state => state.upgrade && state.upgrade.isUpgrading))
		{
			data.button.enabled = false;
			modifier = "color:0 0 0 127:grayscale:";
			data.button.tooltip += "\n" + objectionFont(translate("Cannot train while upgrading."));
		}

		if (template.icon)
			data.icon.sprite = modifier + "stretched:session/portraits/" + template.icon;

		const index = data.i + getNumberOfRightPanelButtons();
		setPanelObjectPosition(data.button, index, data.rowLength);

		return true;
	}
};
