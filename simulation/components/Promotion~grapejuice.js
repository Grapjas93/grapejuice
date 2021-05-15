
Promotion.prototype.Promote = function(promotedTemplateName)
{
	// Store ammo before promotion
	let cmpAttack = Engine.QueryInterface(this.entity, IID_Attack);
	let currentAmmo = cmpAttack.ammo;

	// If the unit is dead, don't promote it
	let cmpHealth = Engine.QueryInterface(this.entity, IID_Health);
	if (cmpHealth && cmpHealth.GetHitpoints() == 0)
	{
		this.promotedUnitEntity = INVALID_ENTITY;
		return;
	}

	// Save the entity id.
	this.promotedUnitEntity = ChangeEntityTemplate(this.entity, promotedTemplateName);
	
	// Apply ammo after promotion
	cmpAttack = Engine.QueryInterface(this.promotedUnitEntity, IID_Attack);
	cmpAttack.ammo = currentAmmo;
	
	// Check for new targets if ammo is 0, otherwise unit would perform ranged attacks without ammo
	if (currentAmmo == 0)
	{
	let cmpUnitAI = Engine.QueryInterface(this.promotedUnitEntity, IID_UnitAI);
	cmpUnitAI.Stop();	
	}
	
	// promoted units regain some health
	cmpHealth = Engine.QueryInterface(this.promotedUnitEntity, IID_Health);
	cmpHealth.Increase(10);
};


Engine.ReRegisterComponentType(IID_Promotion, "Promotion", Promotion);
