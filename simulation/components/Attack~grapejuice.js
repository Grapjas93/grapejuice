
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
			"<MaxRange>4.0</MaxRange>" +
		"</Slaughter>" +
	"</a:example>" +
	"<optional>" +
		"<element name='Melee'>" +
			"<interleave>" +
				"<element name='AttackName' a:help='Name of the attack, to be displayed in the GUI. Optionally includes a translate context attribute.'>" +
					"<optional>" +
						"<attribute name='context'>" +
							"<text/>" +
						"</attribute>" +
					"</optional>" +
					"<text/>" +
				"</element>" +
				Attacking.BuildAttackEffectsSchema() +
				"<element name='MaxRange' a:help='Maximum attack range (in metres)'><ref name='nonNegativeDecimal'/></element>" +
				"<element name='PrepareTime' a:help='Time from the start of the attack command until the attack actually occurs (in milliseconds). This value relative to RepeatTime should closely match the \"event\" point in the actor&apos;s attack animation'>" +
					"<data type='nonNegativeInteger'/>" +
				"</element>" +
				"<element name='RepeatTime' a:help='Time between attacks (in milliseconds). The attack animation will be stretched to match this time'>" + // TODO: it shouldn't be stretched
					"<data type='positiveInteger'/>" +
				"</element>" +
				Attack.prototype.preferredClassesSchema +
				Attack.prototype.restrictedClassesSchema +
			"</interleave>" +
		"</element>" +
	"</optional>" +
	"<optional>" +
		"<element name='Ranged'>" +
			"<interleave>" +
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
				Attacking.BuildAttackEffectsSchema() +
				"<element name='MaxRange' a:help='Maximum attack range (in metres)'><ref name='nonNegativeDecimal'/></element>" +
				"<element name='MinRange' a:help='Minimum attack range (in metres)'><ref name='nonNegativeDecimal'/></element>" +
				"<optional>"+
					"<element name='ElevationBonus' a:help='give an elevation advantage (in meters)'><ref name='nonNegativeDecimal'/></element>" +
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
				"<element name='PrepareTime' a:help='Time from the start of the attack command until the attack actually occurs (in milliseconds). This value relative to RepeatTime should closely match the \"event\" point in the actor&apos;s attack animation'>" +
					"<data type='nonNegativeInteger'/>" +
				"</element>" +
				"<element name='RepeatTime' a:help='Time between attacks (in milliseconds). The attack animation will be stretched to match this time'>" +
					"<data type='positiveInteger'/>" +
				"</element>" +
				"<element name='Delay' a:help='Delay of the damage in milliseconds'><ref name='nonNegativeDecimal'/></element>" +
				"<optional>" +
					"<element name='Splash'>" +
						"<interleave>" +
							"<element name='Shape' a:help='Shape of the splash damage, can be circular or linear'><text/></element>" +
							"<element name='Range' a:help='Size of the area affected by the splash'><ref name='nonNegativeDecimal'/></element>" +
							"<element name='FriendlyFire' a:help='Whether the splash damage can hurt non enemy units'><data type='boolean'/></element>" +
							Attacking.BuildAttackEffectsSchema() +
						"</interleave>" +
					"</element>" +
				"</optional>" +
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
				Attack.prototype.preferredClassesSchema +
				Attack.prototype.restrictedClassesSchema +
			"</interleave>" +
		"</element>" +
	"</optional>" +
	"<optional>" +
		"<element name='Capture'>" +
			"<interleave>" +
				"<element name='AttackName' a:help='Name of the attack, to be displayed in the GUI. Optionally includes a translate context attribute.'>" +
					"<optional>" +
						"<attribute name='context'>" +
							"<text/>" +
						"</attribute>" +
					"</optional>" +
					"<text/>" +
				"</element>" +
				Attacking.BuildAttackEffectsSchema() +
				"<element name='MaxRange' a:help='Maximum attack range (in meters)'><ref name='nonNegativeDecimal'/></element>" +
				"<element name='RepeatTime' a:help='Time between attacks (in milliseconds). The attack animation will be stretched to match this time'>" + // TODO: it shouldn't be stretched
					"<data type='positiveInteger'/>" +
				"</element>" +
				Attack.prototype.preferredClassesSchema +
				Attack.prototype.restrictedClassesSchema +
			"</interleave>" +
		"</element>" +
	"</optional>" +
	"<optional>" +
		"<element name='Slaughter' a:help='A special attack to kill domestic animals'>" +
			"<interleave>" +
				"<element name='AttackName' a:help='Name of the attack, to be displayed in the GUI. Optionally includes a translate context attribute.'>" +
					"<optional>" +
						"<attribute name='context'>" +
							"<text/>" +
						"</attribute>" +
					"</optional>" +
					"<text/>" +
				"</element>" +
				Attacking.BuildAttackEffectsSchema() +
				"<element name='MaxRange'><ref name='nonNegativeDecimal'/></element>" + // TODO: how do these work?
				Attack.prototype.preferredClassesSchema +
				Attack.prototype.restrictedClassesSchema +
			"</interleave>" +
		"</element>" +
	"</optional>";

