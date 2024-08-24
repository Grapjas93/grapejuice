/*
 * This function creates the entities and places them in world if possible
 * (some of these entities may be garrisoned directly if autogarrison, the others are spawned).
 */
Trainer.prototype.Item.prototype.Spawn = function()
{
	if (this.templateName == "brazier_off")
	{
		ChangeEntityTemplate(this.trainer, "brazier_off");
		return;
	}
	else if (this.templateName == "brazier_lit")
	{
		ChangeEntityTemplate(this.trainer, "brazier_lit");
		return;
	}

	const createdEnts = [];
	const spawnedEnts = [];

	// We need entities to test spawning, but we don't want to waste resources,
	// so only create them once and use as needed.
	if (!this.entities)
	{
		this.entities = [];
		for (let i = 0; i < this.count; ++i)
			this.entities.push(Engine.AddEntity(this.templateName));
	}

	let autoGarrison;
	const cmpRallyPoint = Engine.QueryInterface(this.trainer, IID_RallyPoint);
	if (cmpRallyPoint)
	{
		const data = cmpRallyPoint.GetData()[0];
		if (data?.target && data.target == this.trainer && data.command == "garrison")
			autoGarrison = true;
	}

	const cmpFootprint = Engine.QueryInterface(this.trainer, IID_Footprint);
	const cmpPosition = Engine.QueryInterface(this.trainer, IID_Position);
	const positionTrainer = cmpPosition && cmpPosition.GetPosition();

	const cmpPlayerEntityLimits = QueryPlayerIDInterface(this.player, IID_EntityLimits);
	const cmpPlayerStatisticsTracker = QueryPlayerIDInterface(this.player, IID_StatisticsTracker);
	while (this.entities.length)
	{
		const ent = this.entities[0];
		const cmpNewOwnership = Engine.QueryInterface(ent, IID_Ownership);
		let garrisoned = false;

		if (autoGarrison)
		{
			const cmpGarrisonable = Engine.QueryInterface(ent, IID_Garrisonable);
			if (cmpGarrisonable)
			{
				// Temporary owner affectation needed for GarrisonHolder checks.
				cmpNewOwnership.SetOwnerQuiet(this.player);
				garrisoned = cmpGarrisonable.Garrison(this.trainer);
				cmpNewOwnership.SetOwnerQuiet(INVALID_PLAYER);
			}
		}

		if (!garrisoned)
		{
			const pos = cmpFootprint.PickSpawnPoint(ent);
			if (pos.y < 0)
				break;

			const cmpNewPosition = Engine.QueryInterface(ent, IID_Position);
			cmpNewPosition.JumpTo(pos.x, pos.z);

			if (positionTrainer)
				cmpNewPosition.SetYRotation(positionTrainer.horizAngleTo(pos));

			spawnedEnts.push(ent);
		}

		// Decrement entity count in the EntityLimits component
		// since it will be increased by EntityLimits.OnGlobalOwnershipChanged,
		// i.e. we replace a 'trained' entity by 'alive' one.
		// Must be done after spawn check so EntityLimits decrements only if unit spawns.
		if (cmpPlayerEntityLimits)
		{
			const cmpTrainingRestrictions = Engine.QueryInterface(ent, IID_TrainingRestrictions);
			if (cmpTrainingRestrictions)
				cmpPlayerEntityLimits.ChangeCount(cmpTrainingRestrictions.GetCategory(), -1);
		}
		cmpNewOwnership.SetOwner(this.player);

		if (cmpPlayerStatisticsTracker)
			cmpPlayerStatisticsTracker.IncreaseTrainedUnitsCounter(ent);

		this.count--;
		this.entities.shift();
		createdEnts.push(ent);
	}

	if (spawnedEnts.length && !autoGarrison && cmpRallyPoint)
		for (const com of GetRallyPointCommands(cmpRallyPoint, spawnedEnts))
			ProcessCommand(this.player, com);

	const cmpPlayer = QueryOwnerInterface(this.trainer);
	if (createdEnts.length)
	{
		if (this.population)
			cmpPlayer.UnReservePopulationSlots(this.population * createdEnts.length);
		// Play a sound, but only for the first in the batch (to avoid nasty phasing effects).
		PlaySound("trained", createdEnts[0]);
		Engine.PostMessage(this.trainer, MT_TrainingFinished, {
		    "entities": createdEnts,
		    "owner": this.player,
		    "metadata": this.metadata
		});
	}
	if (this.count)
	{
		cmpPlayer.BlockTraining();

		if (!this.spawnNotified)
		{
			Engine.QueryInterface(SYSTEM_ENTITY, IID_GuiInterface).PushNotification({
			    "players": [cmpPlayer.GetPlayerID()],
			    "message": markForTranslation("Can't find free space to spawn trained units."),
			    "translateMessage": true
			});
			this.spawnNotified = true;
		}
	}
	else
	{
		cmpPlayer.UnBlockTraining();
		delete this.spawnNotified;
	}
};

Engine.ReRegisterComponentType(IID_Trainer, "Trainer", Trainer);
