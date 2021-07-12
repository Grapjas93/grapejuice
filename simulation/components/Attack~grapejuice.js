function Attack() {}

var g_AttackTypes = ["Melee", "Ranged", "Capture"];

Attack.prototype.preferredClassesSchema =
	"<optional>" +
		"<element name='PreferredClasses' a:help='Space delimited list of classes preferred for attacking. If an entity has any of theses classes, it is preferred. The classes are in decending order of preference'>" +
			"<attribute name='datatype'>" +
				"<value>tokens</value>" +
			"</attribute>" +
			"<text/>" +
		"</element>" +
	"</optional>";

Attack.prototype.restrictedClassesSchema =
	"<optional>" +
		"<element name='RestrictedClasses' a:help='Space delimited list of classes that cannot be attacked by this entity. If target entity has any of these classes, it cannot be attacked'>" +
			"<attribute name='datatype'>" +
				"<value>tokens</value>" +
			"</attribute>" +
			"<text/>" +
		"</element>" +
	"</optional>";

// grapejuice, added <Ammo>, <RefillTime>, <RefillAmount>
Attack.prototype.Schema =
	"<a:help>Controls the attack abilities and strengths of the unit.</a:help>" +
	"<a:example>" +
		"<Melee>" +
			"<AttackName>Spear</AttackName>" +
			"<Damage>" +
				"<Hack>10.0</Hack>" +
				"<Pierce>0.0</Pierce>" +
				"<Crush>5.0</Crush>" +
			"</Damage>" +
			"<MaxRange>4.0</MaxRange>" +
			"<RepeatTime>1000</RepeatTime>" +
			"<Bonuses>" +
				"<Bonus1>" +
					"<Civ>pers</Civ>" +
					"<Classes>Infantry</Classes>" +
					"<Multiplier>1.5</Multiplier>" +
				"</Bonus1>" +
				"<BonusCavMelee>" +
					"<Classes>Cavalry Melee</Classes>" +
					"<Multiplier>1.5</Multiplier>" +
				"</BonusCavMelee>" +
			"</Bonuses>" +
			"<RestrictedClasses datatype=\"tokens\">Champion</RestrictedClasses>" +
			"<PreferredClasses datatype=\"tokens\">Cavalry Infantry</PreferredClasses>" +
		"</Melee>" +
		"<Ranged>" +
			"<AttackName>Bow</AttackName>" +
			"<Damage>" +
				"<Hack>0.0</Hack>" +
				"<Pierce>10.0</Pierce>" +
				"<Crush>0.0</Crush>" +
			"</Damage>" +
			"<MaxRange>44.0</MaxRange>" +
			"<MinRange>20.0</MinRange>" +
			"<ElevationBonus>15.0</ElevationBonus>" +
			"<PrepareTime>800</PrepareTime>" +
			"<RepeatTime>1600</RepeatTime>" +
			"<Delay>1000</Delay>" +
			"<Bonuses>" +
				"<Bonus1>" +
					"<Classes>Cavalry</Classes>" +
					"<Multiplier>2</Multiplier>" +
				"</Bonus1>" +
			"</Bonuses>" +
			"<Projectile>" +
				"<Speed>50.0</Speed>" +
				"<Spread>2.5</Spread>" +
				"<ActorName>props/units/weapons/rock_flaming.xml</ActorName>" +
				"<ImpactActorName>props/units/weapons/rock_explosion.xml</ImpactActorName>" +
				"<ImpactAnimationLifetime>0.1</ImpactAnimationLifetime>" +
				"<FriendlyFire>false</FriendlyFire>" +
			"</Projectile>" +
			"<RestrictedClasses datatype=\"tokens\">Champion</RestrictedClasses>" +
			"<Splash>" +
				"<Shape>Circular</Shape>" +
				"<Range>20</Range>" +
				"<FriendlyFire>false</FriendlyFire>" +
				"<Damage>" +
					"<Hack>0.0</Hack>" +
					"<Pierce>10.0</Pierce>" +
					"<Crush>0.0</Crush>" +
				"</Damage>" +
			"</Splash>" +
		"</Ranged>" +
		"<Slaughter>" +
			"<Damage>" +
				"<Hack>1000.0</Hack>" +
				"<Pierce>0.0</Pierce>" +
				"<Crush>0.0</Crush>" +
			"</Damage>" +
			"<RepeatTime>1000</RepeatTime>" +
			"<MaxRange>4.0</MaxRange>" +
		"</Slaughter>" +
	"</a:example>" +
	"<oneOrMore>" +
		"<element>" +
			"<anyName a:help='Currently one of Melee, Ranged, Capture or Slaughter.'/>" +
			"<interleave>" +
				"<optional><element name='Energy'><data type='nonNegativeInteger'/></element></optional>" +
				"<optional><element name='Ammo'><data type='nonNegativeInteger'/></element></optional>" +
				"<optional><element name='RefillTime'><data type='nonNegativeInteger'/></element></optional>" +
				"<optional><element name='RefillAmount'><data type='nonNegativeInteger'/></element></optional>" +
				"<element name='AttackName' a:help='Name of the attack, to be displayed in the GUI. Optionally includes a translate context attribute.'>" +
					"<optional>" +
						"<attribute name='context'>" +
							"<text/>" +
						"</attribute>" +
					"</optional>" +
					"<text/>" +
				"</element>" +
				AttackHelper.BuildAttackEffectsSchema() +
				"<element name='MaxRange' a:help='Maximum attack range (in metres)'><ref name='nonNegativeDecimal'/></element>" +
				"<optional>" +
					"<element name='MinRange' a:help='Minimum attack range (in metres). Defaults to 0.'><ref name='nonNegativeDecimal'/></element>" +
				"</optional>" +
				"<optional>"+
					"<element name='ElevationBonus' a:help='The offset height from which the attack occurs, relative to the entity position. Defaults to 0.'><ref name='nonNegativeDecimal'/></element>" +
				"</optional>" +
				"<optional>" +
					"<element name='RangeOverlay'>" +
						"<interleave>" +
							"<element name='LineTexture'><text/></element>" +
							"<element name='LineTextureMask'><text/></element>" +
							"<element name='LineThickness'><ref name='nonNegativeDecimal'/></element>" +
						"</interleave>" +
					"</element>" +
				"</optional>" +
				"<optional>" +
					"<element name='PrepareTime' a:help='Time from the start of the attack command until the attack actually occurs (in milliseconds). This value relative to RepeatTime should closely match the \"event\" point in the actor&apos;s attack animation. Defaults to 0.'>" +
						"<data type='nonNegativeInteger'/>" +
					"</element>" +
				"</optional>" +
				"<element name='RepeatTime' a:help='Time between attacks (in milliseconds). The attack animation will be stretched to match this time'>" + // TODO: it shouldn't be stretched
					"<data type='positiveInteger'/>" +
				"</element>" +
				"<optional>" +
					"<element name='Delay' a:help='Delay of applying the effects in milliseconds after the attack has landed. Defaults to 0.'><ref name='nonNegativeDecimal'/></element>" +
				"</optional>" +
				"<optional>" +
					"<element name='Splash'>" +
						"<interleave>" +
							"<element name='Shape' a:help='Shape of the splash damage, can be circular or linear'><text/></element>" +
							"<element name='Range' a:help='Size of the area affected by the splash'><ref name='nonNegativeDecimal'/></element>" +
							"<element name='FriendlyFire' a:help='Whether the splash damage can hurt non enemy units'><data type='boolean'/></element>" +
							AttackHelper.BuildAttackEffectsSchema() +
						"</interleave>" +
					"</element>" +
				"</optional>" +
				"<optional>" +
					"<element name='Projectile'>" +
						"<interleave>" +
							"<element name='Speed' a:help='Speed of projectiles (in meters per second).'>" +
								"<ref name='positiveDecimal'/>" +
							"</element>" +
							"<element name='Spread' a:help='Standard deviation of the bivariate normal distribution of hits at 100 meters. A disk at 100 meters from the attacker with this radius (2x this radius, 3x this radius) is expected to include the landing points of 39.3% (86.5%, 98.9%) of the rounds.'><ref name='nonNegativeDecimal'/></element>" +
							"<element name='Gravity' a:help='The gravity affecting the projectile. This affects the shape of the flight curve.'>" +
								"<ref name='nonNegativeDecimal'/>" +
							"</element>" +
							"<element name='FriendlyFire' a:help='Whether stray missiles can hurt non enemy units.'><data type='boolean'/></element>" +
							"<optional>" +
								"<element name='LaunchPoint' a:help='Delta from the unit position where to launch the projectile.'>" +
									"<attribute name='y'>" +
										"<data type='decimal'/>" +
									"</attribute>" +
								"</element>" +
							"</optional>" +
							"<optional>" +
								"<element name='ActorName' a:help='actor of the projectile animation.'>" +
									"<text/>" +
								"</element>" +
							"</optional>" +
							"<optional>" +
								"<element name='ImpactActorName' a:help='actor of the projectile impact animation'>" +
									"<text/>" +
								"</element>" +
								"<element name='ImpactAnimationLifetime' a:help='length of the projectile impact animation.'>" +
									"<ref name='positiveDecimal'/>" +
								"</element>" +
							"</optional>" +
						"</interleave>" +
					"</element>" +
				"</optional>" +
				Attack.prototype.preferredClassesSchema +
				Attack.prototype.restrictedClassesSchema +
			"</interleave>" +
		"</element>" +
	"</oneOrMore>";