Attack.prototype.Init = function()
{
	this.ammo = 0;
	this.noRange = false;
	this.refillTime = 3000;
	this.refillAmount = 0;
	this.ammoReffilTimer = undefined;
	if (!!this.template["Ranged"] && !!this.template["Ranged"].Ammo)
		this.ammo = +this.template["Ranged"].Ammo;
	if (!!this.template["Ranged"] && !!this.template["Ranged"].RefillAmount)
		this.refillAmount = +this.template["Ranged"].RefillAmount;
//	if (!!this.template["Ranged"] && !!this.template["Ranged"].RefillTime)
//		this.refillTime = +this.template["Ranged"].RefillTime;
};

Attack.prototype.SetNoRange = function()
{
	this.noRange = true;
}

Attack.prototype.SetAmmo = function()
{
	this.ammo = this.GetMaxAmmo();
	let cmpStatusBars = Engine.QueryInterface(this.entity, IID_StatusBars);
	cmpStatusBars.RegenerateSprites();
	warn("Re-Arm");
	
}

Attack.prototype.CheckAmmoRefill = function()
{
	if (this.ammoReffilTimer != undefined)
		return;
	if (!this.refillAmount || !this.refillTime || !this.HasLimitedAmmo())
		return;
	if (this.ammo == this.GetMaxAmmo())
		return;
}

var g_target = "";
var entPlayer = "";	
var forge = "";
var civilCentre = "";
var colony = "";
var barracks = "";
var stable = "";
var fortress = "";
var arsenal = "";
var armyCamp = "";
var range30 = [];
var range60 = [];
var length = "";

// Used to check if target is inside the rearm aura. Called from ReArmAura function.
Attack.prototype.CheckTargetIsInAuraRange = function()
{
	entPlayer = TriggerHelper.GetOwner(this.entity);	
	forge = TriggerHelper.GetPlayerEntitiesByClass(entPlayer, "Forge");
	colony = TriggerHelper.GetPlayerEntitiesByClass(entPlayer, "Colony");
	barracks = TriggerHelper.GetPlayerEntitiesByClass(entPlayer, "Barracks");
	stable = TriggerHelper.GetPlayerEntitiesByClass(entPlayer, "Stable");
	fortress = TriggerHelper.GetPlayerEntitiesByClass(entPlayer, "Fortress");
	arsenal = TriggerHelper.GetPlayerEntitiesByClass(entPlayer, "Arsenal");
	armyCamp = TriggerHelper.GetPlayerEntitiesByClass(entPlayer, "ArmyCamp");
	colony = TriggerHelper.GetPlayerEntitiesByClass(entPlayer, "Colony");
	range30 = range30.concat(forge, colony, barracks, stable, arsenal);
	range60 = range60.concat(fortress, armyCamp, colony);
	length = range30.length;
	for (let i = 0; i < length; i++) 
	{
		let pop = range30.pop();
		let distance = PositionHelper.DistanceBetweenEntities(pop, this.entity);
		if (distance < 30)
		{
			warn("InsideAura = true");
			return true;
		} 	
	} 
	length = range60.length;
	for (let i = 0; i < length; i++) 
	{
		let pop = range60.pop();
		let distance = PositionHelper.DistanceBetweenEntities(pop, this.entity);
		if (distance < 60)
		{
			warn("InsideAura = true");
			return true;
		} 	
	} 
	warn("InsideAura = false");
	return false;	
};

