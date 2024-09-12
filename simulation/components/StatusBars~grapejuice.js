const g_NaturalColor = "255 255 255 255"; // pure white

StatusBars.prototype.RemoveAuraSource = function(source, auraName)
{
	let names = this.auraSources.get(source);
	if (!names)  // grapejuice
		return;
	names.splice(names.indexOf(auraName), 1);
	this.RegenerateSprites();
};

/**
 * For every sprite, the code will call their "Add" method when regenerating
 * the sprites. Every sprite adder should return the height it needs.
 *
 * Modders who need extra sprites can just modify this array, and
 * provide the right methods.
 */
StatusBars.prototype.Sprites = [
	"PackBar",
	"UpgradeBar",
	"ResourceSupplyBar",
	"CaptureBar",
	"HealthBar",
	"AmmoBar",
	"EnergyBar",
	"AuraIcons",
	"RankIcon",
	"WoundedIcon"  // grapejuice
	];

// grapejuice ammoBar
StatusBars.prototype.AddEnergyBar = function(cmpOverlayRenderer, yoffset)
{
	let cmpAttack = QueryMiragedInterface(this.entity, IID_Attack);
	if(cmpAttack && cmpAttack.maxEnergy)
	{
		if (!this.enabled)
			return 0;

		if(cmpAttack.wounded == true  || cmpAttack.chargeCooldown != 0)
			return 0;

		return this.AddBar(cmpOverlayRenderer, yoffset, "energy", cmpAttack.energy / cmpAttack.maxEnergy, 2/3);
	}
	return 0;
};

// grapejuice ammoBar
StatusBars.prototype.AddAmmoBar = function(cmpOverlayRenderer, yoffset)
{
	let cmpAttack = QueryMiragedInterface(this.entity, IID_Attack);
	if(cmpAttack && cmpAttack.maxAmmo)
	{
		if (!this.enabled)
			return 0;
		if(cmpAttack.maxAmmo == "0")
			return 0;
		if (cmpAttack.maxAmmo > "0"){
			return this.AddBar(cmpOverlayRenderer, yoffset, "ammo", cmpAttack.ammo / cmpAttack.maxAmmo, 2/3);
		}
	}
	return 0;
};

// grapejuice wounded state icon
StatusBars.prototype.AddWoundedIcon = function(cmpOverlayRenderer, yoffset)
{
	let cmpUnitMotion = QueryMiragedInterface(this.entity, IID_UnitMotion);
	let cmpHealth = QueryMiragedInterface(this.entity, IID_Health);

	if(cmpUnitMotion && cmpHealth != null)
	{
		if (!this.enabled)
			return 0;

		let iconSize = +this.template.BarWidth / 2;
		let currentHp = cmpHealth.GetHitpoints();
		let treshold = cmpHealth.GetMaxHitpoints() / 3;
		if( currentHp <= treshold  )
		{
			cmpOverlayRenderer.AddSprite(
			"art/textures/ui/session/icons/status_effects/wounded.png",
			{ "x": -iconSize / 2, "y": yoffset },
			{ "x": iconSize / 2, "y": iconSize + yoffset },
			{ "x": 0, "y": +this.template.HeightOffset + 0.4, "z": 0 },
			g_NaturalColor);
		}
		return iconSize + this.template.BarHeight / 2;
	}


};

Engine.ReRegisterComponentType(IID_StatusBars, "StatusBars", StatusBars);
