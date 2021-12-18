function init()
{
	let mainText = Engine.GetGUIObjectByName("mainText");
	let text = Engine.TranslateLines(Engine.ReadFile("gui/grapejuice/info.txt"));

	mainText.caption = text;
}
