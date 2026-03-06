function Ammo() {}

Ammo.prototype.Schema =
	"<a:help>Deals with ammo.</a:help>" +
	"<a:example>" +
		"<CurrAmmo>30</CurrAmmo>" +
		"<MaxAmmo>30</MaxAmmo>" +
		"<RefillTime>6000</RefillTime>" +
		"<RefillAmount>30</RefillAmount>" +
		"<RefillCostMult>1</RefillCostMult>" +
	"</a:example>" +
	"<element name='CurrAmmo'><data type='nonNegativeInteger'/></element>" +
	"<element name='MaxAmmo'><data type='nonNegativeInteger'/></element>" +
	"<element name='RefillTime'><data type='nonNegativeInteger'/></element>" +
	"<element name='RefillAmount'><data type='nonNegativeInteger'/></element>" +
	"<element name='RefillCostMult'><data type='nonNegativeInteger'/></element>";


Ammo.prototype.Init = function()
{
	this.ammo = +this.template.CurrAmmo;
	this.maxAmmo = +this.template.MaxAmmo;
	this.refillTime = +this.template.RefillTime;
	this.refillAmount = +this.template.RefillAmount;
	this.refillCostMult = +this.template.RefillCostMult;
	this.ammoReffilTimer = undefined;
	this.ammoGiver = undefined;
	this.hasInfAmmoGiver = false;
}

Ammo.prototype.StopReArming = function()
{
	let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
	cmpTimer.CancelTimer(this.ammoReffilTimer);
	this.ammoReffilTimer =	undefined;
};

Ammo.prototype.AutoRefill = function()
{

};

Ammo.prototype.Increase = function(amount)
{
	// Before changing the value, activate Fogging if necessary to hide changes
	const cmpFogging = Engine.QueryInterface(this.entity, IID_Fogging);
	if (cmpFogging)
		cmpFogging.Activate();

	const old = this.ammo;
	this.ammo = Math.min(this.ammo + amount, this.GetMaxAmmo());

	this.RegisterAmmoChanged(old);

	return { "old": old, "new": this.ammo };
};

Ammo.prototype.Reduce = function(amount)
{
	if (!amount || !this.ammo)
		return { "ammoChange": 0 };

	// Before changing the value, activate Fogging if necessary to hide changes
	const cmpFogging = Engine.QueryInterface(this.entity, IID_Fogging);
	if (cmpFogging)
		cmpFogging.Activate();

	const oldAmmo = this.ammo;

	this.ammo -= amount;
	this.RegisterAmmoChanged(oldAmmo);
	return { "ammoChange": this.ammo - oldAmmo };
};

Ammo.prototype.ExecuteRegeneration = function()
{
	let regenRate = this.GetRegenRate();
	if (regenRate > 0 && this.ammo != this.maxAmmo)
	{
		let regenAmount = this.GetRegenAmount();
		let entPlayer = Helpers.GetOwner(this.entity);
		let cmpAmmo = this.ammoGiver ? Engine.QueryInterface(this.ammoGiver, IID_Ammo) : undefined;
		let ammoNeeded = (this.maxAmmo - this.ammo)*this.refillCostMult;
		if (!this.hasInfAmmoGiver && (cmpAmmo && cmpAmmo.ammo > ammoNeeded))
		{
			cmpAmmo.Reduce(ammoNeeded)
			this.Increase(ammoNeeded);
		}
		else if (!this.hasInfAmmoGiver && (cmpAmmo && cmpAmmo.ammo <= ammoNeeded))
		{
			let canGive = 0
			let calc = 1*this.refillCostMult
			while ((canGive+calc) <= cmpAmmo.ammo)
			{
				canGive += calc
			}
			cmpAmmo.Reduce(canGive)
			this.Increase(canGive);
		}
		else
		{
			// If player has no forge, entities will not re-arm
			let hasForge = Helpers.GetPlayerEntitiesByClass(entPlayer, "Forge");
			if(hasForge.length > 0)
			{
				if (regenRate > 0)
					this.Increase(regenAmount);
			}
		}
	}
};

/*
 * Check if the regeneration timer needs to be started or stopped
 */
Ammo.prototype.CheckRegenTimer = function()
{
	let refillTime = this.GetRegenRate()
	// check if we need a timer
	if (refillTime == 0)
	{
		// we don't need a timer, disable if one exists
		if (this.ammoReffilTimer)
			this.StopReArming()
		return;
	}

	// we need a timer, enable if one doesn't exist
	if (this.ammoReffilTimer)
		return;

	const cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
	this.ammoReffilTimer = cmpTimer.SetInterval(this.entity, IID_Ammo, "ExecuteRegeneration", refillTime, refillTime, null);
};

Ammo.prototype.GetRegenRate = function()
{
	this.refillTime = ApplyValueModificationsToEntity("Ammo/RefillTime", +this.template.RefillTime, this.entity)
	return this.refillTime;
};

Ammo.prototype.GetRegenAmount = function()
{
	this.refillAmount = ApplyValueModificationsToEntity("Ammo/RefillAmount", +this.template.RefillAmount, this.entity)
	return this.refillAmount;
};


Ammo.prototype.GetAmmo = function()
{
	return this.ammo;
};

Ammo.prototype.GetMaxAmmo = function()
{
	return this.maxAmmo;
};

Ammo.prototype.SetAmmo = function(value)
{
	// Before changing the value, activate Fogging if necessary to hide changes
	const cmpFogging = Engine.QueryInterface(this.entity, IID_Fogging);
	if (cmpFogging)
		cmpFogging.Activate();

	const old = this.ammo;
	this.ammo = Math.max(0, Math.min(this.GetMaxAmmo(), value));

	this.RegisterAmmoChanged(old);
};

Ammo.prototype.OnValueModification = function(msg)
{
	if (msg.component != "Ammo")
		return

	this.RecalculateValues();
};

Ammo.prototype.RegisterAmmoChanged = function(from)
{
	this.CheckRegenTimer();
	Engine.PostMessage(this.entity, MT_AmmoChanged, { "from": from, "to": this.ammo });
};

Ammo.prototype.RecalculateValues = function()
{
	//this.ammo = ApplyValueModificationsToEntity("Ammo/CurrAmmo", +this.template.CurrAmmo, this.entity)
	this.maxAmmo = ApplyValueModificationsToEntity("Ammo/MaxAmmo", +this.template.MaxAmmo, this.entity)
	this.refillTime = ApplyValueModificationsToEntity("Ammo/RefillTime", +this.template.RefillTime, this.entity)
	this.refillAmount = ApplyValueModificationsToEntity("Ammo/RefillAmount", +this.template.RefillAmount, this.entity)
	this.refillCostMult = ApplyValueModificationsToEntity("Ammo/RefillCostMult", +this.template.RefillCostMult, this.entity)

	this.StopReArming()
	if (this.refillTime > 0)
		this.CheckRegenTimer();
};

Engine.RegisterComponentType(IID_Ammo, "Ammo", Ammo);
