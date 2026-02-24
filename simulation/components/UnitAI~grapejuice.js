/**
 * Try to find one of the given entities which can be attacked,
 * and start attacking it.
 * Returns true if it found something to attack.
 */
//nitAI.prototype.AttackVisibleEntity = function(ents)
//
//   let randomIndex = Math.floor(Math.random() * ents.length)
//   while (ents.length > 0 && !this.CanAttack(ents[randomIndex]))
//   {
//       ents.splice(randomIndex, 1);
//       randomIndex = Math.floor(Math.random() * ents.length)
//   }
//	if (ents.length == 0)
//		return false;
//
//	var target = ents[randomIndex];
//	this.PushOrderFront("Attack", { "target": target, "force": false });
//	return true;
//;

UnitAI.prototype.AttackEntitiesByPreference = function(ents)
{
	if (!ents.length)
		return false;

	const cmpAttack = Engine.QueryInterface(this.entity, IID_Attack);
	if (!cmpAttack)
		return false;

	const attackfilter = function(e) {
		if (!cmpAttack.CanAttack(e))
			return false;

		const cmpOwnership = Engine.QueryInterface(e, IID_Ownership);
		if (cmpOwnership && cmpOwnership.GetOwner() > 0)
			return true;

		const cmpUnitAI = Engine.QueryInterface(e, IID_UnitAI);
		return cmpUnitAI && (!cmpUnitAI.IsAnimal() || cmpUnitAI.IsDangerousAnimal());
	};

	const preferences = [];
	const entsWithoutPref = [];
	for (const ent of ents)
	{
		if (!attackfilter(ent))
			continue;
		const pref = cmpAttack.GetPreference(ent);
		if (pref === null || pref === undefined)
			entsWithoutPref.push(ent);
		else
            preferences.push(ent);
	}

	// both the prefences and entsWithoutPref arrays are already filtered by whether we can attack them or not we don't need to check it again
	// i have a theory that the ents delivered to this function are sorted by range, [0] would be closest and growing in range from there on out
	// so we cap the rng number to 15 to try and focus fire a bit to closer targets and to not wander of to soldier #200 who is standing in narnia
	if (preferences.length)
	{
		let targets = preferences.length > 15 ? 15 : preferences.length
        let randomIndex = Math.floor(Math.random() * targets)
		this.RespondToTargetedEntities([preferences[randomIndex]])
		return true;
	}
    else if (entsWithoutPref.length)
    {
		let targets = entsWithoutPref.length > 15 ? 15 : entsWithoutPref.length
        let randomIndex = Math.floor(Math.random() * targets)
		this.RespondToTargetedEntities([entsWithoutPref[randomIndex]])
		return true;
    }

	return false;
};

Engine.ReRegisterComponentType(IID_UnitAI, "UnitAI", UnitAI);
