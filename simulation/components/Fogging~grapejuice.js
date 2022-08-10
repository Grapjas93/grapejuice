const VIS_HIDDEN = 0;
const VIS_FOGGED = 1;
const VIS_VISIBLE = 2;

/**
 * @returns {array} - playerIDs seen done by exploring
 */
Fogging.prototype.GetSeenPlayers = function()
{
	return QueryOwnerInterface(this.entity).hasSeenPlayers;
};

Fogging.prototype.OnVisibilityChanged = function(msg)
{
	if (msg.player < 0 || msg.player >= this.mirages.length)
		return;

	if (msg.newVisibility == VIS_VISIBLE)
	{
		this.miraged[msg.player] = false;
		this.seen[msg.player] = true;

		// add first contact with players to array and push a spotted player notification
		const cmpPlayer = QueryPlayerIDInterface(msg.player);
		if (cmpPlayer)
			cmpPlayer.AddSeenPlayer(QueryOwnerInterface(msg.ent).GetPlayerID(), msg.ent);
	}

	if (msg.newVisibility == VIS_FOGGED && this.activated)
		this.LoadMirage(msg.player);
};

Engine.ReRegisterComponentType(IID_Fogging, "Fogging", Fogging);
