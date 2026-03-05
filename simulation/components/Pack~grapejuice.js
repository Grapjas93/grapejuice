const PACKING_INTERVAL = 250;
Pack.prototype.Init = function()
{
	this.packed = this.template.State == "packed";
	this.packing = false;
	this.elapsedTime = 0;
	this.timer = undefined;

	this.currentAmmo = "";
	this.currentLevel;
};

Pack.prototype.PackProgress = function(data, lateness)
{
	// store current ammo
	let cmpPromotion = QueryMiragedInterface(this.entity, IID_Promotion);
	let cmpAmmo = QueryMiragedInterface(this.entity, IID_Ammo);
	this.currentAmmo = cmpAmmo.ammo;
	this.currentLevel = cmpPromotion.currentLevel;

	if (this.elapsedTime < this.GetPackTime())
	{
		this.SetElapsedTime(this.GetElapsedTime() + PACKING_INTERVAL + lateness);
		return;
	}

	this.CancelTimer();
	this.packed = !this.packed;
	this.packing = false;

	Engine.PostMessage(this.entity, MT_PackFinished, { "packed": this.packed });

	let newEntity = ChangeEntityTemplate(this.entity, this.template.Entity);

	// apply ammo to new entity
	cmpAmmo = QueryMiragedInterface(newEntity, IID_Ammo);
	cmpAmmo.ammo = this.currentAmmo;
	cmpPromotion = QueryMiragedInterface(newEntity, IID_Promotion);
	cmpPromotion.currentLevel = this.currentLevel;
	cmpPromotion.ApplyRankModification(newEntity)

	if (newEntity)
		PlaySound(this.packed ? "packed" : "unpacked", newEntity);

};

Engine.ReRegisterComponentType(IID_Pack, "Pack", Pack);