// grapejuice
Attack.prototype.Init = function()
{
	this.chargeCooldown = 0;
	this.maxEnergy = undefined;
	this.energy = undefined;
	
	// changed by the health component
	this.wounded = false;

	this.canChargeTimer = 0;
	this.CanRechargeEnergyTimer = undefined;
	this.RechargeEnergyTimer = undefined;
	
	this.ammo = 0;
	this.refillTime = 3000;
	this.refillAmount = 0;
	this.ammoReffilTimer = undefined;
	if (!!this.template["Ranged"] && !!this.template["Ranged"].Ammo)
		this.ammo = +this.template["Ranged"].Ammo;
	if (!!this.template["Ranged"] && !!this.template["Ranged"].RefillAmount)
		this.refillAmount = +this.template["Ranged"].RefillAmount;
		
	if (!!this.template["Melee"] && !!this.template["Melee"].Energy)
	{		
		this.energy = this.template["Melee"].Energy;
		this.maxEnergy = this.template["Melee"].Energy;
		this.energy = +this.energy;
		this.maxEnergy = +this.maxEnergy;
		
		warn("this.energy " + this.energy);
		warn("this.maxEnergy " + this.maxEnergy);
	}
	
	// start the automatic refill timer for units that regain ammo anywhere (slingers for now)
	if (this.ammo == 40)
	{
		if (!!this.template["Ranged"] && !!this.template["Ranged"].RefillTime)
		{
			this.refillTime = +this.template["Ranged"].RefillTime;
		}
		
		let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
		cmpTimer.SetInterval(this.entity, IID_Attack, "AutoRefill", 0, this.refillTime, {});
	}

};

