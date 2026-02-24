const trainingPanel = g_SelectionPanels.Training;

if (!trainingPanel._grapejuicePatched)
{
	const _origSetupButton = trainingPanel.setupButton;

	trainingPanel.setupButton = function(data)
	{
		const result = _origSetupButton.apply(this, arguments);
		if (!result)
			return result;

		if (Engine.ConfigDB_GetValue("user", "showdetailedtooltips") !== "true")
			return result;

		const template = GetTemplateData(data.item, data.player);
		if (!template)
			return result;

		const energy = getEnergyTooltip(template);
		const ammo   = getAmmoTooltip(template);

		if (!energy && !ammo)
			return result;

		let lines = data.button.tooltip.split("\n");

		const healthIndex = lines.findIndex(line =>
			line.includes(translate("Health")) ||
			line.includes("Health")
		);

		if (healthIndex !== -1)
		{
			const insert = [energy, ammo].filter(Boolean);
			lines.splice(healthIndex + 1, 0, ...insert);
			data.button.tooltip = lines.join("\n");
		}

		return result;
	};

	trainingPanel._grapejuicePatched = true;
}