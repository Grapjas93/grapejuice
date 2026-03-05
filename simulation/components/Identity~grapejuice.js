// grapejuice, Added champion rank into schema
Identity.prototype.Schema =
	"<a:help>Specifies various names and values associated with the entity, typically for GUI display to users.</a:help>" +
	"<a:example>" +
		"<Civ>athen</Civ>" +
		"<GenericName>Athenian Hoplite</GenericName>" +
		"<SpecificName>Hoplī́tēs Athēnaïkós</SpecificName>" +
		"<Icon>units/athen_infantry_spearman.png</Icon>" +
	"</a:example>" +
	"<element name='Civ' a:help='Civilization that this unit is primarily associated with, typically a 4-letter code. Choices include: gaia (world objects), skirm (skirmish map placeholders), athen (Athenians), brit (Britons), cart (Carthaginians), gaul (Gauls), han (Han Chinese), iber (Iberians), kush (Kushites), mace (Macedonians), maur (Mauryas), pers (Persians), ptol (Ptolemies), rome (Romans), sele (Seleucids), spart (Spartans).'>" +
		"<text/>" +
	"</element>" +
	"<optional>" +
		"<element name='Lang' a:help='Unit language for voices.'>" +
			"<text/>" +
		"</element>" +
	"</optional>" +
	"<optional>" +
		"<element name='Phenotype' a:help='Unit phenotype for voices and visual. If more than one is specified a random one will be chosen.'>" +
			"<attribute name='datatype'>" +
				"<value>tokens</value>" +
			"</attribute>" +
			"<text/>" +
		"</element>" +
	"</optional>" +
	"<element name='GenericName' a:help='Generic English-language name for this entity.'>" +
		"<optional>" +
			"<attribute name='context'>" +
				"<text/>" +
			"</attribute>" +
		"</optional>" +
		"<optional>" +
			"<attribute name='comment'>" +
				"<text/>" +
			"</attribute>" +
		"</optional>" +
		"<text/>" +
	"</element>" +
	"<optional>" +
		"<element name='SpecificName' a:help='Specific native-language name for this entity.'>" +
			"<optional>" +
				"<attribute name='context'>" +
					"<text/>" +
				"</attribute>" +
			"</optional>" +
			"<optional>" +
				"<attribute name='comment'>" +
					"<text/>" +
				"</attribute>" +
			"</optional>" +
			"<text/>" +
		"</element>" +
	"</optional>" +
	"<optional>" +
		"<element name='SelectionGroupName' a:help='Name used to group ranked entities.'>" +
			"<text/>" +
		"</element>" +
	"</optional>" +
	"<optional>" +
		"<element name='Tooltip'>" +
			"<optional>" +
				"<attribute name='context'>" +
					"<text/>" +
				"</attribute>" +
			"</optional>" +
			"<optional>" +
				"<attribute name='comment'>" +
					"<text/>" +
				"</attribute>" +
			"</optional>" +
			"<text/>" +
		"</element>" +
	"</optional>" +
	"<optional>" +
		"<element name='History'>" +
			"<optional>" +
				"<attribute name='context'>" +
					"<text/>" +
				"</attribute>" +
			"</optional>" +
			"<optional>" +
				"<attribute name='comment'>" +
					"<text/>" +
				"</attribute>" +
			"</optional>" +
			"<text/>" +
		"</element>" +
	"</optional>" +
	"<optional>" +
		"<element name='Rank'>" +
			"<optional>" +
				"<attribute name='context'>" +
					"<text/>" +
				"</attribute>" +
			"</optional>" +
			"<optional>" +
				"<attribute name='comment'>" +
					"<text/>" +
				"</attribute>" +
			"</optional>" +
			"<choice>" +
				"<value>Basic</value>" +
				"<value>Advanced</value>" +
				"<value>Elite</value>" +
				"<value>Champion</value>" +
			"</choice>" +
		"</element>" +
	"</optional>" +
	"<optional>" +
		"<element name='Classes' a:help='Optional list of space-separated classes applying to this entity. Choices include: AfricanElephant, AmunGuard, Animal, ApedemakGuard, Ashoka, Barter, Bireme, CitizenSoldier, CivCentre, CivSpecific, ConquestCritical, Domestic, DropsiteFood, DropsiteMetal, DropsiteStone, DropsiteWood, FastMoving, Formation, Foundation, GarrisonFortress, Human, IndianElephant, Juggernaut, KushTrireme, MercenaryCamp, Organic, Player, PtolemyIV, Quinquereme, SeaCreature, Spy, Structure, Trireme, Unit, WallLong, WallMedium, WallShort, WallTower.'>" +
			"<attribute name='datatype'>" +
				"<value>tokens</value>" +
			"</attribute>" +
			"<text/>" +
		"</element>" +
	"</optional>" +
	"<optional>" +
		"<element name='VisibleClasses' a:help='Optional list of space-separated classes applying to this entity. These classes will also be visible in various GUI elements. Choices include: Academy, Amphitheater, Archer, ArmyCamp, ArrowShip, Arsenal, ArtilleryTower, Auxiliary, Axeman, Barracks, BoltShooter, BoltTower, Bribable, Builder, Camel, Cataphract, Cavalry, Centurion, Champion, Chariot, Citizen, City, Civilian, Civic, CivilCentre, Colony, Corral, Council, Crossbowman, Defensive, Dock, Dog, Economic, Elephant, ElephantStable, Embassy, Farmstead, Field, Fireship, FishingBoat, Forge, Fortress, Gate, Gladiator, GreatTower, Gymnasium, Hall, Healer, Heavy, Hero, House, IceHouse, Ignited, Immortal, ImperialCourt, ImperialMinistry, Infantry, Javelineer, Kennel, LaoziGate, Legionary, Library, Lighthouse, Longsword, Maceman, Melee, Market, Mercenary, Military, Minister, Monument, Naval, NavalRam, NavalSiege, Outpost, Palace, Palisade, Pikeman, Pillar, Pirate, Pyramid, Ram, Range, Ranged, Relic, Resource, RotaryMill, ScoutShip, SentryTower, Ship, Shipyard, Shrine, Siege, SiegeTower, SiegeWall, Slave, Slinger, Soldier, Spearman, Stable, Stoa, StoneThrower, StoneTower, Storehouse, Support, Swordsman, Syssiton, Temple, TempleOfAmun, TempleOfApedemak, TempleOfIsis, TempleOfMars, TempleOfVesta, Tent, Theater, Tower, Town, Trade, Trader, TriumphalArch, Trumpeter, Village, Wall, Warship, Wonder, Worker.'>" +
			"<optional>" +
				"<attribute name='context'>" +
					"<text/>" +
				"</attribute>" +
			"</optional>" +
			"<optional>" +
				"<attribute name='comment'>" +
					"<text/>" +
				"</attribute>" +
			"</optional>" +
			"<attribute name='datatype'>" +
				"<value>tokens</value>" +
			"</attribute>" +
			"<text/>" +
		"</element>" +
	"</optional>" +
	"<element name='Icon'>" +
		"<text/>" +
	"</element>" +
	"<optional>" +
		RequirementsHelper.BuildSchema() +
	"</optional>" +
	"<optional>" +
		"<element name='Controllable' a:help='Whether players can control this entity. Defaults to true.'>" +
			"<data type='boolean'/>" +
		"</element>" +
	"</optional>" +
	"<element name='Undeletable' a:help='Prevent players from deleting this entity.'>" +
		"<data type='boolean'/>" +
	"</element>";

const rankName = ["Basic", "Advanced", "Elite", "Champion", "Hero", "Hero I", "Hero II", "Hero III", "Hero IV", "Hero V"]
Identity.prototype.GetRank = function()
{
	let cmpPromotion = Engine.QueryInterface(this.entity, IID_Promotion);
	let rank = cmpPromotion ? rankName[cmpPromotion.currentLevel-1] : undefined

	return rank || this.template.Rank || "";
};

Engine.ReRegisterComponentType(IID_Identity, "Identity", Identity);