// grapejuice, called by Charge()
Attack.prototype.CanCharge = function(target)
{
	warn("canCharge?");

	if (this.energy <= 0)
		return false;
	
	// if the unit is wounded it cant charge
	if (this.wounded)
		return;

	if (PositionHelper.DistanceBetweenEntities(this.entity, target) > 27)
		return false;
	
	warn("CHARRGGEE!!");
	return true;
	
};

// grapejuice, called by a timer in GetBestAttackAgainst() with a 500ms interval
Attack.prototype.Charge = function(target)
{
	if (this.energy == undefined)
		return;
		
	warn(this.energy);
	let cmpModifiersManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_ModifiersManager);
	let cmpUnitAI = Engine.QueryInterface(this.entity, IID_UnitAI);

	if (this.CanCharge(target) == false)
	{
		cmpModifiersManager.RemoveAllModifiers("ChargeAttack", this.entity);
		cmpUnitAI.ResetSpeedMultiplier();

		return;
	}
	
	else
	{
		if (cmpModifiersManager.HasAnyModifier("ChargeAttack", this.entity) == true)
		{
			this.energy = this.energy - 10;
			this.RefreshStatusbars(this.entity);
			return;
		}
		
		// rams have multipliers based on how many are garrisoned
		if (Helpers.EntityMatchesClassList(this.entity, "Ram"))
		{
			let cmpGarrisonHolder = Engine.QueryInterface(this.entity, IID_GarrisonHolder);
			let multiplier = 1 + cmpGarrisonHolder.OccupiedSlots() / 10;
			
			this.energy = this.energy - 10;
			cmpModifiersManager.AddModifiers("ChargeAttack", {
			"Attack/Melee/PrepareTime": [{ "affects": ["Unit"], "replace": 100 }],
			"Attack/Melee/Damage/Hack": [{ "affects": ["Unit"], "multiply": 1.2 }],
			"Attack/Melee/Damage/Pierce": [{ "affects": ["Unit"], "multiply": 1.5 }],
			"Attack/Melee/Damage/Crush": [{ "affects": ["Unit"], "multiply": multiplier }],
			"UnitMotion/WalkSpeed": [{ "affects": ["Unit"], "multiply": multiplier }]
			}, this.entity);
			return;		
		}

		this.energy = this.energy - 10;
		cmpModifiersManager.AddModifiers("ChargeAttack", {
		"Attack/Melee/PrepareTime": [{ "affects": ["Unit"], "replace": 100 }],
		"Attack/Melee/Damage/Hack": [{ "affects": ["Unit"], "multiply": 1.2 }],
		"Attack/Melee/Damage/Pierce": [{ "affects": ["Unit"], "multiply": 1.5 }],
		"Attack/Melee/Damage/Crush": [{ "affects": ["Unit"], "multiply": 1.3}]
		}, this.entity);
		
		cmpUnitAI.SetSpeedMultiplier(cmpUnitAI.GetRunMultiplier());
		
		return;
	}
	
};

// grapejuice, stops the timer which checks every 500ms if we can Charge() our target
Attack.prototype.StopCanChargeTimer = function()
{
	let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
	cmpTimer.CancelTimer(this.canChargeTimer);
	
	let cmpModifiersManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_ModifiersManager);
	cmpModifiersManager.RemoveAllModifiers("ChargeAttack", this.entity);
	
	let cmpUnitAI = Engine.QueryInterface(this.entity, IID_UnitAI);
	cmpUnitAI.ResetSpeedMultiplier();
};

// grapejuice, called by UnitAI~grapejuice.
// it will call RechargeEnergy() after 1s, but the timer is reset after a new unit order.
Attack.prototype.CanRechargeEnergy = function()
{
	if (this.energy == undefined)
		return;
		
	if (this.wounded)
	return;

	// quick return if we already have a valid running timer
	if (this.CanRechargeEnergyTimer != undefined)
		return;
	
	this.StopRechargingEnergy();
	
	let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
	this.CanRechargeEnergyTimer = cmpTimer.SetTimeout(this.entity, IID_Attack, "RechargeEnergy", 1000, {});
};

// grapejuice, called by CanRechargeEnergy()
Attack.prototype.RechargeEnergy = function()
{
	let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
	
	
	if (this.wounded)
	{
		this.StopRechargingEnergy();
		return;
	}

	if (!(this.energy >= this.maxEnergy))
	{
		if (this.energy < 0)
			this.energy = 0;
			
		if (this.energy + 5 > this.maxEnergy || this.energy > this.maxEnergy)
		{
			this.energy = this.maxEnergy;
			this.RefreshStatusbars(this.entity);
			this.StopRechargingEnergy();	
			return;
		}
		
		// make sure that the ram regen rate increases the more units are garrisoned in it
		if (Helpers.EntityMatchesClassList(this.entity, "Ram"))
		{
			let cmpGarrisonHolder = Engine.QueryInterface(this.entity, IID_GarrisonHolder);
			if (this.energy + 5 * cmpGarrisonHolder.OccupiedSlots() > this.maxEnergy)
			{
				this.energy = this.maxEnergy;
				this.RefreshStatusbars(this.entity);
				this.StopRechargingEnergy();	
			}
			else 
			{
				this.energy += 5 * cmpGarrisonHolder.OccupiedSlots();
			}		
		}
		else 
		{
			this.energy = this.energy + 5;			
		}
		this.RechargeEnergyTimer = cmpTimer.SetTimeout(this.entity, IID_Attack, "RechargeEnergy", 500, {});
		this.RefreshStatusbars(this.entity);
		warn(this.energy);
	}

};

