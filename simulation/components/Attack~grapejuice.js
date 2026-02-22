var g_AttackTypes = ["Melee", "Ranged", "Capture"];

// grapejuice
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
				"<Gravity>50.0</Gravity>" +
				"<GravArcMult>0.5</GravArcMult>" +
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
							"<optional>" +
								"<element name='Speed' a:help='Speed of projectiles (in meters per second).'>" +
									"<ref name='positiveDecimal'/>" +
								"</element>" +
							"</optional>" +
							"<element name='Spread' a:help='Standard deviation of the bivariate normal distribution of hits at 100 meters. A disk at 100 meters from the attacker with this radius (2x this radius, 3x this radius) is expected to include the landing points of 39.3% (86.5%, 98.9%) of the rounds.'><ref name='nonNegativeDecimal'/></element>" +
							"<element name='Gravity' a:help='The gravity affecting the projectile. This affects the shape of the flight curve.'>" +
								"<ref name='nonNegativeDecimal'/>" +
							"</element>" +
							"<optional>" +
								"<element name='GravArcMult' a:help='Adjust the projectile arc strength with this multiplier.'>" +
									"<ref name='nonNegativeDecimal'/>" +
								"</element>" +
							"</optional>" +
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

	this.canChargeTimer = undefined;
};

// returns object containing the ActorName, ImpactActorName and ImpactAnimationLifetime
Attack.prototype.GetProjectileActors = function()
{
	let actorName = this.template.Ranged.Projectile.ActorName ? this.template.Ranged.Projectile.ActorName : "";
	let impactActorName = this.template.Ranged.Projectile.ImpactActorName ? this.template.Ranged.Projectile.ImpactActorName : "";
	let impactAnimationLifetime = this.template.Ranged.Projectile.ImpactAnimationLifetime ? +this.template.Ranged.Projectile.ImpactAnimationLifetime : 0;

	return {
		"actorName": ApplyValueModificationsToEntity("Attack/Ranged/Projectile/ActorName", actorName, this.entity),
		"impactActorName": ApplyValueModificationsToEntity("Attack/Ranged/Projectile/ImpactActorName", impactActorName, this.entity),
		"impactAnimationLifetime": ApplyValueModificationsToEntity("Attack/Ranged/Projectile/ImpactAnimationLifetime", impactAnimationLifetime, this.entity),
	};
};

// grapejuice, called by Charge()
Attack.prototype.CanCharge = function(target)
{
	let cmpEnergy = Engine.QueryInterface(this.entity, IID_Energy);
	if (cmpEnergy && cmpEnergy.GetEnergy() <= 0)
		return false;

	if (PositionHelper.DistanceBetweenEntities(this.entity, target) > 27)
		return false;

	return true;

};

// grapejuice, stops the timer which checks every 500ms if we can Charge() our target
Attack.prototype.StopCanChargeTimer = function()
{
	let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
	this.canChargeTimer = cmpTimer.CancelTimer(this.canChargeTimer);

	let cmpModifiersManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_ModifiersManager);
	cmpModifiersManager.RemoveAllModifiers("ChargeAttack", this.entity);

	let cmpUnitAI = Engine.QueryInterface(this.entity, IID_UnitAI);
	cmpUnitAI.SetSpeedMultiplier(1);
};

// grapejuice, called by a timer in GetBestAttackAgainst() with a 500ms interval
Attack.prototype.Charge = function(target)
{
	warn('called charge()')
	let cmpEnergy = Engine.QueryInterface(this.entity, IID_Energy);
	if (!cmpEnergy || (cmpEnergy && cmpEnergy.GetEnergy() <= 0))
	{
		this.StopCanChargeTimer();
		return;
	}

	let cmpModifiersManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_ModifiersManager);
	let cmpUnitAI = Engine.QueryInterface(this.entity, IID_UnitAI);

	if (this.CanCharge(target) == false)
	{
		cmpModifiersManager.RemoveAllModifiers("ChargeAttack", this.entity);
		cmpUnitAI.SetSpeedMultiplier(1);

		// workaround fix for sprinting attacking soldiers in formation
		if (cmpUnitAI.IsFormationMember())
		cmpUnitAI.SetSpeedMultiplier(0.5);

		return;
	}

	else
	{
		if (cmpModifiersManager.HasAnyModifier("ChargeAttack", this.entity) == true)
		{
			cmpEnergy.Reduce(5);
			return;
		}

		// rams have multipliers based on how many are garrisoned
		if (Helpers.EntityMatchesClassList(this.entity, "Ram"))
		{
			let cmpGarrisonHolder = Engine.QueryInterface(this.entity, IID_GarrisonHolder);
			let multiplier = 1 + (cmpGarrisonHolder.OccupiedSlots() / 10);

			cmpEnergy.Reduce(5);
			cmpModifiersManager.AddModifiers("ChargeAttack", {
				"Attack/Melee/PrepareTime": [{ "affects": ["Unit"], "replace": 100 }],
				"Attack/Melee/Damage/Hack": [{ "affects": ["Unit"], "multiply": multiplier }],
				"Attack/Melee/Damage/Pierce": [{ "affects": ["Unit"], "multiply": multiplier}],
				"Attack/Melee/Damage/Crush": [{ "affects": ["Unit"], "multiply": multiplier }],
				"UnitMotion/WalkSpeed": [{ "affects": ["Unit"], "multiply": multiplier }]
			}, this.entity);
			return;
		}

		cmpEnergy.Reduce(5);
		cmpModifiersManager.AddModifiers("ChargeAttack", {
			"Attack/Melee/PrepareTime": [{ "affects": ["Unit"], "replace": 100 }],
			"Attack/Melee/Damage/Hack": [{ "affects": ["Unit"], "multiply": 1.2 }],
			"Attack/Melee/Damage/Pierce": [{ "affects": ["Unit"], "multiply": 1.5 }],
			"Attack/Melee/Damage/Crush": [{ "affects": ["Unit"], "multiply": 1.3}]
		}, this.entity);

		cmpUnitAI.Run();

		// workaround fix for sprinting attacking soldiers in formation
		if (cmpUnitAI.IsFormationMember())
		cmpUnitAI.SetSpeedMultiplier(1);

		return;
	}

};

