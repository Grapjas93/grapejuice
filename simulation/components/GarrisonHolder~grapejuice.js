/**
 * @param {number} entity - The entityID to garrison.
 * @return {boolean} - Whether the entity was garrisoned.
 */
GarrisonHolder.prototype.Garrison = function(entity)
{
	if (!this.IsAllowedToGarrison(entity))
		return false;

	if (!this.HasEnoughHealth())
		return false;

	if (!this.timer && this.GetHealRate())
		this.StartTimer();

	this.entities.push(entity);
	this.UpdateGarrisonFlag();

	Engine.PostMessage(this.entity, MT_GarrisonedUnitsChanged, {
		"added": [entity],
		"removed": []
	});
	
	if (Helpers.EntityMatchesClassList(this.entity, "Ram"))
	{
		let ram = Engine.QueryInterface(this.entity, IID_Attack);
		let garrisonEntity = Engine.QueryInterface(entity, IID_Attack);
		
		ram.energy += garrisonEntity.energy;
		ram.maxEnergy += garrisonEntity.maxEnergy;
		ram.RefreshStatusbars(this.entity);
		
		let cmpUnitAI = Engine.QueryInterface(this.entity, IID_UnitAI);
		if (cmpUnitAI.GetCurrentState() == "INDIVIDUAL.IDLE" || cmpUnitAI.GetCurrentState() == "IDLE")
		{
			ram.StopRechargingEnergy();		
			ram.CanRechargeEnergy();		
		}			
	}
	
	return true;
};

/**
 * Tell unit to unload from this entity.
 * @param {number} entity - The entity to unload.
 * @return {boolean} Whether the command was successful.
 */
GarrisonHolder.prototype.Unload = function(entity)
{
	let cmpGarrisonable = Engine.QueryInterface(entity, IID_Garrisonable);
	

	if (cmpGarrisonable && cmpGarrisonable.UnGarrison())
	{
		if (Helpers.EntityMatchesClassList(this.entity, "Ram"))
		{
			let ram = Engine.QueryInterface(this.entity, IID_Attack);
			let garrisonEntity = Engine.QueryInterface(entity, IID_Attack);
			
			garrisonEntity.energy = 0;

			ram.energy -= garrisonEntity.maxEnergy;
			ram.maxEnergy -= garrisonEntity.maxEnergy;
			
			if (ram.maxEnergy == 0)
			{
				ram.energy = 0;
			}

			ram.RefreshStatusbars(this.entity);
			garrisonEntity.RefreshStatusbars(entity);
			
			let cmpUnitAI = Engine.QueryInterface(entity, IID_UnitAI);
			if (cmpUnitAI.GetCurrentState() == "INDIVIDUAL.IDLE" || cmpUnitAI.GetCurrentState() == "IDLE")
			{
				garrisonEntity.StopRechargingEnergy();		
				garrisonEntity.CanRechargeEnergy();		
			}			
		}	
	
	}
	
	return cmpGarrisonable && cmpGarrisonable.UnGarrison();
};

/**
 * Tell units to unload from this entity.
 * @param {number[]} entities - The entities to unload.
 * @return {boolean} - Whether all unloads were successful.
 */
GarrisonHolder.prototype.UnloadEntities = function(entities)
{
	let success = true;
	for (let entity of entities)
		if (!this.Unload(entity))
			success = false;
	return success;
};

Engine.ReRegisterComponentType(IID_GarrisonHolder, "GarrisonHolder", GarrisonHolder);