// grapejuice, called by UnitAI~grapejuice, any unit order that is not "Stop" will stop the recharge timer
Attack.prototype.StopRechargingEnergy = function()
{
	let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
	
	cmpTimer.CancelTimer(this.RechargeEnergyTimer);
	cmpTimer.CancelTimer(this.CanRechargeEnergyTimer);
	
	this.RechargeEnergyTimer = undefined;
	this.CanRechargeEnergyTimer = undefined;
};

// grapejuice
Attack.prototype.StopReArming = function()
{
	let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
	cmpTimer.CancelTimer(this.ammoReffilTimer);
	this.ammoReffilTimer =	undefined;
	return;
};

// grapejuice
Attack.prototype.RefreshStatusbars = function(ent)
{
	let cmpStatusBars = Engine.QueryInterface(ent, IID_StatusBars);
	cmpStatusBars.RegenerateSprites();
};

// grapejuice, called by Init. Used by units that regain ammo slowly anywhere
Attack.prototype.AutoRefill = function()
{
	if (this.ammo != this.GetMaxAmmo())
	{
		this.ammo = this.ammo + this.refillAmount;
		this.RefreshStatusbars(this.entity);
	}
	
};

// grapejuice, called by ReArmAura()
Attack.prototype.SetAmmo = function(ammoGiver)
{
	let cmpStatusBars = Engine.QueryInterface(this.entity, IID_StatusBars);
	
	// if the entity is the armyCamp, don't reload and stop the timer
	if (Helpers.EntityMatchesClassList(this.entity, "ArmyCamp"))
	{
		this.StopReArming();
		return;
	}

	let cmpAmmoGiver = Engine.QueryInterface(ammoGiver, IID_Attack);	
			
	// if the entity reloads from armycamp, draw ammo from armyCamp ammo pool
	if (Helpers.EntityMatchesClassList(ammoGiver, "ArmyCamp"))
	{
		let ammoNeeded = this.GetMaxAmmo() - this.ammo;
		
		// if the armyCamp has no ammo, stop timer
		if (cmpAmmoGiver.ammo == 0)
		{
			this.StopReArming();
			return;
		}
		
		// if the armycamp can't do a full reload for the unit, give all remaining ammo to unit
		if (cmpAmmoGiver.ammo < ammoNeeded)
		{
			this.ammo = this.ammo + cmpAmmoGiver.ammo;
			this.RefreshStatusbars(this.entity);
			
			cmpAmmoGiver.ammo = 0;
			this.RefreshStatusbars(ammoGiver);
			
			this.StopReArming();
			return;
		}
		else 
		{
			cmpAmmoGiver.ammo = cmpAmmoGiver.ammo - ammoNeeded;
			this.ammo = this.GetMaxAmmo();
			
			this.RefreshStatusbars(this.entity);
			this.RefreshStatusbars(ammoGiver);
			
			return;
		} 
	}
	
	// other buildings have infinite stock, simply reload the unit fully 
	this.ammo = this.GetMaxAmmo();
	this.RefreshStatusbars(this.entity);
}

// grapejuice, called by GetBestAttackAgainst() and PerformAttack()
Attack.prototype.CheckTargetIsInMeleeRange = function(target)
{
	let cmpVision = Engine.QueryInterface(this.entity, IID_Vision);
	
	if (!cmpVision)
		return false;

	let range = cmpVision.GetRange() / 6.5;
	let distance = PositionHelper.DistanceBetweenEntities(this.entity, target);
	let result = distance < range;

	return distance < range;
};

// grapejuice, called by ReArmAura()
Attack.prototype.CheckIsInAuraRange = function()
{
	let entityOwner = Helpers.GetOwner(this.entity);	
	let range30 = TriggerHelper.GetPlayerEntitiesByClass(entityOwner, "Forge Barracks Stable Arsenal");
	let range60 = TriggerHelper.GetPlayerEntitiesByClass(entityOwner, "Fortress ArmyCamp Colony");
	let length = range30.length;
	
	for (let i = 0; i < length; i++) 
	{
		let pop = range30.pop();
		let distance = PositionHelper.DistanceBetweenEntities(pop, this.entity);
		if (distance < 30)
		{
			return pop;
		} 	
	} 
	length = range60.length;
	for (let i = 0; i < length; i++) 
	{
		let pop = range60.pop();
		let distance = PositionHelper.DistanceBetweenEntities(pop, this.entity);
		if (distance < 60)
		{
			return pop;
		} 	
	} 
	return false;	
};

// grapejuice, called by PerformAttack()
Attack.prototype.ReArmAura = function()
{
	if (this.CheckIsInAuraRange() == false || this.ammo == this.GetMaxAmmo())
	{
		this.StopReArming();
		return;
	} 
	
	else
	{
		let ammoGiver = this.CheckIsInAuraRange();
		let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
		cmpTimer.SetTimeout(this.entity, IID_Attack, "SetAmmo", this.refillTime, ammoGiver);
		return;
	}
}

// grapejuice
Attack.prototype.GetMaxAmmo = function()
{
	if (!this.template["Ranged"] || !this.template["Ranged"].Ammo)
		return 0;
	return this.template["Ranged"].Ammo;
}

/**
 * Attack the target entity. This should only be called after a successful range check,
 * and should only be called after GetTimers().repeat msec has passed since the last
 * call to PerformAttack.
 */
