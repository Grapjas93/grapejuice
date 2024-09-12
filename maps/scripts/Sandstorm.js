let cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
let spawnTime = Helpers.getRandomInt(300, 900)*1000;
//warn("spawnTime: "+spawnTime/1000+"s");
cmpTimer.SetTimeout(SYSTEM_ENTITY, IID_Envoirementals, "Spawn", spawnTime, "envoirementals/sandstorm");
