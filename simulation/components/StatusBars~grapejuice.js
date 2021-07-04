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
	if(Helpers.EntityMatchesClassList(this.entity, "Organic Siege ArmyCamp"))
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

// grapejuice, slight alignment and size adjustments
StatusBars.prototype.AddCaptureBar = function(cmpOverlayRenderer, yoffset)
{
	if (!this.enabled)
		return 0;

	let cmpCapturable = QueryMiragedInterface(this.entity, IID_Capturable);
	if (!cmpCapturable)
		return 0;

	let cmpOwnership = QueryMiragedInterface(this.entity, IID_Ownership);
	if (!cmpOwnership)
		return 0;

	let owner = cmpOwnership.GetOwner();
	if (owner == INVALID_PLAYER)
		return 0;

	this.usedPlayerColors = true;
	let capturePoints = cmpCapturable.GetCapturePoints();

	// Size of health bar (in world-space units)
	let width = +this.template.BarWidth;
	let height = +this.template.BarHeight;

	// World-space offset from the unit's position
	let offset = { "x": 0, "y": +this.template.HeightOffset + 0.24, "z": 0 };

	let setCaptureBarPart = function(playerID, startSize)
	{
		let c = QueryPlayerIDInterface(playerID).GetDisplayedColor();
		let strColor = (c.r * 255) + " " + (c.g * 255) + " " + (c.b * 255) + " 255";
		let size = width * capturePoints[playerID] / cmpCapturable.GetMaxCapturePoints();

		cmpOverlayRenderer.AddSprite(
			"art/textures/ui/session/icons/capture_bar.png",
			{ "x": startSize, "y": yoffset },
			{ "x": startSize + size, "y": 0.45 + yoffset },
			offset,
			strColor
		);

		return size + startSize;
	};

	// First handle the owner's points, to keep those points on the left for clarity
	let size = setCaptureBarPart(owner, -width / 2);
	for (let i in capturePoints)
		if (i != owner && capturePoints[i] > 0)
			size = setCaptureBarPart(i, size);

	return height * 1.2;
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