Attack.prototype.PerformAttack = function(type, target)
{
	let cmpPosition = Engine.QueryInterface(this.entity, IID_Position);
	if (!cmpPosition || !cmpPosition.IsInWorld())
		return;
	let selfPosition = cmpPosition.GetPosition();

	let cmpTargetPosition = Engine.QueryInterface(target, IID_Position);
	if (!cmpTargetPosition || !cmpTargetPosition.IsInWorld())
		return;
	let targetPosition = cmpTargetPosition.GetPosition();

	let cmpOwnership = Engine.QueryInterface(this.entity, IID_Ownership);
	if (!cmpOwnership)
		return;
	let attackerOwner = cmpOwnership.GetOwner();

	let data = {
		"type": type,
		"attackData": this.GetAttackEffectsData(type),
		"splash": this.GetSplashData(type),
		"attacker": this.entity,
		"attackerOwner": attackerOwner,
		"target": target,
	};
	
	let delay = +(this.template[type].Delay || 0);
	
	// grapejuice
	if (type == "Ranged")
	{

		if (!!this.template["Ranged"].Ammo) 
		{
			if (this.ammo > 0 && this.CheckTargetIsInMeleeRange(target) == false) 
			{
				this.ammo--;
				this.RefreshStatusbars(this.entity);
			}
			else 
			{
				let cmpUnitAI = Engine.QueryInterface(this.entity, IID_UnitAI);
				if(cmpUnitAI == null)
				{
					return;
				}
				cmpUnitAI.RespondToTargetedEntities([target]);
			}
		}
		this.ReArmAura();
	}
	
	// grapejuice
	if (type == "Melee")
	{	
		this.energy = 0;
		this.StopCanChargeTimer();
		this.RefreshStatusbars(this.entity);
	}

	if (this.template[type].Projectile)
	{
		let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
		let turnLength = cmpTimer.GetLatestTurnLength()/1000;
		// In the future this could be extended:
		//  * Obstacles like trees could reduce the probability of the target being hit
		//  * Obstacles like walls should block projectiles entirely

		let horizSpeed = +this.template[type].Projectile.Speed;
		let gravity = +this.template[type].Projectile.Gravity;
		// horizSpeed /= 2; gravity /= 2; // slow it down for testing

		// We will try to estimate the position of the target, where we can hit it.
		// We first estimate the time-till-hit by extrapolating linearly the movement
		// of the last turn. We compute the time till an arrow will intersect the target.
		let targetVelocity = Vector3D.sub(targetPosition, cmpTargetPosition.GetPreviousPosition()).div(turnLength);

		let timeToTarget = PositionHelper.PredictTimeToTarget(selfPosition, horizSpeed, targetPosition, targetVelocity);

		// 'Cheat' and use UnitMotion to predict the position in the near-future.
		// This avoids 'dancing' issues with units zigzagging over very short distances.
		// However, this could fail if the player gives several short move orders, so
		// occasionally fall back to basic interpolation.
		let predictedPosition = targetPosition;
		if (timeToTarget !== false)
		{
			// Don't predict too far in the future, but avoid threshold effects.
			// After 1 second, always use the 'dumb' interpolated past-motion prediction.
			let useUnitMotion = randBool(Math.max(0, 0.75 - timeToTarget / 1.333));
			if (useUnitMotion)
			{
				let cmpTargetUnitMotion = Engine.QueryInterface(target, IID_UnitMotion);
				let cmpTargetUnitAI = Engine.QueryInterface(target, IID_UnitAI);
				if (cmpTargetUnitMotion && (!cmpTargetUnitAI || !cmpTargetUnitAI.IsFormationMember()))
				{
					let pos2D = cmpTargetUnitMotion.EstimateFuturePosition(timeToTarget);
					predictedPosition.x = pos2D.x;
					predictedPosition.z = pos2D.y;
				}
				else
					predictedPosition = Vector3D.mult(targetVelocity, timeToTarget).add(targetPosition);
			}
			else
				predictedPosition = Vector3D.mult(targetVelocity, timeToTarget).add(targetPosition);
		}

		let predictedHeight = cmpTargetPosition.GetHeightAt(predictedPosition.x, predictedPosition.z);

		// Add inaccuracy based on spread.
		let distanceModifiedSpread = ApplyValueModificationsToEntity("Attack/" + type + "/Spread", +this.template[type].Projectile.Spread, this.entity) *
			predictedPosition.horizDistanceTo(selfPosition) / 100;

		let randNorm = randomNormal2D();
		let offsetX = randNorm[0] * distanceModifiedSpread;
		let offsetZ = randNorm[1] * distanceModifiedSpread;

		data.position = new Vector3D(predictedPosition.x + offsetX, predictedHeight, predictedPosition.z + offsetZ);

		let realHorizDistance = data.position.horizDistanceTo(selfPosition);
		timeToTarget = realHorizDistance / horizSpeed;
		delay += timeToTarget * 1000;

		data.direction = Vector3D.sub(data.position, selfPosition).div(realHorizDistance);

		let actorName = this.template[type].Projectile.ActorName || "";
		let impactActorName = this.template[type].Projectile.ImpactActorName || "";
		let impactAnimationLifetime = this.template[type].Projectile.ImpactAnimationLifetime || 0;

		// TODO: Use unit rotation to implement x/z offsets.
		let deltaLaunchPoint = new Vector3D(0, +this.template[type].Projectile.LaunchPoint["@y"], 0);
		let launchPoint = Vector3D.add(selfPosition, deltaLaunchPoint);

		let cmpVisual = Engine.QueryInterface(this.entity, IID_Visual);
		if (cmpVisual)
		{
			// if the projectile definition is missing from the template
			// then fallback to the projectile name and launchpoint in the visual actor
			if (!actorName)
				actorName = cmpVisual.GetProjectileActor();

			let visualActorLaunchPoint = cmpVisual.GetProjectileLaunchPoint();
			if (visualActorLaunchPoint.length() > 0)
				launchPoint = visualActorLaunchPoint;
		}

		let cmpProjectileManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_ProjectileManager);
		data.projectileId = cmpProjectileManager.LaunchProjectileAtPoint(launchPoint, data.position, horizSpeed, gravity, actorName, impactActorName, impactAnimationLifetime);

		let cmpSound = Engine.QueryInterface(this.entity, IID_Sound);
		data.attackImpactSound = cmpSound ? cmpSound.GetSoundGroup("attack_impact_" + type.toLowerCase()) : "";

		data.friendlyFire = this.template[type].Projectile.FriendlyFire == "true";
	}
	else
	{
		data.position = targetPosition;
		data.direction = Vector3D.sub(targetPosition, selfPosition);
	}
	if (delay)
	{
		let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
		cmpTimer.SetTimeout(SYSTEM_ENTITY, IID_DelayedDamage, "Hit", delay, data);
	}
	else
		Engine.QueryInterface(SYSTEM_ENTITY, IID_DelayedDamage).Hit(data, 0);
};

