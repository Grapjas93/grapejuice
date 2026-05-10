let grapejuice =  {
		"caption": translate("Grapejuice Info"),
		"tooltip": translate("View the changes that this mod brings to the game."),
		"onPress": () => {
			Engine.OpenChildPage("page_grapejuice.xml");
		}
	};

mainMenuItems.unshift(grapejuice)
