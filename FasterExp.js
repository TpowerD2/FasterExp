//
//	@filename 	FasterExp.js
//	@athor		dzik, Tpower @ D2GM
//	@version	2021.4.17

//  Fast exp script based on FastExp.js by dzik but heavily modified. 
//  Requires 5 chars minimum but ideally run with 7-8 chars.
//  Chars not specified will help clear chaos, hurt diablo, help clear throne and hurt Baal.
//  Route is seal bosses > xp shrine > kill diablo > leach waves > leach baal > kill nith (nith right after diablo is faster but you often lose XP shrine @ nith).
//  Place this file in the bots folder, put your char names in the variables (case sensitive) and put Scripts.FasterExp = true; in the char configs.
//  To ensure Barb makes it to cata 2 on time he should be d2botlead, rest running d2botfollow.
//  leveler must have diaLead, nithPrep and shrineHunter in quitlist, everryone else must have leveler in quitlist.


var	leveler 		= "", // Char being leveled
	diaLead 		= "", // Diablo lead char (should be hammerdin), opens boss seals, opens TP + summons leveler for seal boss kills, helps prep Daiblo + kills baal
	nithPrep 		= "", // Preps nith, then helps clear throne
	shrineHunter	= "", // Hunts for shrine and tps throne for rest of team
	BOer			= ""; // BO Barb (only runs BoBarbHelper.js)

var	hurtDia 		= 30, // Hurt Diablo to health %
	hurtNith 		= 30, // Hurt Nith to health %
	hurtBaal 		= 10; // Hurt Baal to health %

