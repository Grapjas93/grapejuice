

Promotion.prototype.Init = function()
{
	this.currentXp = 0;
	this.ComputeTrickleRate();
	this.currentAmmo; // grapejuice
};

Promotion.prototype.Promote = function(promotedTemplateName)
{

	// If the unit is dead, don't promote it
	let cmpHealth = Engine.QueryInterface(this.entity, IID_Health);
	if (cmpHealth && cmpHealth.GetHitpoints() == 0)
	{
		this.promotedUnitEntity = INVALID_ENTITY;
		return;
	}

	// Store ammo before promotion / grapejuice
	let cmpAmmo = Engine.QueryInterface(this.entity, IID_Ammo);
	if (cmpAmmo)
	{
		this.currentAmmo = cmpAmmo.ammo;

		// Save the entity id. / grapejuice
		this.promotedUnitEntity = ChangeEntityTemplate(this.entity, promotedTemplateName);

		// Apply ammo after promotion / grapejuice
		cmpAmmo = Engine.QueryInterface(this.promotedUnitEntity, IID_Ammo);
		cmpAmmo.ammo = this.currentAmmo;

		// Check for new targets if ammo is 0, otherwise unit would perform ranged attacks without ammo / grapejuice
		if (this.currentAmmo == 0)
		{
			let cmpUnitAI = Engine.QueryInterface(this.promotedUnitEntity, IID_UnitAI);
			cmpUnitAI.Stop();
		}
	}
	else
		this.promotedUnitEntity = ChangeEntityTemplate(this.entity, promotedTemplateName);

	// promoted units regain some health / grapejuice
	cmpHealth = Engine.QueryInterface(this.promotedUnitEntity, IID_Health);
	cmpHealth.Increase(10);
};


Engine.ReRegisterComponentType(IID_Promotion, "Promotion", Promotion);