Attack.prototype.ReArmAura = function()
{
	let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
	

	if (this.CheckTargetIsInAuraRange() == false || this.ammo == this.GetMaxAmmo())
	{
		cmpTimer.CancelTimer(this.ammoReffilTimer);
		this.ammoReffilTimer =	undefined;
		return;
	} 
	if (this.CheckTargetIsInAuraRange()  == true){
		cmpTimer.SetTimeout(this.entity, IID_Attack, "SetAmmo", this.refillTime, {});
	}
}

Attack.prototype.HasLimitedAmmo = function()
{
	if (!this.template["Ranged"])
		return false;
	return !!this.template["Ranged"].Ammo && this.template["Ranged"].Ammo > 0;
}

Attack.prototype.GetAmmoLeft = function()
{
	return this.ammo;
}

Attack.prototype.GetMaxAmmo = function()
{
	if (!this.template["Ranged"] || !this.template["Ranged"].Ammo)
		return 0;
	return this.template["Ranged"].Ammo;
}

Attack.prototype.CanAttack = function(target, wantedTypes)
{
	g_target = target;
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
	   (!wantedTypes || !wantedTypes.filter(wType => wType.indexOf("!") != 0).length))
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
	this.GetBestAttackAgainst();

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
 * Returns null if we have no preference or the lowest index of a preferred class.
 */
Attack.prototype.GetPreference = function(target)
{
	g_target = target;
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
				if (pref === 0)
				{
					let isStructure = TriggerHelper.MatchEntitiesByClass([this.entity], "Structure");
					if (isStructure != "")
					{
						return minPref;
					}		
						
					let cmpUnitAI = Engine.QueryInterface(this.entity, IID_UnitAI);
					cmpUnitAI.Stop();
					return pref;
				}

				if ((minPref === null || minPref > pref))
					minPref = pref;
			}
		}
	}
	return minPref;
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

	let targetClasses = cmpIdentity.GetClassesList();
	let isPreferred = attackType => MatchesClassList(targetClasses, this.GetPreferredClasses(attackType));

	let rangeIndex = types.indexOf("Ranged");
	let meleeIndex = types.indexOf("Melee");
	if (this.noRange)
	{
		types.splice(rangeIndex);
	}

	if (rangeIndex != -1 && !!this.template["Ranged"].Ammo  && TriggerHelper.MatchEntitiesByClass([this.entity], "Siege") == "")
	{
		// switch to melee if any of the blow is true
		if (this.ammo == 0 || this.CheckTargetIsInMeleeRange() || TriggerHelper.MatchEntitiesByClass([target], "Siege Palisade") != "") {
			types.splice(rangeIndex, 1);
			types.splice(meleeIndex, 0);
		}
	}


	return types.sort((a, b) =>
		(types.indexOf(a) + (isPreferred(a) ? types.length : 0)) -
		(types.indexOf(b) + (isPreferred(b) ? types.length : 0))).pop();
};

