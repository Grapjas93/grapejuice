/**
 * When maps start with this prefix, they will not appear in the maplist.
 * Used for the Atlas _default.xml for instance.
 */
MapFilters.prototype.HiddenFilesPrefix = "_";

MapFilters.prototype.Filters = [
	{
		"Name": "grapejuice",
		"Title": translate("Grapejuice"),
		"Description": translate("Grapejuice mod maps"),
		"Match": ["grapejuice"]
	},
	{
		"Name": "default",
		"Title": translate("Default"),
		"Description": translate("All maps except naval and demo maps."),
		"Match": ["!naval !demo !hidden"]
	},
	{
		"Name": "naval",
		"Title": translate("Naval Maps"),
		"Description": translate("Maps where ships are needed to reach the enemy."),
		"Match": ["naval"]
	},
	{
		"Name": "demo",
		"Title": translate("Demo Maps"),
		"Description": translate("These maps are not playable but for demonstration purposes only."),
		"Match": ["demo"]
	},
	{
		"Name": "new",
		"Title": translate("New Maps"),
		"Description": translate("Maps that are brand new in this release of the game."),
		"Match": ["new"]
	},
	{
		"Name": "trigger",
		"Title": translate("Trigger Maps"),
		"Description": translate("Maps that come with scripted events and potentially spawn enemy units."),
		"Match": ["trigger"]
	},
	{
		"Name": "all",
		"Title": translate("All Maps"),
		"Description": translate("Every map of the chosen maptype."),
		"Match": "!"
	}
];
