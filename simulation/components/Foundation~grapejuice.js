Foundation.prototype.Init = function()
{
	// Foundations are initially 'uncommitted' and do not block unit movement at all
	// (to prevent players exploiting free foundations to confuse enemy units).
	// The first builder to reach the uncommitted foundation will tell friendly units
	// and animals to move out of the way, then will commit the foundation and enable
	// its obstruction once there's nothing in the way.
	this.committed = false;

	this.builders = new Map(); // Map of builder entities to their work per second
	this.totalBuilderRate = 0; // Total amount of work the builders do each second
	this.buildMultiplier = 1; // Multiplier for the amount of work builders do

	this.buildTimeModifier = +this.template.BuildTimeModifier;

	this.previewEntity = INVALID_ENTITY;
	this.entsToDestroy = [];
};

Foundation.prototype.IsFinished = function()
{
	if (this.GetBuildProgress() == 1.0 && this.entsToDestroy.length)
		for (let ent of this.entsToDestroy)
			Engine.DestroyEntity(ent);

	return this.GetBuildProgress() == 1.0;
};

/**
 * @return {boolean} - Whether the foundation has been committed sucessfully.
 */
Foundation.prototype.Commit = function()
{
	//warn("commit")
	if (this.committed)
		return false;


	let cmpObstruction = Engine.QueryInterface(this.entity, IID_Obstruction);
	if (cmpObstruction && cmpObstruction.GetBlockMovementFlag(true))
	{
		this.entsToDestroy = cmpObstruction.GetEntitiesDeletedUponConstruction();

		let collisions = cmpObstruction.GetEntitiesBlockingConstruction();
		let movableCollisions = [];
		if (collisions.length)
		{
			for (let ent of collisions)
			{
				let cmpUnitAI = Engine.QueryInterface(ent, IID_UnitAI);
				if (cmpUnitAI)
				{
					cmpUnitAI.LeaveFoundation(this.entity);
					movableCollisions.push(ent)
					//warn(uneval(movableCollisions))
				}
				let cmpResourceSupply = Engine.QueryInterface(ent, IID_ResourceSupply);
				if (cmpResourceSupply && cmpResourceSupply.GetType().generic == "wood")
				{
					this.entsToDestroy.push(ent)
					//warn(uneval(this.entsToDestroy))
				}

				// TODO: What if an obstruction has no UnitAI?
			}

			// TODO: maybe we should tell the builder to use a special
			// animation to indicate they're waiting for people to get
			// out the way
			if (movableCollisions.length)
				return false
		}
	}


	// The obstruction always blocks new foundations/construction,
	// but we've temporarily allowed units to walk all over it
	// (via CCmpTemplateManager). Now we need to remove that temporary
	// blocker-disabling, so that we'll perform standard unit blocking instead.
	if (cmpObstruction)
		cmpObstruction.SetDisableBlockMovementPathfinding(false, false, -1);

	let cmpTrigger = Engine.QueryInterface(SYSTEM_ENTITY, IID_Trigger);
	cmpTrigger.CallEvent("OnConstructionStarted", {
		"foundation": this.entity,
		"template": this.finalTemplateName
	});

	let cmpFoundationVisual = Engine.QueryInterface(this.entity, IID_Visual);
	if (cmpFoundationVisual)
		cmpFoundationVisual.SelectAnimation("scaffold", false, 1.0);

	this.committed = true;
	this.CreateConstructionPreview();
	return true;
};

Engine.ReRegisterComponentType(IID_Foundation, "Foundation", Foundation);
