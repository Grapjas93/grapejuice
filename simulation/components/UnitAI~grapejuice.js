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
		// If we match our best preference, we can try responding right away.
		// This makes some common cases fast, like most soldiers having 'Human' as best preference,
		// or ships having 'Ship'. And if there are no such targets, this doesn't do much more work.
		if (pref === null || pref === undefined)
			entsWithoutPref.push(ent);
		else
            preferences.push(ent);
	}

	if (preferences.length)
	{
        let randomIndex = Math.floor(Math.random() * preferences.length)
        while (preferences.length > 0 && !this.CanAttack(preferences[randomIndex]))
        {
            preferences.splice(randomIndex, 1);
            randomIndex = Math.floor(Math.random() * preferences.length)
        }
        if (preferences.length > 0)
        {
            this.RespondToTargetedEntities([preferences[randomIndex]])
            return true;
        }
	}
    else
    {
        let randomIndex = Math.floor(Math.random() * entsWithoutPref.length)
        while (entsWithoutPref.length > 0 && !this.CanAttack(entsWithoutPref[randomIndex]))
        {
            entsWithoutPref.splice(randomIndex, 1);
            randomIndex = Math.floor(Math.random() * entsWithoutPref.length)
        }
        if (entsWithoutPref.length > 0)
        {
            this.RespondToTargetedEntities([entsWithoutPref[randomIndex]])
            return true;
        }
    }

	return false;
};

Engine.ReRegisterComponentType(IID_UnitAI, "UnitAI", UnitAI);
