const rankName = ["Basic", "Advanced", "Elite", "Champion", "Hero", "Hero I", "Hero II", "Hero III", "Hero IV", "Hero V"]
Identity.prototype.GetRank = function()
{
	let cmpPromotion = Engine.QueryInterface(this.entity, IID_Promotion);
	let rank = cmpPromotion ? rankName[cmpPromotion.currentLevel] : undefined

	return rank || this.template.Rank || "";
};

Engine.ReRegisterComponentType(IID_Identity, "Identity", Identity);