Attack.prototype.CheckTargetIsInMeleeRange = function()
{
	let cmpVision = Engine.QueryInterface(this.entity, IID_Vision);
	let cmpUnitAI = Engine.QueryInterface(this.entity, IID_UnitAI);
	if (!cmpVision)
		return false;

	let range = cmpVision.GetRange() / 7;
	let distance = PositionHelper.DistanceBetweenEntities(this.entity, g_target);
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
	g_target = target;
	let attackerOwner = Engine.QueryInterface(this.entity, IID_Ownership).GetOwner();
	// check if they need to perform a melee (if a unit is too close) or ranged attack

	// If this is a ranged attack, then launch a projectile
	if (type == "Ranged")
	{
		this.GetBestAttackAgainst();
		this.ReArmAura();

		if (!!this.template["Ranged"].Ammo) 
		{
			if (this.ammo > 0 && this.CheckTargetIsInMeleeRange() == false) 
			{
				this.ammo--;
				let cmpStatusBars = Engine.QueryInterface(this.entity, IID_StatusBars);
				cmpStatusBars.RegenerateSprites();
			}
			else 
			{
				let cmpUnitAI = Engine.QueryInterface(this.entity, IID_UnitAI);
				// re-apply stance if ammo is empty, so that the unit will switch to melee
				
				cmpUnitAI.SetStance(cmpUnitAI.GetStanceName());
				
				if (UnitAI.prototype.GetStanceName() == "standground")
				{
					cmpUnitAI.Stop();
					warn("Stance is standground");
				}
				// If ammo is empty switch to melee by checking for new preference attack type to attack with
				cmpUnitAI.Attack(g_target);
				return;
			}
		}
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
		let cmpPosition = Engine.QueryInterface(this.entity, IID_Position);
		if (!cmpPosition || !cmpPosition.IsInWorld())
			return;
		let selfPosition = cmpPosition.GetPosition();
		let cmpTargetPosition = Engine.QueryInterface(target, IID_Position);
		if (!cmpTargetPosition || !cmpTargetPosition.IsInWorld())
			return;
		let targetPosition = cmpTargetPosition.GetPosition();

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
		let distanceModifiedSpread = ApplyValueModificationsToEntity("Attack/Ranged/Spread", +this.template[type].Projectile.Spread, this.entity) *
			predictedPosition.horizDistanceTo(selfPosition) / 100;

		let randNorm = randomNormal2D();
		let offsetX = randNorm[0] * distanceModifiedSpread;
		let offsetZ = randNorm[1] * distanceModifiedSpread;

		let realTargetPosition = new Vector3D(predictedPosition.x + offsetX, predictedHeight, predictedPosition.z + offsetZ);

		// Recalculate when the missile will hit the target position.
		let realHorizDistance = realTargetPosition.horizDistanceTo(selfPosition);
		timeToTarget = realHorizDistance / horizSpeed;

		let missileDirection = Vector3D.sub(realTargetPosition, selfPosition).div(realHorizDistance);

		// Launch the graphical projectile.
		let cmpProjectileManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_ProjectileManager);

		let actorName = "";
		let impactActorName = "";
		let impactAnimationLifetime = 0;

		actorName = this.template[type].Projectile.ActorName || "";
		impactActorName = this.template[type].Projectile.ImpactActorName || "";
		impactAnimationLifetime = this.template[type].Projectile.ImpactAnimationLifetime || 0;

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

		let id = cmpProjectileManager.LaunchProjectileAtPoint(launchPoint, realTargetPosition, horizSpeed, gravity, actorName, impactActorName, impactAnimationLifetime);

		let attackImpactSound = "";
		let cmpSound = Engine.QueryInterface(this.entity, IID_Sound);
		if (cmpSound)
			attackImpactSound = cmpSound.GetSoundGroup("attack_impact_" + type.toLowerCase());

		let data = {
			"type": type,
			"attackData": this.GetAttackEffectsData(type),
			"target": target,
			"attacker": this.entity,
			"attackerOwner": attackerOwner,
			"position": realTargetPosition,
			"direction": missileDirection,
			"projectileId": id,
			"attackImpactSound": attackImpactSound,
			"splash": this.GetSplashData(type),
			"friendlyFire": this.template[type].Projectile.FriendlyFire == "true",
		};

		cmpTimer.SetTimeout(SYSTEM_ENTITY, IID_DelayedDamage, "MissileHit", +this.template[type].Delay + timeToTarget * 1000, data);
	}
	else
		Attacking.HandleAttackEffects(target, type, this.GetAttackEffectsData(type), this.entity, attackerOwner);
		
};

Engine.ReRegisterComponentType(IID_Attack, "Attack", Attack);
