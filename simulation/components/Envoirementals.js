function Envoirementals() {}

Envoirementals.prototype.Spawn = function(templateName)
{
	let ent = Engine.AddEntity(templateName);
	let cmpPosition = Engine.QueryInterface(ent, IID_Position);
	if (!cmpPosition)
	{
		Engine.DestroyEntity(ent);
		return false;
	}

	let cmpEntOwnership = Engine.QueryInterface(ent, IID_Ownership);
	if (cmpEntOwnership)
		cmpEntOwnership.SetOwner(0);

	let terrain = TriggerHelper.GetMapSizeTerrain();
	let x = Helpers.getRandomInt(0, terrain);
	let z = Helpers.getRandomInt(0, terrain);
	let destroyTime = Helpers.getRandomInt(80, 300)*1000;
	//warn(uneval(`ent: ${ent} | templatename: ${templateName} | terrainsize: ${terrain} |  SpawnPoint x: ${x} | SpawnPoint z: ${z} | LifeTime: ${destroyTime/1000}s`))

	cmpPosition.JumpTo(x, z);
	this.Move(ent);

	let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
    cmpTimer.SetTimeout(SYSTEM_ENTITY, IID_Envoirementals, "DestroyAndQueueNext", destroyTime, {"ent": ent, "template": templateName});

	return ent;
};

Envoirementals.prototype.DestroyAndQueueNext = function(data)
{
	Engine.DestroyEntity(data.ent);
	let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
	let spawnTime = Helpers.getRandomInt(300, 900)*1000;
	//warn("spawnTime: "+spawnTime/1000+"s");
	cmpTimer.SetTimeout(SYSTEM_ENTITY, IID_Envoirementals, "Spawn", spawnTime, data.template);
};

Envoirementals.prototype.Move = function(ent)
{
	let terrain = TriggerHelper.GetMapSizeTerrain();

	let cmpUnitAI = Engine.QueryInterface(ent, IID_UnitAI);
	if (!cmpUnitAI)
		return false

	let x = Helpers.getRandomInt(0, terrain);
	let z = Helpers.getRandomInt(0, terrain);
	let orderDelay = Helpers.getRandomInt(20, 60)*1000;
	//warn(uneval(`MoveTo x: ${x} | MoveTo z: ${z} | OrderDelay: ${orderDelay/1000}s`))

	cmpUnitAI.MoveToPoint(x, z)

	let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
    cmpTimer.SetTimeout(SYSTEM_ENTITY, IID_Envoirementals, "Move", orderDelay, ent);
};


Engine.RegisterSystemComponentType(IID_Envoirementals, "Envoirementals", Envoirementals);
