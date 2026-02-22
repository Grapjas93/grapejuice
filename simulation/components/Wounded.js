function Wounded() {}

Wounded.prototype.Init = function()
{
	this.wounded = false;
}

Wounded.prototype.RegisterWoundedChanged = function(from)
{
	Engine.PostMessage(this.entity, MT_WoundedChanged, { "from": from, "to": this.wounded });
};

Wounded.prototype.OnHealthChanged = function(msg)
{
	let cmpAuras = Engine.QueryInterface(this.entity, IID_Auras)
	if (!cmpAuras)
		return;

	// Grapejuice modifiers, units above 1/3 of their max hp will get their penalties removed
	let treshold = QueryMiragedInterface(this.entity, IID_Health).GetMaxHitpoints() / 3;
	if (msg.to > treshold)
	{
		this.wounded = false;
		this.RegisterWoundedChanged(true)
		cmpAuras.RemoveAura("units/wounded", [this.entity])
	}
	else if (msg.to <= treshold)
	{
		this.wounded = true;
		this.RegisterWoundedChanged(false)
		cmpAuras.ApplyAura("units/wounded", [this.entity])
	}
};


Engine.RegisterComponentType(IID_Wounded, "Wounded", Wounded);
