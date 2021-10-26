/**
 * @param {number} amount - The amount of hitpoints to substract. Kills the entity if required.
 * @return {{ healthChange:number }} -  Number of health points lost.
 */
Health.prototype.Reduce = function(amount)
{
	// If we are dead, do not do anything
	// (The entity will exist a little while after calling DestroyEntity so this
	// might get called multiple times)
	// Likewise if the amount is 0.
	if (!amount || !this.hitpoints )
		return { "healthChange": 0 };

	// Before changing the value, activate Fogging if necessary to hide changes
	let cmpFogging = Engine.QueryInterface(this.entity, IID_Fogging);
	if (cmpFogging)
		cmpFogging.Activate();

	let oldHitpoints = this.hitpoints;
	// If we reached 0, then die.
	if (amount >= this.hitpoints)
	{
		this.hitpoints = 0;
		this.RegisterHealthChanged(oldHitpoints);
		this.HandleDeath();
		return { "healthChange": -oldHitpoints };
	}

	// If we are not marked as injured, do it now
	if (!this.IsInjured())
	{
		let cmpRangeManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_RangeManager);
		if (cmpRangeManager)
			cmpRangeManager.SetEntityFlag(this.entity, "injured", true);
	}

	this.hitpoints -= amount;
	this.RegisterHealthChanged(oldHitpoints);

	// Grapejuice modifiers, units below 1/3 of their max hp receive penalties
	if (Helpers.EntityMatchesClassList(this.entity, "Siege Organic"))
	{
		let cmpHealth = QueryMiragedInterface(this.entity, IID_Health);
		let currentHp = cmpHealth.GetHitpoints();
		let treshold = cmpHealth.GetMaxHitpoints() / 3; 
		if( currentHp <= treshold ) {
			let cmpAttack = Engine.QueryInterface(this.entity, IID_Attack);
			
			if (cmpAttack)
			{
				cmpAttack.energy = 0;
				cmpAttack.wounded = true;
				
				var cmpModifiersManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_ModifiersManager);
				cmpModifiersManager.AddModifiers("CriticallyWounded", {
					"UnitMotion/WalkSpeed": [{ "affects": ["Unit"], "multiply": 0.80 }],
					"Attack/Melee/RepeatTime": [{ "affects": ["Unit"], "multiply": 1.30 }],
					"Attack/Ranged/RepeatTime": [{ "affects": ["Unit"], "multiply": 1.30 }],
				}, this.entity);
			}
		}
	}
		return { "healthChange": this.hitpoints - oldHitpoints };
};

Health.prototype.Increase = function(amount)
{
	// Before changing the value, activate Fogging if necessary to hide changes
	let cmpFogging = Engine.QueryInterface(this.entity, IID_Fogging);
	if (cmpFogging)
		cmpFogging.Activate();

	if (!this.IsInjured())
		return { "old": this.hitpoints, "new": this.hitpoints };

	// If we're already dead, don't allow resurrection
	if (this.hitpoints == 0)
		return undefined;

	let old = this.hitpoints;
	this.hitpoints = Math.min(this.hitpoints + amount, this.GetMaxHitpoints());

	if (!this.IsInjured())
	{
		let cmpRangeManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_RangeManager);
		if (cmpRangeManager)
			cmpRangeManager.SetEntityFlag(this.entity, "injured", false);
	}

	this.RegisterHealthChanged(old);

	// Grapejuice modifiers, units above 1/3 of their max hp will get their penalties removed
	if (Helpers.EntityMatchesClassList(this.entity, "Siege Organic"))
	{
		let cmpHealth = QueryMiragedInterface(this.entity, IID_Health);
		let currentHp = cmpHealth.GetHitpoints();
		let treshold = cmpHealth.GetMaxHitpoints() / 3; 
		if( currentHp > treshold ) {
			let cmpAttack = Engine.QueryInterface(this.entity, IID_Attack);
			if (cmpAttack)
			{
				cmpAttack.wounded = false;
				
				var cmpModifiersManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_ModifiersManager);
				cmpModifiersManager.RemoveAllModifiers("CriticallyWounded", this.entity);
			}
		}
	}
	return { "old": old, "new": this.hitpoints };

};

Engine.ReRegisterComponentType(IID_Health, "Health", Health);