// grapejuice, called by GetBestAttackAgainst() and PerformAttack()
Attack.prototype.CheckTargetIsInMeleeRange = function(target)
{
	let distance = PositionHelper.DistanceBetweenEntities(this.entity, target);
	return distance < 12;
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
	let cmpAmmo = Engine.QueryInterface(this.entity, IID_Ammo);
	// grapejuice
	if (type == "Ranged")
	{
		if (cmpAmmo)
		{
			if (cmpAmmo.ammo > 0 && this.CheckTargetIsInMeleeRange(target) == false)
			{
				cmpAmmo.Reduce(1);
			}
			else
			{
				let cmpUnitAI = Engine.QueryInterface(this.entity, IID_UnitAI);
				if(!cmpUnitAI)
					return;

				cmpUnitAI.RespondToTargetedEntities([target]);
			}
		}
	}

	// grapejuice
	let cmpEnergy = Engine.QueryInterface(this.entity, IID_Energy);
	if (type == "Melee" && cmpEnergy)
	{
		cmpEnergy.SetEnergy(0);
		this.StopCanChargeTimer();
	}

	if (this.template[type].Projectile)
	{
		let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
		let turnLength = cmpTimer.GetLatestTurnLength()/1000;
		// In the future this could be extended:
		//  * Obstacles like trees could reduce the probability of the target being hit
		//  * Obstacles like walls should block projectiles entirely


		// Credits to @BB for the arcing projectiles code
		let spread = ApplyValueModificationsToEntity("Attack/Ranged/Spread", +this.template[type].Projectile.Spread, this.entity);
		let range = this.GetRange(type);
		let maxRange = range.max + spread;
		let distance = PositionHelper.DistanceBetweenEntities(this.entity, target);
		let GravArcMult = +this.template[type].Projectile.GravArcMult || 1;
		let gravity = +this.template[type].Projectile.Gravity * (maxRange / distance);
		// Compute the horizontal speed for a given gravity and assuming initial angle of pi/4 for maximum range.
		let horizSpeed = maxRange * Math.sqrt(gravity / ((2 * GravArcMult) * Math.max(maxRange  + targetPosition.y - selfPosition.y, 1)));

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
		let distanceModifiedSpread = spread * predictedPosition.horizDistanceTo(selfPosition) / 100;

		let randNorm = randomNormal2D();
		let offsetX = randNorm[0] * distanceModifiedSpread;
		let offsetZ = randNorm[1] * distanceModifiedSpread;

		data.position = new Vector3D(predictedPosition.x + offsetX, predictedHeight, predictedPosition.z + offsetZ);

		let realHorizDistance = data.position.horizDistanceTo(selfPosition);
		timeToTarget = realHorizDistance / horizSpeed;
		delay += timeToTarget * 1000;

		data.direction = Vector3D.sub(data.position, selfPosition).div(realHorizDistance);


		let projectileActors = this.GetProjectileActors();
		let actorName = projectileActors.actorName;
		let impactActorName = projectileActors.impactActorName;
		let impactAnimationLifetime = projectileActors.impactAnimationLifetime;

		data.impactAnimationLifetime = impactAnimationLifetime;

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
	let cmpAmmo = Engine.QueryInterface(this.entity, IID_Ammo);
	if (cmpAmmo
		&& cmpAmmo.ammo != 0
		&& this.CheckTargetIsInMeleeRange(target) == false
		&& (Helpers.EntityMatchesClassList(this.entity, "Raider Siege Structure") == true
		|| Helpers.EntityMatchesClassList(target, "Siege Structure") == false))
		return "Ranged";
	else if (types.includes("Melee"))
		return "Melee";
	else
		return undefined;
};

Attack.prototype.OnUnitAIOrderDataChanged = function(msg)
{
	let currentOrder = msg.to.shift()
	if (currentOrder && currentOrder.attackType == "Melee")
	{
		if (!this.canChargeTimer)
		{
			let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
			this.canChargeTimer = cmpTimer.SetInterval(this.entity, IID_Attack, "Charge", 0, 100, currentOrder.target);
		}
	}
	else
		this.StopCanChargeTimer();
};

Engine.ReRegisterComponentType(IID_Attack, "Attack", Attack);
