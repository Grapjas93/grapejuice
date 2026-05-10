//
//UnitAI.prototype.AttackEntitiesByPreference = function(ents)
//{
//	if (!ents.length)
//		return false;
//
//	const cmpAttack = Engine.QueryInterface(this.entity, IID_Attack);
//	if (!cmpAttack)
//		return false;
//
//	const attackfilter = function(e) {
//		if (!cmpAttack.CanAttack(e))
//			return false;
//
//		const cmpOwnership = Engine.QueryInterface(e, IID_Ownership);
//		if (cmpOwnership && cmpOwnership.GetOwner() > 0)
//			return true;
//
//		const cmpUnitAI = Engine.QueryInterface(e, IID_UnitAI);
//		return cmpUnitAI && (!cmpUnitAI.IsAnimal() || cmpUnitAI.IsDangerousAnimal());
//	};
//	if (Engine.QueryInterface(this.entity, IID_Identity).HasClass("Javelineer") && Engine.QueryInterface(this.entity, IID_Identity).HasClass("Hero"))
//	{
//		if (this.hasValidTarget)
//		{
//			warn(uneval(attackfilter(this.hasValidTarget)))
//			warn(this.hasValidTarget)
//		}
//	}
//
//	if (this.hasValidTarget && !attackfilter(this.hasValidTarget))
//		this.hasValidTarget = undefined
//
//	if (this.hasValidTarget)
//	{
//		this.RespondToTargetedEntities([this.hasValidTarget])
//		return true
//	}
//
//	const preferences = [];
//	const entsWithoutPref = [];
//	for (const ent of ents)
//	{
//		if (!attackfilter(ent))
//			continue;
//		const pref = cmpAttack.GetPreference(ent);
//		if (pref === null || pref === undefined)
//			entsWithoutPref.push(ent);
//		else
//            preferences.push(ent);
//	}
//
//	// grapejuice
//	// both the prefences and entsWithoutPref arrays are already filtered by whether we can attack them or not we don't need to check it again
//	// i have a theory that the ents delivered to this function are sorted by range, [0] would be closest and growing in range from there on out
//	// so we cap the rng number to 15 to try and focus fire a bit to closer targets and to not wander of to soldier #200 who is standing in narnia
//	let cmpAmmo = Engine.QueryInterface(this.entity, IID_Ammo)
//	let isMelee = Engine.QueryInterface(this.entity, IID_Identity).HasClass("Melee") || cmpAmmo && cmpAmmo.ammo == 0
//	let targetLimit = isMelee ? 3 : 15;
//	if (preferences.length)
//	{
//		let targets = preferences.length > targetLimit ? targetLimit : preferences.length
//        let randomIndex = Math.floor(Math.random() * targets)
//		this.RespondToTargetedEntities([preferences[randomIndex]])
//		this.hasValidTarget = preferences[randomIndex]
//		return true;
//	}
//    else if (entsWithoutPref.length)
//    {
//		let targets = entsWithoutPref.length > targetLimit ? targetLimit : entsWithoutPref.length
//        let randomIndex = Math.floor(Math.random() * targets)
//		this.RespondToTargetedEntities([entsWithoutPref[randomIndex]])
//		this.hasValidTarget = entsWithoutPref[randomIndex]
//		return true;
//    }
//
//	return false;
//};

UnitAI.prototype.OnMotionUpdate = function(msg)
{
	if (msg.veryObstructed)
		msg.obstructed = true;
	this.UnitFsm.ProcessMessage(this, Object.assign({ "type": "MovementUpdate" }, msg));

	if (this.hasValidTarget && (msg.obstructed || msg.veryObstructed || msg.likelyFailure))
		this.hasValidTarget = undefined

	if (Engine.QueryInterface(this.entity, IID_Identity).HasClass("Javelineer") && Engine.QueryInterface(this.entity, IID_Identity).HasClass("Hero"))
	{
		if (this.hasValidTarget)
		{
			warn(uneval(msg))
		}
	}

};

Engine.ReRegisterComponentType(IID_UnitAI, "UnitAI", UnitAI);
