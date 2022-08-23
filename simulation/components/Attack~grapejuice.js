var g_AttackTypes = ["Melee", "Ranged", "Capture"];

// grapejuice, added <Ammo>, <RefillTime>, <RefillAmount> <Energy>
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
			"<Origin>" +
				"<X>0</X>" +
				"<Y>10.0</Y>" +
				"<Z>0</Z>" +
			"</Origin>" +
			"<PrepareTime>800</PrepareTime>" +
			"<RepeatTime>1600</RepeatTime>" +
			"<EffectDelay>1000</EffectDelay>" +
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
					"<element name='Origin' a:help='The offset from which the attack occurs, relative to the entity position. Defaults to {0,0,0}.'>" +
						"<interleave>" +
							"<element name='X'>" +
								"<ref name='nonNegativeDecimal'/>" +
							"</element>" +
							"<element name='Y'>" +
								"<ref name='nonNegativeDecimal'/>" +
							"</element>" +
							"<element name='Z'>" +
								"<ref name='nonNegativeDecimal'/>" +
							"</element>" +
						"</interleave>" +
					"</element>" +
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
					"<element name='EffectDelay' a:help='Delay of applying the effects, in milliseconds after the attack has landed. Defaults to 0.'><ref name='nonNegativeDecimal'/></element>" +
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
	this.maxAmmo = 0;
	this.refillTime = 3000;
	this.refillAmount = 0;
	this.ammoReffilTimer = undefined;

	if (!!this.template["Ranged"] && !!this.template["Ranged"].Ammo)
	{
		this.ammo = +this.template["Ranged"].Ammo;
		this.maxAmmo = +this.template["Ranged"].Ammo;
	}

	if (!!this.template["Melee"] && !!this.template["Melee"].Ammo)
	{
		this.ammo = +this.template["Melee"].Ammo;
		this.maxAmmo = +this.template["Melee"].Ammo;
	}

	if (!!this.template["Melee"] && !!this.template["Melee"].Energy)
	{
		this.energy = this.template["Melee"].Energy;
		this.maxEnergy = this.template["Melee"].Energy;
		this.energy = +this.energy;
		this.maxEnergy = +this.maxEnergy;

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
	if (this.energy <= 0)
		return false;

	// if the unit is wounded it cant charge
	if (this.wounded)
		return false;

	if (PositionHelper.DistanceBetweenEntities(this.entity, target) > 27)
		return false;

	return true;

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

// grapejuice, called by a timer in GetBestAttackAgainst() with a 500ms interval
Attack.prototype.Charge = function(target)
{
	if (this.energy == undefined)
		return;

	let cmpModifiersManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_ModifiersManager);
	let cmpUnitAI = Engine.QueryInterface(this.entity, IID_UnitAI);

	if (this.CanCharge(target) == false)
	{
		cmpModifiersManager.RemoveAllModifiers("ChargeAttack", this.entity);
		cmpUnitAI.ResetSpeedMultiplier();

		// workaround fix for sprinting attacking soldiers in formation
		if (cmpUnitAI.IsFormationMember())
		cmpUnitAI.SetSpeedMultiplier(0.5);

		return;
	}

	else
	{
		if (cmpModifiersManager.HasAnyModifier("ChargeAttack", this.entity) == true)
		{
			this.energy = this.energy - 5;
			this.RefreshStatusbars(this.entity);
			return;
		}

		// rams have multipliers based on how many are garrisoned
		if (Helpers.EntityMatchesClassList(this.entity, "Ram"))
		{
			let cmpGarrisonHolder = Engine.QueryInterface(this.entity, IID_GarrisonHolder);
			let multiplier = 1 + cmpGarrisonHolder.OccupiedSlots() / 10;

			this.energy = this.energy - 5;
			cmpModifiersManager.AddModifiers("ChargeAttack", {
			"Attack/Melee/PrepareTime": [{ "affects": ["Unit"], "replace": 100 }],
			"Attack/Melee/Damage/Hack": [{ "affects": ["Unit"], "multiply": 1.2 }],
			"Attack/Melee/Damage/Pierce": [{ "affects": ["Unit"], "multiply": 1.5 }],
			"Attack/Melee/Damage/Crush": [{ "affects": ["Unit"], "multiply": multiplier }],
			"UnitMotion/WalkSpeed": [{ "affects": ["Unit"], "multiply": multiplier }]
			}, this.entity);
			return;
		}

		this.energy = this.energy - 5;
		cmpModifiersManager.AddModifiers("ChargeAttack", {
		"Attack/Melee/PrepareTime": [{ "affects": ["Unit"], "replace": 100 }],
		"Attack/Melee/Damage/Hack": [{ "affects": ["Unit"], "multiply": 1.2 }],
		"Attack/Melee/Damage/Pierce": [{ "affects": ["Unit"], "multiply": 1.5 }],
		"Attack/Melee/Damage/Crush": [{ "affects": ["Unit"], "multiply": 1.3}]
		}, this.entity);

		cmpUnitAI.SetSpeedMultiplier(cmpUnitAI.GetRunMultiplier());

		// workaround fix for sprinting attacking soldiers in formation
		if (cmpUnitAI.IsFormationMember())
		cmpUnitAI.SetSpeedMultiplier(1);

		return;
	}

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

// grapejuice, called by UnitAI~grapejuice, any unit order that is not "Stop" will stop the recharge timer
Attack.prototype.StopRechargingEnergy = function()
{
	let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);

	cmpTimer.CancelTimer(this.RechargeEnergyTimer);
	cmpTimer.CancelTimer(this.CanRechargeEnergyTimer);

	this.RechargeEnergyTimer = undefined;
	this.CanRechargeEnergyTimer = undefined;
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
	}

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
	if (this.ammo != this.maxAmmo)
	{
		this.ammo = this.ammo + 1;
		this.RefreshStatusbars(this.entity);
	}

};

