ChatMessageFormatSimulation.discovered = class
{
	parse(msg)
	{
		if (msg.player != g_ViewedPlayer)
			return "";

		const message = translate("%(icon)s %(playerFound)s (%(diplomacy)s) has been spotted!");

		return {
			"text": sprintf(message, {
				"icon": '[icon="icon_alert"]',
				"playerFound": colorizePlayernameByID(msg.playerFound),
				"diplomacy": msg.diplomacy
			}),
			"callback": ((target, position) => function() {
				focusAttack({ "target": target, "position": position });
			})(msg.target, msg.position),
			"tooltip": translate("Click to focus location.")
		};
	}
};