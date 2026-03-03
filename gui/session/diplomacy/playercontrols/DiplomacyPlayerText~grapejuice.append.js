const _origUpdate =
	DiplomacyDialogPlayerControl
		.prototype
		.DiplomacyPlayerText
		.prototype
		.update;

DiplomacyDialogPlayerControl
	.prototype
	.DiplomacyPlayerText
	.prototype
	.update = function ()
{
	_origUpdate.apply(this, arguments);

	this.seenPlayers = Engine.GuiInterfaceCall("GetSeenPlayers", { "player": g_ViewedPlayer });
	this.HasEpionageTech = Engine.GuiInterfaceCall("HasSpyTech", { "player": g_ViewedPlayer });

	if (this.HasEpionageTech || this.playerID == g_ViewedPlayer || g_Players[this.playerID].isAlly[g_ViewedPlayer])
	{
		this.diplomacyPlayer.sprite = "color:" + g_DiplomacyColors.getPlayerColor(this.playerID, 32);

		this.diplomacyPlayerName.caption = colorizePlayernameByID(this.playerID);
		this.diplomacyPlayerCiv.caption = g_CivData[g_Players[this.playerID].civ].Name;

		this.diplomacyPlayerTeam.caption =
			g_Players[this.playerID].team >= 0 ?
				g_Players[this.playerID].team + 1 :
				translateWithContext("team", this.NoTeam);

		this.diplomacyPlayerTheirs.caption =
			this.playerID == g_ViewedPlayer ? "" :
				g_Players[this.playerID].isAlly[g_ViewedPlayer] ?
					translate(this.Ally) :
					g_Players[this.playerID].isNeutral[g_ViewedPlayer] ?
						translate(this.Neutral) :
						translate(this.Enemy);
	}
	else if (this.seenPlayers.includes(this.playerID))
	{
		this.diplomacyPlayer.sprite = "color:" + g_DiplomacyColors.getPlayerColor(this.playerID, 32);
		this.diplomacyPlayerName.caption = colorizePlayernameByID(this.playerID);
		this.diplomacyPlayerCiv.caption = g_CivData[g_Players[this.playerID].civ].Name;
	}
	else
	{
		this.diplomacyPlayerName.caption = g_Players[this.playerID].name;
		this.diplomacyPlayer.sprite = "color:" + "255 255 255 1";
		this.diplomacyPlayerCiv.caption = "?";
		this.diplomacyPlayerTeam.caption = "?";
		this.diplomacyPlayerTheirs.caption = "?";
	}
};