// grapejuice, called by ReArmAura()
Attack.prototype.SetAmmo = function(ammoGiver)
{
	let cmpStatusBars = Engine.QueryInterface(this.entity, IID_StatusBars);
	let cmpAmmoGiver = Engine.QueryInterface(ammoGiver, IID_Attack);

	// if the entity is the ammoGiver, don't reload and stop the timer
	if (ammoGiver == this.entity)
	{
		this.StopReArming();
		return;
	}

	// if the entity reloads from ammoGiver, draw ammo from ammoGiver ammo pool
	if (Helpers.EntityMatchesClassList(ammoGiver, "ArmyCamp Supply"))
	{
		let ammoNeeded = this.maxAmmo - this.ammo;

		// if the ammoGiver has no ammo, stop timer
		if (cmpAmmoGiver.ammo == 0)
		{
			this.StopReArming();
			return;
		}

		// if the ammoGiver can't do a full reload for the unit, give all remaining ammo to unit
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
			this.ammo = this.maxAmmo;

			this.RefreshStatusbars(this.entity);
			this.RefreshStatusbars(ammoGiver);

			return;
		}
	}

	// other buildings have infinite stock, simply reload the unit fully
	this.ammo = this.maxAmmo;
	this.RefreshStatusbars(this.entity);
}

// grapejuice, called by ReArmAura() and the Auras component
Attack.prototype.CheckIsInAuraRange = function()
{
	let entityOwner = Helpers.GetOwner(this.entity);
	let range30 = TriggerHelper.GetPlayerEntitiesByClass(entityOwner, "Forge Barracks Stable Arsenal Supply");
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
	if (this.CheckIsInAuraRange() == false || this.ammo == this.maxAmmo)
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

	let delay = +(this.template[type].EffectDelay || 0);

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
				if(!cmpUnitAI)
					return;

				cmpUnitAI.RespondToTargetedEntities([target]);
			}
		}
		this.ReArmAura();
	}

	// grapejuice
	if (type == "Melee" && this.maxEnergy != undefined)
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
	if (rangeIndex != -1 && !!this.template["Ranged"].Ammo && Helpers.EntityMatchesClassList(this.entity, "Siege") == false)
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
	this.canChargeTimer = cmpTimer.SetInterval(this.entity, IID_Attack, "Charge", 0, 100, target);

	return types.sort((a, b) =>
		(types.indexOf(a) + (isPreferred(a) ? types.length : 0)) -
		(types.indexOf(b) + (isPreferred(b) ? types.length : 0))).pop();
};

/**
 * Returns undefined if we have no preference or the lowest index of a preferred class.
 */
Attack.prototype.GetPreference = function(target)
{
	let cmpIdentity = Engine.QueryInterface(target, IID_Identity);
	if (!cmpIdentity)
		return undefined;

	let targetClasses = cmpIdentity.GetClassesList();

	let minPref;
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
					if (Helpers.EntityMatchesClassList(this.entity, "Structure Siege") == true)
					{
						return minPref;
					}

					let cmpUnitAI = Engine.QueryInterface(this.entity, IID_UnitAI);
					cmpUnitAI.RespondToTargetedEntities([target]);
					return pref;
				}
				if ((minPref === undefined || minPref > pref))
					minPref = pref;
			}
		}
	}
	return minPref;
};

Engine.ReRegisterComponentType(IID_Attack, "Attack", Attack);
