class CivSelectDropdown
{
	constructor(civData)
	{
		this.handlers = new Set();
		const playerID = Engine.GetPlayerID();
		this.hasViewPermission = Engine.GuiInterfaceCall("HasSpyTech", { "player": playerID }) || Engine.GuiInterfaceCall("GetState", { "player": playerID }) != "active";

		warn(`hasSpyTech = ${ Engine.GuiInterfaceCall("HasSpyTech", { "player": playerID }) } isObserver = ${ Engine.GuiInterfaceCall("GetState", { "player": playerID }) != "active" }`);

		let civList = Object.keys(civData).map(civ => ({
			"name": civData[civ].Name,
			"code": civ,
		})).sort(sortNameIgnoreCase);
		this.civSelectionHeading = Engine.GetGUIObjectByName("civSelectionHeading");
		const defaultcivSelectionHeadingSize = this.civSelectionHeading["size"];
		this.civSelectionHeading.caption = this.hasViewPermission ? this.Caption : translate("Espionage tech (civic center) is required to view other civilizations");
		this.civSelectionHeading["size"] = this.hasViewPermission ? defaultcivSelectionHeadingSize : "0 10 100% 48";

		this.civSelection = Engine.GetGUIObjectByName("civSelection");
		this.civSelection.hidden = !this.hasViewPermission;
		this.civSelection.list = civList.map(c => c.name);
		this.civSelection.list_data = civList.map(c => c.code);
		this.civSelection.onSelectionChange = () => this.onSelectionChange(this);
	}

	onSelectionChange()
	{
		let civCode = this.civSelection.list_data[this.civSelection.selected];

		for (let handler of this.handlers)
			handler(civCode);
	}

	registerHandler(handler)
	{
		this.handlers.add(handler);
	}

	unregisterHandler(handler)
	{
		this.handlers.delete(handler);
	}

	hasCivs()
	{
		return this.civSelection.list.length != 0;
	}

	selectCiv(civCode)
	{
		if (!civCode)
			return;

		let index = this.civSelection.list_data.indexOf(civCode);
		if (index == -1)
			return;

		this.civSelection.selected = index;
	}

	selectFirstCiv()
	{
		this.civSelection.selected = 0;
	}
}

CivSelectDropdown.prototype.Caption =
	translate("Civilization:");