function Energy() {}

Energy.prototype.Schema =
	"<a:help>Deals with Energy.</a:help>" +
	"<a:example>" +
		"<CurrEnergy>30</CurrEnergy>" +
		"<MaxEnergy>30</MaxEnergy>" +
		"<RegenRate>6000</RegenRate>" +
		"<RegenAmount>30</RegenAmount>" +
	"</a:example>" +
	"<element name='CurrEnergy'><data type='nonNegativeInteger'/></element>" +
	"<element name='MaxEnergy'><data type='nonNegativeInteger'/></element>" +
	"<element name='RegenRate'><data type='nonNegativeInteger'/></element>" +
	"<element name='RegenAmount'><data type='nonNegativeInteger'/></element>" ;


Energy.prototype.Init = function()
{
	this.energy = +this.template.CurrEnergy;
	this.maxEnergy = +this.template.MaxEnergy;
	this.regenRate = +this.template.RegenRate;
	this.regenAmount = +this.template.RegenAmount;
	this.regenTimer = undefined;
	this.isIdle = true;
}

Energy.prototype.StopRegen = function()
{
	let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
	cmpTimer.CancelTimer(this.regenTimer);
	this.regenTimer =	undefined;
};

Energy.prototype.AutoRefill = function()
{

};

Energy.prototype.Increase = function(amount)
{
	// Before changing the value, activate Fogging if necessary to hide changes
	const cmpFogging = Engine.QueryInterface(this.entity, IID_Fogging);
	if (cmpFogging)
		cmpFogging.Activate();

	const old = this.energy;
	this.energy = Math.min(this.energy + amount, this.GetMaxEnergy());

	this.RegisterEnergyChanged(old);

	return { "old": old, "new": this.energy };
};

Energy.prototype.Reduce = function(amount)
{
	if (!amount || !this.energy)
		return { "energyChange": 0 };

	// Before changing the value, activate Fogging if necessary to hide changes
	const cmpFogging = Engine.QueryInterface(this.entity, IID_Fogging);
	if (cmpFogging)
		cmpFogging.Activate();

	const oldEnergy = this.energy;

	this.energy -= amount;
	this.RegisterEnergyChanged(oldEnergy);
	return { "energyChange": this.energy - oldEnergy };
};

Energy.prototype.ExecuteRegeneration = function()
{
	if (this.energy < this.maxEnergy)
		this.Increase(this.GetRegenAmount())
	else
		this.StopRegen();
};

/*
 * Check if the regeneration timer needs to be started or stopped
 * this function is also called by UnitAI~grapejuice
 */
Energy.prototype.CheckRegenTimer = function()
{
	// check if we need a timer
	if (!this.isIdle)
	{
		// we don't need a timer, disable if one exists
		if (this.regenTimer)
			this.StopRegen()
		return;
	}

	// we need a timer, enable if one doesn't exist
	if (this.regenTimer)
		return;

	let regenRate = this.GetRegenRate()
	const cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
	this.regenTimer = cmpTimer.SetInterval(this.entity, IID_Energy, "ExecuteRegeneration", regenRate, regenRate, null);
};

Energy.prototype.GetRegenRate = function()
{
	return this.regenRate;
};

Energy.prototype.GetRegenAmount = function()
{
	return this.regenAmount;
};


Energy.prototype.OnValueModification = function(msg)
{
	if (msg.component == "Energy")
		this.RecalculateValues();
};

Energy.prototype.GetEnergy = function()
{
	return this.energy;
};

Energy.prototype.GetMaxEnergy = function()
{
	return this.maxEnergy;
};

Energy.prototype.SetEnergy = function(value)
{
	// Before changing the value, activate Fogging if necessary to hide changes
	const cmpFogging = Engine.QueryInterface(this.entity, IID_Fogging);
	if (cmpFogging)
		cmpFogging.Activate();

	const old = this.energy;
	this.energy = Math.max(0, Math.min(this.GetMaxEnergy(), value));

	this.RegisterEnergyChanged(old);
};

Energy.prototype.RegisterEnergyChanged = function(from)
{
	this.CheckRegenTimer();
	Engine.PostMessage(this.entity, MT_EnergyChanged, { "from": from, "to": this.energy });
};

Energy.prototype.RecalculateValues = function()
{
	this.CheckRegenTimer();
};

Engine.RegisterComponentType(IID_Energy, "Energy", Energy);
