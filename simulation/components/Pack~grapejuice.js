const PACKING_INTERVAL = 250;
var currentAmmo = "";
var cmpAttack = "";

Pack.prototype.PackProgress = function(data, lateness)
{
	// store current ammo
	cmpAttack = QueryMiragedInterface(this.entity, IID_Attack);
	currentAmmo = cmpAttack.ammo;

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
	cmpAttack.ammo = currentAmmo;

	if (newEntity)
		PlaySound(this.packed ? "packed" : "unpacked", newEntity);

};

Engine.ReRegisterComponentType(IID_Pack, "Pack", Pack);