/**
 * Find the best attack against a target.
 * @param {number} target - The entity-ID of the target.
 * @param {boolean} allowCapture - Whether capturing is allowed.
 * @return {string} - The preferred attack type.
 */
Attack.prototype.GetBestAttackAgainst = function(target, allowCapture)
{
	let cmpFormation = Engine.QueryInterface(target, IID_Formation);
	if (cmpFormation)
	{
		// TODO: Formation against formation needs review
		let types = this.GetAttackTypes();
		return g_AttackTypes.find(attack => types.indexOf(attack) != -1);
	}

	let cmpIdentity = Engine.QueryInterface(target, IID_Identity);
	if (!cmpIdentity)
		return undefined;

	// Always slaughter domestic animals instead of using a normal attack
	if (this.template.Slaughter && cmpIdentity.HasClass("Domestic"))
		return "Slaughter";

	let types = this.GetAttackTypes().filter(type => this.CanAttack(target, [type]));

	// Check whether the target is capturable and prefer that when it is allowed.
	let captureIndex = types.indexOf("Capture");
	if (captureIndex != -1)
	{
		if (allowCapture)
			return "Capture";
		types.splice(captureIndex, 1);
	}
	
	// grapejuice
	let rangeIndex = types.indexOf("Ranged");
	if (rangeIndex != -1 && !!this.template["Ranged"].Ammo  && Helpers.EntityMatchesClassList(this.entity, "Siege") == false)
	{
		if (this.ammo == 0 || this.CheckTargetIsInMeleeRange(target) || Helpers.EntityMatchesClassList(target, "Siege Structure") == true && Helpers.EntityMatchesClassList(this.entity, "Raider") == false)
			{
				types.splice(rangeIndex, 1);
			} 
		
			else	
			{
				types.splice(rangeIndex, -1);
			}
	}

	let targetClasses = cmpIdentity.GetClassesList();
	let isPreferred = attackType => MatchesClassList(targetClasses, this.GetPreferredClasses(attackType));
	
	this.StopCanChargeTimer();
	
	let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
	this.canChargeTimer = cmpTimer.SetInterval(this.entity, IID_Attack, "Charge", 0, 500, target);

	return types.sort((a, b) =>
		(types.indexOf(a) + (isPreferred(a) ? types.length : 0)) -
		(types.indexOf(b) + (isPreferred(b) ? types.length : 0))).pop();
};

/**
 * Returns null if we have no preference or the lowest index of a preferred class.
 */
Attack.prototype.GetPreference = function(target)
{
	let cmpIdentity = Engine.QueryInterface(target, IID_Identity);
	if (!cmpIdentity)
		return undefined;

	let targetClasses = cmpIdentity.GetClassesList();

	let minPref = null;
	for (let type of this.GetAttackTypes())
	{
		let preferredClasses = this.GetPreferredClasses(type);
		for (let pref = 0; pref < preferredClasses.length; ++pref)
		{
			if (MatchesClassList(targetClasses, preferredClasses[pref]))
			{
				// grapejuice
				if (pref === 0)
				{
					if (Helpers.EntityMatchesClassList(this.entity, "Structure") == true)
					{
						return minPref;
					}		
						
					let cmpUnitAI = Engine.QueryInterface(this.entity, IID_UnitAI);
					cmpUnitAI.RespondToTargetedEntities([target]);
					return pref;
				}

				if ((minPref === null || minPref > pref))
					minPref = pref;
			}
		}
	}
	return minPref;
};

Attack.prototype.GetAttackTypes = function(wantedTypes)
{
	let types = g_AttackTypes.filter(type => !!this.template[type]);
	if (!wantedTypes)
		return types;

	let wantedTypesReal = wantedTypes.filter(wtype => wtype.indexOf("!") != 0);
	return types.filter(type => wantedTypes.indexOf("!" + type) == -1 &&
	      (!wantedTypesReal || !wantedTypesReal.length || wantedTypesReal.indexOf(type) != -1));
};

Attack.prototype.GetPreferredClasses = function(type)
{
	if (this.template[type] && this.template[type].PreferredClasses &&
	    this.template[type].PreferredClasses._string)
		return this.template[type].PreferredClasses._string.split(/\s+/);

	return [];
};

Attack.prototype.GetRestrictedClasses = function(type)
{
	if (this.template[type] && this.template[type].RestrictedClasses &&
	    this.template[type].RestrictedClasses._string)
		return this.template[type].RestrictedClasses._string.split(/\s+/);

	return [];
};

