/**
 * This class is concerned with updating the labels and icons in the diplomacy dialog that don't provide player interaction.
 */
DiplomacyDialogPlayerControl.prototype.DiplomacyPlayerText = class
{
	constructor(playerID)
	{
		this.playerID = playerID;

		let id = "[" + (playerID - 1) + "]";

		this.diplomacyPlayer = Engine.GetGUIObjectByName("diplomacyPlayer" + id);
		this.diplomacyPlayerCiv = Engine.GetGUIObjectByName("diplomacyPlayerCiv" + id);
		this.diplomacyPlayerName = Engine.GetGUIObjectByName("diplomacyPlayerName" + id);
		this.diplomacyPlayerTeam = Engine.GetGUIObjectByName("diplomacyPlayerTeam" + id);
		this.diplomacyPlayerTheirs = Engine.GetGUIObjectByName("diplomacyPlayerTheirs" + id);
		this.diplomacyPlayerOutcome = Engine.GetGUIObjectByName("diplomacyPlayerOutcome" + id);
		this.seenPlayers = Engine.GuiInterfaceCall("GetSeenPlayers", { "player": g_ViewedPlayer });
		this.HasEpionageTech = Engine.GuiInterfaceCall("HasSpyTech", { "player": g_ViewedPlayer });

		this.init();
	}

	init()
	{
		// TODO: Atlas should pass this
		if (Engine.IsAtlasRunning())
			return;

		this.diplomacyPlayerCiv.caption = this.HasEpionageTech ? g_CivData[g_Players[this.playerID].civ].Name : "?";
		this.diplomacyPlayerName.tooltip = translateAISettings(g_InitAttributes.settings.PlayerData[this.playerID]);
		this.diplomacyPlayerName.caption = g_Players[this.playerID].name;


		// Apply offset
		let rowSize = DiplomacyDialogPlayerControl.prototype.DiplomacyPlayerText.getRowHeight();
		let size = this.diplomacyPlayer.size;
		size.top = rowSize * (this.playerID - 1);
		size.bottom = rowSize * this.playerID;
		this.diplomacyPlayer.size = size;
		this.diplomacyPlayer.hidden = false;
	}

	update()
	{


		setOutcomeIcon(g_Players[this.playerID].state, this.diplomacyPlayerOutcome);

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
			this.diplomacyPlayerTeam.caption = "?";
			this.diplomacyPlayerTheirs.caption = "?";
		}

	}
};

DiplomacyDialogPlayerControl.prototype.DiplomacyPlayerText.getRowHeight = function()
{
	let diplomacyPlayer = Engine.GetGUIObjectByName("diplomacyPlayer[0]").size;
	return diplomacyPlayer.bottom - diplomacyPlayer.top;
};

DiplomacyDialogPlayerControl.prototype.DiplomacyPlayerText.getHeightOffset = function()
{
	return (g_Players.length - 1) * DiplomacyDialogPlayerControl.prototype.DiplomacyPlayerText.getRowHeight();
};

DiplomacyDialogPlayerControl.prototype.DiplomacyPlayerText.prototype.NoTeam =
	markForTranslationWithContext("team", "None");

DiplomacyDialogPlayerControl.prototype.DiplomacyPlayerText.prototype.Ally =
	markForTranslation("Ally");

DiplomacyDialogPlayerControl.prototype.DiplomacyPlayerText.prototype.Neutral =
	markForTranslation("Neutral");

DiplomacyDialogPlayerControl.prototype.DiplomacyPlayerText.prototype.Enemy =
	markForTranslation("Enemy");
