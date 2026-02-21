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
		for (const ent of validEnts)
		{
			const cmpStatusBars = Engine.QueryInterface(ent, IID_StatusBars);
			if (cmpStatusBars)
				cmpStatusBars.AddAuraSource(this.entity, name);
		}

	// Global aura modifications are handled at the player level by the modification manager,
	// so stop after icons have been applied.
	if (this.IsGlobalAura(name))
		return;

	const cmpModifiersManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_ModifiersManager);

	const derivedModifiers = DeriveModificationsFromTech({
		"modifications": this.GetModifications(name),
		"affects": this.GetClasses(name)
	});

	const modifName = this.GetModifierIdentifier(name);
	for (const ent of validEnts)
	{
		cmpModifiersManager.AddModifiers(modifName, derivedModifiers, ent);
		// grapejuice, register ammoGiver for the cmpAmmo so that we can handle limited ammo refills
		if(name == "limited_refill_ammo_30range" || name == "limited_refill_ammo_60range")
		{
			let cmpAmmo = Engine.QueryInterface(ent, IID_Ammo);
			if (cmpAmmo)
				cmpAmmo.ammoGiver = this.entity
		}
		else if (name == "structures/refill_ammo_30range" || name == "structures/refill_ammo_60range")
		{
			let cmpAmmo = Engine.QueryInterface(ent, IID_Ammo);
			if (cmpAmmo)
				cmpAmmo.hasInfAmmoGiver = true
		}
	}

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
		for (const ent of validEnts)
		{
			const cmpStatusBars = Engine.QueryInterface(ent, IID_StatusBars);
			if (cmpStatusBars)
				cmpStatusBars.RemoveAuraSource(this.entity, name);
		}

	// Global aura modifications are handled at the player level by the modification manager,
	// so stop after icons have been removed.
	if (this.IsGlobalAura(name))
		return;

	const cmpModifiersManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_ModifiersManager);

	const derivedModifiers = DeriveModificationsFromTech({
		"modifications": this.GetModifications(name),
		"affects": this.GetClasses(name)
	});

	const modifName = this.GetModifierIdentifier(name);
	for (const ent of ents)
	{
		// grapejuice, register ammoGiver for the cmpAmmo so that we can handle limited ammo refills
		if(name == "limited_refill_ammo_30range" || name == "limited_refill_ammo_60range")
		{
			let cmpAmmo = Engine.QueryInterface(ent, IID_Ammo);
			if (cmpAmmo)
				cmpAmmo.ammoGiver = undefined
		}
		else if (name == "structures/refill_ammo_30range" || name == "structures/refill_ammo_60range")
		{
			let cmpAmmo = Engine.QueryInterface(ent, IID_Ammo);
			if (cmpAmmo)
				cmpAmmo.hasInfAmmoGiver = false
		}
		for (const modifierPath in derivedModifiers)
			cmpModifiersManager.RemoveModifier(modifierPath, modifName, ent);
	}
};

Engine.ReRegisterComponentType(IID_Auras, "Auras", Auras);
