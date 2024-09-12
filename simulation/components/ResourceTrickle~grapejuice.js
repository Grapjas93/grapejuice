ResourceTrickle.prototype.Schema =
	"<a:help>Controls the resource trickle ability of the unit.</a:help>" +
	"<element name='Rates' a:help='Trickle Rates'>" +
		Resources.BuildSchema("decimal") +
	"</element>" +
	"<element name='Interval' a:help='Number of miliseconds must pass for the player to gain the next trickle.'>" +
		"<ref name='nonNegativeDecimal'/>" +
	"</element>";

	ResourceTrickle.prototype.Trickle = function(data, lateness)
{
	// The player entity may also have a ResourceTrickle component
	let cmpPlayer = QueryOwnerInterface(this.entity) || Engine.QueryInterface(this.entity, IID_Player);
	if (!cmpPlayer)
		return;

	let braziers = Helpers.GetPlayerEntitiesByClass(cmpPlayer.GetPlayerID(), "Brazier");
	for (let res in this.rates)
	{
		let amount = this.rates[res];
		if (amount < 0 && cmpPlayer.GetResourceCounts()[res] != 0)
			cmpPlayer.AddResource(res, amount)
		else if (amount < 0 && cmpPlayer.GetResourceCounts()[res] == 0)
			for (let brazier of braziers)
				ChangeEntityTemplate(brazier, "brazier_off")
		else
			cmpPlayer.AddResource(res, amount)
	}
};

Engine.ReRegisterComponentType(IID_ResourceTrickle, "ResourceTrickle", ResourceTrickle);
