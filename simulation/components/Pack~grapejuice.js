const PACKING_INTERVAL = 250;
Pack.prototype.Init = function()
{
	this.packed = this.template.State == "packed";
	this.packing = false;
	this.elapsedTime = 0;
	this.timer = undefined;

	this.currentAmmo = "";
};

Pack.prototype.PackProgress = function(data, lateness)
{
	// store current ammo
	let cmpAttack = QueryMiragedInterface(this.entity, IID_Attack);
	this.currentAmmo = cmpAttack.ammo;

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
	cmpAttack = QueryMiragedInterface(newEntity, IID_Attack);
	cmpAttack.ammo = this.currentAmmo;

	if (newEntity)
		PlaySound(this.packed ? "packed" : "unpacked", newEntity);

};

Engine.ReRegisterComponentType(IID_Pack, "Pack", Pack);