Attack.prototype.CanAttack = function(target, wantedTypes)
{
	let cmpFormation = Engine.QueryInterface(target, IID_Formation);
	if (cmpFormation)
		return true;

	let cmpThisPosition = Engine.QueryInterface(this.entity, IID_Position);
	let cmpTargetPosition = Engine.QueryInterface(target, IID_Position);
	if (!cmpThisPosition || !cmpTargetPosition || !cmpThisPosition.IsInWorld() || !cmpTargetPosition.IsInWorld())
		return false;

	let cmpIdentity = QueryMiragedInterface(target, IID_Identity);
	if (!cmpIdentity)
		return false;

	let cmpHealth = QueryMiragedInterface(target, IID_Health);
	let targetClasses = cmpIdentity.GetClassesList();
	if (targetClasses.indexOf("Domestic") != -1 && this.template.Slaughter && cmpHealth && cmpHealth.GetHitpoints() &&
	   (!wantedTypes || !wantedTypes.filter(wType => wType.indexOf("!") != 0).length || wantedTypes.indexOf("Slaughter") != -1))
		return true;

	let cmpEntityPlayer = QueryOwnerInterface(this.entity);
	let cmpTargetPlayer = QueryOwnerInterface(target);
	if (!cmpTargetPlayer || !cmpEntityPlayer)
		return false;

	let types = this.GetAttackTypes(wantedTypes);
	let entityOwner = cmpEntityPlayer.GetPlayerID();
	let targetOwner = cmpTargetPlayer.GetPlayerID();
	let cmpCapturable = QueryMiragedInterface(target, IID_Capturable);

	// Check if the relative height difference is larger than the attack range
	// If the relative height is bigger, it means they will never be able to
	// reach each other, no matter how close they come.
	let heightDiff = Math.abs(cmpThisPosition.GetHeightOffset() - cmpTargetPosition.GetHeightOffset());

	for (let type of types)
	{
		if (type != "Capture" && (!cmpEntityPlayer.IsEnemy(targetOwner) || !cmpHealth || !cmpHealth.GetHitpoints()))
			continue;

		if (type == "Capture" && (!cmpCapturable || !cmpCapturable.CanCapture(entityOwner)))
			continue;

		if (heightDiff > this.GetRange(type).max)
			continue;

		let restrictedClasses = this.GetRestrictedClasses(type);
		if (!restrictedClasses.length)
			return true;

		if (!MatchesClassList(targetClasses, restrictedClasses))
			return true;
	}

	return false;
};

/**
 * Get the full range of attack using all available attack types.
 */
Attack.prototype.GetFullAttackRange = function()
{
	let ret = { "min": Infinity, "max": 0 };
	for (let type of this.GetAttackTypes())
	{
		let range = this.GetRange(type);
		ret.min = Math.min(ret.min, range.min);
		ret.max = Math.max(ret.max, range.max);
	}
	return ret;
};

Attack.prototype.GetAttackEffectsData = function(type, splash)
{
	let template = this.template[type];
	if (splash)
		template = template.Splash;
	return AttackHelper.GetAttackEffectsData("Attack/" + type + (splash ? "/Splash" : ""), template, this.entity);
};

Attack.prototype.GetAttackName = function(type)
{
	return {
		"name": this.template[type].AttackName._string || this.template[type].AttackName,
		"context": this.template[type].AttackName["@context"]
	};
};

Attack.prototype.GetRepeatTime = function(type)
{
	let repeatTime = 1000;

	if (this.template[type] && this.template[type].RepeatTime)
		repeatTime = +this.template[type].RepeatTime;

	return ApplyValueModificationsToEntity("Attack/" + type + "/RepeatTime", repeatTime, this.entity);
};

Attack.prototype.GetTimers = function(type)
{
	return {
		"prepare": ApplyValueModificationsToEntity("Attack/" + type + "/PrepareTime", +(this.template[type].PrepareTime || 0), this.entity),
		"repeat": this.GetRepeatTime(type)
	};
};

Attack.prototype.GetSplashData = function(type)
{
	if (!this.template[type].Splash)
		return undefined;

	return {
		"attackData": this.GetAttackEffectsData(type, true),
		"friendlyFire": this.template[type].Splash.FriendlyFire == "true",
		"radius": ApplyValueModificationsToEntity("Attack/" + type + "/Splash/Range", +this.template[type].Splash.Range, this.entity),
		"shape": this.template[type].Splash.Shape,
	};
};

Attack.prototype.GetRange = function(type)
{
	if (!type)
		return this.GetFullAttackRange();

	let max = +this.template[type].MaxRange;
	max = ApplyValueModificationsToEntity("Attack/" + type + "/MaxRange", max, this.entity);

	let min = +(this.template[type].MinRange || 0);
	min = ApplyValueModificationsToEntity("Attack/" + type + "/MinRange", min, this.entity);

	let elevationBonus = +(this.template[type].ElevationBonus || 0);
	elevationBonus = ApplyValueModificationsToEntity("Attack/" + type + "/ElevationBonus", elevationBonus, this.entity);

	return { "max": max, "min": min, "elevationBonus": elevationBonus };
};

/**
 * @param {number} target - The target to attack.
 * @param {string} type - The type of attack to use.
 * @param {number} callerIID - The IID to notify on specific events.
 *
 * @return {boolean} - Whether we started attacking.
 */
