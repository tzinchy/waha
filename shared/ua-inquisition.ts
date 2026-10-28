// Сгенерировано tools/ua-race.mjs из Ultimate Apocalypse 1.89.2. Не править руками.
export const UA_INQUISITION = {
 "squads": {
  "archivist": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "morale": {
    "max": 150,
    "rate": 8,
    "minTime": 5,
    "minMorale": 75,
    "acc": 1,
    "speed": 1.5
   },
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_archivist",
    "name": "Archivist",
    "icon": "inquisition_icons/archivist_icon",
    "model": "races/inquisition_daemonhunt/troops/archivist",
    "hp": 300,
    "armour": 100,
    "armourType": "infantry_high",
    "regen": 1,
    "speed": 20,
    "sight": 20,
    "cost": 75,
    "power": 0,
    "time": 6,
    "hardpoints": []
   },
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ]
  },
  "bodyguard": {
   "min": 3,
   "max": 6,
   "reinforce": 95,
   "ups": 4,
   "morale": {
    "max": 400,
    "rate": 11,
    "minTime": 5,
    "minMorale": 50,
    "acc": 0.10000000149011612,
    "speed": 1.2000000476837158
   },
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_bodyguard",
    "name": "Bodyguards",
    "icon": "inquisition_icons/bodyguard_icon",
    "model": "races/inquisition_daemonhunt/troops/inquisition_bodyguard",
    "hp": 550,
    "armour": 100,
    "armourType": "commander",
    "regen": 1,
    "speed": 16,
    "sight": 25,
    "cost": 95,
    "power": 15,
    "time": 6,
    "hardpoints": [
     [
      {
       "file": "inquisition_hellgun_bodyguard",
       "name": "- Durability: 4 | Strength: 6.5 | Morale: 6 | Upgrades: 2 | Squad Size: Standard | Movement Speed: Standard | Sight: Standard | Keen Sight: 2m | Ability Strength: 0 | Weapon range: Standard | Capture Points: Yes.",
       "range": 30,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.699999988079071,
       "min": 26,
       "max": 34,
       "pierce": 3,
       "morale": 3,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 10.800000190734863
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_flamer_bodyguard",
       "name": "",
       "range": 20,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 1,
       "min": 24,
       "max": 31,
       "pierce": 1,
       "morale": 20,
       "setup": 0,
       "moveAcc": 0.30000001192092896,
       "melee": false,
       "aoe": 10,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 8.600000381469727,
        "veh": 0,
        "titan": 5,
        "struct": 30,
        "cmd": 22
       },
       "cost": 20,
       "power": 5,
       "time": 0.30000001192092896,
       "icon": "inquisition_icons/upgrade_flamer",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      },
      {
       "file": "inquisition_melta_gun_bodyguard",
       "name": "",
       "range": 36,
       "minRange": 0,
       "reload": 2.5,
       "accuracy": 1,
       "min": 100,
       "max": 200,
       "pierce": 10,
       "morale": 35,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 20,
        "hinf": 12,
        "light": 80,
        "veh": 50,
        "titan": 5,
        "struct": 10,
        "cmd": 15
       },
       "cost": 20,
       "power": 50,
       "time": 2.799999952316284,
       "icon": "inquisition_icons/upgrade_melta_gun",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      },
      {
       "file": "inquisition_plasma_gun_bodyguard",
       "name": "",
       "range": 30,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 0.699999988079071,
       "min": 22,
       "max": 32,
       "pierce": 10,
       "morale": 10,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 75,
        "light": 15,
        "veh": 10,
        "titan": 5,
        "struct": 0,
        "cmd": 17
       },
       "cost": 40,
       "power": 10,
       "time": 3,
       "icon": "inquisition_icons/upgrade_plasma_gun",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      }
     ],
     [
      {
       "file": "inquisition_knife_bodyguard",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 45,
       "max": 55,
       "pierce": 0,
       "morale": 5,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 49,
        "hinf": 39,
        "light": 0,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 15
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ]
  },
  "chaplain": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "morale": {
    "max": 1500,
    "rate": 14,
    "minTime": 5,
    "minMorale": 50,
    "acc": 0.20000000298023224,
    "speed": 1.2000000476837158
   },
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_chaplain",
    "name": "Grey Knight Brotherhood Champion",
    "icon": "inquisition_icons/gk_champion_icon",
    "model": "races/inquisition/troops/grey_knight_codex",
    "hp": 1070,
    "armour": 100,
    "armourType": "commander",
    "regen": 36,
    "speed": 14,
    "sight": 25,
    "cost": 700,
    "power": 240,
    "time": 250,
    "hardpoints": [
     [
      {
       "file": "inquisition_assault_cannon_dreadnought",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 0.20000000298023224,
       "accuracy": 0.800000011920929,
       "min": 18,
       "max": 22,
       "pierce": 0,
       "morale": 4,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 30,
        "veh": 10,
        "titan": 8,
        "struct": 0,
        "cmd": 8.399999618530273
       },
       "cost": 30,
       "power": 70,
       "time": 4,
       "icon": "inquisition_icons/upgrade_assault_cannon",
       "requires": []
      },
      {
       "file": "inquisition_autocannon_twin_dreadnought",
       "name": "",
       "range": 50,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 100,
       "max": 170,
       "pierce": 0,
       "morale": 30,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 1.5,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 50,
        "veh": 25,
        "titan": 8,
        "struct": 10,
        "cmd": 8.399999618530273
       },
       "cost": 60,
       "power": 40,
       "time": 4,
       "icon": "inquisition_icons/upgrade_twin_autocannon_dreadnought",
       "requires": []
      },
      {
       "file": "inquisition_lascannon_twin_dreadnought",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 450,
       "max": 630,
       "pierce": 10,
       "morale": 55,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094,
        "cmd": 15
       },
       "cost": 30,
       "power": 70,
       "time": 4,
       "icon": "inquisition_icons/upgrade_lascannon",
       "requires": []
      }
     ],
     [
      {
       "file": "space_marine_dreadnought_fist",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.75,
       "min": 138,
       "max": 217,
       "pierce": 0,
       "morale": 100,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 47,
        "light": 44,
        "veh": 38,
        "titan": 20,
        "struct": 12.5,
        "cmd": 14.399999618530273
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_incinerator_dreadnought",
       "name": "Incinerator",
       "range": 14,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 1,
       "min": 30,
       "max": 40,
       "pierce": 0,
       "morale": 40,
       "setup": 0,
       "moveAcc": 0.30000001192092896,
       "melee": false,
       "aoe": 14,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20,
        "cmd": 11
       },
       "cost": 60,
       "power": 40,
       "time": 3,
       "icon": "inquisition_icons/upgrade_incinerator",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_grey_knights_teleporter"
     ]
    }
   ]
  },
  "chimera_transport": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 1,
   "cap": 0,
   "support": 2,
   "unit": {
    "id": "inquisition_chimera_transport",
    "name": "Chimera Transport",
    "icon": "inquisition_icons/chimera_transport_icon",
    "model": "races/inquisition_daemonhunt/troops/inquisition_chimera",
    "hp": 2400,
    "armour": 100,
    "armourType": "vehicle_low",
    "regen": 0,
    "speed": 32,
    "sight": 30,
    "cost": 110,
    "power": 110,
    "time": 20,
    "hardpoints": [
     [
      {
       "file": "inquisition_multilaser_chimera",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.5,
       "min": 108,
       "max": 128,
       "pierce": 0,
       "morale": 10.050000190734863,
       "setup": 0,
       "moveAcc": 0.3499999940395355,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 56,
        "hinf": 45,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 18
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_heavy_flamer_chimera_turret",
       "name": "",
       "range": 18,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 1,
       "min": 25,
       "max": 50,
       "pierce": 0,
       "morale": 25,
       "setup": 0,
       "moveAcc": 0.30000001192092896,
       "melee": false,
       "aoe": 14,
       "vs": {
        "inf": 85,
        "hinf": 77,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 10,
        "cmd": 17
       },
       "cost": 40,
       "power": 15,
       "time": 1.7999999523162842,
       "icon": "inquisition_icons/upgrade_heavy_flamer",
       "requires": []
      },
      {
       "file": "inquisition_heavy_bolter_chimera_turret",
       "name": "",
       "range": 35,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.75,
       "min": 40,
       "max": 55,
       "pierce": 5,
       "morale": 17,
       "setup": 0,
       "moveAcc": 0.6000000238418579,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 25,
        "veh": 16,
        "titan": 5.5,
        "struct": 0,
        "cmd": 20
       },
       "cost": 50,
       "power": 25,
       "time": 3,
       "icon": "inquisition_icons/upgrade_heavy_bolter",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hellgun_chimera_l1",
       "name": "- Durability: 4 | Strength: 6.5 | Morale: 6 | Upgrades: 2 | Squad Size: Standard | Movement Speed: Standard | Sight: Standard | Keen Sight: 2m | Ability Strength: 0 | Weapon range: Standard | Capture Points: Yes.",
       "range": 30,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 80,
       "max": 110,
       "pierce": 10,
       "morale": 10,
       "setup": 0,
       "moveAcc": 0.550000011920929,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 10.800000190734863
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hellgun_chimera_l2",
       "name": "- Durability: 4 | Strength: 6.5 | Morale: 6 | Upgrades: 2 | Squad Size: Standard | Movement Speed: Standard | Sight: Standard | Keen Sight: 2m | Ability Strength: 0 | Weapon range: Standard | Capture Points: Yes.",
       "range": 30,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 80,
       "max": 110,
       "pierce": 10,
       "morale": 10,
       "setup": 0,
       "moveAcc": 0.550000011920929,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 10.800000190734863
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hellgun_chimera_l3",
       "name": "- Durability: 4 | Strength: 6.5 | Morale: 6 | Upgrades: 2 | Squad Size: Standard | Movement Speed: Standard | Sight: Standard | Keen Sight: 2m | Ability Strength: 0 | Weapon range: Standard | Capture Points: Yes.",
       "range": 30,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 80,
       "max": 110,
       "pierce": 10,
       "morale": 10,
       "setup": 0,
       "moveAcc": 0.550000011920929,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 10.800000190734863
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hellgun_chimera_r1",
       "name": "- Durability: 4 | Strength: 6.5 | Morale: 6 | Upgrades: 2 | Squad Size: Standard | Movement Speed: Standard | Sight: Standard | Keen Sight: 2m | Ability Strength: 0 | Weapon range: Standard | Capture Points: Yes.",
       "range": 30,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 80,
       "max": 110,
       "pierce": 10,
       "morale": 10,
       "setup": 0,
       "moveAcc": 0.550000011920929,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 10.800000190734863
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hellgun_chimera_r2",
       "name": "- Durability: 4 | Strength: 6.5 | Morale: 6 | Upgrades: 2 | Squad Size: Standard | Movement Speed: Standard | Sight: Standard | Keen Sight: 2m | Ability Strength: 0 | Weapon range: Standard | Capture Points: Yes.",
       "range": 30,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 80,
       "max": 110,
       "pierce": 10,
       "morale": 10,
       "setup": 0,
       "moveAcc": 0.550000011920929,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 10.800000190734863
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hellgun_chimera_r3",
       "name": "- Durability: 4 | Strength: 6.5 | Morale: 6 | Upgrades: 2 | Squad Size: Standard | Movement Speed: Standard | Sight: Standard | Keen Sight: 2m | Ability Strength: 0 | Weapon range: Standard | Capture Points: Yes.",
       "range": 30,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 80,
       "max": 110,
       "pierce": 10,
       "morale": 10,
       "setup": 0,
       "moveAcc": 0.550000011920929,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 10.800000190734863
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_heavy_bolter_chimera_hull",
       "name": "",
       "range": 35,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.699999988079071,
       "min": 35,
       "max": 50,
       "pierce": 5,
       "morale": 10,
       "setup": 0,
       "moveAcc": 0.550000011920929,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 25,
        "veh": 16,
        "titan": 5.5,
        "struct": 0,
        "cmd": 20
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade_heavy_bolter",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_chimera"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_chimera"
     ]
    }
   ]
  },
  "civilian": {
   "min": 1,
   "max": 1,
   "reinforce": 30,
   "ups": 0,
   "morale": {
    "max": 50,
    "rate": 4,
    "minTime": 5,
    "minMorale": 15,
    "acc": 0.10000000149011612,
    "speed": 1.2000000476837158
   },
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_civilian",
    "name": "Worker",
    "icon": "inquisition_icons/idh_civilian_icon",
    "model": "",
    "hp": 70,
    "armour": 10,
    "armourType": "infantry_low",
    "regen": 1,
    "speed": 12,
    "sight": 6,
    "cost": 35,
    "power": 0,
    "time": 65,
    "hardpoints": []
   },
   "req": [
    {
     "t": "local_addon",
     "ids": [
      "inquisition_dedication_workers_addon"
     ]
    }
   ]
  },
  "civilian_ai": {
   "min": 1,
   "max": 1,
   "reinforce": 30,
   "ups": 0,
   "morale": {
    "max": 50,
    "rate": 4,
    "minTime": 5,
    "minMorale": 15,
    "acc": 0.10000000149011612,
    "speed": 1.2000000476837158
   },
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_civilian_ai",
    "name": "Worker",
    "icon": "inquisition_icons/idh_civilian_icon",
    "model": "",
    "hp": 70,
    "armour": 10,
    "armourType": "infantry_low",
    "regen": 1,
    "speed": 12,
    "sight": 6,
    "cost": 35,
    "power": 0,
    "time": 68,
    "hardpoints": []
   },
   "req": []
  },
  "damocles": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 3,
   "unit": {
    "id": "inquisition_damocles",
    "name": "Damocles",
    "icon": "inquisition_icons/damocles_icon",
    "model": "races/inquisition/troops/inquisition_damocles",
    "hp": 2000,
    "armour": 100,
    "armourType": "vehicle_med",
    "regen": 0,
    "speed": 32,
    "sight": 60,
    "cost": 120,
    "power": 255,
    "time": 42,
    "hardpoints": [
     [
      {
       "file": "inquisition_storm_bolter_damocles",
       "name": "",
       "range": 25,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 0.800000011920929,
       "min": 43,
       "max": 51,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0.44999998807907104,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 50,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 20
       },
       "cost": 50,
       "power": 40,
       "time": 0.6000000238418579,
       "icon": "space_marine_icons/upgrade_stormbolter",
       "requires": []
      }
     ],
     [
      {
       "file": "space_marine_dummy_weapon",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0,
       "accuracy": 0.6499999761581421,
       "min": 0,
       "max": 0,
       "pierce": 0,
       "morale": 0.05000000074505806,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0,
        "cmd": 0
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "space_marine_dummy_weapon",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0,
       "accuracy": 0.6499999761581421,
       "min": 0,
       "max": 0,
       "pierce": 0,
       "morale": 0.05000000074505806,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0,
        "cmd": 0
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "space_marine_dummy_weapon",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0,
       "accuracy": 0.6499999761581421,
       "min": 0,
       "max": 0,
       "pierce": 0,
       "morale": 0.05000000074505806,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0,
        "cmd": 0
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_damocles"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_damocles"
     ]
    }
   ]
  },
  "death_cultist": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "morale": {
    "max": 600,
    "rate": 12,
    "minTime": 5,
    "minMorale": 50,
    "acc": 0.20000000298023224,
    "speed": 1.2000000476837158
   },
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_death_cultist",
    "name": "Death Cult Assassin",
    "icon": "inquisition_icons/death_cultist_icon",
    "model": "races/inquisition_daemonhunt/troops/death_cultist",
    "hp": 800,
    "armour": 100,
    "armourType": "infantry_high",
    "regen": 6,
    "speed": 25,
    "sight": 35,
    "cost": 190,
    "power": 50,
    "time": 26,
    "hardpoints": [
     [
      {
       "file": "inquisition_power_sword_cultist",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 160,
       "max": 240,
       "pierce": 0,
       "morale": 50,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 80,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0,
        "cmd": 30
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_death_cultists"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_death_cultists"
     ]
    }
   ]
  },
  "dreadknight_titan": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 1,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_dreadknight_titan",
    "name": "Nemesis Dreadknight",
    "icon": "inquisition_icons/nemesis_dreadknight_icon",
    "model": "races/inquisition/troops/dreadknight",
    "hp": 7500,
    "armour": 101,
    "armourType": "vehicle_high",
    "regen": 0,
    "speed": 24,
    "sight": 70,
    "cost": 620,
    "power": 1500,
    "time": 118,
    "hardpoints": [
     [
      {
       "file": "inquisition_nemesis_weapon_dreadknight",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 2,
       "accuracy": 0.8999999761581421,
       "min": 946,
       "max": 1105,
       "pierce": 4,
       "morale": 176,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 80,
        "light": 23,
        "veh": 13,
        "titan": 40,
        "struct": 13,
        "cmd": 25
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_autocannon_twin_dreadknight",
       "name": "",
       "range": 45,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 0.800000011920929,
       "min": 98,
       "max": 172,
       "pierce": 0,
       "morale": 30,
       "setup": 0,
       "moveAcc": 0.30000001192092896,
       "melee": false,
       "aoe": 4,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 50,
        "veh": 35,
        "titan": 8,
        "struct": 20,
        "cmd": 8.399999618530273
       },
       "cost": 60,
       "power": 40,
       "time": 4,
       "icon": "inquisition_icons/upgrade_twin_autocannon_dreadnought",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_incinerator_dreadknight",
       "name": "Incinerator",
       "range": 30,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 1,
       "min": 87,
       "max": 105,
       "pierce": 0,
       "morale": 45,
       "setup": 0,
       "moveAcc": 0.30000001192092896,
       "melee": false,
       "aoe": 18,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20,
        "cmd": 11
       },
       "cost": 40,
       "power": 20,
       "time": 3,
       "icon": "inquisition_icons/upgrade_incinerator_gk_termie",
       "requires": []
      },
      {
       "file": "inquisition_psycannon_dreadknight",
       "name": "Psycannon",
       "range": 45,
       "minRange": 0,
       "reload": 0.30000001192092896,
       "accuracy": 0.8999999761581421,
       "min": 140,
       "max": 180,
       "pierce": 20,
       "morale": 34,
       "setup": 0,
       "moveAcc": 0.4300000071525574,
       "melee": false,
       "aoe": 3,
       "vs": {
        "inf": 35,
        "hinf": 20,
        "light": 45,
        "veh": 55,
        "titan": 30,
        "struct": 20,
        "cmd": 30
       },
       "cost": 225,
       "power": 225,
       "time": 10,
       "icon": "inquisition_icons/upgrade_psycannon_nemesis",
       "requires": [
        "inquisition_begin_purification"
       ]
      }
     ],
     [
      {
       "file": "inquisition_daemon_hammer_dreadknight",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 2.5,
       "accuracy": 0.6000000238418579,
       "min": 2077,
       "max": 2596,
       "pierce": 10,
       "morale": 433,
       "setup": 2.5,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 80,
        "light": 55,
        "veh": 30,
        "titan": 60,
        "struct": 20,
        "cmd": 40
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_daemon_hammer_dreadknight_mk2",
       "name": "Doom Slayer",
       "range": 0,
       "minRange": 0,
       "reload": 2.5,
       "accuracy": 1,
       "min": 6692,
       "max": 9556,
       "pierce": 20,
       "morale": 1000,
       "setup": 2.5,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 80,
        "light": 55,
        "veh": 30,
        "titan": 60,
        "struct": 20,
        "cmd": 40
       },
       "cost": 660,
       "power": 660,
       "time": 23,
       "icon": "inquisition_icons/upgrade_daemon_hammer",
       "requires": [
        "inquisition_begin_purification"
       ]
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_dreadknight"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_dreadknight"
     ]
    }
   ]
  },
  "dreadnought": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 1,
   "cap": 0,
   "support": 3,
   "unit": {
    "id": "inquisition_dreadnought",
    "name": "Dreadnought",
    "icon": "inquisition_icons/dreadnought_icon",
    "model": "races/inquisition/troops/grey_knights_dreadnought",
    "hp": 4000,
    "armour": 100,
    "armourType": "vehicle_med",
    "regen": 0,
    "speed": 18,
    "sight": 30,
    "cost": 180,
    "power": 290,
    "time": 45,
    "hardpoints": [
     [
      {
       "file": "inquisition_assault_cannon_dreadnought",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 0.20000000298023224,
       "accuracy": 0.800000011920929,
       "min": 18,
       "max": 22,
       "pierce": 0,
       "morale": 4,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 30,
        "veh": 10,
        "titan": 8,
        "struct": 0,
        "cmd": 8.399999618530273
       },
       "cost": 30,
       "power": 70,
       "time": 4,
       "icon": "inquisition_icons/upgrade_assault_cannon",
       "requires": []
      },
      {
       "file": "inquisition_autocannon_twin_dreadnought",
       "name": "",
       "range": 50,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 100,
       "max": 170,
       "pierce": 0,
       "morale": 30,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 1.5,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 50,
        "veh": 25,
        "titan": 8,
        "struct": 10,
        "cmd": 8.399999618530273
       },
       "cost": 60,
       "power": 40,
       "time": 4,
       "icon": "inquisition_icons/upgrade_twin_autocannon_dreadnought",
       "requires": []
      },
      {
       "file": "inquisition_lascannon_twin_dreadnought",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 450,
       "max": 630,
       "pierce": 10,
       "morale": 55,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094,
        "cmd": 15
       },
       "cost": 30,
       "power": 70,
       "time": 4,
       "icon": "inquisition_icons/upgrade_lascannon",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_dreadnought_fist",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.75,
       "min": 138,
       "max": 217,
       "pierce": 0,
       "morale": 100,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 47,
        "light": 44,
        "veh": 38,
        "titan": 20,
        "struct": 12.5,
        "cmd": 14.399999618530273
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_incinerator_dreadnought",
       "name": "Incinerator",
       "range": 14,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 1,
       "min": 30,
       "max": 40,
       "pierce": 0,
       "morale": 40,
       "setup": 0,
       "moveAcc": 0.30000001192092896,
       "melee": false,
       "aoe": 14,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20,
        "cmd": 11
       },
       "cost": 60,
       "power": 40,
       "time": 3,
       "icon": "inquisition_icons/upgrade_incinerator",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_dreadnought"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_dreadnought"
     ]
    }
   ]
  },
  "dreadnought_assault": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 1,
   "cap": 0,
   "support": 4,
   "unit": {
    "id": "inquisition_dreadnought_assault",
    "name": "Purgation Assault Dreadnought",
    "icon": "inquisition_icons/dreadnought_asault_icon",
    "model": "races/inquisition_daemonhunt/troops/id_gk_dreadnought",
    "hp": 4000,
    "armour": 100,
    "armourType": "vehicle_med",
    "regen": 0,
    "speed": 16,
    "sight": 30,
    "cost": 210,
    "power": 300,
    "time": 30,
    "hardpoints": [
     [
      {
       "file": "inquisition_assault_cannon_dreadnought",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 0.20000000298023224,
       "accuracy": 0.800000011920929,
       "min": 18,
       "max": 22,
       "pierce": 0,
       "morale": 4,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 30,
        "veh": 10,
        "titan": 8,
        "struct": 0,
        "cmd": 8.399999618530273
       },
       "cost": 30,
       "power": 70,
       "time": 4,
       "icon": "inquisition_icons/upgrade_assault_cannon",
       "requires": []
      },
      {
       "file": "inquisition_psycannon_dreadnought",
       "name": "Psycannon",
       "range": 35,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.8999999761581421,
       "min": 70,
       "max": 100,
       "pierce": 10,
       "morale": 17,
       "setup": 0,
       "moveAcc": 0.75,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 20,
        "light": 45,
        "veh": 55,
        "titan": 30,
        "struct": 20,
        "cmd": 30
       },
       "cost": 80,
       "power": 50,
       "time": 4,
       "icon": "inquisition_icons/upgrade_psycannon_dreadnought",
       "requires": []
      },
      {
       "file": "inquisition_heavy_bolter_dreadnought",
       "name": "",
       "range": 35,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.800000011920929,
       "min": 45,
       "max": 60,
       "pierce": 5,
       "morale": 15,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 25,
        "veh": 16,
        "titan": 5.5,
        "struct": 0,
        "cmd": 20
       },
       "cost": 30,
       "power": 60,
       "time": 4,
       "icon": "inquisition_icons/upgrade_heavy_bolter",
       "requires": []
      },
      {
       "file": "inquisition_multi_melta_gun_dreadnought",
       "name": "Multi Melta",
       "range": 35,
       "minRange": 0,
       "reload": 2.5,
       "accuracy": 1,
       "min": 300,
       "max": 400,
       "pierce": 0,
       "morale": 55,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 20,
        "hinf": 12,
        "light": 88,
        "veh": 53,
        "titan": 5,
        "struct": 25,
        "cmd": 15
       },
       "cost": 45,
       "power": 200,
       "time": 4.400000095367432,
       "icon": "inquisition_icons/upgrade_multi_melta",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_power_sword_dreadnought",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 250,
       "max": 330,
       "pierce": 10,
       "morale": 100,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 55,
        "hinf": 60,
        "light": 54,
        "veh": 48,
        "titan": 55,
        "struct": 25,
        "cmd": 45
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_incinerator_dreadnought",
       "name": "Incinerator",
       "range": 14,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 1,
       "min": 30,
       "max": 40,
       "pierce": 0,
       "morale": 40,
       "setup": 0,
       "moveAcc": 0.30000001192092896,
       "melee": false,
       "aoe": 14,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20,
        "cmd": 11
       },
       "cost": 60,
       "power": 40,
       "time": 3,
       "icon": "inquisition_icons/upgrade_incinerator",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_dummy_weapon",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0,
       "accuracy": 0.6499999761581421,
       "min": 0,
       "max": 0,
       "pierce": 0,
       "morale": 0.05000000074505806,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 0,
        "struct": 0,
        "cmd": 0
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_dreadnoughts"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_dreadnoughts"
     ]
    }
   ]
  },
  "dreadnought_support": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 1,
   "cap": 0,
   "support": 4,
   "unit": {
    "id": "inquisition_dreadnought_support",
    "name": "Purgation Hellfire Dreadnought",
    "icon": "inquisition_icons/dreadnought_support_icon",
    "model": "races/inquisition_daemonhunt/troops/id_gk_dreadnought",
    "hp": 3500,
    "armour": 100,
    "armourType": "vehicle_med",
    "regen": 0,
    "speed": 16,
    "sight": 40,
    "cost": 130,
    "power": 280,
    "time": 45,
    "hardpoints": [
     [
      {
       "file": "inquisition_assault_cannon_dreadnought",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 0.20000000298023224,
       "accuracy": 0.800000011920929,
       "min": 18,
       "max": 22,
       "pierce": 0,
       "morale": 4,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 30,
        "veh": 10,
        "titan": 8,
        "struct": 0,
        "cmd": 8.399999618530273
       },
       "cost": 30,
       "power": 70,
       "time": 4,
       "icon": "inquisition_icons/upgrade_assault_cannon",
       "requires": []
      },
      {
       "file": "inquisition_autocannon_twin_dreadnought",
       "name": "",
       "range": 50,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 100,
       "max": 170,
       "pierce": 0,
       "morale": 30,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 1.5,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 50,
        "veh": 25,
        "titan": 8,
        "struct": 10,
        "cmd": 8.399999618530273
       },
       "cost": 60,
       "power": 40,
       "time": 4,
       "icon": "inquisition_icons/upgrade_twin_autocannon_dreadnought",
       "requires": []
      },
      {
       "file": "inquisition_lascannon_twin_dreadnought",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 450,
       "max": 630,
       "pierce": 10,
       "morale": 55,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094,
        "cmd": 15
       },
       "cost": 30,
       "power": 70,
       "time": 4,
       "icon": "inquisition_icons/upgrade_lascannon",
       "requires": []
      },
      {
       "file": "inquisition_heavy_plasma_gun_dreadnought",
       "name": "",
       "range": 35,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 300,
       "max": 400,
       "pierce": 10,
       "morale": 30,
       "setup": 1,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 5,
       "vs": {
        "inf": 80,
        "hinf": 75,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 17
       },
       "cost": 70,
       "power": 80,
       "time": 6,
       "icon": "inquisition_icons/upgrade_heavy_plasma_gun",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_missile_launcher_dreadnought",
       "name": "",
       "range": 45,
       "minRange": 0,
       "reload": 3,
       "accuracy": 0.800000011920929,
       "min": 330,
       "max": 400,
       "pierce": 0,
       "morale": 50,
       "setup": 0,
       "moveAcc": 0.699999988079071,
       "melee": false,
       "aoe": 4,
       "vs": {
        "inf": 25,
        "hinf": 25,
        "light": 60,
        "veh": 50,
        "titan": 10,
        "struct": 14,
        "cmd": 12
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inqusition_icons/upgrade_missile_launcher",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_incinerator_dreadnought",
       "name": "Incinerator",
       "range": 14,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 1,
       "min": 30,
       "max": 40,
       "pierce": 0,
       "morale": 40,
       "setup": 0,
       "moveAcc": 0.30000001192092896,
       "melee": false,
       "aoe": 14,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20,
        "cmd": 11
       },
       "cost": 60,
       "power": 40,
       "time": 3,
       "icon": "inquisition_icons/upgrade_incinerator",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_incinerator_melee",
       "name": "Land Raider Crusader",
       "range": 0,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 0.6499999761581421,
       "min": 30,
       "max": 40,
       "pierce": 0,
       "morale": 40,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 14,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20,
        "cmd": 11
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade_incinerator",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_dreadnoughts"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_dreadnoughts"
     ]
    }
   ]
  },
  "dreadnought_venerable": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 1,
   "cap": 0,
   "support": 5,
   "unit": {
    "id": "inquisition_dreadnought_venerable",
    "name": "Venerable Dreadnought",
    "icon": "inquisition_icons/dreadnought_venerable_icon",
    "model": "races/inquisition/troops/grey_knight_ven_dread",
    "hp": 8000,
    "armour": 104,
    "armourType": "vehicle_med",
    "regen": 0.10000000149011612,
    "speed": 26,
    "sight": 30,
    "cost": 280,
    "power": 500,
    "time": 100,
    "hardpoints": [
     [
      {
       "file": "inquisition_autocannon_twin_dreadnought",
       "name": "",
       "range": 50,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 100,
       "max": 170,
       "pierce": 0,
       "morale": 30,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 1.5,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 50,
        "veh": 25,
        "titan": 8,
        "struct": 10,
        "cmd": 8.399999618530273
       },
       "cost": 60,
       "power": 40,
       "time": 4,
       "icon": "inquisition_icons/upgrade_twin_autocannon_dreadnought",
       "requires": []
      },
      {
       "file": "inquisition_lascannon_twin_dreadnought",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 450,
       "max": 630,
       "pierce": 10,
       "morale": 55,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094,
        "cmd": 15
       },
       "cost": 30,
       "power": 70,
       "time": 4,
       "icon": "inquisition_icons/upgrade_lascannon",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_dreadnought_fist_improved",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0.75,
       "accuracy": 0.8500000238418579,
       "min": 481,
       "max": 604,
       "pierce": 0,
       "morale": 125,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 47,
        "light": 44,
        "veh": 38,
        "titan": 20,
        "struct": 12.5,
        "cmd": 20
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_assault_cannon_venerable",
       "name": "",
       "range": 30,
       "minRange": 0,
       "reload": 0.20000000298023224,
       "accuracy": 0.6499999761581421,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 6,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 30,
        "veh": 10,
        "titan": 8,
        "struct": 0,
        "cmd": 8.399999618530273
       },
       "cost": 30,
       "power": 70,
       "time": 4,
       "icon": "space_marine_icons/upgrade_dreadnought_assault_cannon",
       "requires": []
      }
     ],
     [
      {
       "file": "space_marine_dummy_weapon",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0,
       "accuracy": 0.6499999761581421,
       "min": 0,
       "max": 0,
       "pierce": 0,
       "morale": 0.05000000074505806,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0,
        "cmd": 0
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_ultimate_forces"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_dreadnoughts"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_dreadnoughts"
     ]
    }
   ]
  },
  "ds_turret": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 1,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_ds_turret",
    "name": "",
    "icon": "inquisition_icons/IDH_turret_icon",
    "model": "races/imperial_turrs/structures/dehun_turret_heavy_bolter",
    "hp": 1000,
    "armour": 100,
    "armourType": "building_low",
    "regen": 0,
    "speed": 0,
    "sight": 20,
    "cost": 120,
    "power": 60,
    "time": 17,
    "hardpoints": [
     [
      {
       "file": "inquisition_heavy_bolter_turret",
       "name": "",
       "range": 35,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.800000011920929,
       "min": 58,
       "max": 70,
       "pierce": 0,
       "morale": 14,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 10,
        "veh": 5,
        "titan": 5.5,
        "struct": 0,
        "cmd": 20
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_missile_turret",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 2,
       "accuracy": 0.800000011920929,
       "min": 430,
       "max": 654,
       "pierce": 0,
       "morale": 50,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 3,
       "vs": {
        "inf": 25,
        "hinf": 25,
        "light": 60,
        "veh": 50,
        "titan": 10,
        "struct": 14,
        "cmd": 12
       },
       "cost": 25,
       "power": 90,
       "time": 15,
       "icon": "guard_Icons\\guard_missile_turret",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_turret"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_turret"
     ]
    }
   ]
  },
  "grenaider_troops": {
   "min": 4,
   "max": 8,
   "reinforce": 45,
   "ups": 2,
   "morale": {
    "max": 350,
    "rate": 10,
    "minTime": 5,
    "minMorale": 30,
    "acc": 0.10000000149011612,
    "speed": 1.2000000476837158
   },
   "cap": 3,
   "support": 0,
   "unit": {
    "id": "inquisition_grenaider_troops",
    "name": "Grenaiders",
    "icon": "inquisition_icons/grenaiders_icon",
    "model": "races/inquisition_daemonhunt/troops/inquisition_shocktroop",
    "hp": 400,
    "armour": 100,
    "armourType": "infantry_med",
    "regen": 1,
    "speed": 16,
    "sight": 25,
    "cost": 40,
    "power": 10,
    "time": 6,
    "hardpoints": [
     [
      {
       "file": "inquisition_grenade_launcher_shock_troops",
       "name": "",
       "range": 40,
       "minRange": 6,
       "reload": 3,
       "accuracy": 0.699999988079071,
       "min": 79,
       "max": 106,
       "pierce": 0,
       "morale": 12,
       "setup": 1,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 4,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 10,
        "veh": 0,
        "titan": 20,
        "struct": 7,
        "cmd": 9.600000381469727
       },
       "cost": 25,
       "power": 10,
       "time": 4,
       "icon": "inquisition_icons/upgrade_grenade_launcher",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      },
      {
       "file": "inquisition_grenade_launcher_stun",
       "name": "",
       "range": 45,
       "minRange": 15,
       "reload": 3,
       "accuracy": 0.699999988079071,
       "min": 0,
       "max": 0,
       "pierce": 0,
       "morale": 70,
       "setup": 1,
       "moveAcc": 1,
       "melee": false,
       "aoe": 13,
       "vs": {
        "inf": 75,
        "hinf": 100,
        "light": 50,
        "veh": 50,
        "titan": 25,
        "struct": 25,
        "cmd": 100
       },
       "cost": 30,
       "power": 15,
       "time": 5,
       "icon": "inquisition_icons/upgrade_grenade_launcher_stun",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      },
      {
       "file": "inquisition_grenade_launcher_incendiary",
       "name": "",
       "range": 40,
       "minRange": 15,
       "reload": 3,
       "accuracy": 0.699999988079071,
       "min": 83,
       "max": 106,
       "pierce": 0,
       "morale": 12,
       "setup": 1,
       "moveAcc": 1,
       "melee": false,
       "aoe": 5,
       "vs": {
        "inf": 85,
        "hinf": 50,
        "light": 10,
        "veh": 0,
        "titan": 20,
        "struct": 7,
        "cmd": 9.600000381469727
       },
       "cost": 20,
       "power": 10,
       "time": 2.799999952316284,
       "icon": "inquisition_icons/upgrade_grenade_launcher_incendiary",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      }
     ],
     [
      {
       "file": "inquisition_knife_shock_troops",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 25,
       "max": 30,
       "pierce": 0,
       "morale": 5,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 49,
        "hinf": 39,
        "light": 0,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 15
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_grenaiders"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_grenaiders"
     ]
    }
   ]
  },
  "grey_knight_champion": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "morale": {
    "max": 2000,
    "rate": 14,
    "minTime": 5,
    "minMorale": 50,
    "acc": 0.20000000298023224,
    "speed": 1.2000000476837158
   },
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_grey_knight_champion",
    "name": "Grey Knight Brotherhood Champion",
    "icon": "inquisition_icons/gk_champion_icon",
    "model": "races/space_marines/troops/gknight_champion",
    "hp": 1070,
    "armour": 100,
    "armourType": "commander",
    "regen": 36,
    "speed": 14,
    "sight": 25,
    "cost": 300,
    "power": 80,
    "time": 32,
    "hardpoints": [
     [
      {
       "file": "inquisition_bolt_pistol_inquisitor_lord",
       "name": "",
       "range": 25,
       "minRange": 0,
       "reload": 0.800000011920929,
       "accuracy": 0.8999999761581421,
       "min": 20,
       "max": 25,
       "pierce": 3,
       "morale": 4,
       "setup": 0,
       "moveAcc": 0.3499999940395355,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 62,
        "hinf": 53,
        "light": 7.599999904632568,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 24
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_daemon_hammer_champion",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1.5,
       "accuracy": 1,
       "min": 646,
       "max": 724,
       "pierce": 10,
       "morale": 40,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 80,
        "light": 55,
        "veh": 30,
        "titan": 60,
        "struct": 20,
        "cmd": 40
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand_complex",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand_complex",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand_complex",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "space_marine_dummy_weapon",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0,
       "accuracy": 0.6499999761581421,
       "min": 0,
       "max": 0,
       "pierce": 0,
       "morale": 0.05000000074505806,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0,
        "cmd": 0
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_grey_knights_teleporter"
     ]
    }
   ]
  },
  "grey_knight_hero": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "morale": {
    "max": 2000,
    "rate": 20,
    "minTime": 10,
    "minMorale": 150,
    "acc": 0.20000000298023224,
    "speed": 1.2000000476837158
   },
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_grey_knight_hero",
    "name": "The Grand Master",
    "icon": "inquisition_icons/grey_knight_hero_icon",
    "model": "races/inquisition_daemonhunt/troops/grey_knight_hero",
    "hp": 10000,
    "armour": 107,
    "armourType": "commander",
    "regen": 250,
    "speed": 16,
    "sight": 60,
    "cost": 16000,
    "power": 6000,
    "time": 300,
    "hardpoints": [
     [
      {
       "file": "inquisition_storm_bolter_gk_hero",
       "name": "",
       "range": 25,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 0.75,
       "min": 60,
       "max": 80,
       "pierce": 3,
       "morale": 4,
       "setup": 0,
       "moveAcc": 0.30000001192092896,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 50,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 20
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_nemesis_weapon_gk_hero",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 1,
       "min": 850,
       "max": 1110,
       "pierce": 10,
       "morale": 100,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 80,
        "light": 23,
        "veh": 13,
        "titan": 40,
        "struct": 13,
        "cmd": 25
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand_complex",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand_complex",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand_complex",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "space_marine_dummy_weapon",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0,
       "accuracy": 0.6499999761581421,
       "min": 0,
       "max": 0,
       "pierce": 0,
       "morale": 0.05000000074505806,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0,
        "cmd": 0
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_hammerhand_complex",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_absolute_purification"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_shrine_to_the_emperor"
     ]
    },
    {
     "t": "required_ownership",
     "ids": [
      "relic_struct"
     ]
    }
   ]
  },
  "grey_knights": {
   "min": 2,
   "max": 5,
   "reinforce": 130,
   "ups": 2,
   "morale": {
    "max": 1400,
    "rate": 20,
    "minTime": 5,
    "minMorale": 50,
    "acc": 0.10000000149011612,
    "speed": 1.2000000476837158
   },
   "cap": 2,
   "support": 0,
   "unit": {
    "id": "inquisition_grey_knights",
    "name": "Grey Knights Strike Team",
    "icon": "inquisition_icons/grey_knight_icon",
    "model": "races/inquisition_daemonhunt/troops/id_grey_knight",
    "hp": 2200,
    "armour": 102,
    "armourType": "infantry_heavy_med",
    "regen": 3.5,
    "speed": 16,
    "sight": 25,
    "cost": 130,
    "power": 10,
    "time": 11,
    "hardpoints": [
     [
      {
       "file": "inquisition_storm_bolter_grey_knight_t1",
       "name": "",
       "range": 25,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 0.800000011920929,
       "min": 35,
       "max": 45,
       "pierce": 3,
       "morale": 5,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 50,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 20
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_incinerator_grey_knight",
       "name": "Incinerator",
       "range": 20,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 1,
       "min": 35,
       "max": 50,
       "pierce": 0,
       "morale": 29,
       "setup": 2,
       "moveAcc": 1,
       "melee": false,
       "aoe": 20,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20,
        "cmd": 11
       },
       "cost": 40,
       "power": 20,
       "time": 3,
       "icon": "inquisition_icons/upgrade_incinerator_gk",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      },
      {
       "file": "inquisition_psycannon_grey_knight",
       "name": "Psycannon",
       "range": 40,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.800000011920929,
       "min": 50,
       "max": 65,
       "pierce": 10,
       "morale": 15,
       "setup": 2,
       "moveAcc": 1,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 20,
        "light": 45,
        "veh": 55,
        "titan": 30,
        "struct": 20,
        "cmd": 30
       },
       "cost": 20,
       "power": 50,
       "time": 2.4000000953674316,
       "icon": "inquisition_icons/upgrade_psycannon_gk",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      }
     ],
     [
      {
       "file": "inquisition_halberd_grey_knight",
       "name": "Falchions",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 1,
       "min": 56,
       "max": 70,
       "pierce": 15,
       "morale": 12,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 50,
        "light": 50,
        "veh": 20,
        "titan": 10,
        "struct": 20,
        "cmd": 30
       },
       "cost": 60,
       "power": 30,
       "time": 4.800000190734863,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "space_marine_dummy_weapon",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0,
       "accuracy": 0.6499999761581421,
       "min": 0,
       "max": 0,
       "pierce": 0,
       "morale": 0.05000000074505806,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0,
        "cmd": 0
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_grey_knights_teleporter"
     ]
    }
   ]
  },
  "grey_knights_astra": {
   "min": 2,
   "max": 5,
   "reinforce": 130,
   "ups": 2,
   "morale": {
    "max": 1400,
    "rate": 20,
    "minTime": 5,
    "minMorale": 50,
    "acc": 0.10000000149011612,
    "speed": 1.2000000476837158
   },
   "cap": 2,
   "support": 0,
   "unit": {
    "id": "inquisition_grey_knights_astra",
    "name": "Grey Knights Strike Team",
    "icon": "inquisition_icons/grey_knight_icon",
    "model": "races/inquisition_daemonhunt/troops/id_grey_knight",
    "hp": 2200,
    "armour": 102,
    "armourType": "infantry_heavy_med",
    "regen": 3.5,
    "speed": 16,
    "sight": 25,
    "cost": 130,
    "power": 10,
    "time": 11,
    "hardpoints": [
     [
      {
       "file": "inquisition_storm_bolter_grey_knight_t1",
       "name": "",
       "range": 25,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 0.800000011920929,
       "min": 35,
       "max": 45,
       "pierce": 3,
       "morale": 5,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 50,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 20
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_incinerator_grey_knight",
       "name": "Incinerator",
       "range": 20,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 1,
       "min": 35,
       "max": 50,
       "pierce": 0,
       "morale": 29,
       "setup": 2,
       "moveAcc": 1,
       "melee": false,
       "aoe": 20,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20,
        "cmd": 11
       },
       "cost": 40,
       "power": 20,
       "time": 3,
       "icon": "inquisition_icons/upgrade_incinerator_gk",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      },
      {
       "file": "inquisition_psycannon_grey_knight",
       "name": "Psycannon",
       "range": 40,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.800000011920929,
       "min": 50,
       "max": 65,
       "pierce": 10,
       "morale": 15,
       "setup": 2,
       "moveAcc": 1,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 20,
        "light": 45,
        "veh": 55,
        "titan": 30,
        "struct": 20,
        "cmd": 30
       },
       "cost": 20,
       "power": 50,
       "time": 2.4000000953674316,
       "icon": "inquisition_icons/upgrade_psycannon_gk",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      }
     ],
     [
      {
       "file": "inquisition_halberd_grey_knight",
       "name": "Falchions",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 1,
       "min": 56,
       "max": 70,
       "pierce": 15,
       "morale": 12,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 50,
        "light": 50,
        "veh": 20,
        "titan": 10,
        "struct": 20,
        "cmd": 30
       },
       "cost": 60,
       "power": 30,
       "time": 4.800000190734863,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "space_marine_dummy_weapon",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0,
       "accuracy": 0.6499999761581421,
       "min": 0,
       "max": 0,
       "pierce": 0,
       "morale": 0.05000000074505806,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0,
        "cmd": 0
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_grey_knight"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_grey_knight"
     ]
    }
   ]
  },
  "grey_knights_interceptor": {
   "min": 2,
   "max": 5,
   "reinforce": 140,
   "ups": 4,
   "morale": {
    "max": 1400,
    "rate": 20,
    "minTime": 5,
    "minMorale": 50,
    "acc": 0.10000000149011612,
    "speed": 1.2000000476837158
   },
   "cap": 3,
   "support": 0,
   "unit": {
    "id": "inquisition_grey_knights_interceptor",
    "name": "Grey Knight Interceptors",
    "icon": "inquisition_icons/grey_knight_interceptor_icon",
    "model": "races/inquisition/troops/grey_knight_codex",
    "hp": 2550,
    "armour": 102,
    "armourType": "infantry_heavy_med",
    "regen": 3.5,
    "speed": 16,
    "sight": 25,
    "cost": 140,
    "power": 15,
    "time": 13,
    "hardpoints": [
     [
      {
       "file": "inquisition_storm_bolter_grey_knight",
       "name": "",
       "range": 25,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 0.800000011920929,
       "min": 40,
       "max": 55,
       "pierce": 3,
       "morale": 5,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 50,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 20
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_halberd_grey_knight_interceptor",
       "name": "Falchions",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 1,
       "min": 70,
       "max": 100,
       "pierce": 15,
       "morale": 12,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 50,
        "light": 50,
        "veh": 20,
        "titan": 10,
        "struct": 20,
        "cmd": 30
       },
       "cost": 60,
       "power": 30,
       "time": 4.800000190734863,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_nemesis_weapon_grey_knight",
       "name": "Nemesis Force Sword",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.8999999761581421,
       "min": 85,
       "max": 108,
       "pierce": 1,
       "morale": 25,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 80,
        "light": 23,
        "veh": 13,
        "titan": 40,
        "struct": 13,
        "cmd": 25
       },
       "cost": 30,
       "power": 50,
       "time": 0.800000011920929,
       "icon": "inquisition_icons/upgrade",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      },
      {
       "file": "inquisition_nemesis_weapon_falchions",
       "name": "Dual Falchion Force Swords",
       "range": 0,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 0.7900000214576721,
       "min": 50,
       "max": 70,
       "pierce": 1,
       "morale": 7,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 45,
        "light": 23,
        "veh": 13,
        "titan": 20,
        "struct": 13,
        "cmd": 23
       },
       "cost": 100,
       "power": 50,
       "time": 0.800000011920929,
       "icon": "inquisition_icons/upgrade_falchions",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      },
      {
       "file": "inquisition_daemon_hammer_grey_knight",
       "name": "Daemon Hammer",
       "range": 0,
       "minRange": 0,
       "reload": 1.5,
       "accuracy": 0.8999999761581421,
       "min": 300,
       "max": 400,
       "pierce": 3,
       "morale": 50,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 80,
        "light": 55,
        "veh": 30,
        "titan": 60,
        "struct": 20,
        "cmd": 40
       },
       "cost": 100,
       "power": 130,
       "time": 3,
       "icon": "inquisition_icons/upgrade_daemon_hammer",
       "requires": [
        "inquisition_tower_addon",
        "inquisition_ultimate_forces",
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      }
     ],
     [
      {
       "file": "space_marine_dummy_weapon",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0,
       "accuracy": 0.6499999761581421,
       "min": 0,
       "max": 0,
       "pierce": 0,
       "morale": 0.05000000074505806,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0,
        "cmd": 0
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "space_marine_dummy_weapon",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0,
       "accuracy": 0.6499999761581421,
       "min": 0,
       "max": 0,
       "pierce": 0,
       "morale": 0.05000000074505806,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0,
        "cmd": 0
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_grey_knight_interceptor"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_grey_knight_interceptor"
     ]
    }
   ]
  },
  "grey_knights_purgator": {
   "min": 2,
   "max": 5,
   "reinforce": 140,
   "ups": 5,
   "morale": {
    "max": 1400,
    "rate": 20,
    "minTime": 5,
    "minMorale": 50,
    "acc": 0.10000000149011612,
    "speed": 1.2000000476837158
   },
   "cap": 3,
   "support": 0,
   "unit": {
    "id": "inquisition_grey_knights_purgator",
    "name": "Grey Knight Purgators",
    "icon": "inquisition_icons/grey_knight_purgator_icon",
    "model": "races/inquisition/troops/grey_knight_codex",
    "hp": 2200,
    "armour": 102,
    "armourType": "infantry_heavy_med",
    "regen": 3.5,
    "speed": 16,
    "sight": 25,
    "cost": 140,
    "power": 15,
    "time": 13,
    "hardpoints": [
     [
      {
       "file": "inquisition_psycannon_grey_knight",
       "name": "Psycannon",
       "range": 40,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.800000011920929,
       "min": 50,
       "max": 65,
       "pierce": 10,
       "morale": 15,
       "setup": 2,
       "moveAcc": 1,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 20,
        "light": 45,
        "veh": 55,
        "titan": 30,
        "struct": 20,
        "cmd": 30
       },
       "cost": 20,
       "power": 50,
       "time": 2.4000000953674316,
       "icon": "inquisition_icons/upgrade_psycannon_gk",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      },
      {
       "file": "inquisition_incinerator_grey_knight",
       "name": "Incinerator",
       "range": 20,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 1,
       "min": 35,
       "max": 50,
       "pierce": 0,
       "morale": 29,
       "setup": 2,
       "moveAcc": 1,
       "melee": false,
       "aoe": 20,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20,
        "cmd": 11
       },
       "cost": 40,
       "power": 20,
       "time": 3,
       "icon": "inquisition_icons/upgrade_incinerator_gk",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      }
     ],
     [
      {
       "file": "inquisition_knife_grey_knight",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 28,
       "max": 34,
       "pierce": 0,
       "morale": 4,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 49,
        "hinf": 39,
        "light": 0,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 15
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "space_marine_dummy_weapon",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0,
       "accuracy": 0.6499999761581421,
       "min": 0,
       "max": 0,
       "pierce": 0,
       "morale": 0.05000000074505806,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0,
        "cmd": 0
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_grey_knight_purgator"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_grey_knight_purgator"
     ]
    }
   ]
  },
  "grey_knights_purifier": {
   "min": 2,
   "max": 5,
   "reinforce": 160,
   "ups": 0,
   "morale": {
    "max": 1400,
    "rate": 20,
    "minTime": 5,
    "minMorale": 50,
    "acc": 0.10000000149011612,
    "speed": 1.2000000476837158
   },
   "cap": 3,
   "support": 0,
   "unit": {
    "id": "inquisition_grey_knights_purifier",
    "name": "Grey Knight Purifiers",
    "icon": "inquisition_icons/grey_knight_purifier_icon",
    "model": "races/inquisition/troops/grey_knight_psyker",
    "hp": 2200,
    "armour": 102,
    "armourType": "infantry_heavy_med",
    "regen": 4,
    "speed": 16,
    "sight": 25,
    "cost": 160,
    "power": 40,
    "time": 11,
    "hardpoints": [
     [
      {
       "file": "inquisition_storm_bolter_grey_knight",
       "name": "",
       "range": 25,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 0.800000011920929,
       "min": 40,
       "max": 55,
       "pierce": 3,
       "morale": 5,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 50,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 20
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_staff_psyker",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.699999988079071,
       "min": 45,
       "max": 80,
       "pierce": 0,
       "morale": 5,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 82,
        "light": 10,
        "veh": 0,
        "titan": 48,
        "struct": 0,
        "cmd": 45
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "space_marine_dummy_weapon",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0,
       "accuracy": 0.6499999761581421,
       "min": 0,
       "max": 0,
       "pierce": 0,
       "morale": 0.05000000074505806,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0,
        "cmd": 0
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_grey_knight_purifier"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_grey_knight_purifier"
     ]
    }
   ]
  },
  "grey_knights_terminator": {
   "min": 2,
   "max": 5,
   "reinforce": 280,
   "ups": 2,
   "cap": 6,
   "support": 0,
   "unit": {
    "id": "inquisition_grey_knights_terminator",
    "name": "Grey Knight Terminators",
    "icon": "inquisition_icons/gk_terminator_icon",
    "model": "races/inquisition_daemonhunt/troops/grey_knight_terminator",
    "hp": 3500,
    "armour": 103,
    "armourType": "infantry_heavy_high",
    "regen": 3,
    "speed": 16,
    "sight": 30,
    "cost": 280,
    "power": 80,
    "time": 27,
    "hardpoints": [
     [
      {
       "file": "inquisition_storm_bolter_gk_terminator",
       "name": "",
       "range": 25,
       "minRange": 6,
       "reload": 0.5,
       "accuracy": 0.800000011920929,
       "min": 45,
       "max": 70,
       "pierce": 3,
       "morale": 7,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 50,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 20
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_incinerator_gk_terminator",
       "name": "Incinerator",
       "range": 20,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 1,
       "min": 50,
       "max": 68,
       "pierce": 0,
       "morale": 29,
       "setup": 0,
       "moveAcc": 0.30000001192092896,
       "melee": false,
       "aoe": 20,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20,
        "cmd": 11
       },
       "cost": 40,
       "power": 20,
       "time": 3,
       "icon": "inquisition_icons/upgrade_incinerator_gk_termie",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      },
      {
       "file": "inquisition_psycannon_gk_terminator",
       "name": "Psycannon",
       "range": 40,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.8500000238418579,
       "min": 60,
       "max": 76,
       "pierce": 10,
       "morale": 17,
       "setup": 0,
       "moveAcc": 0.550000011920929,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 20,
        "light": 45,
        "veh": 55,
        "titan": 30,
        "struct": 20,
        "cmd": 30
       },
       "cost": 50,
       "power": 20,
       "time": 2.4000000953674316,
       "icon": "inquisition_icons/upgrade_psycannon_gk_termie",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      }
     ],
     [
      {
       "file": "inquisition_nemesis_weapon_gk_terminator",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 140,
       "max": 190,
       "pierce": 8,
       "morale": 24,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 80,
        "light": 23,
        "veh": 13,
        "titan": 40,
        "struct": 13,
        "cmd": 25
       },
       "cost": 50,
       "power": 25,
       "time": 0.800000011920929,
       "icon": "inquisition_icons/upgrade",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "space_marine_dummy_weapon",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0,
       "accuracy": 0.6499999761581421,
       "min": 0,
       "max": 0,
       "pierce": 0,
       "morale": 0.05000000074505806,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0,
        "cmd": 0
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_grey_knight_terminator"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_grey_knight_terminator"
     ]
    }
   ]
  },
  "grey_knights_terminator_paladin": {
   "min": 2,
   "max": 3,
   "reinforce": 500,
   "ups": 3,
   "cap": 9,
   "support": 0,
   "unit": {
    "id": "inquisition_grey_knights_terminator_paladin",
    "name": "Grey Knight Paladins",
    "icon": "inquisition_icons/grey_knight_terminator_paladin_icon",
    "model": "races/inquisition/troops/grey_knight_terminator_codex",
    "hp": 4500,
    "armour": 104,
    "armourType": "infantry_heavy_high",
    "regen": 4,
    "speed": 12,
    "sight": 30,
    "cost": 500,
    "power": 120,
    "time": 70,
    "hardpoints": [
     [
      {
       "file": "inquisition_storm_bolter_gk_terminator",
       "name": "",
       "range": 25,
       "minRange": 6,
       "reload": 0.5,
       "accuracy": 0.800000011920929,
       "min": 45,
       "max": 70,
       "pierce": 3,
       "morale": 7,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 50,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 20
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_incinerator_gk_terminator",
       "name": "Incinerator",
       "range": 20,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 1,
       "min": 50,
       "max": 68,
       "pierce": 0,
       "morale": 29,
       "setup": 0,
       "moveAcc": 0.30000001192092896,
       "melee": false,
       "aoe": 20,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20,
        "cmd": 11
       },
       "cost": 40,
       "power": 20,
       "time": 3,
       "icon": "inquisition_icons/upgrade_incinerator_gk_termie",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      },
      {
       "file": "inquisition_psycannon_gk_terminator",
       "name": "Psycannon",
       "range": 40,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.8500000238418579,
       "min": 60,
       "max": 76,
       "pierce": 10,
       "morale": 17,
       "setup": 0,
       "moveAcc": 0.550000011920929,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 20,
        "light": 45,
        "veh": 55,
        "titan": 30,
        "struct": 20,
        "cmd": 30
       },
       "cost": 50,
       "power": 20,
       "time": 2.4000000953674316,
       "icon": "inquisition_icons/upgrade_psycannon_gk_termie",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      }
     ],
     [
      {
       "file": "inquisition_nemesis_weapon_gk_terminator",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 140,
       "max": 190,
       "pierce": 8,
       "morale": 24,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 80,
        "light": 23,
        "veh": 13,
        "titan": 40,
        "struct": 13,
        "cmd": 25
       },
       "cost": 50,
       "power": 25,
       "time": 0.800000011920929,
       "icon": "inquisition_icons/upgrade",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      },
      {
       "file": "inquisition_daemon_hammer_grey_knight_terminator",
       "name": "Daemon Hammer",
       "range": 0,
       "minRange": 0,
       "reload": 1.5,
       "accuracy": 1,
       "min": 789,
       "max": 1000,
       "pierce": 3,
       "morale": 100,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 80,
        "light": 55,
        "veh": 30,
        "titan": 60,
        "struct": 20,
        "cmd": 40
       },
       "cost": 250,
       "power": 90,
       "time": 3,
       "icon": "inquisition_icons/upgrade_daemon_hammer",
       "requires": [
        "inquisition_tower_mechanicum",
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hammerhand",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_grey_knight_terminator_paladin"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_grey_knight_terminator_paladin"
     ]
    }
   ]
  },
  "imperator_titan": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 6,
   "morale": {
    "max": 19000,
    "rate": 16,
    "minTime": 5,
    "minMorale": 100,
    "acc": 1,
    "speed": 1
   },
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_imperator_titan.rgd",
    "name": "Imperator Titan",
    "icon": "titan_icons\\imperator_icon",
    "model": "races/imperators/troops/ig_imperator",
    "hp": 200000,
    "armour": 105,
    "armourType": "titan",
    "regen": 10,
    "speed": 9,
    "sight": 250,
    "cost": 21000,
    "power": 40000,
    "time": 300,
    "hardpoints": [
     [
      {
       "file": "titan_imperator_volcano_cannon",
       "name": "",
       "range": 250,
       "minRange": 20,
       "reload": 15,
       "accuracy": 1,
       "min": 12000,
       "max": 18000,
       "pierce": 0,
       "morale": 9999,
       "setup": 20,
       "moveAcc": 1,
       "melee": false,
       "aoe": 40,
       "vs": {
        "inf": 150,
        "hinf": 150,
        "light": 150,
        "veh": 150,
        "titan": 50,
        "struct": 15,
        "cmd": 150
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "Guard_Icons/npc_titan_target_weapon",
       "requires": []
      }
     ],
     [
      {
       "file": "titan_imperator_megalaser",
       "name": "Plasma Blast Gun",
       "range": 250,
       "minRange": 20,
       "reload": 1,
       "accuracy": 1,
       "min": 4500,
       "max": 6000,
       "pierce": 15,
       "morale": 1800,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 10,
       "vs": {
        "inf": 20,
        "hinf": 25,
        "light": 100.66699981689453,
        "veh": 90,
        "titan": 50,
        "struct": 30,
        "cmd": 60
       },
       "cost": 125,
       "power": 200,
       "time": 15,
       "icon": "npc/titan_plasma_blastgun_icon",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_absolute_purification"
     ]
    }
   ]
  },
  "inquisitor_lord": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "morale": {
    "max": 350,
    "rate": 12,
    "minTime": 10,
    "minMorale": 150,
    "acc": 0.20000000298023224,
    "speed": 1.2000000476837158
   },
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_inquisitor_lord",
    "name": "Inquisitor Lord",
    "icon": "inquisition_icons/inquisitor_lord_icon",
    "model": "races/inquisition_daemonhunt/troops/inquisitor_lord",
    "hp": 940,
    "armour": 100,
    "armourType": "commander",
    "regen": 31,
    "speed": 16,
    "sight": 50,
    "cost": 245,
    "power": 40,
    "time": 45,
    "hardpoints": [
     [
      {
       "file": "inquisition_bolt_pistol_inquisitor_lord",
       "name": "",
       "range": 25,
       "minRange": 0,
       "reload": 0.800000011920929,
       "accuracy": 0.8999999761581421,
       "min": 20,
       "max": 25,
       "pierce": 3,
       "morale": 4,
       "setup": 0,
       "moveAcc": 0.3499999940395355,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 62,
        "hinf": 53,
        "light": 7.599999904632568,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 24
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_plasma_pistol_inquisitor_lord",
       "name": "",
       "range": 25,
       "minRange": 0,
       "reload": 1,
       "accuracy": 1,
       "min": 40,
       "max": 55,
       "pierce": 10,
       "morale": 10,
       "setup": 0,
       "moveAcc": 0.3499999940395355,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 75,
        "light": 15,
        "veh": 10,
        "titan": 5,
        "struct": 0,
        "cmd": 17
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade_plasma_gun",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_power_sword_inquisitor",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1.5,
       "accuracy": 0.800000011920929,
       "min": 198,
       "max": 248,
       "pierce": 0,
       "morale": 5,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 61.72200012207031,
        "hinf": 45.400001525878906,
        "light": 35.63600158691406,
        "veh": 25,
        "titan": 30,
        "struct": 10.666999816894531,
        "cmd": 30
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_thunder_hammer_daemonkiller",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1.5,
       "accuracy": 1,
       "min": 504,
       "max": 588,
       "pierce": 10,
       "morale": 48,
       "setup": 1,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 75,
        "veh": 60,
        "titan": 125,
        "struct": 15,
        "cmd": 40
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "space_marine_dummy_weapon",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0,
       "accuracy": 0.6499999761581421,
       "min": 0,
       "max": 0,
       "pierce": 0,
       "morale": 0.05000000074505806,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0,
        "cmd": 0
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_hammerhand_complex",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 20,
       "max": 40,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ]
  },
  "inquisitor_ordo_malleus": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "morale": {
    "max": 600,
    "rate": 12,
    "minTime": 10,
    "minMorale": 150,
    "acc": 0.20000000298023224,
    "speed": 1.2000000476837158
   },
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_inquisitor_ordo_malleus",
    "name": "Ordo Malleus Supreme Lord",
    "icon": "inquisition_icons/inquisitor_toth_icon",
    "model": "",
    "hp": 940,
    "armour": 100,
    "armourType": "commander",
    "regen": 31,
    "speed": 16,
    "sight": 45,
    "cost": 320,
    "power": 60,
    "time": 65,
    "hardpoints": [
     [
      {
       "file": "inquisition_plasma_pistol_inquisitor_lord",
       "name": "",
       "range": 25,
       "minRange": 0,
       "reload": 1,
       "accuracy": 1,
       "min": 40,
       "max": 55,
       "pierce": 10,
       "morale": 10,
       "setup": 0,
       "moveAcc": 0.3499999940395355,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 75,
        "light": 15,
        "veh": 10,
        "titan": 5,
        "struct": 0,
        "cmd": 17
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade_plasma_gun",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_power_sword_inquisitor",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1.5,
       "accuracy": 0.800000011920929,
       "min": 198,
       "max": 248,
       "pierce": 0,
       "morale": 5,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 61.72200012207031,
        "hinf": 45.400001525878906,
        "light": 35.63600158691406,
        "veh": 25,
        "titan": 30,
        "struct": 10.666999816894531,
        "cmd": 30
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_thunder_hammer_daemonkiller",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1.5,
       "accuracy": 1,
       "min": 504,
       "max": 588,
       "pierce": 10,
       "morale": 48,
       "setup": 1,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 75,
        "veh": 60,
        "titan": 125,
        "struct": 15,
        "cmd": 40
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_astra_telepathica"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ]
  },
  "land_raider": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_land_raider",
    "name": "Land Raider Phobos",
    "icon": "inquisition_icons/land_raider_phobos_icon",
    "model": "races/inquisition/troops/land_raidgk_codex",
    "hp": 8500,
    "armour": 100,
    "armourType": "vehicle_high",
    "regen": 0,
    "speed": 24,
    "sight": 30,
    "cost": 350,
    "power": 900,
    "time": 124,
    "hardpoints": [
     [
      {
       "file": "inquisition_heavy_bolter_twin_landraider",
       "name": "",
       "range": 35,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.8999999761581421,
       "min": 116,
       "max": 216.8000030517578,
       "pierce": 5,
       "morale": 12,
       "setup": 0,
       "moveAcc": 0.75,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 25,
        "veh": 16,
        "titan": 5.5,
        "struct": 0,
        "cmd": 20
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade_heavy_bolter",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_lascannon_twin_landraider_left",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 1400,
       "max": 1850,
       "pierce": 10,
       "morale": 50,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094,
        "cmd": 15
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade_lascannon",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_lascannon_twin_landraider_right",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 1400,
       "max": 1850,
       "pierce": 10,
       "morale": 50,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094,
        "cmd": 15
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade_lascannon",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_dummy_weapon",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0,
       "accuracy": 0.6499999761581421,
       "min": 0,
       "max": 0,
       "pierce": 0,
       "morale": 0.05000000074505806,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 0,
        "struct": 0,
        "cmd": 0
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_land_raiders"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_land_raiders"
     ]
    }
   ]
  },
  "land_raider_crusader": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_land_raider_crusader",
    "name": "Land Raider Crusader",
    "icon": "inquisition_icons/land_raider_crusader_icon",
    "model": "races/inquisition/troops/land_raidgk_crusader",
    "hp": 8500,
    "armour": 100,
    "armourType": "vehicle_high",
    "regen": 0,
    "speed": 24,
    "sight": 30,
    "cost": 350,
    "power": 900,
    "time": 124,
    "hardpoints": [
     [
      {
       "file": "inquisition_assault_cannon_twin_crusader",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 0.20000000298023224,
       "accuracy": 0.800000011920929,
       "min": 50,
       "max": 65,
       "pierce": 0,
       "morale": 6,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 30,
        "veh": 10,
        "titan": 8,
        "struct": 0,
        "cmd": 8.399999618530273
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inqusition_icons/upgrade_vehicle_assault_cannon",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hurricane_bolter_crusader_right",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.8500000238418579,
       "min": 130,
       "max": 160,
       "pierce": 5,
       "morale": 25,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 70,
        "light": 35,
        "veh": 25,
        "titan": 50,
        "struct": 25,
        "cmd": 30
       },
       "cost": 60,
       "power": 20,
       "time": 4.400000095367432,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hurricane_bolter_crusader_left",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.8500000238418579,
       "min": 130,
       "max": 160,
       "pierce": 5,
       "morale": 25,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 70,
        "light": 35,
        "veh": 25,
        "titan": 50,
        "struct": 25,
        "cmd": 30
       },
       "cost": 60,
       "power": 20,
       "time": 4.400000095367432,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_multi_melta_crusader",
       "name": "",
       "range": 30,
       "minRange": 0,
       "reload": 2.5,
       "accuracy": 0.8999999761581421,
       "min": 450,
       "max": 600,
       "pierce": 20,
       "morale": 36,
       "setup": 0,
       "moveAcc": 0.75,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 20,
        "hinf": 12,
        "light": 88,
        "veh": 53,
        "titan": 5,
        "struct": 25,
        "cmd": 15
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade_multi_melta",
       "requires": []
      },
      {
       "file": "space_marine_multi_melta_crusader",
       "name": "",
       "range": 30,
       "minRange": 0,
       "reload": 4,
       "accuracy": 0.6499999761581421,
       "min": 220,
       "max": 340,
       "pierce": 10,
       "morale": 50,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 40,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 75,
        "struct": 25,
        "cmd": 15
       },
       "cost": 45,
       "power": 15,
       "time": 2.4000000953674316,
       "icon": "space_marine_icons/upgrade_melta_gun",
       "requires": []
      }
     ],
     [
      {
       "file": "chaos_dummy_weapon",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0,
       "accuracy": 0.6499999761581421,
       "min": 0,
       "max": 0,
       "pierce": 0,
       "morale": 0,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0,
        "cmd": 0
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "guard_dummy_weapon",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0,
       "accuracy": 0.6499999761581421,
       "min": 0,
       "max": 0,
       "pierce": 0,
       "morale": 0.05000000074505806,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0,
        "cmd": 0
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_land_raiders"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_land_raiders"
     ]
    }
   ]
  },
  "land_raider_daemonhunter": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_land_raider_daemonhunter",
    "name": "Land Raider Daemon Hunter",
    "icon": "inquisition_icons/inquisition_crusader_icon",
    "model": "races/inquisition_daemonhunt/troops/id_crusader",
    "hp": 9000,
    "armour": 102,
    "armourType": "vehicle_high",
    "regen": 0,
    "speed": 24,
    "sight": 50,
    "cost": 520,
    "power": 1500,
    "time": 170,
    "hardpoints": [
     [
      {
       "file": "inquisition_assault_cannon_twin_crusader",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 0.20000000298023224,
       "accuracy": 0.800000011920929,
       "min": 50,
       "max": 65,
       "pierce": 0,
       "morale": 6,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 30,
        "veh": 10,
        "titan": 8,
        "struct": 0,
        "cmd": 8.399999618530273
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inqusition_icons/upgrade_vehicle_assault_cannon",
       "requires": []
      },
      {
       "file": "inquisition_heavy_bolter_twin_landraider",
       "name": "",
       "range": 35,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.8999999761581421,
       "min": 116,
       "max": 216.8000030517578,
       "pierce": 5,
       "morale": 12,
       "setup": 0,
       "moveAcc": 0.75,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 25,
        "veh": 16,
        "titan": 5.5,
        "struct": 0,
        "cmd": 20
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade_heavy_bolter",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hurricane_bolter_crusader_right",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.8500000238418579,
       "min": 130,
       "max": 160,
       "pierce": 5,
       "morale": 25,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 70,
        "light": 35,
        "veh": 25,
        "titan": 50,
        "struct": 25,
        "cmd": 30
       },
       "cost": 60,
       "power": 20,
       "time": 4.400000095367432,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_lascannon_twin_landraider_right",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 1400,
       "max": 1850,
       "pierce": 10,
       "morale": 50,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094,
        "cmd": 15
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade_lascannon",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_lascannon_twin_landraider_right",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 1400,
       "max": 1850,
       "pierce": 10,
       "morale": 50,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094,
        "cmd": 15
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade_lascannon",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hurricane_bolter_crusader_left",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.8500000238418579,
       "min": 130,
       "max": 160,
       "pierce": 5,
       "morale": 25,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 70,
        "light": 35,
        "veh": 25,
        "titan": 50,
        "struct": 25,
        "cmd": 30
       },
       "cost": 60,
       "power": 20,
       "time": 4.400000095367432,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_lascannon_twin_landraider_left",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 1400,
       "max": 1850,
       "pierce": 10,
       "morale": 50,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094,
        "cmd": 15
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade_lascannon",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_lascannon_twin_landraider_left",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 1400,
       "max": 1850,
       "pierce": 10,
       "morale": 50,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094,
        "cmd": 15
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade_lascannon",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_multi_melta_daemonhunter",
       "name": "",
       "range": 30,
       "minRange": 0,
       "reload": 2.5,
       "accuracy": 0.8999999761581421,
       "min": 1000,
       "max": 1400,
       "pierce": 20,
       "morale": 36,
       "setup": 0,
       "moveAcc": 0.75,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 20,
        "hinf": 12,
        "light": 88,
        "veh": 53,
        "titan": 5,
        "struct": 25,
        "cmd": 15
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade_multi_melta",
       "requires": []
      },
      {
       "file": "inquisition_dummy_weapon",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0,
       "accuracy": 0.6499999761581421,
       "min": 0,
       "max": 0,
       "pierce": 0,
       "morale": 0.05000000074505806,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 0,
        "struct": 0,
        "cmd": 0
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "required_ownership",
     "ids": [
      "relic_struct"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_land_raider_special"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_land_raider_special"
     ]
    }
   ]
  },
  "land_raider_redeemer": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_land_raider_redeemer",
    "name": "Land Raider Redeemer",
    "icon": "inquisition_icons/land_raider_redeemer_icon",
    "model": "races/inquisition/troops/land_raidgk_redeemer",
    "hp": 8500,
    "armour": 100,
    "armourType": "vehicle_high",
    "regen": 0,
    "speed": 24,
    "sight": 30,
    "cost": 350,
    "power": 900,
    "time": 124,
    "hardpoints": [
     [
      {
       "file": "inquisition_assault_cannon_redeemer",
       "name": "",
       "range": 30,
       "minRange": 0,
       "reload": 0.20000000298023224,
       "accuracy": 0.75,
       "min": 70,
       "max": 95,
       "pierce": 5,
       "morale": 8,
       "setup": 0,
       "moveAcc": 0.44999998807907104,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 30,
        "veh": 10,
        "titan": 8,
        "struct": 0,
        "cmd": 8.399999618530273
       },
       "cost": 30,
       "power": 70,
       "time": 4,
       "icon": "space_marine_icons/upgrade_dreadnought_assault_cannon",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_flamestorm_cannon_right",
       "name": "",
       "range": 25,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 1,
       "min": 120,
       "max": 180,
       "pierce": 0,
       "morale": 30,
       "setup": 0,
       "moveAcc": 0.30000001192092896,
       "melee": false,
       "aoe": 6,
       "vs": {
        "inf": 85,
        "hinf": 77,
        "light": 25,
        "veh": 15,
        "titan": 60,
        "struct": 50,
        "cmd": 12
       },
       "cost": 70,
       "power": 40,
       "time": 3,
       "icon": "space_marine_icons/upgrade_terminator_heavy_flamer",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_flamestorm_cannon_left",
       "name": "",
       "range": 25,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 1,
       "min": 120,
       "max": 180,
       "pierce": 0,
       "morale": 30,
       "setup": 0,
       "moveAcc": 0.30000001192092896,
       "melee": false,
       "aoe": 6,
       "vs": {
        "inf": 85,
        "hinf": 77,
        "light": 25,
        "veh": 15,
        "titan": 60,
        "struct": 50,
        "cmd": 12
       },
       "cost": 70,
       "power": 40,
       "time": 3,
       "icon": "space_marine_icons/upgrade_terminator_heavy_flamer",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_heavy_bolter_land_raider",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 0.8500000238418579,
       "min": 140,
       "max": 180,
       "pierce": 5,
       "morale": 18,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 25,
        "veh": 16,
        "titan": 5.5,
        "struct": 0,
        "cmd": 20
       },
       "cost": 45,
       "power": 15,
       "time": 2,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_land_raiders"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_land_raiders"
     ]
    }
   ]
  },
  "predator": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 150,
   "cap": 0,
   "support": 4,
   "unit": {
    "id": "inquisition_predator",
    "name": "Predator Annihilator",
    "icon": "inquisition_icons/predator_icon",
    "model": "races/space_marines/troops/predator_codex",
    "hp": 6820,
    "armour": 102,
    "armourType": "vehicle_med",
    "regen": 0,
    "speed": 24,
    "sight": 35,
    "cost": 230,
    "power": 410,
    "time": 75,
    "hardpoints": [
     [
      {
       "file": "inquisition_lascannon_twin_predator",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 650,
       "max": 900,
       "pierce": 0,
       "morale": 100,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094,
        "cmd": 15
       },
       "cost": 45,
       "power": 90,
       "time": 3,
       "icon": "space_marine_icons/upgrade_predator_twin_lascannon",
       "requires": [
        "marine_heavy_armor_deployment"
       ]
      }
     ],
     [
      {
       "file": "inquisition_heavy_bolter_predator_right",
       "name": "",
       "range": 35,
       "minRange": 0,
       "reload": 0.20000000298023224,
       "accuracy": 0.6499999761581421,
       "min": 35,
       "max": 43,
       "pierce": 0,
       "morale": 12,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 25,
        "veh": 16,
        "titan": 5.5,
        "struct": 0,
        "cmd": 20
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade_heavy_bolter",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_heavy_bolter_predator_left",
       "name": "",
       "range": 35,
       "minRange": 0,
       "reload": 0.20000000298023224,
       "accuracy": 0.6499999761581421,
       "min": 35,
       "max": 43,
       "pierce": 0,
       "morale": 12,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 25,
        "veh": 16,
        "titan": 5.5,
        "struct": 0,
        "cmd": 20
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade_heavy_bolter",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_storm_bolter_predator",
       "name": "",
       "range": 30,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 0.8500000238418579,
       "min": 101,
       "max": 126,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 50,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 20
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_predator"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_predator"
     ]
    }
   ]
  },
  "razorback": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 2,
   "unit": {
    "id": "inquisition_razorback",
    "name": "Razorback Transport",
    "icon": "inquisition_icons/razorback_icon",
    "model": "races/inquisition/troops/inquisition_razorback_scorpion",
    "hp": 2600,
    "armour": 100,
    "armourType": "vehicle_med",
    "regen": 0,
    "speed": 28,
    "sight": 30,
    "cost": 170,
    "power": 140,
    "time": 45,
    "hardpoints": [
     [
      {
       "file": "inquisition_incinerator_razorback",
       "name": "Incinerator",
       "range": 14,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 1,
       "min": 40,
       "max": 60,
       "pierce": 0,
       "morale": 40,
       "setup": 0,
       "moveAcc": 0.30000001192092896,
       "melee": false,
       "aoe": 14,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20,
        "cmd": 11
       },
       "cost": 60,
       "power": 40,
       "time": 3,
       "icon": "inquisition_icons/upgrade_incinerator",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_razorback"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_razorback"
     ]
    }
   ]
  },
  "rhino": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 1,
   "cap": 0,
   "support": 1,
   "unit": {
    "id": "inquisition_rhino",
    "name": "Rhino Transport",
    "icon": "inquisition_icons/inquisitorial_rhino_icon",
    "model": "races/inquisition_daemonhunt/troops/inquisitorial_rhino",
    "hp": 2000,
    "armour": 100,
    "armourType": "vehicle_med",
    "regen": 0,
    "speed": 32,
    "sight": 30,
    "cost": 150,
    "power": 150,
    "time": 30,
    "hardpoints": [
     [
      {
       "file": "inquisition_storm_bolter_rhino",
       "name": "Razorback Transport",
       "range": 25,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 0.75,
       "min": 50,
       "max": 70,
       "pierce": 3,
       "morale": 6,
       "setup": 0,
       "moveAcc": 0.6000000238418579,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 50,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 20
       },
       "cost": 20,
       "power": 5,
       "time": 1.2000000476837158,
       "icon": "inquisition_icons/upgrade_storm_bolter",
       "requires": []
      },
      {
       "file": "inquisition_missile_launcher_rhino",
       "name": "",
       "range": 45,
       "minRange": 0,
       "reload": 3,
       "accuracy": 0.800000011920929,
       "min": 500,
       "max": 700,
       "pierce": 0,
       "morale": 50,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 4,
       "vs": {
        "inf": 25,
        "hinf": 25,
        "light": 60,
        "veh": 50,
        "titan": 10,
        "struct": 14,
        "cmd": 12
       },
       "cost": 20,
       "power": 60,
       "time": 2.4000000953674316,
       "icon": "inquisition_icons/upgrade_missile_launcher",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_rhino"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_rhino"
     ]
    }
   ]
  },
  "scholar_astropath": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "morale": {
    "max": 500,
    "rate": 12,
    "minTime": 5,
    "minMorale": 50,
    "acc": 0.20000000298023224,
    "speed": 1.2000000476837158
   },
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_scholars_astropath",
    "name": "Astropath",
    "icon": "inquisition_icons/astropath_icon",
    "model": "races/inquisition_daemonhunt/troops/scholars",
    "hp": 400,
    "armour": 100,
    "armourType": "infantry_high",
    "regen": 1,
    "speed": 15,
    "sight": 60,
    "cost": 70,
    "power": 10,
    "time": 20,
    "hardpoints": [
     [
      {
       "file": "inquisition_laspistol_scholars",
       "name": "Nemesis Dreadknight",
       "range": 25,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.6000000238418579,
       "min": 11,
       "max": 15,
       "pierce": 0,
       "morale": 0.05000000074505806,
       "setup": 0,
       "moveAcc": 0.44999998807907104,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 31,
        "light": 3,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 3
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_staff_scholar",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.5,
       "min": 40,
       "max": 51,
       "pierce": 0,
       "morale": 7,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 49,
        "hinf": 39,
        "light": 0,
        "veh": 0,
        "titan": 20,
        "struct": 0,
        "cmd": 29
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_melee_dummy",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 200,
       "max": 200,
       "pierce": 0,
       "morale": 0,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 0,
        "struct": 0,
        "cmd": 0
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_astropath"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_astropath"
     ]
    }
   ]
  },
  "scholar_calculus_logi": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_scholars_calculus_logi",
    "name": "Calculus Logistic Pskyer",
    "icon": "inquisition_icons/calculus_logi_icon",
    "model": "races/inquisition_daemonhunt/troops/scholars",
    "hp": 250,
    "armour": 100,
    "armourType": "infantry_heavy_med",
    "regen": 1,
    "speed": 15,
    "sight": 10,
    "cost": 120,
    "power": 60,
    "time": 16,
    "hardpoints": [
     [
      {
       "file": "inquisition_melee_dummy",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 200,
       "max": 200,
       "pierce": 0,
       "morale": 0,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 0,
        "struct": 0,
        "cmd": 0
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_calculus_logi"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_calculus_logi"
     ]
    }
   ]
  },
  "scholar_exorcist": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "morale": {
    "max": 500,
    "rate": 12,
    "minTime": 5,
    "minMorale": 50,
    "acc": 0.20000000298023224,
    "speed": 1.2000000476837158
   },
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_scholars_exorcist",
    "name": "Exorcist",
    "icon": "inquisition_icons/exorcist_icon",
    "model": "races/inquisition_daemonhunt/troops/scholars",
    "hp": 600,
    "armour": 100,
    "armourType": "infantry_high",
    "regen": 1,
    "speed": 15,
    "sight": 30,
    "cost": 70,
    "power": 10,
    "time": 20,
    "hardpoints": [
     [
      {
       "file": "inquisition_eviscerator",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 2,
       "accuracy": 0.5,
       "min": 160,
       "max": 200,
       "pierce": 10,
       "morale": 60,
       "setup": 1,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 61,
        "hinf": 53,
        "light": 46,
        "veh": 41,
        "titan": 20,
        "struct": 20,
        "cmd": 25
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade_power_glove",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_melee_dummy",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 200,
       "max": 200,
       "pierce": 0,
       "morale": 0,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 0,
        "struct": 0,
        "cmd": 0
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_exorcist"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_exorcist"
     ]
    }
   ]
  },
  "scholars": {
   "min": 5,
   "max": 9,
   "reinforce": 30,
   "ups": 0,
   "morale": {
    "max": 200,
    "rate": 10,
    "minTime": 5,
    "minMorale": 30,
    "acc": 0.10000000149011612,
    "speed": 1.2000000476837158
   },
   "cap": 2,
   "support": 0,
   "unit": {
    "id": "inquisition_scholars",
    "name": "Scholars",
    "icon": "inquisition_icons/scholars_icon",
    "model": "races/inquisition_daemonhunt/troops/scholars",
    "hp": 450,
    "armour": 100,
    "armourType": "infantry_med",
    "regen": 1,
    "speed": 17,
    "sight": 20,
    "cost": 30,
    "power": 0,
    "time": 5,
    "hardpoints": [
     [
      {
       "file": "inquisition_laspistol_scholars",
       "name": "Nemesis Dreadknight",
       "range": 25,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.6000000238418579,
       "min": 11,
       "max": 15,
       "pierce": 0,
       "morale": 0.05000000074505806,
       "setup": 0,
       "moveAcc": 0.44999998807907104,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 31,
        "light": 3,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 3
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_staff_scholar",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.5,
       "min": 40,
       "max": 51,
       "pierce": 0,
       "morale": 7,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 49,
        "hinf": 39,
        "light": 0,
        "veh": 0,
        "titan": 20,
        "struct": 0,
        "cmd": 29
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_melee_dummy",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 200,
       "max": 200,
       "pierce": 0,
       "morale": 0,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 0,
        "struct": 0,
        "cmd": 0
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    }
   ]
  },
  "servitor_maintenance": {
   "min": 1,
   "max": 3,
   "reinforce": 30,
   "ups": 0,
   "cap": 1,
   "support": 0,
   "unit": {
    "id": "inquisition_servitor_maintenance",
    "name": "Maintenance Servitors",
    "icon": "inquisition_icons/servitor_maintenance_icon",
    "model": "races/inquisition_daemonhunt/troops/inquisition_servitor",
    "hp": 300,
    "armour": 100,
    "armourType": "infantry_low",
    "regen": 1,
    "speed": 16,
    "sight": 25,
    "cost": 30,
    "power": 10,
    "time": 10,
    "hardpoints": [
     [
      {
       "file": "inquisition_power_wrench",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 2,
       "accuracy": 0.6499999761581421,
       "min": 50,
       "max": 60,
       "pierce": 10,
       "morale": 10,
       "setup": 1,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 61.72200012207031,
        "hinf": 45.400001525878906,
        "light": 35.63600158691406,
        "veh": 25,
        "titan": 15,
        "struct": 10.666999816894531,
        "cmd": 15
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade_power_glove",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_servitors_maintenance"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_servitors_maintenance"
     ]
    }
   ]
  },
  "servitor_melee": {
   "min": 4,
   "max": 8,
   "reinforce": 50,
   "ups": 2,
   "cap": 3,
   "support": 0,
   "unit": {
    "id": "inquisition_servitor_melee",
    "name": "Assault Servitors",
    "icon": "inquisition_icons/servitor_melee_icon",
    "model": "races/inquisition_daemonhunt/troops/inquisition_servitor",
    "hp": 690,
    "armour": 100,
    "armourType": "infantry_heavy_med",
    "regen": 1,
    "speed": 20,
    "sight": 25,
    "cost": 50,
    "power": 10,
    "time": 8,
    "hardpoints": [
     [
      {
       "file": "inquisition_power_wrench_double",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 2,
       "accuracy": 0.6499999761581421,
       "min": 100,
       "max": 120,
       "pierce": 10,
       "morale": 10,
       "setup": 1,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 61.72200012207031,
        "hinf": 45.400001525878906,
        "light": 35.63600158691406,
        "veh": 25,
        "titan": 15,
        "struct": 10.666999816894531,
        "cmd": 15
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade_power_glove",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_power_wrench",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 2,
       "accuracy": 0.6499999761581421,
       "min": 50,
       "max": 60,
       "pierce": 10,
       "morale": 10,
       "setup": 1,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 61.72200012207031,
        "hinf": 45.400001525878906,
        "light": 35.63600158691406,
        "veh": 25,
        "titan": 15,
        "struct": 10.666999816894531,
        "cmd": 15
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade_power_glove",
       "requires": []
      },
      {
       "file": "inquisition_power_pincers_servitor",
       "name": "Power Pincers",
       "range": 0,
       "minRange": 0,
       "reload": 2,
       "accuracy": 0.800000011920929,
       "min": 140,
       "max": 160,
       "pierce": 10,
       "morale": 60,
       "setup": 1,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 61.72200012207031,
        "hinf": 65,
        "light": 50,
        "veh": 35,
        "titan": 15,
        "struct": 10.666999816894531,
        "cmd": 15
       },
       "cost": 75,
       "power": 20,
       "time": 2.700000047683716,
       "icon": "inquisition_icons/servitor_melee_icon",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_servitors"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_servitors"
     ]
    }
   ]
  },
  "servitor_weapon": {
   "min": 4,
   "max": 8,
   "reinforce": 50,
   "ups": 2,
   "cap": 3,
   "support": 0,
   "unit": {
    "id": "inquisition_servitor_weapon",
    "name": "Weapon Servitors",
    "icon": "inquisition_icons/servitor_weapon_icon",
    "model": "races/inquisition_daemonhunt/troops/inquisition_servitor",
    "hp": 500,
    "armour": 100,
    "armourType": "infantry_heavy_med",
    "regen": 1,
    "speed": 16,
    "sight": 25,
    "cost": 50,
    "power": 10,
    "time": 8,
    "hardpoints": [
     [
      {
       "file": "inquisition_heavy_bolter_servitor",
       "name": "",
       "range": 40,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.75,
       "min": 20,
       "max": 28,
       "pierce": 0,
       "morale": 10,
       "setup": 3,
       "moveAcc": 1,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 25,
        "veh": 16,
        "titan": 5.5,
        "struct": 0,
        "cmd": 20
       },
       "cost": 40,
       "power": 10,
       "time": 2.4000000953674316,
       "icon": "inquisition_icons/upgrade_heavy_bolter",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      },
      {
       "file": "inquisition_multi_melta_servitor",
       "name": "Multi Melta",
       "range": 40,
       "minRange": 0,
       "reload": 2.5,
       "accuracy": 1,
       "min": 200,
       "max": 280,
       "pierce": 0,
       "morale": 55,
       "setup": 3,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 20,
        "hinf": 12,
        "light": 88,
        "veh": 53,
        "titan": 5,
        "struct": 15,
        "cmd": 15
       },
       "cost": 20,
       "power": 75,
       "time": 6,
       "icon": "inquisition_icons/upgrade_multi_melta",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      }
     ],
     [
      {
       "file": "inquisition_power_wrench",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 2,
       "accuracy": 0.6499999761581421,
       "min": 50,
       "max": 60,
       "pierce": 10,
       "morale": 10,
       "setup": 1,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 61.72200012207031,
        "hinf": 45.400001525878906,
        "light": 35.63600158691406,
        "veh": 25,
        "titan": 15,
        "struct": 10.666999816894531,
        "cmd": 15
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade_power_glove",
       "requires": []
      },
      {
       "file": "inquisition_power_pincers_servitor",
       "name": "Power Pincers",
       "range": 0,
       "minRange": 0,
       "reload": 2,
       "accuracy": 0.800000011920929,
       "min": 140,
       "max": 160,
       "pierce": 10,
       "morale": 60,
       "setup": 1,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 61.72200012207031,
        "hinf": 65,
        "light": 50,
        "veh": 35,
        "titan": 15,
        "struct": 10.666999816894531,
        "cmd": 15
       },
       "cost": 75,
       "power": 20,
       "time": 2.700000047683716,
       "icon": "inquisition_icons/servitor_melee_icon",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_servitors"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_servitors"
     ]
    }
   ]
  },
  "servo_skull": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_servo_skull",
    "name": "Servo Skull",
    "icon": "inquisition_icons/servo_skull_icon",
    "model": "races/inquisition_daemonhunt/troops/servo_skull",
    "hp": 250,
    "armour": 100,
    "armourType": "infantry_med",
    "regen": 1,
    "speed": 25,
    "sight": 45,
    "cost": 40,
    "power": 5,
    "time": 10,
    "hardpoints": [
     [
      {
       "file": "inquisition_servo_skull_defense",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 52,
       "max": 89,
       "pierce": 0,
       "morale": 8,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 39,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 45,
        "cmd": 29
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ]
  },
  "shock_troops": {
   "min": 5,
   "max": 8,
   "reinforce": 35,
   "ups": 4,
   "morale": {
    "max": 300,
    "rate": 5,
    "minTime": 5,
    "minMorale": 30,
    "acc": 0.10000000149011612,
    "speed": 1.2000000476837158
   },
   "cap": 2,
   "support": 0,
   "unit": {
    "id": "inquisition_shock_troops",
    "name": "Elite Stormtroopers",
    "icon": "inquisition_icons/shock_troops_icon",
    "model": "races/inquisition_daemonhunt/troops/inquisition_shocktroop",
    "hp": 480,
    "armour": 100,
    "armourType": "infantry_high",
    "regen": 1,
    "speed": 16,
    "sight": 25,
    "cost": 40,
    "power": 0,
    "time": 3,
    "hardpoints": [
     [
      {
       "file": "inquisition_hellgun_shock_troops",
       "name": "- Durability: 4 | Strength: 6.5 | Morale: 6 | Upgrades: 2 | Squad Size: Standard | Movement Speed: Standard | Sight: Standard | Keen Sight: 2m | Ability Strength: 0 | Weapon range: Standard | Capture Points: Yes.",
       "range": 30,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.699999988079071,
       "min": 12,
       "max": 21,
       "pierce": 3,
       "morale": 1,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 10.800000190734863
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_flamer_shock_troops",
       "name": "",
       "range": 20,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 1,
       "min": 16,
       "max": 19,
       "pierce": 1,
       "morale": 17,
       "setup": 0,
       "moveAcc": 0.30000001192092896,
       "melee": false,
       "aoe": 10,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 8.600000381469727,
        "veh": 0,
        "titan": 5,
        "struct": 30,
        "cmd": 22
       },
       "cost": 20,
       "power": 5,
       "time": 2,
       "icon": "inquisition_icons/upgrade_flamer_shock",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      },
      {
       "file": "inquisition_grenade_launcher_shock_troops",
       "name": "",
       "range": 40,
       "minRange": 6,
       "reload": 3,
       "accuracy": 0.699999988079071,
       "min": 79,
       "max": 106,
       "pierce": 0,
       "morale": 12,
       "setup": 1,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 4,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 10,
        "veh": 0,
        "titan": 20,
        "struct": 7,
        "cmd": 9.600000381469727
       },
       "cost": 25,
       "power": 10,
       "time": 4,
       "icon": "inquisition_icons/upgrade_grenade_launcher",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      },
      {
       "file": "inquisition_plasma_gun_shock_troops",
       "name": "",
       "range": 30,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 1,
       "min": 15,
       "max": 25,
       "pierce": 10,
       "morale": 10,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 75,
        "light": 15,
        "veh": 10,
        "titan": 5,
        "struct": 0,
        "cmd": 17
       },
       "cost": 40,
       "power": 10,
       "time": 3,
       "icon": "inquisition_icons/upgrade_plasma_gun",
       "requires": [
        "inquisition_tower_addon",
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      },
      {
       "file": "inquisition_melta_gun_shock_troops",
       "name": "",
       "range": 35,
       "minRange": 0,
       "reload": 2.5,
       "accuracy": 1,
       "min": 105,
       "max": 185,
       "pierce": 10,
       "morale": 15,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 20,
        "hinf": 12,
        "light": 80,
        "veh": 50,
        "titan": 5,
        "struct": 10,
        "cmd": 15
       },
       "cost": 20,
       "power": 50,
       "time": 2.4000000953674316,
       "icon": "inquisition_icons/upgrade_melta_gun",
       "requires": [
        "inquisition_tower_addon",
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      }
     ],
     [
      {
       "file": "inquisition_knife_shock_troops",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 25,
       "max": 30,
       "pierce": 0,
       "morale": 5,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 49,
        "hinf": 39,
        "light": 0,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 15
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": []
  },
  "stormraven_fury": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 1,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_stormraven_fury",
    "name": "Stormraven Fury",
    "icon": "inquisition_icons/stormraven_fury_icon",
    "model": "races/inquisition/troops/gkraven",
    "hp": 8000,
    "armour": 100,
    "armourType": "vehicle_high",
    "regen": 0,
    "speed": 60,
    "sight": 70,
    "cost": 490,
    "power": 1150,
    "time": 190,
    "hardpoints": [
     [
      {
       "file": "inquisition_multi_melta_stormraven",
       "name": "",
       "range": 80,
       "minRange": 0,
       "reload": 4,
       "accuracy": 0.800000011920929,
       "min": 890,
       "max": 1340,
       "pierce": 10,
       "morale": 65,
       "setup": 0,
       "moveAcc": 0.30000001192092896,
       "melee": false,
       "aoe": 6,
       "vs": {
        "inf": 20,
        "hinf": 12,
        "light": 88,
        "veh": 53,
        "titan": 5,
        "struct": 25,
        "cmd": 15
       },
       "cost": 100,
       "power": 100,
       "time": 2.4000000953674316,
       "icon": "space_marine_icons/upgrade_melta_gun",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hurricane_bolter_stormraven_left",
       "name": "",
       "range": 80,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.8500000238418579,
       "min": 70,
       "max": 130,
       "pierce": 5,
       "morale": 25,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 70,
        "light": 35,
        "veh": 25,
        "titan": 50,
        "struct": 25,
        "cmd": 30
       },
       "cost": 60,
       "power": 20,
       "time": 4.400000095367432,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_hurricane_bolter_stormraven_right",
       "name": "",
       "range": 80,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.8500000238418579,
       "min": 70,
       "max": 130,
       "pierce": 5,
       "morale": 25,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 70,
        "light": 35,
        "veh": 25,
        "titan": 50,
        "struct": 25,
        "cmd": 30
       },
       "cost": 60,
       "power": 20,
       "time": 4.400000095367432,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_stormraven_fury"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_stormraven_fury"
     ]
    }
   ]
  },
  "stormtroopers": {
   "min": 5,
   "max": 10,
   "reinforce": 15,
   "ups": 2,
   "morale": {
    "max": 200,
    "rate": 4,
    "minTime": 5,
    "minMorale": 30,
    "acc": 0.10000000149011612,
    "speed": 1.2000000476837158
   },
   "cap": 2,
   "support": 0,
   "unit": {
    "id": "inquisition_stormtrooper",
    "name": "",
    "icon": "inquisition_icons/stormtroopers_icon",
    "model": "races/inquisition_daemonhunt/troops/inquisition_shocktroop",
    "hp": 220,
    "armour": 100,
    "armourType": "infantry_med",
    "regen": 1,
    "speed": 16,
    "sight": 25,
    "cost": 15,
    "power": 0,
    "time": 3,
    "hardpoints": [
     [
      {
       "file": "inquisition_hellgun_stormtrooper",
       "name": "- Durability: 4 | Strength: 6.5 | Morale: 6 | Upgrades: 2 | Squad Size: Standard | Movement Speed: Standard | Sight: Standard | Keen Sight: 2m | Ability Strength: 0 | Weapon range: Standard | Capture Points: Yes.",
       "range": 30,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.699999988079071,
       "min": 7,
       "max": 13,
       "pierce": 3,
       "morale": 1,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 10.800000190734863
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      },
      {
       "file": "inquisition_flamer_stormtroopers",
       "name": "",
       "range": 20,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 1,
       "min": 12,
       "max": 15,
       "pierce": 1,
       "morale": 17,
       "setup": 0,
       "moveAcc": 0.30000001192092896,
       "melee": false,
       "aoe": 10,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 8.600000381469727,
        "veh": 0,
        "titan": 5,
        "struct": 30,
        "cmd": 22
       },
       "cost": 20,
       "power": 5,
       "time": 2,
       "icon": "inquisition_icons/upgrade_flamer_shock",
       "requires": [
        "inquisition_infantry_bunker",
        "inquisition_librarium"
       ]
      }
     ],
     [
      {
       "file": "inquisition_knife_stormtroopers",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 10,
       "max": 15,
       "pierce": 0,
       "morale": 4,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 49,
        "hinf": 39,
        "light": 0,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 15
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "inquisition_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": []
  },
  "tempest": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 2,
   "unit": {
    "id": "inquisition_tempest",
    "name": "Land Speeder Tempest",
    "icon": "inquisition_icons/land_speeder_tempest_icon",
    "model": "races/space_marines/troops/tempest",
    "hp": 1050,
    "armour": 100,
    "armourType": "air_med",
    "regen": 0,
    "speed": 60,
    "sight": 30,
    "cost": 130,
    "power": 210,
    "time": 30,
    "hardpoints": [
     [
      {
       "file": "inquisition_assault_cannon_tempest",
       "name": "",
       "range": 30,
       "minRange": 0,
       "reload": 0.20000000298023224,
       "accuracy": 0.6499999761581421,
       "min": 15,
       "max": 30,
       "pierce": 0,
       "morale": 1,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 30,
        "veh": 10,
        "titan": 8,
        "struct": 0,
        "cmd": 8.399999618530273
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_incendiary_missile",
       "name": "",
       "range": 30,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 200,
       "max": 300,
       "pierce": 0,
       "morale": 70,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 5,
       "vs": {
        "inf": 85,
        "hinf": 50,
        "light": 10,
        "veh": 1,
        "titan": 65,
        "struct": 28,
        "cmd": 42
       },
       "cost": 70,
       "power": 30,
       "time": 3,
       "icon": "space_marine_icons/upgrade_tempest_missile_krak",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_land_speeder_tempest"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_land_speeder_tempest"
     ]
    }
   ]
  },
  "thunderfire_cannon": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 1,
   "unit": {
    "id": "inquisition_thunderfire_cannon",
    "name": "Thunderfire Cannon",
    "icon": "inquisition_icons/thunderfire_cannon_icon",
    "model": "races/space_marines/troops/thunderfire_cannon",
    "hp": 1000,
    "armour": 100,
    "armourType": "vehicle_med",
    "regen": 0,
    "speed": 16,
    "sight": 35,
    "cost": 90,
    "power": 100,
    "time": 35,
    "hardpoints": [
     [
      {
       "file": "inquisition_autocannon_thunderfire_cannon",
       "name": "",
       "range": 55,
       "minRange": 0,
       "reload": 1,
       "accuracy": 1,
       "min": 120,
       "max": 180,
       "pierce": 0,
       "morale": 25,
       "setup": 5,
       "moveAcc": 1,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 55,
        "hinf": 55,
        "light": 35,
        "veh": 25,
        "titan": 8,
        "struct": 10,
        "cmd": 8.399999618530273
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_thunderfire_cannon"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_thunderfire_cannon"
     ]
    }
   ]
  },
  "thunderhawk": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_transport_thunderhawk",
    "name": "",
    "icon": "",
    "model": "races/inquisition_daemonhunt/troops/inquisition_th_transporter",
    "hp": 0,
    "armour": 0,
    "armourType": "vehicle_low",
    "regen": 0,
    "speed": 0,
    "sight": 30,
    "cost": 0,
    "power": 0,
    "time": 1,
    "hardpoints": []
   },
   "req": []
  },
  "trade_power": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_trade_power",
    "name": "Resource Trade: Power",
    "icon": "inquisition_icons/idh_trade_power_icon",
    "model": "races/tyranids/structures/drop_building",
    "hp": 0,
    "armour": 100,
    "armourType": "infantry_low",
    "regen": -5,
    "speed": 0,
    "sight": 0,
    "cost": 200,
    "power": 0,
    "time": 1,
    "hardpoints": []
   },
   "req": [
    {
     "t": "local_addon",
     "ids": [
      "inquisition_dedication_trading_addon"
     ]
    }
   ]
  },
  "trade_requisition": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_trade_requisition",
    "name": "Resource Trade: Requisition",
    "icon": "inquisition_icons/idh_trade_requisition_icon",
    "model": "races/tyranids/structures/drop_building",
    "hp": 0,
    "armour": 100,
    "armourType": "infantry_low",
    "regen": -5,
    "speed": 0,
    "sight": 0,
    "cost": 0,
    "power": 200,
    "time": 1,
    "hardpoints": []
   },
   "req": [
    {
     "t": "local_addon",
     "ids": [
      "inquisition_dedication_trading_addon"
     ]
    }
   ]
  },
  "valkyrie": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_transport_valkyrie",
    "name": "",
    "icon": "",
    "model": "races/inquisition_daemonhunt/troops/inquisition_valkyrie",
    "hp": 0,
    "armour": 0,
    "armourType": "vehicle_low",
    "regen": 0,
    "speed": 0,
    "sight": 30,
    "cost": 0,
    "power": 0,
    "time": 1,
    "hardpoints": []
   },
   "req": []
  },
  "valkyrie_uamod": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 2,
   "unit": {
    "id": "inquisition_transport_valkyrie_uamod",
    "name": "Valkyrie Transport",
    "icon": "inquisition_icons/valkyrie_icon",
    "model": "races/imperial_guard/troops/valkyrie_extraction",
    "hp": 3000,
    "armour": 100,
    "armourType": "vehicle_med",
    "regen": 0,
    "speed": 0,
    "sight": 36,
    "cost": 150,
    "power": 150,
    "time": 45,
    "hardpoints": []
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_valkyrie"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_valkyrie"
     ]
    }
   ]
  },
  "vulture": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 5,
   "unit": {
    "id": "inquisition_vulture",
    "name": "Vulture Gunship",
    "icon": "inquisition_icons/vulture_icon",
    "model": "races/armoured_company/troops/ac_vulture_gunship",
    "hp": 6000,
    "armour": 101,
    "armourType": "air_med",
    "regen": 0,
    "speed": 59,
    "sight": 35,
    "cost": 250,
    "power": 350,
    "time": 64,
    "hardpoints": [
     [
      {
       "file": "inquisition_autocannon_vulture",
       "name": "",
       "range": 50,
       "minRange": 0,
       "reload": 0.6000000238418579,
       "accuracy": 0.699999988079071,
       "min": 80,
       "max": 120,
       "pierce": 0,
       "morale": 20,
       "setup": 0,
       "moveAcc": 0.3499999940395355,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 50,
        "veh": 35,
        "titan": 8,
        "struct": 20,
        "cmd": 8.399999618530273
       },
       "cost": 40,
       "power": 10,
       "time": 2.4000000953674316,
       "icon": "guard_icons/upgrade_chimera_autocannon",
       "requires": []
      },
      {
       "file": "inquisition_lascannon_vulture",
       "name": "",
       "range": 50,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 600,
       "max": 800,
       "pierce": 10,
       "morale": 50,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094,
        "cmd": 15
       },
       "cost": 50,
       "power": 50,
       "time": 3,
       "icon": "guard_icons/upgrade_leman_russ_hull_lascannon",
       "requires": [
        "addon_guard_hq_2",
        "guard_hq",
        "guard_research_sentinel_armor"
       ]
      }
     ],
     [
      {
       "file": "inquisition_heavy_bolter_vulture",
       "name": "",
       "range": 35,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.5,
       "min": 130,
       "max": 160,
       "pierce": 0,
       "morale": 10.050000190734863,
       "setup": 0,
       "moveAcc": 0.3499999940395355,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 25,
        "veh": 16,
        "titan": 5.5,
        "struct": 0,
        "cmd": 20
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_missile_launcher_vulture",
       "name": "",
       "range": 50,
       "minRange": 5,
       "reload": 5,
       "accuracy": 0.8500000238418579,
       "min": 250,
       "max": 300,
       "pierce": 0,
       "morale": 80,
       "setup": 0,
       "moveAcc": 1,
       "melee": false,
       "aoe": 3,
       "vs": {
        "inf": 25,
        "hinf": 25,
        "light": 60,
        "veh": 50,
        "titan": 10,
        "struct": 14,
        "cmd": 12
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_missile_launcher_vulture",
       "name": "",
       "range": 50,
       "minRange": 5,
       "reload": 5,
       "accuracy": 0.8500000238418579,
       "min": 250,
       "max": 300,
       "pierce": 0,
       "morale": 80,
       "setup": 0,
       "moveAcc": 1,
       "melee": false,
       "aoe": 3,
       "vs": {
        "inf": 25,
        "hinf": 25,
        "light": 60,
        "veh": 50,
        "titan": 10,
        "struct": 14,
        "cmd": 12
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_vulture"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_vulture"
     ]
    }
   ]
  },
  "warhound_titan": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 2,
   "morale": {
    "max": 1875,
    "rate": 2,
    "minTime": 60,
    "minMorale": 50,
    "acc": 1,
    "speed": 1
   },
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_warhound_titan",
    "name": "Warhound Purifier Titan",
    "icon": "inquisition_icons/idh_warhound_purifier_icon",
    "model": "races/titans/troops/winter_warhound_idh",
    "hp": 25000,
    "armour": 100,
    "armourType": "titan",
    "regen": 0,
    "speed": 18,
    "sight": 60,
    "cost": 1250,
    "power": 3100,
    "time": 130,
    "hardpoints": [
     [
      {
       "file": "inquisition_titan_inferno_cannon_improved_left",
       "name": "Inferno Cannon",
       "range": 72,
       "minRange": 2,
       "reload": 0.4000000059604645,
       "accuracy": 1,
       "min": 131,
       "max": 270,
       "pierce": 0,
       "morale": 80,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 6,
       "vs": {
        "inf": 80,
        "hinf": 70,
        "light": 70,
        "veh": 55,
        "titan": 125,
        "struct": 80,
        "cmd": 50
       },
       "cost": 100,
       "power": 100,
       "time": 8,
       "icon": "npc/titan_inferno_cannon_icon",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_titan_inferno_cannon_improved",
       "name": "Inferno Cannon",
       "range": 72,
       "minRange": 2,
       "reload": 0.4000000059604645,
       "accuracy": 1,
       "min": 131,
       "max": 270,
       "pierce": 0,
       "morale": 80,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 6,
       "vs": {
        "inf": 80,
        "hinf": 70,
        "light": 70,
        "veh": 55,
        "titan": 125,
        "struct": 80,
        "cmd": 50
       },
       "cost": 100,
       "power": 100,
       "time": 8,
       "icon": "npc/titan_inferno_cannon_icon",
       "requires": []
      },
      {
       "file": "inquisition_titan_plasma_blastgun_godly",
       "name": "Emperor's Artifact: Fastfire Plasma Blast Gun",
       "range": 72,
       "minRange": 5,
       "reload": 1,
       "accuracy": 1,
       "min": 2000,
       "max": 3000,
       "pierce": 20,
       "morale": 200,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 8,
       "vs": {
        "inf": 10,
        "hinf": 12,
        "light": 80,
        "veh": 80,
        "titan": 40,
        "struct": 30,
        "cmd": 25
       },
       "cost": 1500,
       "power": 1500,
       "time": 180,
       "icon": "npc/titan_plasma_blastgun_godly_icon",
       "requires": [
        "inquisition_essence_omnissiah_research",
        "inquisition_shrine_to_the_emperor"
       ]
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_titan_purifier"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_titan_purifier"
     ]
    }
   ]
  },
  "warhound_vengence_titan": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 2,
   "morale": {
    "max": 1875,
    "rate": 2,
    "minTime": 60,
    "minMorale": 50,
    "acc": 1,
    "speed": 1
   },
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "inquisition_warhound_vengence_titan",
    "name": "Warhound Vengence Titan",
    "icon": "inquisition_icons/idh_warhound_vengence_icon",
    "model": "races/titans/troops/winter_warhound_idh",
    "hp": 25000,
    "armour": 100,
    "armourType": "titan",
    "regen": 0,
    "speed": 18,
    "sight": 60,
    "cost": 1250,
    "power": 3100,
    "time": 130,
    "hardpoints": [
     [
      {
       "file": "inquisition_titan_vulcan_mega_bolter_left",
       "name": "",
       "range": 60,
       "minRange": 5,
       "reload": 0.25,
       "accuracy": 0.6499999761581421,
       "min": 225,
       "max": 325,
       "pierce": 0,
       "morale": 6,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 4,
       "vs": {
        "inf": 75,
        "hinf": 50,
        "light": 45,
        "veh": 30,
        "titan": 16.5,
        "struct": 30,
        "cmd": 25
       },
       "cost": 40,
       "power": 70,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_titan_plasma_blastgun",
       "name": "Plasma Blast Gun",
       "range": 72,
       "minRange": 5,
       "reload": 5,
       "accuracy": 1,
       "min": 2500,
       "max": 3500,
       "pierce": 15,
       "morale": 200,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 7,
       "vs": {
        "inf": 10,
        "hinf": 12,
        "light": 80,
        "veh": 80,
        "titan": 40,
        "struct": 30,
        "cmd": 25
       },
       "cost": 400,
       "power": 400,
       "time": 45,
       "icon": "npc/titan_plasma_blastgun_icon",
       "requires": []
      },
      {
       "file": "inquisition_titan_plasma_blastgun_godly",
       "name": "Emperor's Artifact: Fastfire Plasma Blast Gun",
       "range": 72,
       "minRange": 5,
       "reload": 1,
       "accuracy": 1,
       "min": 2000,
       "max": 3000,
       "pierce": 20,
       "morale": 200,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 8,
       "vs": {
        "inf": 10,
        "hinf": 12,
        "light": 80,
        "veh": 80,
        "titan": 40,
        "struct": 30,
        "cmd": 25
       },
       "cost": 1500,
       "power": 1500,
       "time": 180,
       "icon": "npc/titan_plasma_blastgun_godly_icon",
       "requires": [
        "inquisition_essence_omnissiah_research",
        "inquisition_shrine_to_the_emperor"
       ]
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_titan_vengence"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_titan_vengence"
     ]
    }
   ]
  },
  "whirlwind": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 150,
   "cap": 0,
   "support": 5,
   "unit": {
    "id": "inquisition_whirlwind",
    "name": "Whirlwind Hyperios",
    "icon": "inquisition_icons/whirlwind_icon",
    "model": "races/inquisition/troops/inquisition_whirlwind_hyperios",
    "hp": 5280,
    "armour": 102,
    "armourType": "vehicle_med",
    "regen": 0,
    "speed": 16,
    "sight": 50,
    "cost": 310,
    "power": 515,
    "time": 93,
    "hardpoints": [
     [
      {
       "file": "inquisition_missile_battery_inferno",
       "name": "",
       "range": 120,
       "minRange": 12,
       "reload": 1.600000023841858,
       "accuracy": 0.699999988079071,
       "min": 250,
       "max": 400,
       "pierce": 0,
       "morale": 50,
       "setup": 2,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 5,
       "vs": {
        "inf": 50,
        "hinf": 35,
        "light": 10,
        "veh": 5,
        "titan": 30,
        "struct": 50,
        "cmd": 20
       },
       "cost": 15,
       "power": 10,
       "time": 1.600000023841858,
       "icon": "guard_icons/guard_let_it_burn_icon",
       "requires": []
      }
     ],
     [
      {
       "file": "inquisition_missile_battery",
       "name": "",
       "range": 120,
       "minRange": 12,
       "reload": 4,
       "accuracy": 0.699999988079071,
       "min": 500,
       "max": 700,
       "pierce": 0,
       "morale": 50,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 7,
       "vs": {
        "inf": 25,
        "hinf": 20,
        "light": 90,
        "veh": 70,
        "titan": 50,
        "struct": 30,
        "cmd": 30
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      }
     ],
     [
      {
       "file": "space_marine_missile_launcher_hyperios",
       "name": "",
       "range": 80,
       "minRange": 10,
       "reload": 1,
       "accuracy": 1,
       "min": 254.10000610351562,
       "max": 333.29998779296875,
       "pierce": 0,
       "morale": 28,
       "setup": 0,
       "moveAcc": 0.8500000238418579,
       "melee": false,
       "aoe": 3,
       "vs": {
        "inf": 15,
        "hinf": 12,
        "light": 60,
        "veh": 50,
        "titan": 11,
        "struct": 14.444000244140625,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade_missile_launcher",
       "requires": []
      }
     ],
     [
      {
       "file": "space_marine_missile_launcher_hyperios",
       "name": "",
       "range": 80,
       "minRange": 10,
       "reload": 1,
       "accuracy": 1,
       "min": 254.10000610351562,
       "max": 333.29998779296875,
       "pierce": 0,
       "morale": 28,
       "setup": 0,
       "moveAcc": 0.8500000238418579,
       "melee": false,
       "aoe": 3,
       "vs": {
        "inf": 15,
        "hinf": 12,
        "light": 60,
        "veh": 50,
        "titan": 11,
        "struct": 14.444000244140625,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade_missile_launcher",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_whirlwind"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_schematic_whirlwind"
     ]
    }
   ]
  }
 },
 "buildings": {
  "astra_telepathica": {
   "id": "inquisition_astra_telepathica",
   "name": "Astra Telepathica",
   "icon": "inquisition_icons/astra_telepatica_icon",
   "model": "races/inquisition_daemonhunt/structures/domus_astra_telepatica",
   "hp": 3500,
   "armour": 100,
   "armourType": "building_med",
   "regen": 0,
   "speed": 0,
   "sight": 40,
   "cost": 190,
   "power": 70,
   "time": 54,
   "hardpoints": [],
   "spawns": [
    "inquisition_squad_stormraven_fury",
    "inquisition_squad_tempest",
    "inquisition_squad_valkyrie_uamod",
    "inquisition_squad_ds_turret",
    "inquisition_squad_dreadnought_support",
    "inquisition_squad_grey_knights_astra",
    "inquisition_squad_vulture",
    "inquisition_squad_shock_troops",
    "inquisition_squad_thunderfire_cannon",
    "inquisition_squad_dreadnought"
   ],
   "research": [
    "inquisition_schematic_dreadnought",
    "inquisition_schematic_dreadnoughts",
    "inquisition_schematic_vulture",
    "inquisition_schematic_grey_knight",
    "inquisition_schematic_valkyrie",
    "inquisition_schematic_stormraven_fury",
    "inquisition_schematic_thunderfire_cannon",
    "inquisition_schematic_land_speeder_tempest",
    "inquisition_schematic_turret"
   ],
   "addons": [],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ]
  },
  "civilian_bunker": {
   "id": "inquisition_civilian_bunker",
   "name": "Urban Territory",
   "icon": "inquisition_icons/urban_territory_icon",
   "model": "races/inquisition/structures/civilian_structure",
   "hp": 800,
   "armour": 100,
   "armourType": "building_med",
   "regen": 0,
   "speed": 0,
   "sight": 15,
   "cost": 50,
   "power": 25,
   "time": 90,
   "hardpoints": [
    [
     {
      "file": "inquisition_skyscraper_dummyweapon",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "inquisition_skyscraper_dummyweapon_1",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "inquisition_skyscraper_dummyweapon_2",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "inquisition_skyscraper_dummyweapon_3",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "inquisition_skyscraper_dummyweapon_4",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     }
    ],
    [
     {
      "file": "inquisition_skyscraper_dummyweapon",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "inquisition_skyscraper_dummyweapon_5",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "inquisition_skyscraper_dummyweapon_6",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "inquisition_skyscraper_dummyweapon_7",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "inquisition_skyscraper_dummyweapon_8",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     }
    ],
    [
     {
      "file": "inquisition_skyscraper_dummyweapon",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "inquisition_skyscraper_dummyweapon_9",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "inquisition_skyscraper_dummyweapon_10",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     }
    ]
   ],
   "spawns": [],
   "research": [],
   "addons": [
    "inquisition_worker_3_addon",
    "inquisition_worker_1_addon",
    "inquisition_worker_2_addon",
    "inquisition_dedication_squad_addon",
    "inquisition_worker_4_addon",
    "inquisition_dedication_support_addon"
   ],
   "req": [
    {
     "t": "either",
     "ids": [
      "inquisition_watch",
      "inquisition_librarium"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_imperial_icon"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ]
  },
  "civilian_bunker_ai": {
   "id": "inquisition_civilian_bunker_ai",
   "name": "Urban Territory",
   "icon": "inquisition_icons/urban_territory_icon",
   "model": "races/inquisition/structures/civilian_structure",
   "hp": 500,
   "armour": 100,
   "armourType": "building_low",
   "regen": 0,
   "speed": 0,
   "sight": 15,
   "cost": 50,
   "power": 25,
   "time": 18,
   "hardpoints": [
    [
     {
      "file": "inquisition_skyscraper_dummyweapon",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "inquisition_skyscraper_dummyweapon_1",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "inquisition_skyscraper_dummyweapon_2",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "inquisition_skyscraper_dummyweapon_3",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "inquisition_skyscraper_dummyweapon_4",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     }
    ],
    [
     {
      "file": "inquisition_skyscraper_dummyweapon",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "inquisition_skyscraper_dummyweapon_5",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "inquisition_skyscraper_dummyweapon_6",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "inquisition_skyscraper_dummyweapon_7",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "inquisition_skyscraper_dummyweapon_8",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     }
    ],
    [
     {
      "file": "inquisition_skyscraper_dummyweapon",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "inquisition_skyscraper_dummyweapon_9",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "inquisition_skyscraper_dummyweapon_10",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     }
    ]
   ],
   "spawns": [
    "inquisition_squad_shock_troops",
    "inquisition_squad_civilian_ai"
   ],
   "research": [],
   "addons": [
    "inquisition_dedication_squad_addon",
    "inquisition_dedication_workers_addon",
    "inquisition_dedication_trading_addon",
    "inquisition_dedication_requisition_addon",
    "inquisition_dedication_support_addon",
    "inquisition_dedication_power_addon"
   ],
   "req": [
    {
     "t": "either",
     "ids": [
      "inquisition_watch",
      "inquisition_librarium"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ]
  },
  "grey_knights_teleporter": {
   "id": "inquisition_grey_knights_teleporter",
   "name": "Grey Knights Teleporter",
   "icon": "inquisition_icons/grey_knights_teleporter",
   "model": "races/inquisition_daemonhunt/structures/gk_teleporter",
   "hp": 3000,
   "armour": 100,
   "armourType": "building_med",
   "regen": 0,
   "speed": 0,
   "sight": 25,
   "cost": 200,
   "power": 50,
   "time": 60,
   "hardpoints": [
    [
     {
      "file": "inquisition_heavy_bolter_gk_teleporter",
      "name": "",
      "range": 35,
      "minRange": 10,
      "reload": 0.4000000059604645,
      "accuracy": 0.800000011920929,
      "min": 100,
      "max": 150,
      "pierce": 5,
      "morale": 20,
      "setup": 0,
      "moveAcc": 0.6499999761581421,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 70,
       "hinf": 60,
       "light": 25,
       "veh": 16,
       "titan": 5.5,
       "struct": 0,
       "cmd": 20
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "inquisition_icons/upgrade_heavy_bolter",
      "requires": []
     },
     {
      "file": "inquisition_lascannon_twin_gk_teleporter",
      "name": "",
      "range": 40,
      "minRange": 10,
      "reload": 3,
      "accuracy": 1,
      "min": 820,
      "max": 950,
      "pierce": 10,
      "morale": 55,
      "setup": 0,
      "moveAcc": 0,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 30,
       "hinf": 30,
       "light": 87.6259994506836,
       "veh": 52.55799865722656,
       "titan": 20,
       "struct": 18.152000427246094,
       "cmd": 15
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "inquisition_icons/upgrade_lascannon",
      "requires": [
       "inquisition_mass_teleporter",
       "inquisition_ultimate_forces"
      ]
     }
    ]
   ],
   "spawns": [
    "inquisition_squad_dreadknight_titan",
    "inquisition_squad_dreadnought_venerable",
    "inquisition_squad_grey_knight_hero",
    "inquisition_squad_grey_knights_interceptor",
    "inquisition_squad_dreadnought_support",
    "inquisition_squad_grey_knights_purifier",
    "inquisition_squad_grey_knight_champion",
    "inquisition_squad_grey_knights_terminator_paladin",
    "inquisition_squad_dreadnought",
    "inquisition_squad_grey_knights_purgator",
    "inquisition_squad_dreadnought_assault",
    "inquisition_squad_grey_knights",
    "inquisition_squad_grey_knights_terminator"
   ],
   "research": [
    "inquisition_schematic_grey_knight_terminator",
    "inquisition_schematic_dreadnoughts",
    "inquisition_schematic_dreadknight",
    "inquisition_schematic_grey_knight_purifier",
    "inquisition_schematic_dreadnought",
    "inquisition_schematic_grey_knight_terminator_paladin",
    "inquisition_schematic_grey_knight_interceptor",
    "inquisition_schematic_grey_knight_purgator",
    "inquisition_temporal_power"
   ],
   "addons": [
    "inquisition_mass_teleporter"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_temporal_power"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ]
  },
  "imperial_icon": {
   "id": "inquisition_imperial_icon",
   "name": "Icon of Purification",
   "icon": "inquisition_icons/imperial_icon_icon",
   "model": "races/inquisition_daemonhunt/structures/imperial_icon",
   "hp": 2800,
   "armour": 100,
   "armourType": "building_low",
   "regen": 0,
   "speed": 0,
   "sight": 35,
   "cost": 90,
   "power": 0,
   "time": 30,
   "hardpoints": [
    [
     {
      "file": "inquisition_dummy_weapon",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 0,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "inquisition_icons/upgrade",
      "requires": []
     },
     {
      "file": "inquisition_warp_zap_pentagram",
      "name": "- Monstrous creatures gets dealt severe damage and weaker monsters might be killed in the process.",
      "range": 35,
      "minRange": 0,
      "reload": 1,
      "accuracy": 0.800000011920929,
      "min": 170,
      "max": 190,
      "pierce": 3,
      "morale": 60,
      "setup": 0,
      "moveAcc": 0.6499999761581421,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 42,
       "hinf": 51,
       "light": 20,
       "veh": 10,
       "titan": 5.5,
       "struct": 0,
       "cmd": 25
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "inqusition_icons/upgrade_warp_zap.tga",
      "requires": []
     },
     {
      "file": "inquisition_warp_zap_sanctuary",
      "name": "- Monstrous creatures gets dealt severe damage and weaker monsters might be killed in the process.",
      "range": 45,
      "minRange": 0,
      "reload": 1,
      "accuracy": 0.800000011920929,
      "min": 170,
      "max": 190,
      "pierce": 10,
      "morale": 90,
      "setup": 0,
      "moveAcc": 0.6499999761581421,
      "melee": false,
      "aoe": 4,
      "vs": {
       "inf": 42,
       "hinf": 51,
       "light": 60,
       "veh": 50,
       "titan": 30,
       "struct": 0,
       "cmd": 25
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "inqusition_icons/upgrade_warp_zap.tga",
      "requires": []
     }
    ]
   ],
   "spawns": [
    "inquisition_squad_servo_skull"
   ],
   "research": [
    "inquisition_requisition_research_5",
    "inquisition_listening_post_upgrade",
    "inquisition_requisition_research_4",
    "inquisition_pentagrams",
    "inquisition_requisition_research_2",
    "inquisition_requisition_research_3",
    "inquisition_requisition_research_1"
   ],
   "addons": [
    "inquisition_imperial_icon_addon_1",
    "inquisition_imperial_icon_addon_2"
   ],
   "req": []
  },
  "infantry_bunker": {
   "id": "inquisition_infantry_bunker",
   "name": "Bunker",
   "icon": "inquisition_icons/infantry_bunker_icon",
   "model": "races/sisters/structures/sister_bunker_base",
   "hp": 5000,
   "armour": 100,
   "armourType": "building_med",
   "regen": 0,
   "speed": 0,
   "sight": 25,
   "cost": 240,
   "power": 100,
   "time": 29,
   "hardpoints": [
    [
     {
      "file": "inquisition_heavy_bolter_bunker_east",
      "name": "",
      "range": 55,
      "minRange": 0,
      "reload": 0.5,
      "accuracy": 0.800000011920929,
      "min": 65,
      "max": 84,
      "pierce": 10,
      "morale": 10.050000190734863,
      "setup": 0,
      "moveAcc": 0.6499999761581421,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 70,
       "hinf": 60,
       "light": 25,
       "veh": 16,
       "titan": 5.5,
       "struct": 0,
       "cmd": 20
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "chaos_dummy_weapon",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     }
    ],
    [
     {
      "file": "inquisition_heavy_bolter_bunker_north",
      "name": "",
      "range": 55,
      "minRange": 0,
      "reload": 0.5,
      "accuracy": 0.800000011920929,
      "min": 65,
      "max": 84,
      "pierce": 10,
      "morale": 10.050000190734863,
      "setup": 0,
      "moveAcc": 0.6499999761581421,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 70,
       "hinf": 60,
       "light": 25,
       "veh": 16,
       "titan": 5.5,
       "struct": 0,
       "cmd": 20
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "chaos_dummy_weapon",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     }
    ],
    [
     {
      "file": "inquisition_heavy_bolter_bunker_west",
      "name": "",
      "range": 55,
      "minRange": 0,
      "reload": 0.5,
      "accuracy": 0.800000011920929,
      "min": 65,
      "max": 84,
      "pierce": 10,
      "morale": 10.050000190734863,
      "setup": 0,
      "moveAcc": 0.6499999761581421,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 70,
       "hinf": 60,
       "light": 25,
       "veh": 16,
       "titan": 5.5,
       "struct": 0,
       "cmd": 20
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "chaos_dummy_weapon",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     }
    ],
    [
     {
      "file": "inquisition_heavy_bolter_bunker_south",
      "name": "",
      "range": 55,
      "minRange": 0,
      "reload": 0.5,
      "accuracy": 0.800000011920929,
      "min": 65,
      "max": 84,
      "pierce": 10,
      "morale": 10.050000190734863,
      "setup": 0,
      "moveAcc": 0.6499999761581421,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 70,
       "hinf": 60,
       "light": 25,
       "veh": 16,
       "titan": 5.5,
       "struct": 0,
       "cmd": 20
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "chaos_dummy_weapon",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     }
    ],
    [
     {
      "file": "sisters_flamer_bunker",
      "name": "",
      "range": 15,
      "minRange": 0,
      "reload": 0.5,
      "accuracy": 1,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0,
      "setup": 0,
      "moveAcc": 0.30000001192092896,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 80,
       "hinf": 60,
       "light": 10,
       "veh": 0,
       "titan": 20,
       "struct": 0,
       "cmd": 35
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "sisters_icons/research_upgrade_flamer",
      "requires": []
     }
    ]
   ],
   "spawns": [],
   "research": [
    "inquisition_temporal_power"
   ],
   "addons": [
    "inquisition_bunker_addon"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_temporal_power"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ]
  },
  "librarium": {
   "id": "inquisition_librarium",
   "name": "Librarium",
   "icon": "inquisition_icons/librarium_icon",
   "model": "races/inquisition_daemonhunt/structures/librarium",
   "hp": 2500,
   "armour": 100,
   "armourType": "building_med",
   "regen": 0,
   "speed": 0,
   "sight": 15,
   "cost": 175,
   "power": 50,
   "time": 20,
   "hardpoints": [],
   "spawns": [],
   "research": [
    "inquisition_tome_daemonica_1",
    "inquisition_tome_favor",
    "inquisition_tome_commendation",
    "inquisition_special_squads",
    "inquisition_tome_alacrity_4",
    "inquisition_tome_blades_improved",
    "inquisition_tome_aegis_improved",
    "inquisition_medikits",
    "inquisition_tome_dais_1",
    "inquisition_tome_dais_2",
    "inquisition_tome_psykers",
    "inquisition_tome_alacrity_2",
    "inquisition_frag_grenade_research",
    "inquisition_tome_alacrity_1",
    "inquisition_auto_repair_systems_research",
    "inquisition_tome_technician_overdrive",
    "inquisition_krak_grenades_research",
    "inquisition_tome_daemonica_3",
    "inquisition_incendiary_grenades_research",
    "inquisition_tome_alacrity_3",
    "inquisition_squad_cap",
    "inquisition_disruption_grenades_research",
    "inquisition_tome_aegis",
    "inquisition_tome_canticle",
    "inquisition_targeters",
    "inquisition_tome_blades",
    "inquisition_advanced_weapons",
    "inquisition_tome_daemonica_2",
    "inquisition_targeters_improved",
    "inquisition_advanced_weapons_2",
    "inquisition_tome_invigorate_soul"
   ],
   "addons": [],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ]
  },
  "mines": {
   "id": "inquisition_mines",
   "name": "",
   "icon": "inquisition_icons/IDH_mines_icon",
   "model": "races/imperial_guard/structures/guard_mines",
   "hp": 1000,
   "armour": 100,
   "armourType": "building_low",
   "regen": 0,
   "speed": 0,
   "sight": 10,
   "cost": 60,
   "power": 20,
   "time": 18,
   "hardpoints": [],
   "spawns": [],
   "research": [],
   "addons": [],
   "req": []
  },
  "nuclear_facility": {
   "id": "inquisition_nuclear_facility",
   "name": "Nuclear Weapon Center",
   "icon": "inquisition_icons/idh_nuke_facility_icon",
   "model": "races/sisters/structures/sister_bunker_silo",
   "hp": 6000,
   "armour": 100,
   "armourType": "building_super",
   "regen": 0,
   "speed": 0,
   "sight": 5,
   "cost": 2500,
   "power": 2500,
   "time": 290,
   "hardpoints": [],
   "spawns": [],
   "research": [
    "inquisition_begin_purification"
   ],
   "addons": [
    "addon_superweapon"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_begin_purification"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    }
   ]
  },
  "purification_decree": {
   "id": "inquisition_purification_decree",
   "name": "Purification Decree",
   "icon": "inquisition_icons/purification_decree_icon",
   "model": "races/inquisition_daemonhunt/structures/purification_decree",
   "hp": 1200,
   "armour": 100,
   "armourType": "building_low",
   "regen": 0,
   "speed": 0,
   "sight": 35,
   "cost": 140,
   "power": 0,
   "time": 40,
   "hardpoints": [],
   "spawns": [],
   "research": [],
   "addons": [
    "inquisition_extremis_diabolus",
    "inquisition_extremis_diabolus_2"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "either",
     "ids": [
      "inquisition_watch",
      "inquisition_librarium"
     ]
    }
   ]
  },
  "shrine_to_the_emperor": {
   "id": "inquisition_shrine_to_the_emperor",
   "name": "Shrine To The Emperor",
   "icon": "inquisition_icons/idh_shrine_to_the_emperor_icon",
   "model": "races/sisters/structures/shrine_to_the_emperor",
   "hp": 3000,
   "armour": 100,
   "armourType": "building_super",
   "regen": 0,
   "speed": 0,
   "sight": 6,
   "cost": 2250,
   "power": 1500,
   "time": 290,
   "hardpoints": [],
   "spawns": [],
   "research": [
    "inquisition_iron_curtain_research",
    "inquisition_tome_exterminatus_2",
    "inquisition_tome_exterminatus_3",
    "inquisition_tome_exterminatus_4",
    "inquisition_essence_omnissiah_research",
    "inquisition_tome_exterminatus_1",
    "inquisition_emperors_grey_knights_research",
    "inquisition_tome_exterminatus_5",
    "inquisition_essence_machine_spirit_research",
    "inquisition_terra_army_research",
    "inquisition_begin_purification"
   ],
   "addons": [],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_begin_purification"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    }
   ]
  },
  "strategic_point": {
   "id": "inquisition_strategic_point",
   "name": "Emplaced Strategic Point",
   "icon": "environment_icons/strategic_point_icon",
   "model": "",
   "hp": 0,
   "armour": 0,
   "armourType": "building_low",
   "regen": 0,
   "speed": 0,
   "sight": 35,
   "cost": 100,
   "power": 450,
   "time": 60,
   "hardpoints": [
    [
     {
      "file": "op_dummy_wargear_1",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 1,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 1,
      "melee": true,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "op_dummy_wargear_2",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 1,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 1,
      "melee": true,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "op_dummy_wargear_3",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 1,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 1,
      "melee": true,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     }
    ],
    [
     {
      "file": "op_dummy_wargear_1",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 1,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 1,
      "melee": true,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     }
    ]
   ],
   "spawns": [],
   "research": [],
   "addons": [],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_astra_telepathica"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    }
   ]
  },
  "tanktrap": {
   "id": "inquisition_tanktrap",
   "name": "Tank Trap",
   "icon": "inquisition_icons/idh_tank_trap_icon",
   "model": "",
   "hp": 200,
   "armour": 120,
   "armourType": "building_low",
   "regen": 0,
   "speed": 0,
   "sight": 0,
   "cost": 5,
   "power": 0,
   "time": 1,
   "hardpoints": [],
   "spawns": [],
   "research": [],
   "addons": [],
   "req": []
  },
  "tower_hq": {
   "id": "inquisition_tower_hq",
   "name": "Ordo Malleus Tower",
   "icon": "inquisition_icons/tower_hq_icon",
   "model": "races/inquisition_daemonhunt/structures/inquisition_tower",
   "hp": 7500,
   "armour": 100,
   "armourType": "building_high",
   "regen": 0,
   "speed": 0,
   "sight": 60,
   "cost": 450,
   "power": 0,
   "time": 150,
   "hardpoints": [],
   "spawns": [
    "inquisition_squad_scholar_exorcist",
    "inquisition_squad_scholar_calculus_logi",
    "inquisition_squad_archivist",
    "inquisition_squad_death_cultist",
    "inquisition_squad_inquisitor_ordo_malleus",
    "inquisition_squad_scholar_astropath",
    "inquisition_squad_bodyguard",
    "inquisition_squad_stormtroopers"
   ],
   "research": [
    "inquisition_schematic_calculus_logi",
    "inquisition_schematic_exorcist",
    "inquisition_bodyguard_upgrade_1",
    "inquisition_increase_relic_2",
    "inquisition_temporal_power",
    "inquisition_ultimate_forces",
    "inquisition_begin_purification",
    "inquisition_bodyguard_upgrade_2",
    "inquisition_increase_relic_1",
    "inquisition_schematic_death_cultists",
    "inquisition_absolute_purification",
    "inquisition_schematic_astropath"
   ],
   "addons": [
    "inquisition_tower_addon"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ]
  },
  "tower_mechanicum": {
   "id": "inquisition_tower_mechanicum",
   "name": "Titanic Mechanicum Tower",
   "icon": "inquisition_icons/idh_titan_bunker_icon",
   "model": "races/idh/structures/idh_titan_assembly_tower",
   "hp": 15000,
   "armour": 100,
   "armourType": "building_high",
   "regen": 0,
   "speed": 0,
   "sight": 45,
   "cost": 1330,
   "power": 600,
   "time": 150,
   "hardpoints": [],
   "spawns": [
    "inquisition_squad_warhound_titan",
    "inquisition_squad_imperator_titan",
    "inquisition_squad_warhound_vengence_titan"
   ],
   "research": [
    "inquisition_schematic_titan_vengence",
    "inquisition_schematic_titan_purifier",
    "inquisition_begin_purification"
   ],
   "addons": [],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_begin_purification"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    }
   ]
  },
  "turret_heavy_bolter": {
   "id": "inquisition_turret_heavy_bolter",
   "name": "",
   "icon": "inquisition_icons/IDH_turret_icon",
   "model": "races/imperial_turrs/structures/dehun_turret_heavy_bolter",
   "hp": 2800,
   "armour": 100,
   "armourType": "building_low",
   "regen": 0,
   "speed": 0,
   "sight": 55,
   "cost": 85,
   "power": 235,
   "time": 40,
   "hardpoints": [
    [
     {
      "file": "inquisition_heavy_bolter_turret",
      "name": "",
      "range": 35,
      "minRange": 0,
      "reload": 0.4000000059604645,
      "accuracy": 0.800000011920929,
      "min": 58,
      "max": 70,
      "pierce": 0,
      "morale": 14,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 70,
       "hinf": 60,
       "light": 10,
       "veh": 5,
       "titan": 5.5,
       "struct": 0,
       "cmd": 20
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "inquisition_missile_turret",
      "name": "",
      "range": 40,
      "minRange": 0,
      "reload": 2,
      "accuracy": 0.800000011920929,
      "min": 430,
      "max": 654,
      "pierce": 0,
      "morale": 50,
      "setup": 0,
      "moveAcc": 0.6499999761581421,
      "melee": false,
      "aoe": 3,
      "vs": {
       "inf": 25,
       "hinf": 25,
       "light": 60,
       "veh": 50,
       "titan": 10,
       "struct": 14,
       "cmd": 12
      },
      "cost": 25,
      "power": 90,
      "time": 15,
      "icon": "guard_Icons\\guard_missile_turret",
      "requires": []
     },
     {
      "file": "inquisition_missile_turret_improved",
      "name": "",
      "range": 60,
      "minRange": 0,
      "reload": 7,
      "accuracy": 1,
      "min": 672,
      "max": 985,
      "pierce": 5,
      "morale": 154,
      "setup": 0,
      "moveAcc": 0.6499999761581421,
      "melee": false,
      "aoe": 10,
      "vs": {
       "inf": 25,
       "hinf": 25,
       "light": 60,
       "veh": 50,
       "titan": 10,
       "struct": 14,
       "cmd": 12
      },
      "cost": 25,
      "power": 90,
      "time": 15,
      "icon": "guard_Icons\\guard_missile_turret",
      "requires": []
     },
     {
      "file": "space_marine_dummy_weapon",
      "name": "",
      "range": 0,
      "minRange": 0,
      "reload": 0,
      "accuracy": 0.6499999761581421,
      "min": 0,
      "max": 0,
      "pierce": 0,
      "morale": 0.05000000074505806,
      "setup": 0,
      "moveAcc": 0.5,
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0,
       "cmd": 0
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     }
    ]
   ],
   "spawns": [],
   "research": [
    "inquisition_turret_upgrade2",
    "inquisition_turret_upgrade1"
   ],
   "addons": [
    "inquisition_turret_addon_probe",
    "inquisition_turret_addon",
    "inquisition_turret_improved_addon"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "either",
     "ids": [
      "inquisition_watch",
      "inquisition_librarium"
     ]
    }
   ]
  },
  "wall": {
   "id": "inquisition_wall",
   "name": "Defensive Wall",
   "icon": "inquisition_icons/wall_0_icon",
   "model": "",
   "hp": 4000,
   "armour": 100,
   "armourType": "building_med",
   "regen": 0,
   "speed": 0,
   "sight": 5,
   "cost": 165,
   "power": 0,
   "time": 8,
   "hardpoints": [],
   "spawns": [],
   "research": [
    "inquisition_walls_research",
    "inquisition_temporal_power"
   ],
   "addons": [],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_temporal_power"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ]
  },
  "warp_generator": {
   "id": "inquisition_warp_generator",
   "name": "",
   "icon": "inquisition_icons/warp_generator_icon",
   "model": "races/inquisition_daemonhunt/structures/generator_small",
   "hp": 1500,
   "armour": 100,
   "armourType": "building_low",
   "regen": 0,
   "speed": 0,
   "sight": 15,
   "cost": 135,
   "power": 0,
   "time": 30,
   "hardpoints": [],
   "spawns": [],
   "research": [
    "inquisition_power_research_5",
    "inquisition_power_research_4",
    "inquisition_power_research_2",
    "inquisition_power_research_3",
    "inquisition_power_research_1"
   ],
   "addons": [],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ]
  },
  "warp_reactor": {
   "id": "inquisition_warp_reactor",
   "name": "",
   "icon": "inquisition_icons/warp_reactor_icon",
   "model": "races/inquisition_daemonhunt/structures/generator_big",
   "hp": 2500,
   "armour": 100,
   "armourType": "building_med",
   "regen": 0,
   "speed": 0,
   "sight": 15,
   "cost": 250,
   "power": 0,
   "time": 60,
   "hardpoints": [],
   "spawns": [],
   "research": [
    "inquisition_power_research_5",
    "inquisition_power_research_4",
    "inquisition_power_research_2",
    "inquisition_power_research_3",
    "inquisition_power_research_1"
   ],
   "addons": [],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    }
   ]
  },
  "watch": {
   "id": "inquisition_watch",
   "name": "Inquisition Watch",
   "icon": "inquisition_icons/watch_icon",
   "model": "races/inquisition_daemonhunt/structures/inquisition_watch",
   "hp": 5000,
   "armour": 100,
   "armourType": "building_med",
   "regen": 0,
   "speed": 0,
   "sight": 15,
   "cost": 220,
   "power": 0,
   "time": 57,
   "hardpoints": [],
   "spawns": [
    "inquisition_squad_scholars",
    "inquisition_squad_shock_troops",
    "inquisition_squad_land_raider_crusader",
    "inquisition_squad_servitor_maintenance",
    "inquisition_squad_razorback",
    "inquisition_squad_predator",
    "inquisition_squad_servitor_weapon",
    "inquisition_squad_servitor_melee",
    "inquisition_squad_rhino",
    "inquisition_squad_land_raider",
    "inquisition_squad_inquisitor_lord",
    "inquisition_squad_land_raider_redeemer",
    "inquisition_squad_grenaider_troops",
    "inquisition_squad_damocles",
    "inquisition_squad_land_raider_daemonhunter",
    "inquisition_squad_chimera_transport",
    "inquisition_squad_whirlwind"
   ],
   "research": [
    "inquisition_schematic_razorback",
    "inquisition_schematic_land_raider_special",
    "inquisition_schematic_damocles",
    "inquisition_schematic_chimera",
    "inquisition_schematic_whirlwind",
    "inquisition_schematic_predator",
    "inquisition_schematic_land_raiders",
    "inquisition_schematic_rhino",
    "inquisition_schematic_servitors_maintenance",
    "inquisition_support_cap_1",
    "inquisition_schematic_servitors",
    "inquisition_support_cap_2",
    "inquisition_schematic_grenaiders"
   ],
   "addons": [],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ]
  }
 },
 "research": {
  "inquisition_schematic_dreadnought": {
   "name": "Schematic: Dreadnought",
   "info": "- Allows the production of Dreadnoughts.",
   "icon": "inquisition_icons\\schematic_dreadnought_icon",
   "cost": 0,
   "power": 80,
   "time": 8,
   "requires": [
    "inquisition_tower_addon",
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "astra_telepathica"
  },
  "inquisition_schematic_dreadnoughts": {
   "name": "Schematic: Advanced Dreadnoughts",
   "info": "- Allows the production of Purgation Dreadnoughts and Venerable Dreadnoughts.",
   "icon": "inquisition_icons/schematic_dreadnought_advanced_icon",
   "cost": 0,
   "power": 100,
   "time": 13,
   "requires": [
    "inquisition_tower_addon",
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "astra_telepathica"
  },
  "inquisition_schematic_vulture": {
   "name": "Schematic: Vulture Gunship",
   "info": "- Allows the production of Vulture Gunships.",
   "icon": "inquisition_icons/schematic_vulture_icon",
   "cost": 0,
   "power": 200,
   "time": 15,
   "requires": [
    "inquisition_tower_addon",
    "inquisition_ultimate_forces",
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_ultimate_forces"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "astra_telepathica"
  },
  "inquisition_schematic_grey_knight": {
   "name": "",
   "info": "- Allows the production of Grey Knight Interceptors.",
   "icon": "inquisition_icons/schematic_grey_knight_icon",
   "cost": 0,
   "power": 35,
   "time": 6,
   "requires": [
    "inquisition_tower_addon",
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "astra_telepathica"
  },
  "inquisition_schematic_valkyrie": {
   "name": "Schematic: Valkyrie Transport",
   "info": "- Allows the production of Valkyries.",
   "icon": "inquisition_icons/schematic_valkyrie_icon",
   "cost": 0,
   "power": 100,
   "time": 12,
   "requires": [
    "inquisition_tower_addon",
    "inquisition_temporal_power",
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_temporal_power"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "astra_telepathica"
  },
  "inquisition_schematic_stormraven_fury": {
   "name": "Schematic: Stormraven Fury",
   "info": "- Allows the production of the Stormraven Fury relic / transport aircraft.",
   "icon": "inquisition_icons/schematic_stormraven_fury_icon",
   "cost": 0,
   "power": 300,
   "time": 30,
   "requires": [
    "inquisition_ultimate_forces",
    "inquisition_tower_hq",
    "inquisition_tower_addon"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_ultimate_forces"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    }
   ],
   "mods": [],
   "building": "astra_telepathica"
  },
  "inquisition_schematic_thunderfire_cannon": {
   "name": "Schematic: Thunderfire Cannon",
   "info": "- Allows the production of Thunderfire Cannons.",
   "icon": "inquisition_icons/schematic_thunderfire_cannon_icon",
   "cost": 0,
   "power": 25,
   "time": 3,
   "requires": [
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "astra_telepathica"
  },
  "inquisition_schematic_land_speeder_tempest": {
   "name": "Schematic: Land Speeder Tempest",
   "info": "- Allows the production of Land Speeder Tempests.",
   "icon": "inquisition_icons/schematic_land_speeder_tempest_icon",
   "cost": 0,
   "power": 35,
   "time": 6,
   "requires": [
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "astra_telepathica"
  },
  "inquisition_schematic_turret": {
   "name": "Schematic: Deepstrike Heavy Bolter Turret",
   "info": "- Allows the production of deepstrikable Heavy Bolter harrassment turrets.",
   "icon": "inquisition_icons/schematic_idh_turret_icon",
   "cost": 0,
   "power": 15,
   "time": 2,
   "requires": [
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "astra_telepathica"
  },
  "inquisition_schematic_grey_knight_terminator": {
   "name": "Schematic: Grey Knight Terminators",
   "info": "- Allows the production of Grey Knight Terminators.",
   "icon": "inquisition_icons/schematic_gk_terminator_icon",
   "cost": 0,
   "power": 200,
   "time": 20,
   "requires": [
    "inquisition_ultimate_forces",
    "inquisition_tower_hq",
    "inquisition_tower_addon"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_ultimate_forces"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    }
   ],
   "mods": [],
   "building": "grey_knights_teleporter"
  },
  "inquisition_schematic_dreadknight": {
   "name": "Schematic: Nemesis Dreadknight",
   "info": "- Allows the production of the Nemesis Dreadknight.",
   "icon": "inquisition_icons/schematic_nemesis_dreadknight_icon",
   "cost": 0,
   "power": 300,
   "time": 30,
   "requires": [
    "inquisition_ultimate_forces",
    "inquisition_tower_hq",
    "inquisition_tower_addon"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_ultimate_forces"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    }
   ],
   "mods": [],
   "building": "grey_knights_teleporter"
  },
  "inquisition_schematic_grey_knight_purifier": {
   "name": "Schematic: Grey Knight Purifiers",
   "info": "- Allows the production of Grey Knight Purifiers.",
   "icon": "inquisition_icons/schematic_grey_knight_purifier_icon",
   "cost": 0,
   "power": 50,
   "time": 10,
   "requires": [
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "grey_knights_teleporter"
  },
  "inquisition_schematic_grey_knight_terminator_paladin": {
   "name": "Schematic: Grey Knight Paladins",
   "info": "- Allows the production of Grey Knight Paladins.",
   "icon": "inquisition_icons/schematic_grey_knight_terminator_paladin_icon",
   "cost": 0,
   "power": 500,
   "time": 120,
   "requires": [
    "inquisition_begin_purification",
    "inquisition_tower_hq",
    "inquisition_tower_addon"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_begin_purification"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    }
   ],
   "mods": [],
   "building": "grey_knights_teleporter"
  },
  "inquisition_schematic_grey_knight_interceptor": {
   "name": "Schematic: Grey Knight Interceptors",
   "info": "- Allows the production of Grey Knight Interceptors.",
   "icon": "inquisition_icons/schematic_grey_knight_interceptor_icon",
   "cost": 0,
   "power": 35,
   "time": 6,
   "requires": [
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "grey_knights_teleporter"
  },
  "inquisition_schematic_grey_knight_purgator": {
   "name": "Schematic: Grey Knight Purgators",
   "info": "- Allows the production of Grey Knight Purgators.",
   "icon": "inquisition_icons/schematic_grey_knight_purgator_icon",
   "cost": 0,
   "power": 35,
   "time": 6,
   "requires": [
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "grey_knights_teleporter"
  },
  "inquisition_temporal_power": {
   "name": "Temporal Power (Tier II)",
   "info": "- Allows more advanced units, research, and structures.",
   "icon": "inquisition_icons/temporal_power_research",
   "cost": 500,
   "power": 500,
   "time": 60,
   "requires": [
    "inquisition_astra_telepathica",
    "inquisition_tower_hq",
    "inquisition_tower_addon"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_astra_telepathica"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "local_addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "local_addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    }
   ],
   "mods": [
    {
     "type": "morale_rate_squad",
     "value": 2,
     "add": true,
     "target": "inquisition_squad_inquisitor_ordo_malleus",
     "on": "squad_type"
    },
    {
     "type": "morale_rate_squad",
     "value": 2,
     "add": true,
     "target": "inquisition_squad_inquisitor_lord",
     "on": "squad_type"
    },
    {
     "type": "morale_maximum_squad",
     "value": 300,
     "add": true,
     "target": "inquisition_squad_inquisitor_ordo_malleus",
     "on": "squad_type"
    },
    {
     "type": "morale_maximum_squad",
     "value": 300,
     "add": true,
     "target": "inquisition_squad_inquisitor_lord",
     "on": "squad_type"
    }
   ],
   "building": "grey_knights_teleporter"
  },
  "inquisition_requisition_research_5": {
   "name": "Increased Requisition Income V",
   "info": "",
   "icon": "space_marine_icons/req_inc_research_5",
   "cost": 300,
   "power": 1100,
   "time": 125,
   "requires": [
    "inquisition_absolute_purification"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_absolute_purification"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_requisition_research_4"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_requisition_research_4"
     ]
    }
   ],
   "mods": [
    {
     "type": "income_requisition_player",
     "value": 1.2000000476837158,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "imperial_icon"
  },
  "inquisition_listening_post_upgrade": {
   "name": "Improved Strategic Hold Research",
   "info": "- Increases the health, damage, and maximum weapon ranges of all Listening Posts.",
   "icon": "inquisition_icons/imperial_icon_research",
   "cost": 600,
   "power": 240,
   "time": 170,
   "requires": [
    "inquisition_tower_addon",
    "inquisition_temporal_power",
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_temporal_power"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [
    {
     "type": "max_range_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_warp_zap_sanctuary",
     "on": "weapon_type"
    },
    {
     "type": "enable_armour_2",
     "value": 1,
     "add": false,
     "target": "chaos_listening_post",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 2,
     "add": false,
     "target": "inquisition_warp_zap_sanctuary",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 2,
     "add": false,
     "target": "inquisition_warp_zap_pentagram",
     "on": "weapon_type"
    },
    {
     "type": "keen_sight_radius",
     "value": 10,
     "add": true,
     "target": "inquisition_imperial_icon",
     "on": "entity_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 2,
     "add": false,
     "target": "inquisition_warp_zap_sanctuary",
     "on": "weapon_type"
    },
    {
     "type": "max_range_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_warp_zap_pentagram",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 2,
     "add": false,
     "target": "inquisition_warp_zap_pentagram",
     "on": "weapon_type"
    }
   ],
   "building": "imperial_icon"
  },
  "inquisition_requisition_research_4": {
   "name": "Increased Requisition Income IV",
   "info": "",
   "icon": "space_marine_icons/req_inc_research_4",
   "cost": 150,
   "power": 550,
   "time": 125,
   "requires": [
    "inquisition_begin_purification"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_begin_purification"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_requisition_research_3"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_requisition_research_3"
     ]
    }
   ],
   "mods": [
    {
     "type": "income_requisition_player",
     "value": 1.100000023841858,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "imperial_icon"
  },
  "inquisition_pentagrams": {
   "name": "Pentagrams Research",
   "info": "- Fortifies all Listening Posts and Purifaction Decrees with a more powerful anti daemon aura which strengthens the radius and damage dealt to monstrous creatures.",
   "icon": "inquisition_icons/pentagrams_research",
   "cost": 80,
   "power": 600,
   "time": 221,
   "requires": [
    "inquisition_tower_hq",
    "inquisition_ultimate_forces",
    "inquisition_tower_addon"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_ultimate_forces"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    }
   ],
   "mods": [],
   "building": "imperial_icon"
  },
  "inquisition_requisition_research_2": {
   "name": "Increased Requisition Income II",
   "info": "",
   "icon": "space_marine_icons/req_inc_research_2",
   "cost": 100,
   "power": 350,
   "time": 95,
   "requires": [
    "inquisition_temporal_power"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_temporal_power"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_requisition_research_1"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_requisition_research_1"
     ]
    }
   ],
   "mods": [
    {
     "type": "income_requisition_player",
     "value": 1.100000023841858,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "imperial_icon"
  },
  "inquisition_requisition_research_3": {
   "name": "Increased Requisition Income III",
   "info": "",
   "icon": "space_marine_icons/req_inc_research_3",
   "cost": 125,
   "power": 450,
   "time": 115,
   "requires": [
    "inquisition_ultimate_forces"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_ultimate_forces"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_requisition_research_2"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_requisition_research_2"
     ]
    }
   ],
   "mods": [
    {
     "type": "income_requisition_player",
     "value": 1.100000023841858,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "imperial_icon"
  },
  "inquisition_requisition_research_1": {
   "name": "Increased Requisition Income I",
   "info": "",
   "icon": "space_marine_icons/req_inc_research_1",
   "cost": 75,
   "power": 250,
   "time": 60,
   "requires": [
    "inquisition_tower_addon"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    }
   ],
   "mods": [
    {
     "type": "income_requisition_player",
     "value": 1.100000023841858,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "imperial_icon"
  },
  "inquisition_tome_daemonica_1": {
   "name": "Tome: Libre Daemonica - Section I",
   "info": "- Grants all grey knights and grey knight dreadnoughts attacks that decrease their targets health regeneration.",
   "icon": "inquisition_icons/tome_daemonica_1_icon",
   "cost": 160,
   "power": 90,
   "time": 60,
   "requires": [
    "inquisition_grey_knights_teleporter",
    "inquisition_librarium"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_grey_knights_teleporter"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knight_champion",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_06",
     "value": 2,
     "add": false,
     "target": "inquisition_dreadnought_assault",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights_terminator",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knight_hero",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights_justicar",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_06",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights_purifier",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_06",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights_terminator_justicar",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_06",
     "value": 2,
     "add": false,
     "target": "inquisition_dreadnought_venerable",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights_terminator_justicar",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_06",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights_interceptor",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_06",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights_terminator_paladin",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights_purgator",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights_purifier",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_06",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knight_champion",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_06",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights_terminator",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_dreadnought_support",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_06",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights_justicar",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_dreadnought_venerable",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights_interceptor",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_06",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights_purgator",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights_terminator_paladin",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_06",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_dreadnought_assault",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_06",
     "value": 2,
     "add": false,
     "target": "inquisition_dreadnought_support",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_06",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knight_hero",
     "on": "entity_type"
    }
   ],
   "building": "librarium"
  },
  "inquisition_tome_favor": {
   "name": "Tome of the Mechanicus: Favor of the Omnissiah",
   "info": "- Increases the mobility of all titans.",
   "icon": "inquisition_icons/tome_favor_omnissiah_icon",
   "cost": 300,
   "power": 125,
   "time": 10,
   "requires": [
    "inquisition_tower_mechanicum",
    "inquisition_tower_hq",
    "inquisition_begin_purification"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_mechanicum"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_begin_purification"
     ]
    }
   ],
   "mods": [
    {
     "type": "speed_maximum",
     "value": 1.5,
     "add": false,
     "target": "inquisition_warhound_vengence_titan",
     "on": "entity_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.5,
     "add": false,
     "target": "inquisition_warhound_titan",
     "on": "entity_type"
    }
   ],
   "building": "librarium"
  },
  "inquisition_tome_commendation": {
   "name": "Inquisitorial Mandate: Inquisitorial Commendation.",
   "info": "- Permanently increases the morale of all infantry.",
   "icon": "inquisition_icons/tome_commendation_icon",
   "cost": 80,
   "power": 65,
   "time": 10,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "morale_maximum_player",
     "value": 100,
     "add": true,
     "target": "",
     "on": "player"
    }
   ],
   "building": "librarium"
  },
  "inquisition_special_squads": {
   "name": "Reinforcements Research II",
   "info": "- Further increases the health of all non Grey Knight infantry.",
   "icon": "inquisition_icons/special_squads_research",
   "cost": 150,
   "power": 100,
   "time": 60,
   "requires": [
    "inquisition_squad_cap",
    "inquisition_temporal_power",
    "inquisition_librarium"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_squad_cap"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_temporal_power"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_squad_cap"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    }
   ],
   "mods": [
    {
     "type": "max_upgrades_squad",
     "value": 2,
     "add": true,
     "target": "inquisition_squad_bodyguard",
     "on": "squad_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 3,
     "add": true,
     "target": "inquisition_squad_stormtroopers",
     "on": "squad_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_servitor_melee",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_scholars",
     "on": "entity_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 3,
     "add": true,
     "target": "inquisition_squad_scholars",
     "on": "squad_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_servitor_maintenance",
     "on": "entity_type"
    },
    {
     "type": "max_upgrades_squad",
     "value": 1,
     "add": true,
     "target": "inquisition_squad_servitor_weapon",
     "on": "squad_type"
    },
    {
     "type": "max_upgrades_squad",
     "value": 2,
     "add": true,
     "target": "inquisition_squad_grenaider_troops",
     "on": "squad_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_bodyguard",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_stormtrooper",
     "on": "entity_type"
    },
    {
     "type": "max_upgrades_squad",
     "value": 1,
     "add": true,
     "target": "inquisition_squad_stormtroopers",
     "on": "squad_type"
    },
    {
     "type": "max_upgrades_squad",
     "value": 1,
     "add": true,
     "target": "inquisition_squad_shock_troops",
     "on": "squad_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_inquisitor_acolyte",
     "on": "entity_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 2,
     "add": true,
     "target": "inquisition_squad_shock_troops",
     "on": "squad_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 2,
     "add": true,
     "target": "inquisition_squad_grenaider_troops",
     "on": "squad_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_servitor_weapon",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_grenaider_troops",
     "on": "entity_type"
    },
    {
     "type": "max_upgrades_squad",
     "value": 1,
     "add": true,
     "target": "inquisition_squad_servitor_melee",
     "on": "squad_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_shock_troops",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_death_cultist",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_shock_troops_sergeant",
     "on": "entity_type"
    }
   ],
   "building": "librarium"
  },
  "inquisition_tome_alacrity_4": {
   "name": "Tome: Alacrity of Business - Volume IV",
   "info": "- Increases the production rates of all Urban Territories.",
   "icon": "inquisition_icons/tome_alacrity_4_icon",
   "cost": 300,
   "power": 100,
   "time": 10,
   "requires": [
    "inquisition_ultimate_forces",
    "inquisition_tome_alacrity_3"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_ultimate_forces"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_tome_alacrity_3"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_tome_alacrity_3"
     ]
    }
   ],
   "mods": [
    {
     "type": "production_speed",
     "value": 1.2999999523162842,
     "add": false,
     "target": "inquisition_civilian_bunker_ai",
     "on": "entity_type"
    },
    {
     "type": "production_speed",
     "value": 1.2999999523162842,
     "add": false,
     "target": "inquisition_civilian_bunker",
     "on": "entity_type"
    }
   ],
   "building": "librarium"
  },
  "inquisition_tome_blades_improved": {
   "name": "",
   "info": "- Increases the damage of all Grey Knight weapons and Dreadnought fists.",
   "icon": "inquisition_icons/tome_blades_improved_icon",
   "cost": 240,
   "power": 120,
   "time": 60,
   "requires": [
    "inquisition_grey_knights_teleporter",
    "inquisition_tome_blades",
    "inquisition_ultimate_forces",
    "inquisition_librarium"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_grey_knights_teleporter"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_tome_blades"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_ultimate_forces"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_tome_blades"
     ]
    }
   ],
   "mods": [
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_staff_psyker",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_incinerator_gk_paladin",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_nemesis_weapon_gk_paladin",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_nemesis_weapon_captain",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_storm_bolter_gk_paladin",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_daemon_hammer_grey_knight",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_storm_bolter_gk_terminator",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_psycannon_gk_paladin",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_psycannon_gk_paladin",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_incinerator_gk_paladin",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_nemesis_weapon_grey_knight",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_halberd_grey_knight",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_nemesis_weapon_gk_terminator",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_daemon_hammer_grey_knight_terminator",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_storm_bolter_gk_justicar",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_halberd_grey_knight_interceptor",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_daemon_hammer_grey_knight",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_psycannon_grey_knight",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_nemesis_weapon_gk_terminator",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_storm_bolter_gk_justicar",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_nemesis_weapon_falchions",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_nemesis_weapon_gk_paladin",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_nemesis_weapon_falchions",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_storm_bolter_grey_knight",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_halberd_grey_knight",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_daemon_hammer_grey_knight_terminator",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_psycannon_gk_terminator",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_incinerator_gk_terminator",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_incinerator_grey_knight",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_incinerator_gk_terminator",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_nemesis_weapon_grey_knight",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_halberd_grey_knight_interceptor",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_psycannon_grey_knight",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_staff_psyker",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_psycannon_gk_terminator",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_storm_bolter_grey_knight",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_storm_bolter_gk_paladin",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_storm_bolter_gk_terminator",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_nemesis_weapon_captain",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_incinerator_grey_knight",
     "on": "weapon_type"
    }
   ],
   "building": "librarium"
  },
  "inquisition_tome_aegis_improved": {
   "name": "",
   "info": "- Increases the durability of all Grey Knights.",
   "icon": "inquisition_icons/tome_aegis_improved_icon",
   "cost": 240,
   "power": 120,
   "time": 60,
   "requires": [
    "inquisition_grey_knights_teleporter",
    "inquisition_tome_aegis",
    "inquisition_ultimate_forces",
    "inquisition_librarium"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_grey_knights_teleporter"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_tome_aegis"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_ultimate_forces"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_tome_aegis"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_grey_knights_terminator",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_grey_knights_astra",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_grey_knights_terminator_paladin",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_grey_knights_purgator",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2999999523162842,
     "add": false,
     "target": "inquisition_dreadknight_titan",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_grey_knights_purifier",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_grey_knights_terminator_justicar",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_grey_knights_justicar",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 2,
     "add": true,
     "target": "inquisition_dreadknight_titan",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 3,
     "add": true,
     "target": "inquisition_grey_knights_purifier",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_grey_knight_champion",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 3,
     "add": true,
     "target": "inquisition_grey_knight_champion",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 3,
     "add": true,
     "target": "inquisition_grey_knights",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 3,
     "add": true,
     "target": "inquisition_grey_knights_purgator",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 3,
     "add": true,
     "target": "inquisition_grey_knights_interceptor",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 3,
     "add": true,
     "target": "inquisition_grey_knights_terminator_paladin",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 3,
     "add": true,
     "target": "inquisition_grey_knights_terminator_justicar",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 3,
     "add": true,
     "target": "inquisition_grey_knights_justicar",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_grey_knights",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 3,
     "add": true,
     "target": "inquisition_grey_knights_astra",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 3,
     "add": true,
     "target": "inquisition_grey_knights_terminator",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_grey_knights_interceptor",
     "on": "entity_type"
    }
   ],
   "building": "librarium"
  },
  "inquisition_medikits": {
   "name": "Medkits Research",
   "info": "- Allows most infantry, even Grey Knights and commanders to use medkits.",
   "icon": "inquisition_icons/medikit_research",
   "cost": 75,
   "power": 25,
   "time": 50,
   "requires": [
    "inquisition_tower_hq",
    "inquisition_librarium"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    }
   ],
   "mods": [],
   "building": "librarium"
  },
  "inquisition_tome_dais_1": {
   "name": "Tome of the Mechanicus: Motored Dais enhancements - Volume I",
   "info": "+ Tomes describe lengthy Mechanicus rites for modifying the platform on which the Archivists fly. Processes often called for by high ranking Mechanicus adepts, usually as a symbol of status amongst their peers. Confers stronger frames and more sophisticated propulsion systems to the platforms.",
   "icon": "inquisition_icons/tome_dais_1_icon",
   "cost": 40,
   "power": 20,
   "time": 10,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "health_maximum",
     "value": 300,
     "add": true,
     "target": "inquisition_archivist",
     "on": "entity_type"
    },
    {
     "type": "enable_squad_jump",
     "value": 2,
     "add": false,
     "target": "inquisition_squad_archivist",
     "on": "squad_type"
    }
   ],
   "building": "librarium"
  },
  "inquisition_tome_dais_2": {
   "name": "Tome of the Mechanicus: Motored Dais enhancements - Volume II",
   "info": "+ Tomes describe lengthy Mechanicus rites for modifying the platform on which the Archivists fly. Processes often called for by high ranking Mechanicus adepts, usually as a symbol of status amongst their peers. Confers stronger frames and more sophisticated propulsion systems to the platforms.",
   "icon": "inquisition_icons/tome_dais_2_icon",
   "cost": 130,
   "power": 60,
   "time": 10,
   "requires": [
    "inquisition_tome_dais_1"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_tome_dais_1"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_tome_dais_1"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_maximum",
     "value": 300,
     "add": true,
     "target": "inquisition_archivist",
     "on": "entity_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.5,
     "add": false,
     "target": "inquisition_archivist",
     "on": "entity_type"
    }
   ],
   "building": "librarium"
  },
  "inquisition_tome_psykers": {
   "name": "Tome: Powers of the Psyker",
   "info": "- Allows the Nemesis, Psychic Quake, Strike of Justice, and Banish abilities for specific Grey Knight units.",
   "icon": "inquisition_icons/tome_psykerpower_icon",
   "cost": 190,
   "power": 100,
   "time": 10,
   "requires": [
    "inquisition_grey_knights_teleporter",
    "inquisition_librarium"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_grey_knights_teleporter"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    }
   ],
   "mods": [
    {
     "type": "enable_melee_leap",
     "value": 1,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "librarium"
  },
  "inquisition_tome_alacrity_2": {
   "name": "Tome: Alacrity of Business - Volume II",
   "info": "- Increases the production rates of all Urban Territories.",
   "icon": "inquisition_icons/tome_alacrity_2_icon",
   "cost": 200,
   "power": 60,
   "time": 10,
   "requires": [
    "inquisition_tower_addon",
    "inquisition_tome_alacrity_1"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_tome_alacrity_1"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_tome_alacrity_1"
     ]
    }
   ],
   "mods": [
    {
     "type": "production_speed",
     "value": 1.2999999523162842,
     "add": false,
     "target": "inquisition_civilian_bunker_ai",
     "on": "entity_type"
    },
    {
     "type": "production_speed",
     "value": 1.25,
     "add": false,
     "target": "inquisition_civilian_bunker",
     "on": "entity_type"
    }
   ],
   "building": "librarium"
  },
  "inquisition_frag_grenade_research": {
   "name": "",
   "info": "- Tactical grenade.",
   "icon": "inquisition_icons/fraggrenaderesearch_icon",
   "cost": 25,
   "power": 75,
   "time": 35,
   "requires": [
    "inquisition_tower_hq",
    "inquisition_librarium"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    }
   ],
   "mods": [],
   "building": "librarium"
  },
  "inquisition_tome_alacrity_1": {
   "name": "Tome: Alacrity of Business - Volume I",
   "info": "- Increases the production rates of all Urban Territories.",
   "icon": "inquisition_icons/tome_alacrity_1_icon",
   "cost": 150,
   "power": 40,
   "time": 10,
   "requires": [
    "inquisition_librarium"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    }
   ],
   "mods": [
    {
     "type": "production_speed",
     "value": 1.2999999523162842,
     "add": false,
     "target": "inquisition_civilian_bunker_ai",
     "on": "entity_type"
    },
    {
     "type": "production_speed",
     "value": 1.25,
     "add": false,
     "target": "inquisition_civilian_bunker",
     "on": "entity_type"
    }
   ],
   "building": "librarium"
  },
  "inquisition_auto_repair_systems_research": {
   "name": "Auto Repair Systems Research",
   "info": "- Equips Rhino Transports with the ability to repair the hull of itself and surrounding vehicles within the area for a duration.",
   "icon": "inquisition_icons/auto_repair_research",
   "cost": 80,
   "power": 15,
   "time": 15,
   "requires": [
    "inquisition_tower_addon",
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "librarium"
  },
  "inquisition_tome_technician_overdrive": {
   "name": "Tome of the Mechanicus: Technician Overdrive",
   "info": "- Improves the repair speed of all maintenance servitors.",
   "icon": "inquisition_icons/tome_technician_overdrive_icon",
   "cost": 90,
   "power": 75,
   "time": 10,
   "requires": [
    "inquisition_tower_addon",
    "inquisition_librarium"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    }
   ],
   "mods": [
    {
     "type": "repair_rate",
     "value": 1.5,
     "add": false,
     "target": "inquisition_servitor_maintenance",
     "on": "entity_type"
    },
    {
     "type": "construction_speed",
     "value": 1.5,
     "add": false,
     "target": "inquisition_archivist",
     "on": "entity_type"
    },
    {
     "type": "repair_cost",
     "value": 0.5,
     "add": false,
     "target": "inquisition_servitor_maintenance",
     "on": "entity_type"
    }
   ],
   "building": "librarium"
  },
  "inquisition_krak_grenades_research": {
   "name": "",
   "info": "- Tactical grenade.",
   "icon": "sisters_icons/research_krak_grenades",
   "cost": 75,
   "power": 75,
   "time": 40,
   "requires": [
    "inquisition_frag_grenade_research",
    "inquisition_tower_addon",
    "inquisition_librarium"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_frag_grenade_research"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_frag_grenade_research"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    }
   ],
   "mods": [],
   "building": "librarium"
  },
  "inquisition_tome_daemonica_3": {
   "name": "Tome: Libre Daemonica - Section III",
   "info": "- Grants all grey knights and grey knight dreadnoughts attacks that decrease their targets health regeneration.",
   "icon": "inquisition_icons/tome_daemonica_3_icon",
   "cost": 260,
   "power": 190,
   "time": 60,
   "requires": [
    "inquisition_begin_purification",
    "inquisition_tome_psykers",
    "inquisition_tome_daemonica_2",
    "inquisition_tome_blades",
    "inquisition_tome_aegis"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_begin_purification"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_tome_psykers"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_tome_daemonica_2"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_tome_blades"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_tome_daemonica_2"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_tome_aegis"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knight_champion",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_08",
     "value": 2,
     "add": false,
     "target": "inquisition_dreadnought_assault",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights_terminator",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knight_hero",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights_justicar",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_08",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights_purifier",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_08",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights_terminator_justicar",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_08",
     "value": 2,
     "add": false,
     "target": "inquisition_dreadnought_venerable",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights_terminator_justicar",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_08",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights_interceptor",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_08",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights_terminator_paladin",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights_purgator",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights_purifier",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_08",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knight_champion",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_08",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights_terminator",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_dreadnought_support",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_08",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights_justicar",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_dreadnought_venerable",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights_interceptor",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_08",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights_purgator",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights_terminator_paladin",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_08",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_dreadnought_assault",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_08",
     "value": 2,
     "add": false,
     "target": "inquisition_dreadnought_support",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_08",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knight_hero",
     "on": "entity_type"
    }
   ],
   "building": "librarium"
  },
  "inquisition_incendiary_grenades_research": {
   "name": "Wargear: Inferno Grenades",
   "info": "- Tactical grenade.",
   "icon": "inquisition_icons/incendiarygrenade_research",
   "cost": 50,
   "power": 75,
   "time": 35,
   "requires": [
    "inquisition_tower_hq",
    "inquisition_librarium"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    }
   ],
   "mods": [],
   "building": "librarium"
  },
  "inquisition_tome_alacrity_3": {
   "name": "Tome: Alacrity of Business - Volume III",
   "info": "- Increases the production rates of all Urban Territories.",
   "icon": "inquisition_icons/tome_alacrity_3_icon",
   "cost": 250,
   "power": 80,
   "time": 10,
   "requires": [
    "inquisition_temporal_power",
    "inquisition_tome_alacrity_2"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_temporal_power"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_tome_alacrity_2"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_tome_alacrity_2"
     ]
    }
   ],
   "mods": [
    {
     "type": "production_speed",
     "value": 1.2999999523162842,
     "add": false,
     "target": "inquisition_civilian_bunker_ai",
     "on": "entity_type"
    },
    {
     "type": "production_speed",
     "value": 1.2999999523162842,
     "add": false,
     "target": "inquisition_civilian_bunker",
     "on": "entity_type"
    }
   ],
   "building": "librarium"
  },
  "inquisition_squad_cap": {
   "name": "Reinforcements Research I",
   "info": "- Increases the health of all non Grey Knight infantry.",
   "icon": "inquisition_icons/squadcap_research",
   "cost": 125,
   "power": 75,
   "time": 45,
   "requires": [
    "inquisition_tower_addon",
    "inquisition_tower_hq",
    "inquisition_librarium"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    }
   ],
   "mods": [
    {
     "type": "max_upgrades_squad",
     "value": 2,
     "add": true,
     "target": "inquisition_squad_bodyguard",
     "on": "squad_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 3,
     "add": true,
     "target": "inquisition_squad_stormtroopers",
     "on": "squad_type"
    },
    {
     "type": "health_maximum",
     "value": 1.149999976158142,
     "add": false,
     "target": "inquisition_servitor_melee",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_scholars",
     "on": "entity_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 3,
     "add": true,
     "target": "inquisition_squad_scholars",
     "on": "squad_type"
    },
    {
     "type": "health_maximum",
     "value": 1.149999976158142,
     "add": false,
     "target": "inquisition_servitor_maintenance",
     "on": "entity_type"
    },
    {
     "type": "max_upgrades_squad",
     "value": 1,
     "add": true,
     "target": "inquisition_squad_servitor_weapon",
     "on": "squad_type"
    },
    {
     "type": "max_upgrades_squad",
     "value": 2,
     "add": true,
     "target": "inquisition_squad_grenaider_troops",
     "on": "squad_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_bodyguard",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_stormtrooper",
     "on": "entity_type"
    },
    {
     "type": "max_upgrades_squad",
     "value": 1,
     "add": true,
     "target": "inquisition_squad_stormtroopers",
     "on": "squad_type"
    },
    {
     "type": "max_upgrades_squad",
     "value": 1,
     "add": true,
     "target": "inquisition_squad_shock_troops",
     "on": "squad_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_inquisitor_acolyte",
     "on": "entity_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 2,
     "add": true,
     "target": "inquisition_squad_shock_troops",
     "on": "squad_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 2,
     "add": true,
     "target": "inquisition_squad_grenaider_troops",
     "on": "squad_type"
    },
    {
     "type": "health_maximum",
     "value": 1.149999976158142,
     "add": false,
     "target": "inquisition_servitor_weapon",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_grenaider_troops",
     "on": "entity_type"
    },
    {
     "type": "max_upgrades_squad",
     "value": 1,
     "add": true,
     "target": "inquisition_squad_servitor_melee",
     "on": "squad_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_shock_troops",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_death_cultist",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_shock_troops_sergeant",
     "on": "entity_type"
    }
   ],
   "building": "librarium"
  },
  "inquisition_disruption_grenades_research": {
   "name": "Wargear: Disruption Grenades",
   "info": "- Tactical grenade.",
   "icon": "inquisition_icons/disruptgrenade_research",
   "cost": 75,
   "power": 75,
   "time": 60,
   "requires": [
    "inquisition_incendiary_grenades_research",
    "inquisition_tower_addon",
    "inquisition_librarium"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_incendiary_grenades_research"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_incendiary_grenades_research"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    }
   ],
   "mods": [],
   "building": "librarium"
  },
  "inquisition_tome_aegis": {
   "name": "Tome: Aegis Annointments",
   "info": "- Increases the durability of all Grey Knights.",
   "icon": "inquisition_icons/tome_aegis_icon",
   "cost": 240,
   "power": 120,
   "time": 60,
   "requires": [
    "inquisition_grey_knights_teleporter",
    "inquisition_librarium"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_grey_knights_teleporter"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_grey_knights_terminator",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_grey_knights_astra",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_grey_knights_terminator_paladin",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_grey_knights_purgator",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2999999523162842,
     "add": false,
     "target": "inquisition_dreadknight_titan",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_grey_knights_purifier",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_grey_knights_terminator_justicar",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_grey_knights_justicar",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 2,
     "add": true,
     "target": "inquisition_dreadknight_titan",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 3,
     "add": true,
     "target": "inquisition_grey_knights_purifier",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_grey_knight_champion",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 3,
     "add": true,
     "target": "inquisition_grey_knight_champion",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 3,
     "add": true,
     "target": "inquisition_grey_knights",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 3,
     "add": true,
     "target": "inquisition_grey_knights_purgator",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 3,
     "add": true,
     "target": "inquisition_grey_knights_interceptor",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 3,
     "add": true,
     "target": "inquisition_grey_knights_terminator_paladin",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 3,
     "add": true,
     "target": "inquisition_grey_knights_terminator_justicar",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 3,
     "add": true,
     "target": "inquisition_grey_knights_justicar",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_grey_knights",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 3,
     "add": true,
     "target": "inquisition_grey_knights_astra",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 3,
     "add": true,
     "target": "inquisition_grey_knights_terminator",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_grey_knights_interceptor",
     "on": "entity_type"
    }
   ],
   "building": "librarium"
  },
  "inquisition_tome_canticle": {
   "name": "Tome: Canticle of Absolution",
   "info": "- Creates an aura around all HQ buildings which damages ALL daemonic entities.",
   "icon": "inquisition_icons/tome_canticle_icon",
   "cost": 400,
   "power": 210,
   "time": 10,
   "requires": [
    "inquisition_begin_purification",
    "inquisition_librarium",
    "inquisition_tower_addon"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_begin_purification"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    }
   ],
   "mods": [
    {
     "type": "ability_tau_shield_event",
     "value": 1,
     "add": false,
     "target": "inquisition_tower_hq",
     "on": "entity_type"
    }
   ],
   "building": "librarium"
  },
  "inquisition_targeters": {
   "name": "Targeters Research",
   "info": "- Increases the overall damage provided by all non Grey Knight infantry.",
   "icon": "inquisition_icons/targeters_research",
   "cost": 120,
   "power": 60,
   "time": 45,
   "requires": [
    "inquisition_tower_addon",
    "inquisition_tower_hq",
    "inquisition_librarium"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    }
   ],
   "mods": [
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_chainsword_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_wrench_double",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_plasma_pistol_sergeant",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_sword_sergeant",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_flamer_bodyguard",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_hellpistol_sergeant",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_wrench_double",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_plasma_pistol_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_sword_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_chainsword_sergeant",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_chainsword_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_chainsword_sergeant",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_plasma_pistol_sergeant",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_plasma_pistol_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_pincers_servitor",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_melta_gun_bodyguard",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_sword_cultist",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_plasma_gun_shock_troops",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_sword_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_melta_gun_shock_troops",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_hellgun_bodyguard",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_grenade_launcher_shock_troops",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_pincers_servitor",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_wrench",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_chainsword_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_bolt_pistol_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_plasma_gun_bodyguard",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_plasma_pistol_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_eviscerator",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_plasma_gun_shock_troops",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_hellgun_bodyguard",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_heavy_bolter_servitor",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_wrench",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_staff_scholar",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_bolt_pistol_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_sword_sergeant",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_wrench",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_bolt_pistol_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_multi_melta_servitor",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_plasma_pistol_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_hellgun_stormtrooper",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_sword_cultist",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_melta_gun_shock_troops",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_grenade_launcher_stun",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_flamer_shock_troops",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_grenade_launcher_stun",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_wrench",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_hellgun_shock_troops",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_grenade_launcher_incendiary",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_flamer_stormtroopers",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_hellgun_shock_troops",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_melta_gun_bodyguard",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_staff_scholar",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_plasma_gun_bodyguard",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_eviscerator",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_chainsword_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_flamer_shock_troops",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_hellgun_stormtrooper",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_bolt_pistol_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_grenade_launcher_incendiary",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_hellpistol_sergeant",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_sword_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_multi_melta_servitor",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_sword_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_flamer_bodyguard",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_heavy_bolter_servitor",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_flamer_stormtroopers",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_grenade_launcher_shock_troops",
     "on": "weapon_type"
    }
   ],
   "building": "librarium"
  },
  "inquisition_tome_blades": {
   "name": "Tome: Sanctified blades",
   "info": "- Increases the damage of all Grey Knight weapons and Dreadnought fists.",
   "icon": "inquisition_icons/tome_blades_icon",
   "cost": 240,
   "power": 120,
   "time": 60,
   "requires": [
    "inquisition_grey_knights_teleporter",
    "inquisition_librarium"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_grey_knights_teleporter"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    }
   ],
   "mods": [
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_staff_psyker",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_incinerator_gk_paladin",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_nemesis_weapon_gk_paladin",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_nemesis_weapon_captain",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_storm_bolter_gk_paladin",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_daemon_hammer_grey_knight",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_storm_bolter_gk_terminator",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_psycannon_gk_paladin",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_psycannon_gk_paladin",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_incinerator_gk_paladin",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_nemesis_weapon_grey_knight",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_halberd_grey_knight",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_nemesis_weapon_gk_terminator",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_daemon_hammer_grey_knight_terminator",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_storm_bolter_gk_justicar",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_halberd_grey_knight_interceptor",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_daemon_hammer_grey_knight",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_psycannon_grey_knight",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_nemesis_weapon_gk_terminator",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_storm_bolter_gk_justicar",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_nemesis_weapon_falchions",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_nemesis_weapon_gk_paladin",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_nemesis_weapon_falchions",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_storm_bolter_grey_knight",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_halberd_grey_knight",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_daemon_hammer_grey_knight_terminator",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_psycannon_gk_terminator",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_incinerator_gk_terminator",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_incinerator_grey_knight",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_incinerator_gk_terminator",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_nemesis_weapon_grey_knight",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_halberd_grey_knight_interceptor",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_psycannon_grey_knight",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_staff_psyker",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_psycannon_gk_terminator",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_storm_bolter_grey_knight",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_storm_bolter_gk_paladin",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_storm_bolter_gk_terminator",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_nemesis_weapon_captain",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_incinerator_grey_knight",
     "on": "weapon_type"
    }
   ],
   "building": "librarium"
  },
  "inquisition_advanced_weapons": {
   "name": "Advanced Weapons Research I",
   "info": "- Equips Sergeants and Acolytes with Plasma Pistols.",
   "icon": "inquisition_icons/advanced_weapons_research_1",
   "cost": 50,
   "power": 25,
   "time": 35,
   "requires": [
    "inquisition_librarium"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    }
   ],
   "mods": [
    {
     "type": "default_weapon_modifier_hardpoint1",
     "value": 1,
     "add": true,
     "target": "inquisition_shock_troops_sergeant",
     "on": "entity_type"
    },
    {
     "type": "default_weapon_modifier_hardpoint1",
     "value": 1,
     "add": true,
     "target": "inquisition_inquisitor_acolyte",
     "on": "entity_type"
    }
   ],
   "building": "librarium"
  },
  "inquisition_tome_daemonica_2": {
   "name": "Tome: Libre Daemonica - Section II",
   "info": "- Grants all grey knights and grey knight dreadnoughts attacks that decrease their targets health regeneration.",
   "icon": "inquisition_icons/tome_daemonica_2_icon",
   "cost": 200,
   "power": 100,
   "time": 60,
   "requires": [
    "inquisition_grey_knights_teleporter",
    "inquisition_ultimate_forces",
    "inquisition_tome_daemonica_1",
    "inquisition_tower_addon"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_grey_knights_teleporter"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_ultimate_forces"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_tome_daemonica_1"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_tome_daemonica_1"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knight_champion",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_07",
     "value": 2,
     "add": false,
     "target": "inquisition_dreadnought_assault",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights_terminator",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knight_hero",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights_justicar",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_07",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights_purifier",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_07",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights_terminator_justicar",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_07",
     "value": 2,
     "add": false,
     "target": "inquisition_dreadnought_venerable",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights_terminator_justicar",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_07",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights_interceptor",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_07",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights_terminator_paladin",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights_purgator",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights_purifier",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_07",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knight_champion",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_07",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights_terminator",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_dreadnought_support",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_07",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights_justicar",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_dreadnought_venerable",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights_interceptor",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_07",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights_purgator",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_grey_knights_terminator_paladin",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_07",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights",
     "on": "entity_type"
    },
    {
     "type": "health_meleedamage_received",
     "value": 0.949999988079071,
     "add": false,
     "target": "inquisition_dreadnought_assault",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_07",
     "value": 2,
     "add": false,
     "target": "inquisition_dreadnought_support",
     "on": "entity_type"
    },
    {
     "type": "enable_hardpoint_07",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knight_hero",
     "on": "entity_type"
    }
   ],
   "building": "librarium"
  },
  "inquisition_targeters_improved": {
   "name": "",
   "info": "- Increases the overall damage provided by all non Grey Knight infantry.",
   "icon": "inquisition_icons/targeters_research_improved",
   "cost": 120,
   "power": 60,
   "time": 45,
   "requires": [
    "inquisition_temporal_power",
    "inquisition_tower_addon",
    "inquisition_targeters",
    "inquisition_librarium"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_temporal_power"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_targeters"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_targeters"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    }
   ],
   "mods": [
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_chainsword_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_wrench_double",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_plasma_pistol_sergeant",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_sword_sergeant",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_flamer_bodyguard",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_hellpistol_sergeant",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_wrench_double",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_plasma_pistol_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_sword_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_chainsword_sergeant",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_chainsword_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_chainsword_sergeant",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_plasma_pistol_sergeant",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_plasma_pistol_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_pincers_servitor",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_melta_gun_bodyguard",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_sword_cultist",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_plasma_gun_shock_troops",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_sword_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_melta_gun_shock_troops",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_hellgun_bodyguard",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_grenade_launcher_shock_troops",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_pincers_servitor",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_wrench",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_chainsword_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_bolt_pistol_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_plasma_gun_bodyguard",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_plasma_pistol_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_eviscerator",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_plasma_gun_shock_troops",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_hellgun_bodyguard",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_heavy_bolter_servitor",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_wrench",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_staff_scholar",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_bolt_pistol_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_sword_sergeant",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_wrench",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_bolt_pistol_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_multi_melta_servitor",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_plasma_pistol_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_hellgun_stormtrooper",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_sword_cultist",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_melta_gun_shock_troops",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_grenade_launcher_stun",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_flamer_shock_troops",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_grenade_launcher_stun",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_wrench",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_hellgun_shock_troops",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_grenade_launcher_incendiary",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_flamer_stormtroopers",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_hellgun_shock_troops",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_melta_gun_bodyguard",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_staff_scholar",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_plasma_gun_bodyguard",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_eviscerator",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_chainsword_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_flamer_shock_troops",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_hellgun_stormtrooper",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_bolt_pistol_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_grenade_launcher_incendiary",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_hellpistol_sergeant",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_sword_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_multi_melta_servitor",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_power_sword_inquisitor_acolyte",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_flamer_bodyguard",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_heavy_bolter_servitor",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_flamer_stormtroopers",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_grenade_launcher_shock_troops",
     "on": "weapon_type"
    }
   ],
   "building": "librarium"
  },
  "inquisition_advanced_weapons_2": {
   "name": "Advanced Weapons Research II",
   "info": "- Equips Sergeants and Acolytes with Power Swords.",
   "icon": "inquisition_icons/advanced_weapons_research_2",
   "cost": 50,
   "power": 50,
   "time": 60,
   "requires": [
    "inquisition_advanced_weapons",
    "inquisition_librarium",
    "inquisition_astra_telepathica"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_advanced_weapons"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_advanced_weapons"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_astra_telepathica"
     ]
    }
   ],
   "mods": [
    {
     "type": "default_weapon_modifier_hardpoint2",
     "value": 1,
     "add": true,
     "target": "inquisition_shock_troops_sergeant",
     "on": "entity_type"
    },
    {
     "type": "default_weapon_modifier_hardpoint2",
     "value": 1,
     "add": true,
     "target": "inquisition_inquisitor_acolyte",
     "on": "entity_type"
    }
   ],
   "building": "librarium"
  },
  "inquisition_tome_invigorate_soul": {
   "name": "Tome: Invigorate the Soul",
   "info": "- Decreases the cooldown time of all psyker abilities.",
   "icon": "inquisition_icons/tome_soul_icon",
   "cost": 150,
   "power": 50,
   "time": 10,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "ability_recharge",
     "value": 0.8999999761581421,
     "add": false,
     "target": "inquisition_inquisitor_ordo_malleus",
     "on": "entity_type"
    },
    {
     "type": "ability_recharge",
     "value": 0.699999988079071,
     "add": false,
     "target": "inquisition_scholars_exorcist",
     "on": "entity_type"
    },
    {
     "type": "ability_recharge",
     "value": 0.8999999761581421,
     "add": false,
     "target": "inquisition_inquisitor_lord",
     "on": "entity_type"
    },
    {
     "type": "ability_recharge",
     "value": 0.699999988079071,
     "add": false,
     "target": "inquisition_scholars_calculus_logi",
     "on": "entity_type"
    },
    {
     "type": "sight_radius",
     "value": 10,
     "add": true,
     "target": "inquisition_inquisitor_lord",
     "on": "entity_type"
    },
    {
     "type": "sight_radius",
     "value": 10,
     "add": true,
     "target": "inquisition_scholars",
     "on": "entity_type"
    },
    {
     "type": "sight_radius",
     "value": 10,
     "add": true,
     "target": "inquisition_scholars_exorcist",
     "on": "entity_type"
    },
    {
     "type": "sight_radius",
     "value": 20,
     "add": true,
     "target": "inquisition_scholars_astropath",
     "on": "entity_type"
    },
    {
     "type": "sight_radius",
     "value": 10,
     "add": true,
     "target": "inquisition_scholars_calculus_logi",
     "on": "entity_type"
    },
    {
     "type": "ability_recharge",
     "value": 0.699999988079071,
     "add": false,
     "target": "inquisition_scholars",
     "on": "entity_type"
    },
    {
     "type": "sight_radius",
     "value": 10,
     "add": true,
     "target": "inquisition_inquisitor_ordo_malleus",
     "on": "entity_type"
    },
    {
     "type": "ability_recharge",
     "value": 0.699999988079071,
     "add": false,
     "target": "inquisition_scholars_astropath",
     "on": "entity_type"
    }
   ],
   "building": "librarium"
  },
  "inquisition_begin_purification": {
   "name": "Begin Purification (Tier IV)",
   "info": "",
   "icon": "inquisition_icons/blessed_aegis_seals_research_icon",
   "cost": 1500,
   "power": 1500,
   "time": 180,
   "requires": [
    "inquisition_tower_addon",
    "inquisition_ultimate_forces"
   ],
   "req": [
    {
     "t": "local_addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_ultimate_forces"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_ultimate_forces"
     ]
    }
   ],
   "mods": [],
   "building": "nuclear_facility"
  },
  "inquisition_iron_curtain_research": {
   "name": "Emperor's Artifact: Iron Curtain",
   "info": "- Requisitions a very powerful research blessed by the Emperor himself. With this artifact, an unstoppable incursion will awake from the Space Marines!",
   "icon": "space_marine_icons/emperors_armory_iron_curtain_icon",
   "cost": 3500,
   "power": 3500,
   "time": 300,
   "requires": [
    "inquisition_absolute_purification"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_nuclear_facility"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_absolute_purification"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_shrine_to_the_emperor"
     ]
    },
    {
     "t": "required_ownership",
     "ids": [
      "relic_struct"
     ]
    }
   ],
   "mods": [],
   "building": "shrine_to_the_emperor"
  },
  "inquisition_tome_exterminatus_2": {
   "name": "Inquisitorial Mandate: Exterminatus - Part II",
   "info": "+ Read and sign. The Inquisition leaders demand 5 processes of order, and you, chosen champion will only sign if the situation is absolutely unbarrable. The Inquisition cannot afford the loss of many of our own allies... The Exterminatus is a lengthy and formal process: consigning a planet to oblivion is a matter taken very seriously by the Imperium. Read on if you understand the risks.",
   "icon": "inquisition_icons/tome_exterminatus_2_icon",
   "cost": 1000,
   "power": 1000,
   "time": 200,
   "requires": [
    "inquisition_tower_hq",
    "inquisition_tome_exterminatus_1"
   ],
   "req": [
    {
     "t": "required_ownership",
     "ids": [
      "strategic_objective_struct"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_tome_exterminatus_1"
     ]
    }
   ],
   "mods": [
    {
     "type": "morale_maximum_player",
     "value": 0.10000000149011612,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "shrine_to_the_emperor"
  },
  "inquisition_tome_exterminatus_3": {
   "name": "Inquisitorial Mandate: Exterminatus - Part III",
   "info": "+ Read and sign. The Inquisition leaders demand 5 processes of order, and you, chosen champion will only sign if the situation is absolutely unbarrable. The Inquisition cannot afford the loss of many of our own allies... The Exterminatus is a lengthy and formal process: consigning a planet to oblivion is a matter taken very seriously by the Imperium. Read on if you understand the risks.",
   "icon": "inquisition_icons/tome_exterminatus_3_icon",
   "cost": 2000,
   "power": 2000,
   "time": 200,
   "requires": [
    "inquisition_tower_hq",
    "inquisition_tome_exterminatus_2"
   ],
   "req": [
    {
     "t": "required_ownership",
     "ids": [
      "strategic_objective_struct"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_tome_exterminatus_2"
     ]
    }
   ],
   "mods": [
    {
     "type": "morale_maximum_player",
     "value": 0.10000000149011612,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "shrine_to_the_emperor"
  },
  "inquisition_tome_exterminatus_4": {
   "name": "Inquisitorial Mandate: Exterminatus - Part IV",
   "info": "+ Read and sign. The Inquisition leaders demand 5 processes of order, and you, chosen champion will only sign if the situation is absolutely unbarrable. The Inquisition cannot afford the loss of many of our own allies... The Exterminatus is a lengthy and formal process: consigning a planet to oblivion is a matter taken very seriously by the Imperium. Read on if you understand the risks.",
   "icon": "inquisition_icons/tome_exterminatus_4_icon",
   "cost": 5000,
   "power": 5000,
   "time": 200,
   "requires": [
    "inquisition_tower_hq",
    "inquisition_tome_exterminatus_3"
   ],
   "req": [
    {
     "t": "required_ownership",
     "ids": [
      "strategic_objective_struct"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_tome_exterminatus_3"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_maximum_player",
     "value": 0.15000000596046448,
     "add": false,
     "target": "",
     "on": "player"
    },
    {
     "type": "morale_maximum_player",
     "value": 0.10000000149011612,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "shrine_to_the_emperor"
  },
  "inquisition_essence_omnissiah_research": {
   "name": "Emperor's Artifact: Essence of the Omnissiah",
   "info": "- Requisitions a very powerful research blessed by the Emperor himself. With this artifact, an unstoppable incursion will awake from the Space Marines!",
   "icon": "inquisition_icons/emperors_titans_icon",
   "cost": 2500,
   "power": 5000,
   "time": 300,
   "requires": [
    "inquisition_absolute_purification"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_absolute_purification"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_shrine_to_the_emperor"
     ]
    },
    {
     "t": "required_ownership",
     "ids": [
      "relic_struct"
     ]
    }
   ],
   "mods": [],
   "building": "shrine_to_the_emperor"
  },
  "inquisition_tome_exterminatus_1": {
   "name": "Inquisitorial Mandate: Exterminatus - Part I",
   "info": "+ Read and sign. The Inquisition leaders demand 5 processes of order, and you, chosen champion will only sign if the situation is absolutely unbarrable. The Inquisition cannot afford the loss of many of our own allies... The Exterminatus is a lengthy and formal process: consigning a planet to oblivion is a matter taken very seriously by the Imperium. Read on if you understand the risks.",
   "icon": "inquisition_icons/tome_exterminatus_1_icon",
   "cost": 0,
   "power": 0,
   "time": 200,
   "requires": [
    "inquisition_tower_hq",
    "inquisition_absolute_purification"
   ],
   "req": [
    {
     "t": "required_ownership",
     "ids": [
      "strategic_objective_struct"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_absolute_purification"
     ]
    }
   ],
   "mods": [],
   "building": "shrine_to_the_emperor"
  },
  "inquisition_emperors_grey_knights_research": {
   "name": "",
   "info": "- Requisitions a very powerful research blessed by the Emperor himself. With this artifact, an unstoppable incursion will awake from the Space Marines!",
   "icon": "inquisition_icons/emperors_grey_knights_icon",
   "cost": 1200,
   "power": 1200,
   "time": 150,
   "requires": [],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_shrine_to_the_emperor"
     ]
    },
    {
     "t": "required_ownership",
     "ids": [
      "relic_struct"
     ]
    }
   ],
   "mods": [],
   "building": "shrine_to_the_emperor"
  },
  "inquisition_tome_exterminatus_5": {
   "name": "Inquisitorial Mandate: Exterminatus - Part V",
   "info": "+++ The Ordo Malleus declares this planet beyond redemption, and calls for it's utter destruction. The planet is lost to the pure and the Inquisition must deem it destroyed before all is too late. By the order of the Inquisition, the Inquisitor Lord declares this planet executed, and the use of the Exterminatus is granted. May Imperial justice account in all balance. May the Emperor protect us.",
   "icon": "inquisition_icons/tome_exterminatus_5_icon",
   "cost": 50000,
   "power": 50000,
   "time": 15,
   "requires": [
    "inquisition_tower_hq",
    "inquisition_tome_exterminatus_4"
   ],
   "req": [
    {
     "t": "required_ownership",
     "ids": [
      "strategic_objective_struct"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_tome_exterminatus_4"
     ]
    }
   ],
   "mods": [],
   "building": "shrine_to_the_emperor"
  },
  "inquisition_essence_machine_spirit_research": {
   "name": "Emperor's Artifact: Essense of the Machine Spirit",
   "info": "- Requisitions a very powerful research blessed by the Emperor himself. With this artifact, an unstoppable incursion will awake from the Space Marines!",
   "icon": "inquisition_icons/emperors_machines_icon",
   "cost": 1000,
   "power": 2000,
   "time": 150,
   "requires": [],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_shrine_to_the_emperor"
     ]
    },
    {
     "t": "required_ownership",
     "ids": [
      "relic_struct"
     ]
    }
   ],
   "mods": [],
   "building": "shrine_to_the_emperor"
  },
  "inquisition_terra_army_research": {
   "name": "Emperor's Artifact: Armies of Terra",
   "info": "- Requisitions a very powerful research blessed by the Emperor himself. With this artifact, an unstoppable incursion will awake from the Space Marines!",
   "icon": "space_marine_icons/emperors_armory_armies_of_terra_icon",
   "cost": 800,
   "power": 800,
   "time": 200,
   "requires": [],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_shrine_to_the_emperor"
     ]
    },
    {
     "t": "required_ownership",
     "ids": [
      "relic_struct"
     ]
    }
   ],
   "mods": [
    {
     "type": "max_troopers_squad",
     "value": 2,
     "add": true,
     "target": "inquisition_squad_servitor_melee",
     "on": "squad_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 2,
     "add": true,
     "target": "inquisition_squad_scholars",
     "on": "squad_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 2,
     "add": true,
     "target": "inquisition_squad_bodyguard",
     "on": "squad_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 2,
     "add": true,
     "target": "inquisition_squad_shock_troops",
     "on": "squad_type"
    },
    {
     "type": "max_support_cap_player",
     "value": 15,
     "add": true,
     "target": "",
     "on": "player"
    },
    {
     "type": "max_troopers_squad",
     "value": 1,
     "add": true,
     "target": "inquisition_squad_grey_knights_terminator",
     "on": "squad_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 2,
     "add": true,
     "target": "inquisition_squad_servitor_weapon",
     "on": "squad_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 2,
     "add": true,
     "target": "inquisition_squad_stormtroopers",
     "on": "squad_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 1,
     "add": true,
     "target": "inquisition_squad_grey_knights_interceptor",
     "on": "squad_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 2,
     "add": true,
     "target": "inquisition_squad_grenaider_troops",
     "on": "squad_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 1,
     "add": true,
     "target": "inquisition_squad_grey_knights_purifier",
     "on": "squad_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 2,
     "add": true,
     "target": "inquisition_squad_grey_knights_astra",
     "on": "squad_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 2,
     "add": true,
     "target": "inquisition_squad_servitor_maintenance",
     "on": "squad_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 1,
     "add": true,
     "target": "inquisition_squad_grey_knights_terminator_paladin",
     "on": "squad_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 2,
     "add": true,
     "target": "inquisition_squad_grey_knights",
     "on": "squad_type"
    },
    {
     "type": "max_squad_cap_player",
     "value": 15,
     "add": true,
     "target": "",
     "on": "player"
    },
    {
     "type": "max_troopers_squad",
     "value": 1,
     "add": true,
     "target": "inquisition_squad_grey_knights_purgator",
     "on": "squad_type"
    }
   ],
   "building": "shrine_to_the_emperor"
  },
  "inquisition_schematic_calculus_logi": {
   "name": "Schematic: Calculus Logistics",
   "info": "- Allows the production of Calculus Logistics.",
   "icon": "inquisition_icons/schematic_calculus_logi_icon",
   "cost": 0,
   "power": 140,
   "time": 15,
   "requires": [
    "inquisition_tower_addon",
    "inquisition_temporal_power",
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_temporal_power"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "tower_hq"
  },
  "inquisition_schematic_exorcist": {
   "name": "Schematic: Exorcists",
   "info": "- Allows the production of Exorcists.",
   "icon": "inquisition_icons/schematic_exorcist_icon",
   "cost": 0,
   "power": 30,
   "time": 5,
   "requires": [
    "inquisition_librarium",
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "tower_hq"
  },
  "inquisition_bodyguard_upgrade_1": {
   "name": "Bodyguards Upgrade I",
   "info": "- Modifies the equipment and servitude of all Bodyguard squads.",
   "icon": "inquisition_icons/bodyguard_upgrade1_research",
   "cost": 110,
   "power": 50,
   "time": 10,
   "requires": [
    "inquisition_librarium",
    "inquisition_tower_addon",
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [
    {
     "type": "max_range_weapon",
     "value": 5,
     "add": true,
     "target": "inquisition_hellgun_bodyguard",
     "on": "weapon_type"
    },
    {
     "type": "health_maximum",
     "value": 1.100000023841858,
     "add": false,
     "target": "inquisition_inquisitor_acolyte",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.100000023841858,
     "add": false,
     "target": "inquisition_hellgun_bodyguard",
     "on": "weapon_type"
    },
    {
     "type": "health_maximum",
     "value": 1.100000023841858,
     "add": false,
     "target": "inquisition_bodyguard",
     "on": "entity_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.100000023841858,
     "add": false,
     "target": "inquisition_hellgun_bodyguard",
     "on": "weapon_type"
    }
   ],
   "building": "tower_hq"
  },
  "inquisition_increase_relic_2": {
   "name": "Tier II Relics",
   "info": "- Further upgrades the relics to add an extra bonus to the relic resource, along with increasing its income rates.",
   "icon": "npc/relic_inc_research2",
   "cost": 2000,
   "power": 2000,
   "time": 220,
   "requires": [
    "inquisition_tower_addon",
    "inquisition_begin_purification",
    "inquisition_increase_relic_1"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_begin_purification"
     ]
    },
    {
     "t": "required_ownership",
     "ids": [
      "relic_struct"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_increase_relic_1"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_increase_relic_1"
     ]
    }
   ],
   "mods": [
    {
     "type": "population_growth_rate_player",
     "value": 0.4000000059604645,
     "add": true,
     "target": "",
     "on": "player"
    },
    {
     "type": "population_cap_player",
     "value": 250,
     "add": true,
     "target": "",
     "on": "player"
    }
   ],
   "building": "tower_hq"
  },
  "inquisition_ultimate_forces": {
   "name": "Ultimate Forces (Tier III)",
   "info": "",
   "icon": "inquisition_icons/ultimate_666_research",
   "cost": 1000,
   "power": 1000,
   "time": 100,
   "requires": [
    "inquisition_grey_knights_teleporter",
    "inquisition_tower_addon",
    "inquisition_temporal_power"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_grey_knights_teleporter"
     ]
    },
    {
     "t": "local_addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_temporal_power"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_temporal_power"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_maximum",
     "value": 700,
     "add": true,
     "target": "inquisition_dreadnought_support",
     "on": "entity_type"
    },
    {
     "type": "default_weapon_modifier_hardpoint1",
     "value": 1,
     "add": true,
     "target": "inquisition_grey_knights_teleporter",
     "on": "entity_type"
    }
   ],
   "building": "tower_hq"
  },
  "inquisition_bodyguard_upgrade_2": {
   "name": "Bodyguards Upgrade II",
   "info": "- Modifies the equipment and servitude of all Bodyguard squads.",
   "icon": "inquisition_icons/bodyguard_upgrade2_research",
   "cost": 130,
   "power": 70,
   "time": 25,
   "requires": [
    "inquisition_bodyguard_upgrade_1",
    "inquisition_temporal_power"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_bodyguard_upgrade_1"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_bodyguard_upgrade_1"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_temporal_power"
     ]
    }
   ],
   "mods": [
    {
     "type": "max_range_weapon",
     "value": 10,
     "add": true,
     "target": "inquisition_hellgun_bodyguard",
     "on": "weapon_type"
    },
    {
     "type": "health_maximum",
     "value": 1.100000023841858,
     "add": false,
     "target": "inquisition_inquisitor_acolyte",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.100000023841858,
     "add": false,
     "target": "inquisition_hellgun_bodyguard",
     "on": "weapon_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 2,
     "add": true,
     "target": "inquisition_squad_bodyguard",
     "on": "squad_type"
    },
    {
     "type": "health_maximum",
     "value": 1.100000023841858,
     "add": false,
     "target": "inquisition_bodyguard",
     "on": "entity_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.100000023841858,
     "add": false,
     "target": "inquisition_hellgun_bodyguard",
     "on": "weapon_type"
    }
   ],
   "building": "tower_hq"
  },
  "inquisition_increase_relic_1": {
   "name": "Tier I Relics",
   "info": "- Upgrades the relics to add an extra bonus to the relic resource, along with increasing its income rates.",
   "icon": "npc/relic_inc_research1",
   "cost": 1000,
   "power": 1000,
   "time": 120,
   "requires": [
    "inquisition_ultimate_forces",
    "inquisition_tower_hq",
    "inquisition_tower_addon"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_ultimate_forces"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "required_ownership",
     "ids": [
      "relic_struct"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    }
   ],
   "mods": [
    {
     "type": "population_growth_rate_player",
     "value": 0.4000000059604645,
     "add": true,
     "target": "",
     "on": "player"
    },
    {
     "type": "population_cap_player",
     "value": 350,
     "add": true,
     "target": "",
     "on": "player"
    }
   ],
   "building": "tower_hq"
  },
  "inquisition_schematic_death_cultists": {
   "name": "Schematic: Death Cultists",
   "info": "- Allows the production of DeathCultists.",
   "icon": "inquisition_icons/schematic_death_cultist_icon",
   "cost": 0,
   "power": 30,
   "time": 3,
   "requires": [
    "inquisition_watch",
    "inquisition_tower_addon",
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_watch"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "tower_hq"
  },
  "inquisition_absolute_purification": {
   "name": "Absolute Purification (Tier V)",
   "info": "- The full might of the Inquisition through this research. Cost is based on how many Apocalypse possibilities granted, multiplied by 2000 of each resource.",
   "icon": "inquisition_icons/Icon_of_just_rsrch_icon",
   "cost": 4000,
   "power": 4000,
   "time": 300,
   "requires": [
    "inquisition_tower_addon",
    "inquisition_shrine_to_the_emperor",
    "inquisition_nuclear_facility",
    "inquisition_begin_purification"
   ],
   "req": [
    {
     "t": "local_addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "either",
     "ids": [
      "inquisition_shrine_to_the_emperor",
      "inquisition_nuclear_facility"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_begin_purification"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_begin_purification"
     ]
    },
    {
     "t": "required_ownership",
     "ids": [
      "strategic_objective_struct"
     ]
    }
   ],
   "mods": [
    {
     "type": "production_speed",
     "value": 2,
     "add": false,
     "target": "inquisition_grey_knights_teleporter",
     "on": "entity_type"
    }
   ],
   "building": "tower_hq"
  },
  "inquisition_schematic_astropath": {
   "name": "Schematic: Astropaths",
   "info": "- Allows the production of Astropaths.",
   "icon": "inquisition_icons/schematic_astropath_icon",
   "cost": 0,
   "power": 30,
   "time": 5,
   "requires": [
    "inquisition_librarium",
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "tower_hq"
  },
  "inquisition_schematic_titan_vengence": {
   "name": "Schematic: Warhound Vengence Titan",
   "info": "- Allows the production of the Warhound Vengence Titan.",
   "icon": "inquisition_icons/schematic_idh_warhound_vengence_icon",
   "cost": 0,
   "power": 500,
   "time": 50,
   "requires": [
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "tower_mechanicum"
  },
  "inquisition_schematic_titan_purifier": {
   "name": "Schematic: Warhound Purifier Titan",
   "info": "- Allows the production of the Warhound Purifier Titan.",
   "icon": "inquisition_icons/schematic_idh_warhound_purifier_icon",
   "cost": 0,
   "power": 500,
   "time": 50,
   "requires": [
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "tower_mechanicum"
  },
  "inquisition_turret_upgrade2": {
   "name": "Heavily Fortified Defenses Research",
   "info": "- Further increases the health, damage, and maximum weapon range of all turrets.",
   "icon": "inquisition_icons/idh_turret_research_2",
   "cost": 390,
   "power": 390,
   "time": 90,
   "requires": [
    "inquisition_ultimate_forces",
    "inquisition_tower_addon",
    "inquisition_turret_upgrade1",
    "inquisition_librarium"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_ultimate_forces"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_turret_upgrade1"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_turret_upgrade1"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    }
   ],
   "mods": [
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_missile_turret_improved",
     "on": "weapon_type"
    },
    {
     "type": "max_range_weapon",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_lascannon_twin_gk_teleporter",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_missile_turret",
     "on": "weapon_type"
    },
    {
     "type": "max_range_weapon",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_missile_turret_improved",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_heavy_bolter_gk_teleporter",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_heavy_bolter_turret",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_missile_turret_improved",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_lascannon_twin_gk_teleporter",
     "on": "weapon_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_ds_turret",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_purification_decree",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_missile_turret",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_heavy_bolter_turret",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_lascannon_twin_gk_teleporter",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_heavy_bolter_gk_teleporter",
     "on": "weapon_type"
    },
    {
     "type": "max_range_weapon",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_missile_turret",
     "on": "weapon_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_turret_heavy_bolter",
     "on": "entity_type"
    },
    {
     "type": "max_range_weapon",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_heavy_bolter_gk_teleporter",
     "on": "weapon_type"
    },
    {
     "type": "max_range_weapon",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_heavy_bolter_turret",
     "on": "weapon_type"
    }
   ],
   "building": "turret_heavy_bolter"
  },
  "inquisition_turret_upgrade1": {
   "name": "Fortified Defenses Research",
   "info": "- Increases the health, damage, and maximum weapon range of all turrets.",
   "icon": "inquisition_icons/idh_turret_research_1",
   "cost": 180,
   "power": 180,
   "time": 70,
   "requires": [
    "inquisition_librarium",
    "inquisition_tower_addon"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_librarium"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    }
   ],
   "mods": [
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_missile_turret_improved",
     "on": "weapon_type"
    },
    {
     "type": "max_range_weapon",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_lascannon_twin_gk_teleporter",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_missile_turret",
     "on": "weapon_type"
    },
    {
     "type": "max_range_weapon",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_missile_turret_improved",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_heavy_bolter_gk_teleporter",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_heavy_bolter_turret",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_missile_turret_improved",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_lascannon_twin_gk_teleporter",
     "on": "weapon_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_ds_turret",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_purification_decree",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_missile_turret",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_heavy_bolter_turret",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_lascannon_twin_gk_teleporter",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "inquisition_heavy_bolter_gk_teleporter",
     "on": "weapon_type"
    },
    {
     "type": "max_range_weapon",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_missile_turret",
     "on": "weapon_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "inquisition_turret_heavy_bolter",
     "on": "entity_type"
    },
    {
     "type": "max_range_weapon",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_heavy_bolter_gk_teleporter",
     "on": "weapon_type"
    },
    {
     "type": "max_range_weapon",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_heavy_bolter_turret",
     "on": "weapon_type"
    }
   ],
   "building": "turret_heavy_bolter"
  },
  "inquisition_walls_research": {
   "name": "Fortified Wall Research",
   "info": "- Upgrades the Defensive Walls and increases its hitpoints by the extreme.",
   "icon": "inquisition_icons/idh_wall_fortify_icon",
   "cost": 280,
   "power": 280,
   "time": 190,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "health_maximum",
     "value": 2,
     "add": false,
     "target": "inquisition_wall",
     "on": "entity_type"
    }
   ],
   "building": "wall"
  },
  "inquisition_power_research_5": {
   "name": "Increased Power Income V",
   "info": "",
   "icon": "space_marine_icons/power_inc_research_5",
   "cost": 800,
   "power": 100,
   "time": 125,
   "requires": [
    "inquisition_absolute_purification"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_absolute_purification"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_power_research_4"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_power_research_4"
     ]
    }
   ],
   "mods": [
    {
     "type": "income_power_player",
     "value": 1.149999976158142,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "warp_generator"
  },
  "inquisition_power_research_4": {
   "name": "Increased Power Income IV",
   "info": "",
   "icon": "space_marine_icons/power_inc_research_4",
   "cost": 650,
   "power": 80,
   "time": 125,
   "requires": [
    "inquisition_begin_purification"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_begin_purification"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_power_research_3"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_power_research_3"
     ]
    }
   ],
   "mods": [
    {
     "type": "income_power_player",
     "value": 1.149999976158142,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "warp_generator"
  },
  "inquisition_power_research_2": {
   "name": "Increased Power Income II",
   "info": "",
   "icon": "space_marine_icons/power_inc_research_2",
   "cost": 350,
   "power": 40,
   "time": 95,
   "requires": [
    "inquisition_temporal_power"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_temporal_power"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_power_research_1"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_power_research_1"
     ]
    }
   ],
   "mods": [
    {
     "type": "income_power_player",
     "value": 1.2000000476837158,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "warp_generator"
  },
  "inquisition_power_research_3": {
   "name": "Increased Power Income III",
   "info": "",
   "icon": "space_marine_icons/power_inc_research_3",
   "cost": 500,
   "power": 60,
   "time": 115,
   "requires": [
    "inquisition_ultimate_forces"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_ultimate_forces"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_power_research_2"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_power_research_2"
     ]
    }
   ],
   "mods": [
    {
     "type": "income_power_player",
     "value": 1.25,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "warp_generator"
  },
  "inquisition_power_research_1": {
   "name": "Increased Power Income I",
   "info": "",
   "icon": "space_marine_icons/power_inc_research_1",
   "cost": 200,
   "power": 20,
   "time": 60,
   "requires": [
    "inquisition_tower_addon"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    }
   ],
   "mods": [
    {
     "type": "income_power_player",
     "value": 1.3300000429153442,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "warp_generator"
  },
  "inquisition_schematic_razorback": {
   "name": "Schematic: Razorback Transport",
   "info": "- Allows the production of Razorbacks.",
   "icon": "inquisition_icons\\schematic_razorback_icon",
   "cost": 0,
   "power": 80,
   "time": 8,
   "requires": [
    "inquisition_tower_addon",
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "watch"
  },
  "inquisition_schematic_land_raider_special": {
   "name": "Schematic: Land Raider Daemon Hunter",
   "info": "- Allows the production of the Inquisitor's peronal heavy armored transport.",
   "icon": "inquisition_icons/schematic_inquisition_landraider_icon",
   "cost": 0,
   "power": 400,
   "time": 40,
   "requires": [
    "inquisition_begin_purification",
    "inquisition_tower_hq",
    "inquisition_tower_addon"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_begin_purification"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    }
   ],
   "mods": [],
   "building": "watch"
  },
  "inquisition_schematic_damocles": {
   "name": "Schematic: Damocles",
   "info": "- Allows the production of Damocles.",
   "icon": "inquisition_icons/schematic_damocles_icon",
   "cost": 0,
   "power": 120,
   "time": 15,
   "requires": [
    "inquisition_tower_addon",
    "inquisition_temporal_power",
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_temporal_power"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "watch"
  },
  "inquisition_schematic_chimera": {
   "name": "Schematic: Chimera Transport",
   "info": "- Allows the production of Chimera Transports.",
   "icon": "inquisition_icons\\schematic_chimera_transport_icon",
   "cost": 0,
   "power": 45,
   "time": 7,
   "requires": [
    "inquisition_tower_addon",
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "watch"
  },
  "inquisition_schematic_whirlwind": {
   "name": "Schematic: Whirlwind Hyperios",
   "info": "- Allows the production of Whirlwind Hyperios Artillery Tanks.",
   "icon": "inquisition_icons/schematic_whirlwind_icon",
   "cost": 0,
   "power": 250,
   "time": 30,
   "requires": [
    "inquisition_ultimate_forces",
    "inquisition_tower_hq",
    "inquisition_tower_addon"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_ultimate_forces"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    }
   ],
   "mods": [],
   "building": "watch"
  },
  "inquisition_schematic_predator": {
   "name": "Schematic: Predator Tank",
   "info": "- Allows the production of Predator Tanks.",
   "icon": "inquisition_icons/schematic_predator_icon",
   "cost": 0,
   "power": 200,
   "time": 20,
   "requires": [
    "inquisition_tower_addon",
    "inquisition_temporal_power",
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_temporal_power"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "watch"
  },
  "inquisition_schematic_land_raiders": {
   "name": "Schematic: Land Raiders",
   "info": "- Allows the production of Land Raider Phobos, Land Raider Redeemer, and Land Raider Crusader heavily armored transport relic units, carrying up to three squads.",
   "icon": "inquisition_icons/schematic_land_raider_phobos_icon",
   "cost": 0,
   "power": 300,
   "time": 30,
   "requires": [
    "inquisition_ultimate_forces",
    "inquisition_tower_hq",
    "inquisition_tower_addon"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_ultimate_forces"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    }
   ],
   "mods": [],
   "building": "watch"
  },
  "inquisition_schematic_rhino": {
   "name": "Schematic: Rhino Transport",
   "info": "- Allows the production of Rhino Transports.",
   "icon": "inquisition_icons\\schematic_inquisitorial_rhino_icon",
   "cost": 0,
   "power": 45,
   "time": 5,
   "requires": [
    "inquisition_tower_addon",
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "watch"
  },
  "inquisition_schematic_servitors_maintenance": {
   "name": "Schematic: Maintenance Servitors",
   "info": "- Allows the production of Maintenance Servitors.",
   "icon": "inquisition_icons/schematic_servitor_maintenance_icon",
   "cost": 0,
   "power": 15,
   "time": 5,
   "requires": [
    "inquisition_tower_addon",
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "watch"
  },
  "inquisition_support_cap_1": {
   "name": "Improved Vehicle Armor I",
   "info": "- Increases the health of all vehicles.",
   "icon": "inquisition_icons/supportcap1_icon",
   "cost": 125,
   "power": 75,
   "time": 60,
   "requires": [
    "inquisition_temporal_power",
    "inquisition_watch"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_temporal_power"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_watch"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_stormraven_fury",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_dreadnought_support",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_servitor_weapon",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_land_raider",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_land_raider_redeemer",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_razorback",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_dreadnought_venerable",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_predator",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_vulture",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_dreadnought",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_dreadnought_assault",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_chimera_transport",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_land_raider_crusader",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_transport_valkyrie_uamod",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_servitor_melee",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_servitor_maintenance",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_whirlwind",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_damocles",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_rhino",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_tempest",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_thunderfire_cannon",
     "on": "entity_type"
    }
   ],
   "building": "watch"
  },
  "inquisition_schematic_servitors": {
   "name": "Schematic: Servitors",
   "info": "- Allows the production of Assault and Weapons Servitors which can repair.",
   "icon": "inquisition_icons/schematic_servitors_icon",
   "cost": 0,
   "power": 40,
   "time": 10,
   "requires": [
    "inquisition_tower_addon",
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "watch"
  },
  "inquisition_support_cap_2": {
   "name": "Improved Vehicle Armor II",
   "info": "- Further increases the health of all vehicles.",
   "icon": "inquisition_icons/supportcap2_icon",
   "cost": 175,
   "power": 125,
   "time": 70,
   "requires": [
    "inquisition_ultimate_forces",
    "inquisition_support_cap_1"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "inquisition_ultimate_forces"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_support_cap_1"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_support_cap_1"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_stormraven_fury",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_dreadnought_support",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_servitor_weapon",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_land_raider",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_land_raider_redeemer",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_razorback",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_dreadnought_venerable",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_predator",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_vulture",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_dreadnought",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_dreadnought_assault",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_chimera_transport",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_land_raider_crusader",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_transport_valkyrie_uamod",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_servitor_melee",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_servitor_maintenance",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_whirlwind",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_damocles",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_rhino",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_tempest",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "inquisition_thunderfire_cannon",
     "on": "entity_type"
    }
   ],
   "building": "watch"
  },
  "inquisition_schematic_grenaiders": {
   "name": "Schematic: Grenaiders",
   "info": "- Allows the production of Grenaider squads.",
   "icon": "inquisition_icons/schematic_grenaiders_icon",
   "cost": 0,
   "power": 25,
   "time": 3,
   "requires": [
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [],
   "building": "watch"
  }
 },
 "addons": {
  "inquisition_worker_3_addon": {
   "name": "",
   "info": "",
   "icon": "inquisition_icons\\worker_3_icon",
   "cost": 100,
   "power": 220,
   "time": 320,
   "requires": [
    "inquisition_tower_hq",
    "inquisition_worker_2_addon"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [
    {
     "type": "income_requisition_player",
     "value": 0.15000000596046448,
     "add": true,
     "target": "",
     "on": "player"
    },
    {
     "type": "health_maximum",
     "value": 800,
     "add": true,
     "target": "",
     "on": "entity"
    },
    {
     "type": "default_weapon_modifier_hardpoint1",
     "value": 1,
     "add": true,
     "target": "",
     "on": "entity"
    },
    {
     "type": "income_power_player",
     "value": 0.10000000149011612,
     "add": true,
     "target": "",
     "on": "player"
    }
   ],
   "building": "civilian_bunker"
  },
  "inquisition_worker_1_addon": {
   "name": "",
   "info": "",
   "icon": "inquisition_icons\\worker_1_icon",
   "cost": 100,
   "power": 220,
   "time": 320,
   "requires": [
    "inquisition_tower_hq"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [
    {
     "type": "income_requisition_player",
     "value": 0.15000000596046448,
     "add": true,
     "target": "",
     "on": "player"
    },
    {
     "type": "health_maximum",
     "value": 800,
     "add": true,
     "target": "",
     "on": "entity"
    },
    {
     "type": "default_weapon_modifier_hardpoint1",
     "value": 1,
     "add": true,
     "target": "",
     "on": "entity"
    },
    {
     "type": "income_power_player",
     "value": 0.10000000149011612,
     "add": true,
     "target": "",
     "on": "player"
    }
   ],
   "building": "civilian_bunker"
  },
  "inquisition_worker_2_addon": {
   "name": "",
   "info": "",
   "icon": "inquisition_icons\\worker_2_icon",
   "cost": 100,
   "power": 220,
   "time": 320,
   "requires": [
    "inquisition_tower_hq",
    "inquisition_worker_1_addon"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [
    {
     "type": "income_requisition_player",
     "value": 0.15000000596046448,
     "add": true,
     "target": "",
     "on": "player"
    },
    {
     "type": "health_maximum",
     "value": 800,
     "add": true,
     "target": "",
     "on": "entity"
    },
    {
     "type": "default_weapon_modifier_hardpoint1",
     "value": 1,
     "add": true,
     "target": "",
     "on": "entity"
    },
    {
     "type": "income_power_player",
     "value": 0.10000000149011612,
     "add": true,
     "target": "",
     "on": "player"
    }
   ],
   "building": "civilian_bunker"
  },
  "inquisition_dedication_squad_addon": {
   "name": "Dedicated Addon: Squad Cap Increase",
   "info": "- Dedicate this structure to squad cap production.",
   "icon": "inquisition_icons/dedication_squad_icon",
   "cost": 125,
   "power": 0,
   "time": 30,
   "requires": [
    "inquisition_dedication_trading_addon",
    "inquisition_dedication_support_addon",
    "inquisition_dedication_requisition_addon",
    "inquisition_dedication_power_addon"
   ],
   "req": [
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_dedication_trading_addon"
     ]
    },
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_dedication_support_addon"
     ]
    },
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_dedication_requisition_addon"
     ]
    },
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_dedication_power_addon"
     ]
    }
   ],
   "mods": [
    {
     "type": "morale_break_event_ork",
     "value": 1,
     "add": false,
     "target": "",
     "on": "entity"
    },
    {
     "type": "health_maximum",
     "value": 0,
     "add": true,
     "target": "",
     "on": "entity"
    },
    {
     "type": "max_squad_cap_player",
     "value": 1,
     "add": true,
     "target": "",
     "on": "player"
    },
    {
     "type": "default_weapon_modifier_hardpoint1",
     "value": 0,
     "add": true,
     "target": "",
     "on": "entity"
    },
    {
     "type": "squad_cap_player",
     "value": 1,
     "add": true,
     "target": "",
     "on": "player"
    }
   ],
   "building": "civilian_bunker"
  },
  "inquisition_worker_4_addon": {
   "name": "",
   "info": "",
   "icon": "inquisition_icons\\worker_4_icon",
   "cost": 100,
   "power": 220,
   "time": 320,
   "requires": [
    "inquisition_tower_hq",
    "inquisition_worker_3_addon"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    }
   ],
   "mods": [
    {
     "type": "income_requisition_player",
     "value": 0.15000000596046448,
     "add": true,
     "target": "",
     "on": "player"
    },
    {
     "type": "health_maximum",
     "value": 800,
     "add": true,
     "target": "",
     "on": "entity"
    },
    {
     "type": "default_weapon_modifier_hardpoint1",
     "value": 1,
     "add": true,
     "target": "",
     "on": "entity"
    },
    {
     "type": "income_power_player",
     "value": 0.10000000149011612,
     "add": true,
     "target": "",
     "on": "player"
    }
   ],
   "building": "civilian_bunker"
  },
  "inquisition_dedication_support_addon": {
   "name": "Dedicated Addon: Support Cap Increase",
   "info": "- Dedicate this structure to support cap production.",
   "icon": "inquisition_icons/dedication_support_icon",
   "cost": 125,
   "power": 0,
   "time": 30,
   "requires": [
    "inquisition_dedication_trading_addon",
    "inquisition_dedication_squad_addon",
    "inquisition_dedication_requisition_addon",
    "inquisition_dedication_power_addon"
   ],
   "req": [
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_dedication_trading_addon"
     ]
    },
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_dedication_squad_addon"
     ]
    },
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_dedication_requisition_addon"
     ]
    },
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_dedication_power_addon"
     ]
    }
   ],
   "mods": [
    {
     "type": "ability_mandate_event",
     "value": 1,
     "add": false,
     "target": "",
     "on": "entity"
    },
    {
     "type": "health_maximum",
     "value": 0,
     "add": true,
     "target": "",
     "on": "entity"
    },
    {
     "type": "max_support_cap_player",
     "value": 1,
     "add": true,
     "target": "",
     "on": "player"
    },
    {
     "type": "default_weapon_modifier_hardpoint1",
     "value": 0,
     "add": true,
     "target": "",
     "on": "entity"
    },
    {
     "type": "support_cap_player",
     "value": 1,
     "add": true,
     "target": "",
     "on": "player"
    }
   ],
   "building": "civilian_bunker"
  },
  "inquisition_dedication_workers_addon": {
   "name": "Dedicated Addon: Working Industry",
   "info": "- Allows this structure to produce workers for requisition.",
   "icon": "inquisition_icons/dedication_industry_icon",
   "cost": 160,
   "power": 160,
   "time": 30,
   "requires": [],
   "req": [],
   "mods": [],
   "building": "civilian_bunker_ai"
  },
  "inquisition_dedication_trading_addon": {
   "name": "Dedicated Addon: Resource Trading Center",
   "info": "- Dedicate this structure to resource trading.",
   "icon": "inquisition_icons/dedication_trading_icon",
   "cost": 100,
   "power": 100,
   "time": 30,
   "requires": [
    "inquisition_dedication_squad_addon",
    "inquisition_astra_telepathica",
    "inquisition_dedication_support_addon",
    "inquisition_dedication_requisition_addon",
    "inquisition_dedication_power_addon",
    "inquisition_dedication_workers_addon"
   ],
   "req": [
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_dedication_squad_addon"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_astra_telepathica"
     ]
    },
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_dedication_support_addon"
     ]
    },
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_dedication_requisition_addon"
     ]
    },
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_dedication_power_addon"
     ]
    },
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_dedication_workers_addon"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_maximum",
     "value": 0,
     "add": true,
     "target": "",
     "on": "entity"
    },
    {
     "type": "default_weapon_modifier_hardpoint1",
     "value": 0,
     "add": true,
     "target": "",
     "on": "entity"
    },
    {
     "type": "morale_break_event_space_marine",
     "value": 1,
     "add": false,
     "target": "",
     "on": "entity"
    }
   ],
   "building": "civilian_bunker_ai"
  },
  "inquisition_dedication_requisition_addon": {
   "name": "Dedicated Addon: Requisition Income Increase",
   "info": "- Dedicate this structure to requisition resource production.",
   "icon": "inquisition_icons/purification_1_research",
   "cost": 100,
   "power": 250,
   "time": 45,
   "requires": [
    "inquisition_dedication_trading_addon",
    "inquisition_dedication_squad_addon",
    "inquisition_dedication_support_addon",
    "inquisition_dedication_power_addon"
   ],
   "req": [
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_dedication_trading_addon"
     ]
    },
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_dedication_squad_addon"
     ]
    },
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_dedication_support_addon"
     ]
    },
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_dedication_power_addon"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_maximum",
     "value": 0,
     "add": true,
     "target": "",
     "on": "entity"
    },
    {
     "type": "ability_tau_shield_event",
     "value": 1,
     "add": false,
     "target": "",
     "on": "entity"
    },
    {
     "type": "default_weapon_modifier_hardpoint1",
     "value": 0,
     "add": true,
     "target": "",
     "on": "entity"
    },
    {
     "type": "income_requisition_player",
     "value": 0.30000001192092896,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "civilian_bunker_ai"
  },
  "inquisition_dedication_power_addon": {
   "name": "Dedicated Addon: Power Income Increase",
   "info": "- Dedicate this structure to power resource production.",
   "icon": "inquisition_icons/increasepower1_research",
   "cost": 250,
   "power": 0,
   "time": 45,
   "requires": [
    "inquisition_dedication_trading_addon",
    "inquisition_dedication_squad_addon",
    "inquisition_dedication_support_addon",
    "inquisition_dedication_requisition_addon"
   ],
   "req": [
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_dedication_trading_addon"
     ]
    },
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_dedication_squad_addon"
     ]
    },
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_dedication_support_addon"
     ]
    },
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_dedication_requisition_addon"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_maximum",
     "value": 0,
     "add": true,
     "target": "",
     "on": "entity"
    },
    {
     "type": "ability_energy_field_event",
     "value": 1,
     "add": false,
     "target": "",
     "on": "entity"
    },
    {
     "type": "default_weapon_modifier_hardpoint1",
     "value": 0,
     "add": true,
     "target": "",
     "on": "entity"
    },
    {
     "type": "income_power_player",
     "value": 0.30000001192092896,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "civilian_bunker_ai"
  },
  "inquisition_mass_teleporter": {
   "name": "Lascannon Emplacement (Add-On)",
   "info": "- Permanently replaces the standard heavy bolter emplaced turret with lascannons.",
   "icon": "inquisition_icons/mass_teleport_addon",
   "cost": 25,
   "power": 90,
   "time": 10,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "default_weapon_modifier_hardpoint1",
     "value": 2,
     "add": true,
     "target": "",
     "on": "entity"
    }
   ],
   "building": "grey_knights_teleporter"
  },
  "inquisition_imperial_icon_addon_1": {
   "name": "Pentagram Shielding",
   "info": "",
   "icon": "inquisition_icons/pentagram_shield_addon",
   "cost": 90,
   "power": 80,
   "time": 35,
   "requires": [
    "inquisition_imperial_icon"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_imperial_icon"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_imperial_icon"
     ]
    }
   ],
   "mods": [
    {
     "type": "default_weapon_modifier_hardpoint1",
     "value": 1,
     "add": true,
     "target": "inquisition_imperial_icon",
     "on": "entity"
    },
    {
     "type": "keen_sight_radius",
     "value": 10,
     "add": true,
     "target": "",
     "on": "entity"
    },
    {
     "type": "garrison_requisition",
     "value": 1.5,
     "add": false,
     "target": "",
     "on": "entity"
    },
    {
     "type": "health_maximum",
     "value": 600,
     "add": true,
     "target": "inquisition_imperial_icon",
     "on": "entity"
    }
   ],
   "building": "imperial_icon"
  },
  "inquisition_imperial_icon_addon_2": {
   "name": "Improved Pentagram Shielding",
   "info": "",
   "icon": "inquisition_icons/psychic_wall_addon",
   "cost": 240,
   "power": 160,
   "time": 60,
   "requires": [
    "inquisition_imperial_icon_addon_1",
    "inquisition_tower_addon",
    "inquisition_imperial_icon"
   ],
   "req": [
    {
     "t": "local_addon",
     "ids": [
      "inquisition_imperial_icon_addon_1"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_imperial_icon"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_imperial_icon"
     ]
    }
   ],
   "mods": [
    {
     "type": "default_weapon_modifier_hardpoint1",
     "value": 2,
     "add": true,
     "target": "inquisition_imperial_icon",
     "on": "entity"
    },
    {
     "type": "keen_sight_radius",
     "value": 20,
     "add": true,
     "target": "",
     "on": "entity"
    },
    {
     "type": "garrison_requisition",
     "value": 2,
     "add": false,
     "target": "",
     "on": "entity"
    },
    {
     "type": "health_maximum",
     "value": 1500,
     "add": true,
     "target": "inquisition_imperial_icon",
     "on": "entity"
    }
   ],
   "building": "imperial_icon"
  },
  "inquisition_bunker_addon": {
   "name": "Flaming Death Emplacements (Add-On)",
   "info": "- Upgrade this structure with automatic flamer defenses, circulating in a 360* rotation when enemies are nearby, burning all those within a 35m radius.",
   "icon": "inquisition_icons\\infantry_bunker_flamers_icon",
   "cost": 210,
   "power": 100,
   "time": 50,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "enable_hardpoint_05",
     "value": 2,
     "add": false,
     "target": "",
     "on": "entity"
    },
    {
     "type": "enable_hardpoint_04",
     "value": -1,
     "add": false,
     "target": "",
     "on": "entity"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "",
     "on": "entity"
    },
    {
     "type": "enable_hardpoint_03",
     "value": -1,
     "add": false,
     "target": "",
     "on": "entity"
    },
    {
     "type": "enable_general_combat",
     "value": 1,
     "add": false,
     "target": "",
     "on": "entity"
    },
    {
     "type": "enable_hardpoint_01",
     "value": -1,
     "add": false,
     "target": "",
     "on": "entity"
    },
    {
     "type": "enable_hardpoint_02",
     "value": -1,
     "add": false,
     "target": "",
     "on": "entity"
    }
   ],
   "building": "infantry_bunker"
  },
  "addon_superweapon": {
   "name": "Construct Superweapon",
   "info": "- Enables the countdown of superweapons to be fired upon the battlefield.",
   "icon": "npc/superweapon_addon_1_1",
   "cost": 0,
   "power": 0,
   "time": 300,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "enable_abilities",
     "value": 2,
     "add": false,
     "target": "",
     "on": "entity"
    },
    {
     "type": "enable_general_combat",
     "value": 2,
     "add": false,
     "target": "",
     "on": "entity"
    }
   ],
   "building": "nuclear_facility"
  },
  "inquisition_extremis_diabolus": {
   "name": "Extremis Diabolus",
   "info": "- Increases HP of the Purification Decree.",
   "icon": "inquisition_icons/extremis_diabolus_addon",
   "cost": 15,
   "power": 60,
   "time": 15,
   "requires": [
    "inquisition_purification_decree",
    "inquisition_tower_addon"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_purification_decree"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_maximum",
     "value": 500,
     "add": true,
     "target": "",
     "on": "entity"
    }
   ],
   "building": "purification_decree"
  },
  "inquisition_extremis_diabolus_2": {
   "name": "Additional Extremis Diabolus",
   "info": "",
   "icon": "inquisition_icons/purification_decree2_icon",
   "cost": 30,
   "power": 150,
   "time": 25,
   "requires": [
    "inquisition_purification_decree",
    "inquisition_grey_knights_teleporter",
    "inquisition_extremis_diabolus",
    "inquisition_temporal_power",
    "inquisition_tower_addon"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_purification_decree"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_grey_knights_teleporter"
     ]
    },
    {
     "t": "local_addon",
     "ids": [
      "inquisition_extremis_diabolus"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_temporal_power"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    }
   ],
   "mods": [],
   "building": "purification_decree"
  },
  "inquisition_tower_addon": {
   "name": "Tribunal of the Inquisition (Tier I)",
   "info": "- Unlocks more advanced research, units, and structures.",
   "icon": "inquisition_icons/tribunal_addon",
   "cost": 400,
   "power": 130,
   "time": 80,
   "requires": [
    "inquisition_tower_hq",
    "inquisition_watch",
    "inquisition_librarium"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "inquisition_tower_hq"
     ]
    },
    {
     "t": "either",
     "ids": [
      "inquisition_watch",
      "inquisition_librarium"
     ]
    }
   ],
   "mods": [
    {
     "type": "enable_melee_leap",
     "value": 1,
     "add": false,
     "target": "",
     "on": "player"
    },
    {
     "type": "health_maximum",
     "value": 2000,
     "add": true,
     "target": "",
     "on": "entity"
    }
   ],
   "building": "tower_hq"
  },
  "inquisition_turret_addon_probe": {
   "name": "Probe Add-on",
   "info": "- Permanently replaces the weapon on this turret with an Auspex Device (Probe).",
   "icon": "inquisition_icons\\idh_turret_probe_icon",
   "cost": 10,
   "power": 85,
   "time": 30,
   "requires": [
    "inquisition_turret_addon",
    "inquisition_turret_heavy_bolter",
    "inquisition_temporal_power"
   ],
   "req": [
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_turret_addon"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_turret_heavy_bolter"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_temporal_power"
     ]
    }
   ],
   "mods": [
    {
     "type": "sight_radius",
     "value": 2,
     "add": false,
     "target": "",
     "on": "entity"
    },
    {
     "type": "default_weapon_modifier_hardpoint1",
     "value": 3,
     "add": true,
     "target": "",
     "on": "entity"
    },
    {
     "type": "keen_sight_radius",
     "value": 1.7000000476837158,
     "add": false,
     "target": "",
     "on": "entity"
    }
   ],
   "building": "turret_heavy_bolter"
  },
  "inquisition_turret_addon": {
   "name": "",
   "info": "",
   "icon": "inquisition_icons\\idh_turret_missile_icon",
   "cost": 25,
   "power": 90,
   "time": 15,
   "requires": [
    "inquisition_turret_addon_probe",
    "inquisition_turret_heavy_bolter",
    "inquisition_grey_knights_teleporter",
    "inquisition_astra_telepathica"
   ],
   "req": [
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_turret_addon_probe"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "inquisition_turret_heavy_bolter"
     ]
    },
    {
     "t": "either",
     "ids": [
      "inquisition_grey_knights_teleporter",
      "inquisition_astra_telepathica"
     ]
    }
   ],
   "mods": [
    {
     "type": "default_weapon_modifier_hardpoint1",
     "value": 1,
     "add": true,
     "target": "",
     "on": "entity"
    }
   ],
   "building": "turret_heavy_bolter"
  },
  "inquisition_turret_improved_addon": {
   "name": "Omnissiah Missile Launcher (Add-On)",
   "info": "- Replaces basic missile launcher weapons with the Omnissiah Missile Launchers.",
   "icon": "inquisition_icons\\idh_turret_missile_improved_icon",
   "cost": 400,
   "power": 310,
   "time": 30,
   "requires": [
    "inquisition_turret_addon",
    "inquisition_turret_addon_probe",
    "inquisition_ultimate_forces",
    "inquisition_tower_addon"
   ],
   "req": [
    {
     "t": "local_addon",
     "ids": [
      "inquisition_turret_addon"
     ]
    },
    {
     "t": "no_local_addon",
     "ids": [
      "inquisition_turret_addon_probe"
     ]
    },
    {
     "t": "research",
     "ids": [
      "inquisition_ultimate_forces"
     ]
    },
    {
     "t": "local_addon",
     "ids": [
      "inquisition_turret_addon"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "inquisition_tower_addon"
     ]
    }
   ],
   "mods": [
    {
     "type": "default_weapon_modifier_hardpoint1",
     "value": 1,
     "add": true,
     "target": "",
     "on": "entity"
    }
   ],
   "building": "turret_heavy_bolter"
  }
 }
} as const;
