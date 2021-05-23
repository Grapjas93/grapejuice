const g_NaturalColor = "255 255 255 255"; // pure white

/**
 * For every sprite, the code will call their "Add" method when regenerating
 * the sprites. Every sprite adder should return the height it needs.
 *
 * Modders who need extra sprites can just modify this array, and
 * provide the right methods.
 */
StatusBars.prototype.Sprites = [
	"ExperienceBar",
	"PackBar",
	"UpgradeBar",
	"ResourceSupplyBar",
	"CaptureBar",
	"HealthBar",
	"AuraIcons",
	"RankIcon",
	"WoundedIcon",
	"AmmoBar"
	];

// Grapejuice ammoBar
StatusBars.prototype.AddAmmoBar = function(cmpOverlayRenderer, yoffset)
{
	let cmpHelpers = QueryMiragedInterface(this.entity, IID_Helpers);
	if(Helpers.EntityMatchesClassList(this.entity, "Organic Siege"))
	{
		let cmpAttack = QueryMiragedInterface(this.entity, IID_Attack);
		if (cmpAttack == null)
			return 0;
		if (!this.enabled)
			return 0;
		if(cmpAttack.GetMaxAmmo() == "0")
			return 0;
		if (cmpAttack.GetMaxAmmo() > "0"){
			return this.AddBar(cmpOverlayRenderer, -0.3, "ammo", cmpAttack.ammo / cmpAttack.GetMaxAmmo(), 0.7);
		}
	}

};

// grapejuice wounded state icon
StatusBars.prototype.AddWoundedIcon = function(cmpOverlayRenderer, yoffset)
{
	let cmpHealth = QueryMiragedInterface(this.entity, IID_Health);
			let iconSize = +this.template.BarWidth / 2;
	if (!this.enabled)
		return 0;

	if(Helpers.EntityMatchesClassList(this.entity, "Organic Siege") && cmpHealth != null)
	{
		let currentHp = cmpHealth.GetHitpoints();
		let treshold = cmpHealth.GetMaxHitpoints() / 3; 
		if( currentHp <= treshold  ) {		
			cmpOverlayRenderer.AddSprite(
			"art/textures/ui/session/icons/status_effects/wounded.png",
			{ "x": -iconSize / 2, "y": yoffset },
			{ "x": iconSize / 2, "y": iconSize + yoffset },
			{ "x": 0, "y": +this.template.HeightOffset + 0.4, "z": 0 },
			g_NaturalColor);
			}		
	}


	return iconSize + this.template.BarHeight / 2;
};

Engine.ReRegisterComponentType(IID_StatusBars, "StatusBars", StatusBars);
