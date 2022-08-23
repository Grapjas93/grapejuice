// Number of rounds of firing per 2 seconds.
const roundCount = 10;
const attackType = "Ranged";
BuildingAI.prototype.MAX_PREFERENCE_BONUS = 2;

/**
 * Fire arrows with random temporal distribution on prefered targets.
 * Called 'roundCount' times every 'RepeatTime' seconds when there are units in the range.
 */
BuildingAI.prototype.FireArrows = function()
{
	if (!this.targetUnits.length && !this.unitAITarget)
	{
		if (!this.timer)
			return;

		let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
		cmpTimer.CancelTimer(this.timer);
		this.timer = undefined;
		return;
	}

	let cmpAttack = Engine.QueryInterface(this.entity, IID_Attack);
	if (!cmpAttack)
		return;

	if (this.currentRound > roundCount - 1)
		this.currentRound = 0;

	if (this.currentRound == 0)
		this.arrowsLeft = this.GetArrowCount();

	let arrowsToFire = 0;
	if (this.currentRound == roundCount - 1)
		arrowsToFire = this.arrowsLeft;
	else
		arrowsToFire = Math.min(
			randIntInclusive(0, 2 * this.GetArrowCount() / roundCount),
			this.arrowsLeft
		);

	// grapejuice, if the garrisoned entity has no ammo, don't shoot arrows
	if (Helpers.EntityMatchesClassList(this.entity, "ArmyCamp SiegeTower") && cmpAttack.ammo == 0)
	{
		arrowsToFire = 0;
	}

	if (arrowsToFire <= 0)
	{
		++this.currentRound;
		return;
	}

	// Add targets to a weighted list, to allow preferences.
	let targets = new WeightedList();
	let maxPreference = this.MAX_PREFERENCE_BONUS;
	let addTarget = function(target)
	{
		let preference = cmpAttack.GetPreference(target);
		let weight = 1;

		if (preference !== null && preference !== undefined)
			weight += maxPreference / (1 + preference);

		targets.push(target, weight);
	};

	// Add the UnitAI target separately, as the UnitMotion and RangeManager implementations differ.
	if (this.unitAITarget && this.targetUnits.indexOf(this.unitAITarget) == -1)
		addTarget(this.unitAITarget);
	for (let target of this.targetUnits)
		addTarget(target);

	// The obstruction manager performs approximate range checks.
	// so we need to verify them here.
	// TODO: perhaps an optional 'precise' mode to range queries would be more performant.
	const cmpObstructionManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_ObstructionManager);
	const range = cmpAttack.GetRange(attackType);
	const yOrigin = cmpAttack.GetAttackYOrigin(attackType);

	let firedArrows = 0;
	while (firedArrows < arrowsToFire && targets.length())
	{
		const selectedTarget = targets.randomItem();
		// Grapejuice, don't waste ammo on structures and don't shoot at siege
		if (this.CheckTargetVisible(selectedTarget) && !Helpers.EntityMatchesClassList(selectedTarget, "Structure Siege") && cmpObstructionManager.IsInTargetParabolicRange(
			this.entity,
			selectedTarget,
			range.min,
			range.max,
			yOrigin,
			false))
		{
			cmpAttack.PerformAttack(attackType, selectedTarget);
			PlaySound("attack_" + attackType.toLowerCase(), this.entity);
			++firedArrows;
			continue;
		}

		// Could not attack target, try a different target.
		targets.remove(selectedTarget);
	}

	this.arrowsLeft -= firedArrows;
	++this.currentRound;
};

Engine.ReRegisterComponentType(IID_BuildingAI, "BuildingAI", BuildingAI);