Attack.prototype.StartAttacking = function(target, type, callerIID)
{
	if (this.target)
		this.StopAttacking();

	if (!this.CanAttack(target, [type]))
		return false;

	let cmpResistance = Engine.QueryInterface(target, IID_Resistance);
	if (!cmpResistance || !cmpResistance.AddAttacker(this.entity))
		return false;

	let timings = this.GetTimers(type);
	let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);

	// If the repeat time since the last attack hasn't elapsed,
	// delay the action to avoid attacking too fast.
	let prepare = timings.prepare;
	if (this.lastAttacked)
	{
		let repeatLeft = this.lastAttacked + timings.repeat - cmpTimer.GetTime();
		prepare = Math.max(prepare, repeatLeft);
	}

	let cmpVisual = Engine.QueryInterface(this.entity, IID_Visual);
	if (cmpVisual)
	{
		cmpVisual.SelectAnimation("attack_" + type.toLowerCase(), false, 1.0);
		cmpVisual.SetAnimationSyncRepeat(timings.repeat);
		cmpVisual.SetAnimationSyncOffset(prepare);
	}

	// If using a non-default prepare time, re-sync the animation when the timer runs.
	this.resyncAnimation = prepare != timings.prepare;
	this.target = target;
	this.callerIID = callerIID;
	this.timer = cmpTimer.SetInterval(this.entity, IID_Attack, "Attack", prepare, timings.repeat, type);

	return true;
};

/**
 * @param {string} reason - The reason why we stopped attacking.
 */
Attack.prototype.StopAttacking = function(reason)
{
	warn("stopattacking");
	this.StopCanChargeTimer();
	if (!this.target)
		return;

	let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
	cmpTimer.CancelTimer(this.timer);
	delete this.timer;

	let cmpResistance = Engine.QueryInterface(this.target, IID_Resistance);
	if (cmpResistance)
		cmpResistance.RemoveAttacker(this.entity);

	delete this.target;

	let cmpVisual = Engine.QueryInterface(this.entity, IID_Visual);
	if (cmpVisual)
		cmpVisual.SelectAnimation("idle", false, 1.0);

	// The callerIID component may start again,
	// replacing the callerIID, hence save that.
	let callerIID = this.callerIID;
	delete this.callerIID;

	if (reason && callerIID)
	{
		let component = Engine.QueryInterface(this.entity, callerIID);
		if (component)
			component.ProcessMessage(reason, null);
	}
};

/**
 * Attack our target entity.
 * @param {string} data - The attack type to use.
 * @param {number} lateness - The offset of the actual call and when it was expected.
 */
Attack.prototype.Attack = function(type, lateness)
{
	if (!this.CanAttack(this.target, [type]))
	{
		this.StopAttacking("TargetInvalidated");
		return;
	}

	// ToDo: Enable entities to keep facing a target.
	Engine.QueryInterface(this.entity, IID_UnitAI)?.FaceTowardsTarget(this.target);

	let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
	this.lastAttacked = cmpTimer.GetTime() - lateness;

	// BuildingAI has its own attack routine.
	if (!Engine.QueryInterface(this.entity, IID_BuildingAI))
		this.PerformAttack(type, this.target);

	if (!this.target)
		return;

	// We check the range after the attack to facilitate chasing.
	if (!this.IsTargetInRange(this.target, type))
	{
		this.StopAttacking("OutOfRange");
		return;
	}

	if (this.resyncAnimation)
	{
		let cmpVisual = Engine.QueryInterface(this.entity, IID_Visual);
		if (cmpVisual)
		{
			let repeat = this.GetTimers(type).repeat;
			cmpVisual.SetAnimationSyncRepeat(repeat);
			cmpVisual.SetAnimationSyncOffset(repeat);
		}
		delete this.resyncAnimation;
	}
};

/**
 * @param {number} - The entity ID of the target to check.
 * @return {boolean} - Whether this entity is in range of its target.
 */
Attack.prototype.IsTargetInRange = function(target, type)
{
	let range = this.GetRange(type);
	if (type == "Ranged")
	{
		let cmpPositionTarget = Engine.QueryInterface(target, IID_Position);
		if (!cmpPositionTarget || !cmpPositionTarget.IsInWorld())
			return false;

		let cmpPositionSelf = Engine.QueryInterface(this.entity, IID_Position);
		if (!cmpPositionSelf || !cmpPositionSelf.IsInWorld())
			return false;

		let positionSelf = cmpPositionSelf.GetPosition();
		let positionTarget = cmpPositionTarget.GetPosition();

		let heightDifference = positionSelf.y + range.elevationBonus - positionTarget.y;
		range.max = Math.sqrt(Math.square(range.max) + 2 * range.max * heightDifference);

		if (range.max < 0)
			return false;
	}
	let cmpObstructionManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_ObstructionManager);
	return cmpObstructionManager.IsInTargetRange(this.entity, target, range.min, range.max, false);
};

Attack.prototype.OnValueModification = function(msg)
{
	if (msg.component != "Attack")
		return;

	let cmpUnitAI = Engine.QueryInterface(this.entity, IID_UnitAI);
	if (!cmpUnitAI)
		return;

	if (this.GetAttackTypes().some(type =>
	      msg.valueNames.indexOf("Attack/" + type + "/MaxRange") != -1))
		cmpUnitAI.UpdateRangeQueries();
};

Attack.prototype.GetRangeOverlays = function(type = "Ranged")
{
	if (!this.template[type] || !this.template[type].RangeOverlay)
		return [];

	let range = this.GetRange(type);
	let rangeOverlays = [];
	for (let i in range)
		if ((i == "min" || i == "max") && range[i])
			rangeOverlays.push({
				"radius": range[i],
				"texture": this.template[type].RangeOverlay.LineTexture,
				"textureMask": this.template[type].RangeOverlay.LineTextureMask,
				"thickness": +this.template[type].RangeOverlay.LineThickness,
			});
	return rangeOverlays;
};

Engine.ReRegisterComponentType(IID_Attack, "Attack", Attack);
