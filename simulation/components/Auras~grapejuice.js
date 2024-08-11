
Auras.prototype.ApplyAura = function(name, ents)
{
	var validEnts = this.GiveMembersWithValidClass(name, ents);
	if (!validEnts.length)
		return;

	this[name].targetUnits = this[name].targetUnits.concat(validEnts);

	if (!this[name].isApplied)
		return;

	// update status bars if this has an icon
	if (this.GetOverlayIcon(name))
		for (let ent of validEnts)
		{
			let cmpStatusBars = Engine.QueryInterface(ent, IID_StatusBars);
			if (cmpStatusBars)
				cmpStatusBars.AddAuraSource(this.entity, name);
		}

	// Global aura modifications are handled at the player level by the modification manager,
	// so stop after icons have been applied.
	if (this.IsGlobalAura(name))
		return;

	// re-arm aura
	if(name == "structures/refill_ammo_30range" || name == "structures/refill_ammo_60range" || name == "limited_refill_ammo_30range" || name == "limited_refill_ammo_60range")
	{
		let entPlayer = Helpers.GetOwner(this.entity);
		// If player has no forge, entities will not re-arm
		let hasForge = Helpers.GetPlayerEntitiesByClass(entPlayer, "Forge");
		for (let ent of validEnts)
		{
			let cmpAttack = Engine.QueryInterface(ent, IID_Attack);
			if(hasForge.length >= 1 && cmpAttack)
			{
				let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
				cmpAttack.ammoReffilTimer = cmpTimer.SetInterval(ent, IID_Attack, "SetAmmo", cmpAttack.refillTime, cmpAttack.refillTime, this.entity);
			}
			else
				return 0;
		}
	}

	let cmpModifiersManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_ModifiersManager);

	let derivedModifiers = DeriveModificationsFromTech({
		"modifications": this.GetModifications(name),
		"affects": this.GetClasses(name)
	});

	let modifName = this.GetModifierIdentifier(name);
	for (let ent of validEnts)
		cmpModifiersManager.AddModifiers(modifName, derivedModifiers, ent);
};

Auras.prototype.RemoveAura = function(name, ents, skipModifications = false)
{
	var validEnts = this.GiveMembersWithValidClass(name, ents);
	if (!validEnts.length)
		return;

	this[name].targetUnits = this[name].targetUnits.filter(v => validEnts.indexOf(v) == -1);

	if (!this[name].isApplied)
		return;

	// update status bars if this has an icon
	if (this.GetOverlayIcon(name))
		for (let ent of validEnts)
		{
			let cmpStatusBars = Engine.QueryInterface(ent, IID_StatusBars);
			if (cmpStatusBars)
				cmpStatusBars.RemoveAuraSource(this.entity, name);
		}

	// Global aura modifications are handled at the player level by the modification manager,
	// so stop after icons have been removed.
	if (this.IsGlobalAura(name))
		return;

	// re-arm aura
	if(name == "structures/refill_ammo_30range" || name == "structures/refill_ammo_60range" || name == "limited_refill_ammo_30range" || name == "limited_refill_ammo_60range")
	{
		for (let ent of validEnts)
		{
			let cmpAttack = Engine.QueryInterface(ent, IID_Attack);
			if (cmpAttack)
				cmpAttack.StopReArming()
		}
	}

	let cmpModifiersManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_ModifiersManager);

	let derivedModifiers = DeriveModificationsFromTech({
		"modifications": this.GetModifications(name),
		"affects": this.GetClasses(name)
	});

	let modifName = this.GetModifierIdentifier(name);
	for (let ent of ents)
		for (let modifierPath in derivedModifiers)
			cmpModifiersManager.RemoveModifier(modifierPath, modifName, ent);

};

Engine.ReRegisterComponentType(IID_Auras, "Auras", Auras);
