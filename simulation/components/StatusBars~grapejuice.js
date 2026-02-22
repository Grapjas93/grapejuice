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
	"AmmoBar", // grapejuice
	"EnergyBar", // grapejuice
	"AuraIcons",
	"RankIcon",
	];

// grapejuice ammoBar
StatusBars.prototype.AddEnergyBar = function(cmpOverlayRenderer, yoffset)
{
	let cmpEnergy = QueryMiragedInterface(this.entity, IID_Energy);
	if(cmpEnergy && cmpEnergy.maxEnergy)
	{
		if (!this.enabled)
			return 0;
		if(cmpEnergy.maxEnergy == "0")
			return 0;
		if (cmpEnergy.maxEnergy > "0")
			return this.AddBar(cmpOverlayRenderer, yoffset, "energy", cmpEnergy.energy / cmpEnergy.maxEnergy, 2/3);
	}
	return 0;
};

// grapejuice ammoBar
StatusBars.prototype.AddAmmoBar = function(cmpOverlayRenderer, yoffset)
{
	let cmpAmmo = QueryMiragedInterface(this.entity, IID_Ammo);
	if(cmpAmmo && cmpAmmo.maxAmmo)
	{
		if (!this.enabled)
			return 0;
		if(cmpAmmo.maxAmmo == "0")
			return 0;
		if (cmpAmmo.maxAmmo > "0"){
			return this.AddBar(cmpOverlayRenderer, yoffset, "ammo", cmpAmmo.ammo / cmpAmmo.maxAmmo, 2/3);
		}
	}
	return 0;
};

StatusBars.prototype.OnAmmoChanged = function(msg)
{
	if (this.enabled)
		this.RegenerateSprites();
};

StatusBars.prototype.OnEnergyChanged = function(msg)
{
	if (this.enabled)
		this.RegenerateSprites();
};

Engine.ReRegisterComponentType(IID_StatusBars, "StatusBars", StatusBars);
