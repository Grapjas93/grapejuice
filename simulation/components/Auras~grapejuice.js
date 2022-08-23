
Auras.prototype.ApplyAura = function(name, ents)
{
	var validEnts = this.GiveMembersWithValidClass(name, ents);
	if (!validEnts.length)
		return;

	this[name].targetUnits = this[name].targetUnits.concat(validEnts);

	if (!this[name].isApplied)
		return;

	// re-arm aura
	if(name == "structures/refill_ammo_30range" || name == "structures/refill_ammo_60range" || name == "units/mobile_rearm")
	{
		let length = ents.length;
		for (let i = 0; i < length; i++)
		{
			let entity = ents.pop();
			let entPlayer = Helpers.GetOwner(entity);
			let hasForge = Helpers.GetPlayerEntitiesByClass(entPlayer, "Forge");
			// If player has no forge, entities will not re-arm
			if(hasForge.length >= 1)
			{
				let cmpAttack = Engine.QueryInterface(entity, IID_Attack);
				if (cmpAttack != null){
					cmpAttack.ReArmAura();
				}
			}
			else
			return 0;
		}
	}

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

	let cmpModifiersManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_ModifiersManager);

	let derivedModifiers = DeriveModificationsFromTech({
		"modifications": this.GetModifications(name),
		"affects": this.GetClasses(name)
	});

	let modifName = this.GetModifierIdentifier(name);
	for (let ent of ents)
		for (let modifierPath in derivedModifiers)
			cmpModifiersManager.RemoveModifier(modifierPath, modifName, ent);

	// re-arm aura
	if(name == "structures/refill_ammo_30range" || name == "structures/refill_ammo_60range" || name == "units/mobile_rearm")
	{
		let length = ents.length;
		for (let i = 0; i < length; i++) {
			let entity = ents.pop();
			let cmpAttack = Engine.QueryInterface(entity, IID_Attack);
			if (cmpAttack != null){
				cmpAttack.ReArmAura();
			}
		}
	}
};

Engine.ReRegisterComponentType(IID_Auras, "Auras", Auras);
