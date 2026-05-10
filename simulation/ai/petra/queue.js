import { ResourcesManager } from "simulation/ai/common-api/resources.js";
import { aiWarn } from "simulation/ai/common-api/utils.js";
import { ConstructionPlan } from "simulation/ai/petra/queueplanBuilding.js";
import { ResearchPlan } from "simulation/ai/petra/queueplanResearch.js";
import { TrainingPlan } from "simulation/ai/petra/queueplanTraining.js";

/**
 * Holds a list of wanted plans to train or construct
 */
export function Queue()
{
	this.plans = [];
	this.paused = false;
	this.switched = 0;
}

Queue.prototype.empty = function()
{
	this.plans = [];
};

Queue.prototype.addPlan = function(newPlan)
{
	if (!newPlan)
		return;
	for (const plan of this.plans)
	{
		if (newPlan.category === "unit" && plan.type == newPlan.type && plan.number + newPlan.number <= plan.maxMerge)
		{
			plan.addItem(newPlan.number);
			return;
		}
		else if (newPlan.category === "technology" && plan.type === newPlan.type)
			return;
	}
	this.plans.push(newPlan);
};

Queue.prototype.check= function(gameState)
{
	while (this.plans.length > 0)
	{
		if (!this.plans[0].isInvalid(gameState))
			return;
		const plan = this.plans.shift();
		if (plan.queueToReset)
			gameState.ai.queueManager.changePriority(plan.queueToReset, gameState.ai.Config.priorities[plan.queueToReset]);
	}
};

Queue.prototype.getNext = function()
{
	if (this.plans.length > 0)
		return this.plans[0];
	return null;
};

Queue.prototype.startNext = function(gameState)
{
	if (this.plans.length > 0)
	{
		this.plans.shift().start(gameState);
		return true;
	}
	return false;
};

/**
 * returns the maximal account we'll accept for this queue.
 * Currently all the cost of the first element and fraction of that of the second
 */
Queue.prototype.maxAccountWanted = function(gameState, fraction)
{
	const cost = new ResourcesManager();
	if (this.plans.length > 0 && this.plans[0].isGo(gameState))
		cost.add(this.plans[0].getCost());
	if (this.plans.length > 1 && this.plans[1].isGo(gameState) && fraction > 0)
	{
		const costs = this.plans[1].getCost();
		costs.multiply(fraction);
		cost.add(costs);
	}
	return cost;
};

Queue.prototype.queueCost = function()
{
	const cost = new ResourcesManager();
	for (const plan of this.plans)
		cost.add(plan.getCost());
	return cost;
};

Queue.prototype.length = function()
{
	return this.plans.length;
};

Queue.prototype.hasQueuedUnits = function()
{
	return this.plans.length > 0;
};

Queue.prototype.countQueuedUnits = function()
{
	let count = 0;
	for (const plan of this.plans)
		count += plan.number;
	return count;
};

Queue.prototype.hasQueuedUnitsWithClass = function(classe)
{
	return this.plans.some(plan => plan.template && plan.template.hasClass(classe));
};

Queue.prototype.countQueuedUnitsWithClass = function(classe)
{
	let count = 0;
	for (const plan of this.plans)
		if (plan.template && plan.template.hasClass(classe))
			count += plan.number;
	return count;
};

Queue.prototype.countQueuedUnitsWithMetadata = function(data, value)
{
	let count = 0;
	for (const plan of this.plans)
		if (plan.metadata[data] && plan.metadata[data] == value)
			count += plan.number;
	return count;
};

Queue.prototype.Serialize = function()
{
	const plans = [];
	for (const plan of this.plans)
		plans.push(plan.Serialize());

	return { "plans": plans, "paused": this.paused, "switched": this.switched };
};

Queue.prototype.Deserialize = function(gameState, data)
{
	this.paused = data.paused;
	this.switched = data.switched;
	this.plans = [];
	for (const dataPlan of data.plans)
	{
		let plan;
		if (dataPlan.category == "unit")
			plan = new TrainingPlan(gameState, dataPlan.type);
		else if (dataPlan.category == "building")
			plan = new ConstructionPlan(gameState, dataPlan.type);
		else if (dataPlan.category == "technology")
			plan = new ResearchPlan(gameState, dataPlan.type);
		else
		{
			aiWarn("Petra deserialization error: plan unknown " + uneval(dataPlan));
			continue;
		}
		plan.Deserialize(gameState, dataPlan);
		this.plans.push(plan);
	}
};
