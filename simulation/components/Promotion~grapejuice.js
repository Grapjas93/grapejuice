

Promotion.prototype.Init = function()
{
	this.currentLevel = 0;
	if (Helpers.EntityMatchesClassList(this.entity, "Hero"))
		this.currentLevel = 4
	else if (Helpers.EntityMatchesClassList(this.entity, "Champion"))
		this.currentLevel = 3
	else if (Helpers.EntityMatchesClassList(this.entity, "Elite"))
		this.currentLevel = 2
	else if (Helpers.EntityMatchesClassList(this.entity, "Advanced"))
		this.currentLevel = 1
	this.ApplyRankModification(this.entity)
	this.currentXp = 0;
	this.ComputeTrickleRate();
	this.currentAmmo; // grapejuice
};

Promotion.prototype.Promote = function(promotedTemplateName)
{
	// If the unit is dead, don't promote it
	let cmpHealth = Engine.QueryInterface(this.entity, IID_Health);
	if (cmpHealth && cmpHealth.GetHitpoints() == 0)
	{
		this.promotedUnitEntity = INVALID_ENTITY;
		return;
	}

	// allow units to regain some health even though they are max rank / grapejuice
	let cmpTemplateManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_TemplateManager);
	if (this.currentLevel == 9
		|| (Helpers.EntityMatchesClassList(this.entity, "Support Civilian Siege Ship Citizen") && this.currentLevel == 2 && promotedTemplateName == cmpTemplateManager.GetCurrentTemplateName(this.entity))
		|| (Helpers.EntityMatchesClassList(this.entity, "Champion") && this.currentLevel == 3))
	{
		if (Helpers.EntityMatchesClassList(this.entity, "Organic"))
			cmpHealth.Increase(10);
		return;
	}

	let currLvl = this.currentLevel
	// Store ammo before promotion / grapejuice
	let cmpAmmo = Engine.QueryInterface(this.entity, IID_Ammo);
	if (cmpAmmo)
	{
		this.currentAmmo = cmpAmmo.ammo;

		// Save the entity id. / grapejuice
		this.promotedUnitEntity = ChangeEntityTemplate(this.entity, promotedTemplateName);

		// Apply ammo after promotion / grapejuice
		cmpAmmo = Engine.QueryInterface(this.promotedUnitEntity, IID_Ammo);
		cmpAmmo.ammo = this.currentAmmo;

		// Check for new targets if ammo is 0, otherwise unit would perform ranged attacks without ammo / grapejuice
		if (this.currentAmmo == 0)
		{
			let cmpUnitAI = Engine.QueryInterface(this.promotedUnitEntity, IID_UnitAI);
			cmpUnitAI.Stop();
		}
	}
	else
		this.promotedUnitEntity = ChangeEntityTemplate(this.entity, promotedTemplateName);

	let cmpPromotion = Engine.QueryInterface(this.promotedUnitEntity, IID_Promotion);
	cmpPromotion.currentLevel = currLvl+1

	// promoted units regain some health / grapejuice
	cmpHealth = Engine.QueryInterface(this.promotedUnitEntity, IID_Health);
	if (Helpers.EntityMatchesClassList(this.entity, "Organic"))
		cmpHealth.Increase(10);

	Engine.PostMessage(this.promotedUnitEntity, MT_LevelChanged, {});
};


Promotion.prototype.OnLevelChanged = function(msg)
{
	this.ApplyRankModification()
}


Promotion.prototype.ApplyRankModification = function()
{
	let cmpModifiersManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_ModifiersManager);
	let cmpPromotion = Engine.QueryInterface(this.entity, IID_Promotion);

	let multiplier = cmpPromotion.currentLevel / 10

	// give heroes and champions a 20% buff to stats
	let baseMult = Helpers.EntityMatchesClassList(this.entity, "Hero Champion") ? 1.2 : 1

	// ranged units get less melee damage buff
	let isRangedUnit = Helpers.EntityMatchesClassList(this.entity, "Ranged")

	cmpModifiersManager.RemoveAllModifiers("rankup", this.entity);
	cmpModifiersManager.AddModifiers("rankup", {
		"Attack/Capture/Capture": [{ "affects": ["Unit Soldier"], "multiply": baseMult+multiplier }],
		"Attack/Melee/Damage/Hack": [{ "affects": ["Unit Soldier"], "multiply": isRangedUnit ? baseMult+(multiplier/2) : baseMult+multiplier }],
		"Attack/Melee/Damage/Pierce": [{ "affects": ["Unit Soldier"], "multiply": isRangedUnit ? baseMult+(multiplier/2) : baseMult+multiplier}],
		"Attack/Melee/Damage/Crush": [{ "affects": ["Unit Soldier"], "multiply": isRangedUnit ? baseMult+(multiplier/2) : baseMult+multiplier }],
		"Attack/Ranged/Ammo": [{ "affects": ["Unit Elephant"], "multiply": baseMult+multiplier }],
		"Health/Max": [{ "affects": ["Unit"], "multiply": baseMult+multiplier }],
		"Loot/food": [{ "affects": ["Unit"], "multiply": baseMult+multiplier }],
		"Loot/wood": [{ "affects": ["Unit"], "multiply": baseMult+multiplier }],
		"Loot/stone": [{ "affects": ["Unit"], "multiply": baseMult+multiplier }],
		"Loot/metal": [{ "affects": ["Unit"], "multiply": baseMult+multiplier }],
		"Loot/xp": [{ "affects": ["Unit"], "multiply": baseMult+multiplier }],
		"Attack/Ranged/Spread": [{ "affects": ["Unit Ranged"], "multiply": baseMult-(multiplier/2) }],
		"Attack/Ranged/PrepareTime": [{ "affects": ["Unit Ranged"], "multiply": baseMult-(multiplier/2) }],
		"Attack/Ranged/RepeatTime": [{ "affects": ["Unit Ranged"], "multiply": baseMult-(multiplier/2) }],
		"Attack/Melee/PrepareTime": [{ "affects": ["Unit Melee"], "multiply": baseMult-(multiplier/2) }],
		"Attack/Melee/RepeatTime": [{ "affects": ["Unit Melee"], "multiply": baseMult-(multiplier/2) }],
		"ResourceGatherer/BaseSpeed": [{ "affects": ["Unit Civilian"], "multiply": baseMult-(multiplier/2) }],
		"Builder/Rate": [{ "affects": ["Unit Builder"], "replace": baseMult+multiplier }],
	}, this.entity);
};

Promotion.prototype.GetPromotedTemplateName = function()
{
	let cmpTemplateManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_TemplateManager);

	return this.template.Entity || cmpTemplateManager.GetCurrentTemplateName(this.entity);
};

Engine.ReRegisterComponentType(IID_Promotion, "Promotion", Promotion);
