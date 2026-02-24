// insert grapejuice menu button at the top
MenuButtons.prototype.Grapejuice = class
{
	constructor(button, pauseControl)
	{
		this.button = button;
		this.button.style = "Grapejuice";
		this.button.caption = translate("Grapejuice");
		this.pauseControl = pauseControl;
	}

	async onPress()
	{
		closeOpenDialogs();
		this.pauseControl.implicitPause();
		await Engine.OpenChildPage("page_grapejuice.xml");
		resumeGame();
	}
};

const proto = MenuButtons.prototype;

const entries = Object.entries(proto);

for (const key of Object.keys(proto))
	delete proto[key];

proto.Grapejuice = entries.find(([k]) => k === "Grapejuice")[1];

for (const [key, value] of entries)
{
	if (key === "Grapejuice")
		continue;
	proto[key] = value;
}