function FasterExp () {

var	player,
	msgShrineY		= "s yes",
	msgShrineN		= "s no",
	msgNith			= "nith ready",
	msgstartDia		= "Start Diablo",
	msgSeal1 		= "s1",
	msgSeal2 		= "s2",
	msgSeal3 		= "s3",
	msgDia			= "dia up",
	msgGoThrone		= "Throne",
	msgBeforeB		= "town and wait",
	msgBaal			= "baal up",
	shrineWait 		= true,
	goForShrine 	= false,
	readyNith 		= false,
	startDia 		= false,
	canKill1 		= false, 
	canKill2 		= false, 
	canKill3 		= false,
	readyDia 		= false,
	goThrone 		= false,
	readyWaves 		= false,	
	readyBaal		= false;	
	var id="";

this.messenger = function(name, msg) {
	if (msg === msgShrineY) {
		shrineWait = false;
		goForShrine = true;
	}
	if (msg === msgShrineN) {
		shrineWait = false;
	}
	if (msg === msgNith) {
		readyNith = true;	
	}
	if (msg === msgstartDia) {
		startDia = true;	
	}
	if (msg === msgSeal1) {
		canKill1 = true;
		id = getLocaleString(2851);
	}
	if (msg === msgSeal2) {
		canKill2 = true;
		id = getLocaleString(2852);
	}
	if (msg === msgSeal3) {
		canKill3 = true;
		id = getLocaleString(2853);
	}
	if (msg === msgDia) {
		readyDia = true;	
	}
	if (msg === msgGoThrone) {
		goThrone = true;	
	}
	if (msg === msgBeforeB) {
		readyWaves = true;	
	}
	if (msg === msgBaal) {
		readyBaal = true;	
	}
};

addEventListener("chatmsg", this.messenger);

if (me.name == BOer) {
	include("bots/BoBarbHelper.js");
	BoBarbHelper();
}

Town.doChores();
Pather.useWaypoint(35, true); // go to BO area
Pather.moveTo(me.x + 5, me.y + 5, 5, true);
delay(1000);
Precast.doPrecast(true);

	if (me.name == nithPrep) {
		Pather.useWaypoint(123);
		Pather.moveToExit(124, true);
		Pather.moveToPreset(me.area, 2, 462, 10, 10);
		Attack.hurt(526, hurtNith); // Nihlathak
		Town.goToTown();
		say(msgNith);
		Town.doChores();
		Town.move("portalspot");
	}

	if (me.name == shrineHunter) {
		var noShrine = true, i;
		Pather.useWaypoint(4);
			for (i = 4; i > 1; i -= 1) {
				if (Misc.getShrinesInArea(i, 15, false)) {
					if (me.name == shrineHunter) {
						say(msgShrineY);
						noShrine = false;
					}
				break;
				}
			}
			if (i === 1) {
				Town.goToTown();
				Pather.useWaypoint(5);
				for (i = 5; i < 8; i += 1) {
					if (Misc.getShrinesInArea(i, 15, false)) {
						if (me.name == shrineHunter) {
							say(msgShrineY);
							noShrine = false;
							}
						break;
					}
				}
			}
		if (noShrine){
			say(msgShrineN);
		}
		Town.goToTown(5);
		while(!goThrone) delay(100);
		if (me.area != 129) {
			Pather.useWaypoint(129);
		}
		if (!Pather.moveToExit([130, 131], true)) {
			throw new Error("Failed to move to Throne of Destruction.");
		}
		Pather.moveTo(15118, 5045);
		Town.goToTown();
	}		

	if (me.name == leveler) {
		say(msgstartDia);
		Pather.useWaypoint(103);
		Town.move("portalspot");
		while(!canKill1) delay(100);
		if (canKill1 && !canKill2) {
			Pather.usePortal(108, diaLead);
			try { 
				Attack.kill(id); 
			} 	
			catch (e) {
				say("Seal boss 1 not found");
			}
			finally {
				Pickit.pickItems();
				Town.goToTown();
			}
		}
		while(!canKill2) delay(100);
		if (canKill2 && !canKill3) {
			Pather.usePortal(108, diaLead);
			try { 
				Attack.kill(id); 
			} 	
			catch (e) {
				say("Seal boss 2 not found");
			}
			finally {
				Pickit.pickItems();
				Town.goToTown();
			}	
		}
		while(!canKill3) delay(100);	
		if (canKill3 && !readyDia) {
			Pather.usePortal(108, diaLead);
			try { 
				Attack.kill(id); 
			} 	
			catch (e) {
				say("Seal boss 3 not found");
			}
			finally {
				Pickit.pickItems();
				Town.goToTown();
			}	
		}		
		Town.move("waypoint");
		Pather.useWaypoint(4)
		Town.goToTown(1)
		while(shrineWait) delay(100);
		if (goForShrine) {
			while(!Pather.usePortal(null, shrineHunter)) delay(100);
			say(msgGoThrone);
			Misc.getShrinesInArea(me.area, 15, true);
			delay(300);
			Pather.usePortal(null, shrineHunter);
			delay(300);
			Pather.usePortal(null, me.name);
			Pather.useWaypoint(103, true);
			Town.move("portalspot");
		} 
		if (!goForShrine) {
			say(msgGoThrone);
			Pather.usePortal(null, me.name);
			Pather.useWaypoint(103, true);
			Town.move("portalspot");
		}
		while(!readyDia) delay(100);
		Pather.usePortal(108, diaLead);
		try {
			Attack.kill(243); // Diablo
		}
		catch (e) {
			say("Diablo not found");
		}
		finally {
			Pickit.pickItems();
			Town.goToTown(5);
			Town.move("portalspot");
		}
		while (!Pather.usePortal(131, shrineHunter)) delay(100);
		while(!readyWaves) 	Pather.moveTo(15117, 5045);
		Town.goToTown();
		while(!readyBaal) delay(100);
		while (!Pather.usePortal(132, null)) delay(100);
		try {
			Pather.moveTo(15177, 5952); 
			player = Misc.findPlayer(diaLead);
			while (me.area === player.area) delay(100); // Leach Baal
		}
		catch (e) {
			say("Baal not found");
		}
		finally {
			Town.goToTown();
		}
		while(!readyNith) delay(100);
		Pather.usePortal(124, nithPrep);
		try {
			Attack.kill(526); // Nihlathak
		}
		catch (e) {
			say("Nith not found");
		}
		finally {
			Pickit.pickItems();
		}
		return true;
	}

	if (me.name != leveler && me.name != shrineHunter && me.name != nithPrep) {
		this.getLayout = function (seal, value) {
			var sealPreset = getPresetUnit(108, 2, seal);
	
				if (!seal) {
					throw new Error("Seal preset not found");
				}
		
				if (sealPreset.roomy * 5 + sealPreset.y === value || sealPreset.roomx * 5 + sealPreset.x === value) {
					return 1;
				}
		
				return 2;
			};
		
			this.initLayout = function () {
				this.vizLayout = this.getLayout(396, 5275);
				this.seisLayout = this.getLayout(394, 7773);
				this.infLayout = this.getLayout(392, 7893);
			};
		
			this.getBoss = function (name) {
				var i, boss,
					glow = getUnit(2, 131);
		
				for (i = 0; i < 24; i += 1) {
					boss = getUnit(1, name);
		
					if (boss) {
						this.chaosPreattack(name, 8);
		
						try {
							Attack.kill(name);
						} catch (e) {
							Attack.clear(10, 0, name);
						}
		
						Pickit.pickItems();
		
						return true;
					}
		
					delay(250);
				}
		
				return !!glow;
			};
		
			this.chaosPreattack = function (name, amount) {
				var i, n, target, positions;
		
				switch (me.classid) {
				case 0:
					break;
				case 1:
					break;
				case 2:
					break;
				case 3:
					target = getUnit(1, name);
		
					if (!target) {
						return;
					}
		
					positions = [[6, 11], [0, 8], [8, -1], [-9, 2], [0, -11], [8, -8]];
		
					for (i = 0; i < positions.length; i += 1) {
						if (Attack.validSpot(target.x + positions[i][0], target.y + positions[i][1])) { // check if we can move there
							Pather.moveTo(target.x + positions[i][0], target.y + positions[i][1]);
							Skill.setSkill(Config.AttackSkill[2], 0);
		
							for (n = 0; n < amount; n += 1) {
								Skill.cast(Config.AttackSkill[1], 1);
							}
		
							break;
						}
					}
		
					break;
				case 4:
					break;
				case 5:
					break;
				case 6:
					break;
				}
			};
		
		this.diabloPrep = function () {
			var trapCheck,
				tick = getTickCount();
	
			while (getTickCount() - tick < 17500) {
				if (getTickCount() - tick >= 8000) {
					switch (me.classid) {
					case 1: // Sorceress
						if ([56, 59, 64].indexOf(Config.AttackSkill[1]) > -1) {
							if (me.getState(121)) {
								delay(500);
							} else {
								Skill.cast(Config.AttackSkill[1], 0, 7793, 5293);
							}
	
							break;
						}
	
						delay(500);
	
						break;
					case 3: // Paladin
						Skill.setSkill(Config.AttackSkill[2]);
						Skill.cast(Config.AttackSkill[1], 1);
	
						break;
					case 5: // Druid
						if (Config.AttackSkill[1] === 245) {
							Skill.cast(Config.AttackSkill[1], 0, 7793, 5293);
	
							break;
						}
	
						delay(500);
	
						break;
					case 6: // Assassin
						if (Config.UseTraps) {
							trapCheck = ClassAttack.checkTraps({x: 7793, y: 5293});
	
							if (trapCheck) {
								ClassAttack.placeTraps({x: 7793, y: 5293, classid: 243}, trapCheck);
	
								break;
							}
						}
	
						delay(500);

						break;
					default:
						delay(500);
					}
				} else {
					delay(500);
				}
	
				if (getUnit(1, 243)) {
					return true;
				}
			}
		
			throw new Error("Diablo not found");
		};
		
		this.openSeal = function (classid) {
			var i, j, seal;
		
			for (i = 0; i < 5; i += 1) {
				Pather.moveToPreset(108, 2, classid, classid === 394 ? 5 : 2, classid === 394 ? 5 : 0);
	
				if (i > 1) {
					Attack.clear(10);
				}
		
				for (j = 0; j < 3; j += 1) {
					seal = getUnit(2, classid);
	
					if (seal) {
						break;
					}
	
					delay(100);
				}
	
				if (!seal) {
					throw new Error("Seal not found (id " + classid + ")");
				}
	
				if (seal.mode) {
					return true;
				}
	
				if (classid === 394) {
					Misc.click(0, 0, seal);
				} else {
					seal.interact();
				}
	
				delay(classid === 394 ? 1000 : 500);
		
				if (!seal.mode) {
					if (classid === 394 && Attack.validSpot(seal.x + 15, seal.y)) { // de seis optimization
						Pather.moveTo(seal.x + 15, seal.y);
					} else {
						Pather.moveTo(seal.x - 5, seal.y - 5);
					}
	
					delay(500);
				} else {
					return true;
				}
			}
		
			throw new Error("Failed to open seal (id " + classid + ")");
		};
		
		while(!startDia) delay(100);	
		if (me.area != 107) Pather.useWaypoint(107);
		this.initLayout();
		this.openSeal(395);
		
		if (me.name == diaLead) {
		this.openSeal(396);
		}
	
		if (this.vizLayout === 1) {
			Pather.moveTo(7691, 5292);
		} else {
			Pather.moveTo(7695, 5316);
		}
	
		if (me.name == diaLead) {
			Pather.makePortal();
			say(msgSeal1);
		}
	
		while(!this.getBoss(getLocaleString(2851))) delay(100);
	
		if (me.name == diaLead) {
		this.openSeal(394);
		}
		if (this.seisLayout === 1) {
			Pather.moveTo(7771, 5196);
		} else {
			Pather.moveTo(7798, 5186);
		}
		
		if (me.name == diaLead) {
			Pather.makePortal();
			say(msgSeal2);
		}
		
		while(!this.getBoss(getLocaleString(2852))) delay(100);
	
		this.openSeal(392);
	
		if (me.name == diaLead) {
		this.openSeal(393);
		}
	
		if (this.infLayout === 1) {
			delay(1);
		} else {
			Pather.moveTo(7928, 5295); // temp
		}
	
		if (me.name == diaLead) {
			Pather.makePortal();
			say(msgSeal3);
		}
	
		while (!this.getBoss(getLocaleString(2853))) delay(100);
	
		Pather.moveTo(7788, 5292);
		this.diabloPrep();
		say(msgDia);
		Attack.hurt(243, hurtDia); // Diablo
		Town.goToTown(5)
		Town.move("portalspot");
	}

var portal, tick;

this.preattack = function () {
	var check;

	switch (me.classid) {
	case 1: // Sorceress
		switch (Config.AttackSkill[3]) {
		case 49:
		case 53:
		case 56:
		case 59:
		case 64:
			if (me.getState(121)) {
				while (me.getState(121)) {
					delay(100);
				}
			} else {
				return Skill.cast(Config.AttackSkill[1], 0, 15094 + rand(-1, 1), 5028);
			}

			break;
		}

		break;
	case 3: // Paladin
		if (Config.AttackSkill[3] === 112) {
			if (Config.AttackSkill[4] > 0) {
				Skill.setSkill(Config.AttackSkill[4], 0);
			}

			return Skill.cast(Config.AttackSkill[3], 1);
		}

		break;
	case 5: // Druid
		if (Config.AttackSkill[3] === 245) {
			return Skill.cast(Config.AttackSkill[3], 0, 15094 + rand(-1, 1), 5028);
		}

		break;
	case 6: // Assassin
		if (Config.UseTraps) {
			check = ClassAttack.checkTraps({x: 15094, y: 5028});

			if (check) {
				return ClassAttack.placeTraps({x: 15094, y: 5028}, 5);
			}
		}

		if (Config.AttackSkill[3] === 256) { // shock-web
			return Skill.cast(Config.AttackSkill[3], 0, 15094, 5028);
		}

		break;
	}

	return false;
};

this.checkThrone = function () {
	var monster = getUnit(1);

	if (monster) {
		do {
			if (Attack.checkMonster(monster) && monster.y < 5080) {
				switch (monster.classid) {
				case 23:
				case 62:
					return 1;
				case 105:
				case 381:
					return 2;
				case 557:
					return 3;
				case 558:
					return 4;
				case 571:
					return 5;
				default:
					Attack.getIntoPosition(monster, 10, 0x4);
					Attack.clear(15);

					return false;
				}
			}
		} while (monster.getNext());
	}

	return false;
};

this.clearThrone = function () {
	var i, monster,
		monList = [],
		pos = [15094, 5022, 15094, 5041, 15094, 5060, 15094, 5041, 15094, 5022];

	if (Config.AvoidDolls) {
		monster = getUnit(1, 691);

		if (monster) {
			do {
				if (monster.x >= 15072 && monster.x <= 15118 && monster.y >= 5002 && monster.y <= 5079 && Attack.checkMonster(monster) && Attack.skipCheck(monster)) {
					monList.push(copyUnit(monster));
				}
			} while (monster.getNext());
		}

		if (monList.length) {
			Attack.clearList(monList);
		}
	}

	for (i = 0; i < pos.length; i += 2) {
		Pather.moveTo(pos[i], pos[i + 1]);
		Attack.clear(25);
	}
};

this.checkHydra = function () {
	var monster = getUnit(1, "hydra");
	if (monster) {
		do {
			if (monster.mode !== 12 && monster.getStat(172) !== 2) {
				Pather.moveTo(15072, 5002);
				while (monster.mode !== 12) {
					delay(500);
					if (!copyUnit(monster).x) {
						break;
					}
				}

				break;
			}
		} while (monster.getNext());
	}

	return true;
};

this.announce = function () {
	var count, string, souls, dolls,
		monster = getUnit(1);

	if (monster) {
		count = 0;

		do {
			if (Attack.checkMonster(monster) && monster.y < 5094) {
				if (getDistance(me, monster) <= 40) {
					count += 1;
				}

				if (!souls && monster.classid === 641) {
					souls = true;
				}

				if (!dolls && monster.classid === 691) {
					dolls = true;
				}
			}
		} while (monster.getNext());
	}

	if (count > 30) {
		string = "DEADLY!!!" + " " + count + " monster" + (count > 1 ? "s " : " ") + "nearby.";
	} else if (count > 20) {
		string = "Lethal!" + " " + count + " monster" + (count > 1 ? "s " : " ") + "nearby.";
	} else if (count > 10) {
		string = "Dangerous!" + " " + count + " monster" + (count > 1 ? "s " : " ") + "nearby.";
	} else if (count > 0) {
		string = "Warm" + " " + count + " monster" + (count > 1 ? "s " : " ") + "nearby.";
	} else {
		string = "Cool TP. No immediate monsters.";
	}

	if (souls) {
		string += " Souls ";

		if (dolls) {
			string += "and Dolls ";
		}

		string += "in area.";
	} else if (dolls) {
		string += " Dolls in area.";
	}

	say(string);
};

while (!goThrone) delay(100);

while (!Pather.usePortal(131, shrineHunter)) delay(100);

if (me.name == shrineHunter) {
	Pather.makePortal();
}

this.clearThrone();
Pickit.pickItems();
tick = getTickCount();
Pather.moveTo(15094, me.classid === 3 ? 5029 : 5038);
MainLoop:
while (true) {
	if (getDistance(me, 15094, me.classid === 3 ? 5029 : 5038) > 3) {
		Pather.moveTo(15094, me.classid === 3 ? 5029 : 5038);
	}
	
	Pickit.pickItems();

	if (!getUnit(1, 543)) {
		break MainLoop;
	}

	switch (this.checkThrone()) {
	case 1:
		Attack.clear(40);

		tick = getTickCount();

		Precast.doPrecast(true);

		break;
	case 2:
		Attack.clear(40);

		tick = getTickCount();

		break;
	case 4:
		Attack.clear(40);

		tick = getTickCount();

		break;
	case 3:
		Attack.clear(40);
		this.checkHydra();

		tick = getTickCount();

		break;
	case 5:
		Attack.clear(40);

		break MainLoop;
	default:
		if (getTickCount() - tick < 7e3) {
			if (me.getState(2)) {
				Skill.setSkill(109, 0);
			}

			break;
		}

		if (!this.preattack()) {
			delay(100);
		}

		break;
	}

	delay(10);
}

say(msgBeforeB);
Pather.moveTo(15090, 5008);
if (me.name == nithPrep) {
	while (true) delay(1000);
}
delay(5000);
Precast.doPrecast(true);

while (getUnit(1, 543)) {
	delay(500);
}

portal = getUnit(2, 563);

if (portal) {
	Pather.usePortal(null, null, portal);
} else {
	throw new Error("Couldn't find portal.");
}
Pather.moveTo(15134, 5923);
Attack.hurt(544, hurtBaal); // Baal
say(msgBaal);
if (me.name == diaLead) {
	player = Misc.findPlayer(leveler);
	while (me.area !== player.area) delay(100);
	Attack.kill(544); // Baal
}
Town.goToTown();

while(true) delay(1000);

return true;

}