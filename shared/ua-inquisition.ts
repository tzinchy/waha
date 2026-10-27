// Сгенерировано tools/ua-race.mjs из Ultimate Apocalypse 1.89.2. Не править руками.
export const UA_INQUISITION = {
 "squads": {
  "archivist": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Archivist",
    "icon": "inquisition_icons/archivist_icon",
    "model": "races/inquisition_daemonhunt/troops/archivist",
    "hp": 300,
    "armour": 100,
    "regen": 1,
    "speed": 20,
    "sight": 20,
    "cost": 75,
    "time": 6,
    "hardpoints": []
   }
  },
  "bodyguard": {
   "min": 3,
   "max": 6,
   "reinforce": 95,
   "unit": {
    "name": "Bodyguards",
    "icon": "inquisition_icons/bodyguard_icon",
    "model": "races/inquisition_daemonhunt/troops/inquisition_bodyguard",
    "hp": 550,
    "armour": 100,
    "regen": 1,
    "speed": 16,
    "sight": 25,
    "cost": 95,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 10,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 8.600000381469727,
        "veh": 0,
        "titan": 5,
        "struct": 30
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 20,
        "hinf": 12,
        "light": 80,
        "veh": 50,
        "titan": 5,
        "struct": 10
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 75,
        "light": 15,
        "veh": 10,
        "titan": 5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 49,
        "hinf": 39,
        "light": 0,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "chaplain": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Grey Knight Brotherhood Champion",
    "icon": "inquisition_icons/gk_champion_icon",
    "model": "races/inquisition/troops/grey_knight_codex",
    "hp": 1070,
    "armour": 100,
    "regen": 36,
    "speed": 14,
    "sight": 25,
    "cost": 700,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 30,
        "veh": 10,
        "titan": 8,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 1.5,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 50,
        "veh": 25,
        "titan": 8,
        "struct": 10
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 47,
        "light": 44,
        "veh": 38,
        "titan": 20,
        "struct": 12.5
       }
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
       "melee": false,
       "aoe": 14,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20
       }
      }
     ]
    ]
   }
  },
  "chimera_transport": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Chimera Transport",
    "icon": "inquisition_icons/chimera_transport_icon",
    "model": "races/inquisition_daemonhunt/troops/inquisition_chimera",
    "hp": 2400,
    "armour": 100,
    "regen": 0,
    "speed": 32,
    "sight": 30,
    "cost": 110,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 56,
        "hinf": 45,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 14,
       "vs": {
        "inf": 85,
        "hinf": 77,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 10
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 25,
        "veh": 16,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 25,
        "veh": 16,
        "titan": 5.5,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "civilian": {
   "min": 1,
   "max": 1,
   "reinforce": 30,
   "unit": {
    "name": "Worker",
    "icon": "inquisition_icons/idh_civilian_icon",
    "model": "",
    "hp": 70,
    "armour": 10,
    "regen": 1,
    "speed": 12,
    "sight": 6,
    "cost": 35,
    "time": 65,
    "hardpoints": []
   }
  },
  "civilian_ai": {
   "min": 1,
   "max": 1,
   "reinforce": 30,
   "unit": {
    "name": "Worker",
    "icon": "inquisition_icons/idh_civilian_icon",
    "model": "",
    "hp": 70,
    "armour": 10,
    "regen": 1,
    "speed": 12,
    "sight": 6,
    "cost": 35,
    "time": 68,
    "hardpoints": []
   }
  },
  "damocles": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Damocles",
    "icon": "inquisition_icons/damocles_icon",
    "model": "races/inquisition/troops/inquisition_damocles",
    "hp": 2000,
    "armour": 100,
    "regen": 0,
    "speed": 32,
    "sight": 60,
    "cost": 120,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 50,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "death_cultist": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Death Cult Assassin",
    "icon": "inquisition_icons/death_cultist_icon",
    "model": "races/inquisition_daemonhunt/troops/death_cultist",
    "hp": 800,
    "armour": 100,
    "regen": 6,
    "speed": 25,
    "sight": 35,
    "cost": 190,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 80,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "dreadknight_titan": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Nemesis Dreadknight",
    "icon": "inquisition_icons/nemesis_dreadknight_icon",
    "model": "races/inquisition/troops/dreadknight",
    "hp": 7500,
    "armour": 101,
    "regen": 0,
    "speed": 24,
    "sight": 70,
    "cost": 620,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 80,
        "light": 23,
        "veh": 13,
        "titan": 40,
        "struct": 13
       }
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
       "melee": false,
       "aoe": 4,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 50,
        "veh": 35,
        "titan": 8,
        "struct": 20
       }
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
       "melee": false,
       "aoe": 18,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20
       }
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
       "melee": false,
       "aoe": 3,
       "vs": {
        "inf": 35,
        "hinf": 20,
        "light": 45,
        "veh": 55,
        "titan": 30,
        "struct": 20
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 80,
        "light": 55,
        "veh": 30,
        "titan": 60,
        "struct": 20
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 80,
        "light": 55,
        "veh": 30,
        "titan": 60,
        "struct": 20
       }
      }
     ]
    ]
   }
  },
  "dreadnought": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Dreadnought",
    "icon": "inquisition_icons/dreadnought_icon",
    "model": "races/inquisition/troops/grey_knights_dreadnought",
    "hp": 4000,
    "armour": 100,
    "regen": 0,
    "speed": 18,
    "sight": 30,
    "cost": 180,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 30,
        "veh": 10,
        "titan": 8,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 1.5,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 50,
        "veh": 25,
        "titan": 8,
        "struct": 10
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 47,
        "light": 44,
        "veh": 38,
        "titan": 20,
        "struct": 12.5
       }
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
       "melee": false,
       "aoe": 14,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20
       }
      }
     ]
    ]
   }
  },
  "dreadnought_assault": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Purgation Assault Dreadnought",
    "icon": "inquisition_icons/dreadnought_asault_icon",
    "model": "races/inquisition_daemonhunt/troops/id_gk_dreadnought",
    "hp": 4000,
    "armour": 100,
    "regen": 0,
    "speed": 16,
    "sight": 30,
    "cost": 210,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 30,
        "veh": 10,
        "titan": 8,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 20,
        "light": 45,
        "veh": 55,
        "titan": 30,
        "struct": 20
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 25,
        "veh": 16,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 20,
        "hinf": 12,
        "light": 88,
        "veh": 53,
        "titan": 5,
        "struct": 25
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 55,
        "hinf": 60,
        "light": 54,
        "veh": 48,
        "titan": 55,
        "struct": 25
       }
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
       "melee": false,
       "aoe": 14,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 0,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "dreadnought_support": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Purgation Hellfire Dreadnought",
    "icon": "inquisition_icons/dreadnought_support_icon",
    "model": "races/inquisition_daemonhunt/troops/id_gk_dreadnought",
    "hp": 3500,
    "armour": 100,
    "regen": 0,
    "speed": 16,
    "sight": 40,
    "cost": 130,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 30,
        "veh": 10,
        "titan": 8,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 1.5,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 50,
        "veh": 25,
        "titan": 8,
        "struct": 10
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094
       }
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
       "melee": false,
       "aoe": 5,
       "vs": {
        "inf": 80,
        "hinf": 75,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 4,
       "vs": {
        "inf": 25,
        "hinf": 25,
        "light": 60,
        "veh": 50,
        "titan": 10,
        "struct": 14
       }
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
       "melee": false,
       "aoe": 14,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20
       }
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
       "melee": true,
       "aoe": 14,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "dreadnought_venerable": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Venerable Dreadnought",
    "icon": "inquisition_icons/dreadnought_venerable_icon",
    "model": "races/inquisition/troops/grey_knight_ven_dread",
    "hp": 8000,
    "armour": 104,
    "regen": 0.10000000149011612,
    "speed": 26,
    "sight": 30,
    "cost": 280,
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
       "melee": false,
       "aoe": 1.5,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 50,
        "veh": 25,
        "titan": 8,
        "struct": 10
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 47,
        "light": 44,
        "veh": 38,
        "titan": 20,
        "struct": 12.5
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 30,
        "veh": 10,
        "titan": 8,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "ds_turret": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "",
    "icon": "inquisition_icons/IDH_turret_icon",
    "model": "races/imperial_turrs/structures/dehun_turret_heavy_bolter",
    "hp": 1000,
    "armour": 100,
    "regen": 0,
    "speed": 0,
    "sight": 20,
    "cost": 120,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 10,
        "veh": 5,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 3,
       "vs": {
        "inf": 25,
        "hinf": 25,
        "light": 60,
        "veh": 50,
        "titan": 10,
        "struct": 14
       }
      }
     ]
    ]
   }
  },
  "grenaider_troops": {
   "min": 4,
   "max": 8,
   "reinforce": 45,
   "unit": {
    "name": "Grenaiders",
    "icon": "inquisition_icons/grenaiders_icon",
    "model": "races/inquisition_daemonhunt/troops/inquisition_shocktroop",
    "hp": 400,
    "armour": 100,
    "regen": 1,
    "speed": 16,
    "sight": 25,
    "cost": 40,
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
       "melee": false,
       "aoe": 4,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 10,
        "veh": 0,
        "titan": 20,
        "struct": 7
       }
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
       "melee": false,
       "aoe": 13,
       "vs": {
        "inf": 75,
        "hinf": 100,
        "light": 50,
        "veh": 50,
        "titan": 25,
        "struct": 25
       }
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
       "melee": false,
       "aoe": 5,
       "vs": {
        "inf": 85,
        "hinf": 50,
        "light": 10,
        "veh": 0,
        "titan": 20,
        "struct": 7
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 49,
        "hinf": 39,
        "light": 0,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "grey_knight_champion": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Grey Knight Brotherhood Champion",
    "icon": "inquisition_icons/gk_champion_icon",
    "model": "races/space_marines/troops/gknight_champion",
    "hp": 1070,
    "armour": 100,
    "regen": 36,
    "speed": 14,
    "sight": 25,
    "cost": 300,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 62,
        "hinf": 53,
        "light": 7.599999904632568,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 80,
        "light": 55,
        "veh": 30,
        "titan": 60,
        "struct": 20
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "grey_knight_hero": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "The Grand Master",
    "icon": "inquisition_icons/grey_knight_hero_icon",
    "model": "races/inquisition_daemonhunt/troops/grey_knight_hero",
    "hp": 10000,
    "armour": 107,
    "regen": 250,
    "speed": 16,
    "sight": 60,
    "cost": 16000,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 50,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 80,
        "light": 23,
        "veh": 13,
        "titan": 40,
        "struct": 13
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "grey_knights": {
   "min": 2,
   "max": 5,
   "reinforce": 130,
   "unit": {
    "name": "Grey Knights Strike Team",
    "icon": "inquisition_icons/grey_knight_icon",
    "model": "races/inquisition_daemonhunt/troops/id_grey_knight",
    "hp": 2200,
    "armour": 102,
    "regen": 3.5,
    "speed": 16,
    "sight": 25,
    "cost": 130,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 50,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 20,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 20,
        "light": 45,
        "veh": 55,
        "titan": 30,
        "struct": 20
       }
      }
     ],
     [
      {
       "file": "inquisition_halberd_grey_knight",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 1,
       "min": 56,
       "max": 70,
       "pierce": 15,
       "morale": 12,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 50,
        "light": 50,
        "veh": 20,
        "titan": 10,
        "struct": 20
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "grey_knights_astra": {
   "min": 2,
   "max": 5,
   "reinforce": 130,
   "unit": {
    "name": "Grey Knights Strike Team",
    "icon": "inquisition_icons/grey_knight_icon",
    "model": "races/inquisition_daemonhunt/troops/id_grey_knight",
    "hp": 2200,
    "armour": 102,
    "regen": 3.5,
    "speed": 16,
    "sight": 25,
    "cost": 130,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 50,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 20,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 20,
        "light": 45,
        "veh": 55,
        "titan": 30,
        "struct": 20
       }
      }
     ],
     [
      {
       "file": "inquisition_halberd_grey_knight",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 1,
       "min": 56,
       "max": 70,
       "pierce": 15,
       "morale": 12,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 50,
        "light": 50,
        "veh": 20,
        "titan": 10,
        "struct": 20
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "grey_knights_interceptor": {
   "min": 2,
   "max": 5,
   "reinforce": 140,
   "unit": {
    "name": "Grey Knight Interceptors",
    "icon": "inquisition_icons/grey_knight_interceptor_icon",
    "model": "races/inquisition/troops/grey_knight_codex",
    "hp": 2550,
    "armour": 102,
    "regen": 3.5,
    "speed": 16,
    "sight": 25,
    "cost": 140,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 50,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
      }
     ],
     [
      {
       "file": "inquisition_halberd_grey_knight_interceptor",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 1,
       "min": 70,
       "max": 100,
       "pierce": 15,
       "morale": 12,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 50,
        "light": 50,
        "veh": 20,
        "titan": 10,
        "struct": 20
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 80,
        "light": 23,
        "veh": 13,
        "titan": 40,
        "struct": 13
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 45,
        "light": 23,
        "veh": 13,
        "titan": 20,
        "struct": 13
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 80,
        "light": 55,
        "veh": 30,
        "titan": 60,
        "struct": 20
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "grey_knights_purgator": {
   "min": 2,
   "max": 5,
   "reinforce": 140,
   "unit": {
    "name": "Grey Knight Purgators",
    "icon": "inquisition_icons/grey_knight_purgator_icon",
    "model": "races/inquisition/troops/grey_knight_codex",
    "hp": 2200,
    "armour": 102,
    "regen": 3.5,
    "speed": 16,
    "sight": 25,
    "cost": 140,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 20,
        "light": 45,
        "veh": 55,
        "titan": 30,
        "struct": 20
       }
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
       "melee": false,
       "aoe": 20,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 49,
        "hinf": 39,
        "light": 0,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "grey_knights_purifier": {
   "min": 2,
   "max": 5,
   "reinforce": 160,
   "unit": {
    "name": "Grey Knight Purifiers",
    "icon": "inquisition_icons/grey_knight_purifier_icon",
    "model": "races/inquisition/troops/grey_knight_psyker",
    "hp": 2200,
    "armour": 102,
    "regen": 4,
    "speed": 16,
    "sight": 25,
    "cost": 160,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 50,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 82,
        "light": 10,
        "veh": 0,
        "titan": 48,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "grey_knights_terminator": {
   "min": 2,
   "max": 5,
   "reinforce": 280,
   "unit": {
    "name": "Grey Knight Terminators",
    "icon": "inquisition_icons/gk_terminator_icon",
    "model": "races/inquisition_daemonhunt/troops/grey_knight_terminator",
    "hp": 3500,
    "armour": 103,
    "regen": 3,
    "speed": 16,
    "sight": 30,
    "cost": 280,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 50,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 20,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 20,
        "light": 45,
        "veh": 55,
        "titan": 30,
        "struct": 20
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 80,
        "light": 23,
        "veh": 13,
        "titan": 40,
        "struct": 13
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "grey_knights_terminator_paladin": {
   "min": 2,
   "max": 3,
   "reinforce": 500,
   "unit": {
    "name": "Grey Knight Paladins",
    "icon": "inquisition_icons/grey_knight_terminator_paladin_icon",
    "model": "races/inquisition/troops/grey_knight_terminator_codex",
    "hp": 4500,
    "armour": 104,
    "regen": 4,
    "speed": 12,
    "sight": 30,
    "cost": 500,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 50,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 20,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 20,
        "light": 45,
        "veh": 55,
        "titan": 30,
        "struct": 20
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 80,
        "light": 23,
        "veh": 13,
        "titan": 40,
        "struct": 13
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 80,
        "light": 55,
        "veh": 30,
        "titan": 60,
        "struct": 20
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "imperator_titan": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Imperator Titan",
    "icon": "titan_icons\\imperator_icon",
    "model": "races/imperators/troops/ig_imperator",
    "hp": 200000,
    "armour": 105,
    "regen": 10,
    "speed": 9,
    "sight": 250,
    "cost": 21000,
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
       "melee": false,
       "aoe": 40,
       "vs": {
        "inf": 150,
        "hinf": 150,
        "light": 150,
        "veh": 150,
        "titan": 50,
        "struct": 15
       }
      }
     ],
     [
      {
       "file": "titan_imperator_megalaser",
       "name": "",
       "range": 250,
       "minRange": 20,
       "reload": 1,
       "accuracy": 1,
       "min": 4500,
       "max": 6000,
       "pierce": 15,
       "morale": 1800,
       "melee": false,
       "aoe": 10,
       "vs": {
        "inf": 20,
        "hinf": 25,
        "light": 100.66699981689453,
        "veh": 90,
        "titan": 50,
        "struct": 30
       }
      }
     ]
    ]
   }
  },
  "inquisitor_lord": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Inquisitor Lord",
    "icon": "inquisition_icons/inquisitor_lord_icon",
    "model": "races/inquisition_daemonhunt/troops/inquisitor_lord",
    "hp": 940,
    "armour": 100,
    "regen": 31,
    "speed": 16,
    "sight": 50,
    "cost": 245,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 62,
        "hinf": 53,
        "light": 7.599999904632568,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 75,
        "light": 15,
        "veh": 10,
        "titan": 5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 61.72200012207031,
        "hinf": 45.400001525878906,
        "light": 35.63600158691406,
        "veh": 25,
        "titan": 30,
        "struct": 10.666999816894531
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 75,
        "veh": 60,
        "titan": 125,
        "struct": 15
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 65,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "inquisitor_ordo_malleus": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Ordo Malleus Supreme Lord",
    "icon": "inquisition_icons/inquisitor_toth_icon",
    "model": "",
    "hp": 940,
    "armour": 100,
    "regen": 31,
    "speed": 16,
    "sight": 45,
    "cost": 320,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 75,
        "light": 15,
        "veh": 10,
        "titan": 5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 61.72200012207031,
        "hinf": 45.400001525878906,
        "light": 35.63600158691406,
        "veh": 25,
        "titan": 30,
        "struct": 10.666999816894531
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 75,
        "veh": 60,
        "titan": 125,
        "struct": 15
       }
      }
     ]
    ]
   }
  },
  "land_raider": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Land Raider Phobos",
    "icon": "inquisition_icons/land_raider_phobos_icon",
    "model": "races/inquisition/troops/land_raidgk_codex",
    "hp": 8500,
    "armour": 100,
    "regen": 0,
    "speed": 24,
    "sight": 30,
    "cost": 350,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 25,
        "veh": 16,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 0,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "land_raider_crusader": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Land Raider Crusader",
    "icon": "inquisition_icons/land_raider_crusader_icon",
    "model": "races/inquisition/troops/land_raidgk_crusader",
    "hp": 8500,
    "armour": 100,
    "regen": 0,
    "speed": 24,
    "sight": 30,
    "cost": 350,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 30,
        "veh": 10,
        "titan": 8,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 70,
        "light": 35,
        "veh": 25,
        "titan": 50,
        "struct": 25
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 70,
        "light": 35,
        "veh": 25,
        "titan": 50,
        "struct": 25
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 20,
        "hinf": 12,
        "light": 88,
        "veh": 53,
        "titan": 5,
        "struct": 25
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 40,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 75,
        "struct": 25
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 5.5,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "land_raider_daemonhunter": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Land Raider Daemon Hunter",
    "icon": "inquisition_icons/inquisition_crusader_icon",
    "model": "races/inquisition_daemonhunt/troops/id_crusader",
    "hp": 9000,
    "armour": 102,
    "regen": 0,
    "speed": 24,
    "sight": 50,
    "cost": 520,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 30,
        "veh": 10,
        "titan": 8,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 25,
        "veh": 16,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 70,
        "light": 35,
        "veh": 25,
        "titan": 50,
        "struct": 25
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 70,
        "light": 35,
        "veh": 25,
        "titan": 50,
        "struct": 25
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 20,
        "hinf": 12,
        "light": 88,
        "veh": 53,
        "titan": 5,
        "struct": 25
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 0,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "land_raider_redeemer": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Land Raider Redeemer",
    "icon": "inquisition_icons/land_raider_redeemer_icon",
    "model": "races/inquisition/troops/land_raidgk_redeemer",
    "hp": 8500,
    "armour": 100,
    "regen": 0,
    "speed": 24,
    "sight": 30,
    "cost": 350,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 30,
        "veh": 10,
        "titan": 8,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 6,
       "vs": {
        "inf": 85,
        "hinf": 77,
        "light": 25,
        "veh": 15,
        "titan": 60,
        "struct": 50
       }
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
       "melee": false,
       "aoe": 6,
       "vs": {
        "inf": 85,
        "hinf": 77,
        "light": 25,
        "veh": 15,
        "titan": 60,
        "struct": 50
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 25,
        "veh": 16,
        "titan": 5.5,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "predator": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Predator Annihilator",
    "icon": "inquisition_icons/predator_icon",
    "model": "races/space_marines/troops/predator_codex",
    "hp": 6820,
    "armour": 102,
    "regen": 0,
    "speed": 24,
    "sight": 35,
    "cost": 230,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 25,
        "veh": 16,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 25,
        "veh": 16,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 50,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "razorback": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Razorback Transport",
    "icon": "inquisition_icons/razorback_icon",
    "model": "races/inquisition/troops/inquisition_razorback_scorpion",
    "hp": 2600,
    "armour": 100,
    "regen": 0,
    "speed": 28,
    "sight": 30,
    "cost": 170,
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
       "melee": false,
       "aoe": 14,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 15,
        "veh": 5,
        "titan": 5,
        "struct": 20
       }
      }
     ]
    ]
   }
  },
  "rhino": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Rhino Transport",
    "icon": "inquisition_icons/inquisitorial_rhino_icon",
    "model": "races/inquisition_daemonhunt/troops/inquisitorial_rhino",
    "hp": 2000,
    "armour": 100,
    "regen": 0,
    "speed": 32,
    "sight": 30,
    "cost": 150,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 40,
        "hinf": 50,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 4,
       "vs": {
        "inf": 25,
        "hinf": 25,
        "light": 60,
        "veh": 50,
        "titan": 10,
        "struct": 14
       }
      }
     ]
    ]
   }
  },
  "scholar_astropath": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Astropath",
    "icon": "inquisition_icons/astropath_icon",
    "model": "races/inquisition_daemonhunt/troops/scholars",
    "hp": 400,
    "armour": 100,
    "regen": 1,
    "speed": 15,
    "sight": 60,
    "cost": 70,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 31,
        "light": 3,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 49,
        "hinf": 39,
        "light": 0,
        "veh": 0,
        "titan": 20,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 0,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "scholar_calculus_logi": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Calculus Logistic Pskyer",
    "icon": "inquisition_icons/calculus_logi_icon",
    "model": "races/inquisition_daemonhunt/troops/scholars",
    "hp": 250,
    "armour": 100,
    "regen": 1,
    "speed": 15,
    "sight": 10,
    "cost": 120,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 0,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "scholar_exorcist": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Exorcist",
    "icon": "inquisition_icons/exorcist_icon",
    "model": "races/inquisition_daemonhunt/troops/scholars",
    "hp": 600,
    "armour": 100,
    "regen": 1,
    "speed": 15,
    "sight": 30,
    "cost": 70,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 61,
        "hinf": 53,
        "light": 46,
        "veh": 41,
        "titan": 20,
        "struct": 20
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 0,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "scholars": {
   "min": 5,
   "max": 9,
   "reinforce": 30,
   "unit": {
    "name": "Scholars",
    "icon": "inquisition_icons/scholars_icon",
    "model": "races/inquisition_daemonhunt/troops/scholars",
    "hp": 450,
    "armour": 100,
    "regen": 1,
    "speed": 17,
    "sight": 20,
    "cost": 30,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 31,
        "light": 3,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 49,
        "hinf": 39,
        "light": 0,
        "veh": 0,
        "titan": 20,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 0,
        "hinf": 0,
        "light": 0,
        "veh": 0,
        "titan": 0,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "servitor_maintenance": {
   "min": 1,
   "max": 3,
   "reinforce": 30,
   "unit": {
    "name": "Maintenance Servitors",
    "icon": "inquisition_icons/servitor_maintenance_icon",
    "model": "races/inquisition_daemonhunt/troops/inquisition_servitor",
    "hp": 300,
    "armour": 100,
    "regen": 1,
    "speed": 16,
    "sight": 25,
    "cost": 30,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 61.72200012207031,
        "hinf": 45.400001525878906,
        "light": 35.63600158691406,
        "veh": 25,
        "titan": 15,
        "struct": 10.666999816894531
       }
      }
     ]
    ]
   }
  },
  "servitor_melee": {
   "min": 4,
   "max": 8,
   "reinforce": 50,
   "unit": {
    "name": "Assault Servitors",
    "icon": "inquisition_icons/servitor_melee_icon",
    "model": "races/inquisition_daemonhunt/troops/inquisition_servitor",
    "hp": 690,
    "armour": 100,
    "regen": 1,
    "speed": 20,
    "sight": 25,
    "cost": 50,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 61.72200012207031,
        "hinf": 45.400001525878906,
        "light": 35.63600158691406,
        "veh": 25,
        "titan": 15,
        "struct": 10.666999816894531
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 61.72200012207031,
        "hinf": 45.400001525878906,
        "light": 35.63600158691406,
        "veh": 25,
        "titan": 15,
        "struct": 10.666999816894531
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 61.72200012207031,
        "hinf": 65,
        "light": 50,
        "veh": 35,
        "titan": 15,
        "struct": 10.666999816894531
       }
      }
     ]
    ]
   }
  },
  "servitor_weapon": {
   "min": 4,
   "max": 8,
   "reinforce": 50,
   "unit": {
    "name": "Weapon Servitors",
    "icon": "inquisition_icons/servitor_weapon_icon",
    "model": "races/inquisition_daemonhunt/troops/inquisition_servitor",
    "hp": 500,
    "armour": 100,
    "regen": 1,
    "speed": 16,
    "sight": 25,
    "cost": 50,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 25,
        "veh": 16,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 20,
        "hinf": 12,
        "light": 88,
        "veh": 53,
        "titan": 5,
        "struct": 15
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 61.72200012207031,
        "hinf": 45.400001525878906,
        "light": 35.63600158691406,
        "veh": 25,
        "titan": 15,
        "struct": 10.666999816894531
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 61.72200012207031,
        "hinf": 65,
        "light": 50,
        "veh": 35,
        "titan": 15,
        "struct": 10.666999816894531
       }
      }
     ]
    ]
   }
  },
  "servo_skull": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Servo Skull",
    "icon": "inquisition_icons/servo_skull_icon",
    "model": "races/inquisition_daemonhunt/troops/servo_skull",
    "hp": 250,
    "armour": 100,
    "regen": 1,
    "speed": 25,
    "sight": 45,
    "cost": 40,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 39,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 45
       }
      }
     ]
    ]
   }
  },
  "shock_troops": {
   "min": 5,
   "max": 8,
   "reinforce": 35,
   "unit": {
    "name": "Elite Stormtroopers",
    "icon": "inquisition_icons/shock_troops_icon",
    "model": "races/inquisition_daemonhunt/troops/inquisition_shocktroop",
    "hp": 480,
    "armour": 100,
    "regen": 1,
    "speed": 16,
    "sight": 25,
    "cost": 40,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 10,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 8.600000381469727,
        "veh": 0,
        "titan": 5,
        "struct": 30
       }
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
       "melee": false,
       "aoe": 4,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 10,
        "veh": 0,
        "titan": 20,
        "struct": 7
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 75,
        "light": 15,
        "veh": 10,
        "titan": 5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 20,
        "hinf": 12,
        "light": 80,
        "veh": 50,
        "titan": 5,
        "struct": 10
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 49,
        "hinf": 39,
        "light": 0,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "stormraven_fury": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Stormraven Fury",
    "icon": "inquisition_icons/stormraven_fury_icon",
    "model": "races/inquisition/troops/gkraven",
    "hp": 8000,
    "armour": 100,
    "regen": 0,
    "speed": 60,
    "sight": 70,
    "cost": 490,
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
       "melee": false,
       "aoe": 6,
       "vs": {
        "inf": 20,
        "hinf": 12,
        "light": 88,
        "veh": 53,
        "titan": 5,
        "struct": 25
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 70,
        "light": 35,
        "veh": 25,
        "titan": 50,
        "struct": 25
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 70,
        "light": 35,
        "veh": 25,
        "titan": 50,
        "struct": 25
       }
      }
     ]
    ]
   }
  },
  "stormtroopers": {
   "min": 5,
   "max": 10,
   "reinforce": 15,
   "unit": {
    "name": "",
    "icon": "inquisition_icons/stormtroopers_icon",
    "model": "races/inquisition_daemonhunt/troops/inquisition_shocktroop",
    "hp": 220,
    "armour": 100,
    "regen": 1,
    "speed": 16,
    "sight": 25,
    "cost": 15,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 10,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 8.600000381469727,
        "veh": 0,
        "titan": 5,
        "struct": 30
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 49,
        "hinf": 39,
        "light": 0,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
      }
     ]
    ]
   }
  },
  "tempest": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Land Speeder Tempest",
    "icon": "inquisition_icons/land_speeder_tempest_icon",
    "model": "races/space_marines/troops/tempest",
    "hp": 1050,
    "armour": 100,
    "regen": 0,
    "speed": 60,
    "sight": 30,
    "cost": 130,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 30,
        "veh": 10,
        "titan": 8,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 5,
       "vs": {
        "inf": 85,
        "hinf": 50,
        "light": 10,
        "veh": 1,
        "titan": 65,
        "struct": 28
       }
      }
     ]
    ]
   }
  },
  "thunderfire_cannon": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Thunderfire Cannon",
    "icon": "inquisition_icons/thunderfire_cannon_icon",
    "model": "races/space_marines/troops/thunderfire_cannon",
    "hp": 1000,
    "armour": 100,
    "regen": 0,
    "speed": 16,
    "sight": 35,
    "cost": 90,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 55,
        "hinf": 55,
        "light": 35,
        "veh": 25,
        "titan": 8,
        "struct": 10
       }
      }
     ]
    ]
   }
  },
  "thunderhawk": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "",
    "icon": "",
    "model": "races/inquisition_daemonhunt/troops/inquisition_th_transporter",
    "hp": 0,
    "armour": 0,
    "regen": 0,
    "speed": 0,
    "sight": 30,
    "cost": 0,
    "time": 1,
    "hardpoints": []
   }
  },
  "trade_power": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Resource Trade: Power",
    "icon": "inquisition_icons/idh_trade_power_icon",
    "model": "races/tyranids/structures/drop_building",
    "hp": 0,
    "armour": 100,
    "regen": -5,
    "speed": 0,
    "sight": 0,
    "cost": 200,
    "time": 1,
    "hardpoints": []
   }
  },
  "trade_requisition": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Resource Trade: Requisition",
    "icon": "inquisition_icons/idh_trade_requisition_icon",
    "model": "races/tyranids/structures/drop_building",
    "hp": 0,
    "armour": 100,
    "regen": -5,
    "speed": 0,
    "sight": 0,
    "cost": 0,
    "time": 1,
    "hardpoints": []
   }
  },
  "valkyrie": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "",
    "icon": "",
    "model": "races/inquisition_daemonhunt/troops/inquisition_valkyrie",
    "hp": 0,
    "armour": 0,
    "regen": 0,
    "speed": 0,
    "sight": 30,
    "cost": 0,
    "time": 1,
    "hardpoints": []
   }
  },
  "valkyrie_uamod": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Valkyrie Transport",
    "icon": "inquisition_icons/valkyrie_icon",
    "model": "races/imperial_guard/troops/valkyrie_extraction",
    "hp": 3000,
    "armour": 100,
    "regen": 0,
    "speed": 0,
    "sight": 36,
    "cost": 150,
    "time": 45,
    "hardpoints": []
   }
  },
  "vulture": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Vulture Gunship",
    "icon": "inquisition_icons/vulture_icon",
    "model": "races/armoured_company/troops/ac_vulture_gunship",
    "hp": 6000,
    "armour": 101,
    "regen": 0,
    "speed": 59,
    "sight": 35,
    "cost": 250,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 60,
        "light": 50,
        "veh": 35,
        "titan": 8,
        "struct": 20
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 30,
        "hinf": 30,
        "light": 87.6259994506836,
        "veh": 52.55799865722656,
        "titan": 20,
        "struct": 18.152000427246094
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 60,
        "light": 25,
        "veh": 16,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 3,
       "vs": {
        "inf": 25,
        "hinf": 25,
        "light": 60,
        "veh": 50,
        "titan": 10,
        "struct": 14
       }
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
       "melee": false,
       "aoe": 3,
       "vs": {
        "inf": 25,
        "hinf": 25,
        "light": 60,
        "veh": 50,
        "titan": 10,
        "struct": 14
       }
      }
     ]
    ]
   }
  },
  "warhound_titan": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Warhound Purifier Titan",
    "icon": "inquisition_icons/idh_warhound_purifier_icon",
    "model": "races/titans/troops/winter_warhound_idh",
    "hp": 25000,
    "armour": 100,
    "regen": 0,
    "speed": 18,
    "sight": 60,
    "cost": 1250,
    "time": 130,
    "hardpoints": [
     [
      {
       "file": "inquisition_titan_inferno_cannon_improved_left",
       "name": "",
       "range": 72,
       "minRange": 2,
       "reload": 0.4000000059604645,
       "accuracy": 1,
       "min": 131,
       "max": 270,
       "pierce": 0,
       "morale": 80,
       "melee": false,
       "aoe": 6,
       "vs": {
        "inf": 80,
        "hinf": 70,
        "light": 70,
        "veh": 55,
        "titan": 125,
        "struct": 80
       }
      }
     ],
     [
      {
       "file": "inquisition_titan_inferno_cannon_improved",
       "name": "",
       "range": 72,
       "minRange": 2,
       "reload": 0.4000000059604645,
       "accuracy": 1,
       "min": 131,
       "max": 270,
       "pierce": 0,
       "morale": 80,
       "melee": false,
       "aoe": 6,
       "vs": {
        "inf": 80,
        "hinf": 70,
        "light": 70,
        "veh": 55,
        "titan": 125,
        "struct": 80
       }
      },
      {
       "file": "inquisition_titan_plasma_blastgun_godly",
       "name": "",
       "range": 72,
       "minRange": 5,
       "reload": 1,
       "accuracy": 1,
       "min": 2000,
       "max": 3000,
       "pierce": 20,
       "morale": 200,
       "melee": false,
       "aoe": 8,
       "vs": {
        "inf": 10,
        "hinf": 12,
        "light": 80,
        "veh": 80,
        "titan": 40,
        "struct": 30
       }
      }
     ]
    ]
   }
  },
  "warhound_vengence_titan": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Warhound Vengence Titan",
    "icon": "inquisition_icons/idh_warhound_vengence_icon",
    "model": "races/titans/troops/winter_warhound_idh",
    "hp": 25000,
    "armour": 100,
    "regen": 0,
    "speed": 18,
    "sight": 60,
    "cost": 1250,
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
       "melee": false,
       "aoe": 4,
       "vs": {
        "inf": 75,
        "hinf": 50,
        "light": 45,
        "veh": 30,
        "titan": 16.5,
        "struct": 30
       }
      }
     ],
     [
      {
       "file": "inquisition_titan_plasma_blastgun",
       "name": "",
       "range": 72,
       "minRange": 5,
       "reload": 5,
       "accuracy": 1,
       "min": 2500,
       "max": 3500,
       "pierce": 15,
       "morale": 200,
       "melee": false,
       "aoe": 7,
       "vs": {
        "inf": 10,
        "hinf": 12,
        "light": 80,
        "veh": 80,
        "titan": 40,
        "struct": 30
       }
      },
      {
       "file": "inquisition_titan_plasma_blastgun_godly",
       "name": "",
       "range": 72,
       "minRange": 5,
       "reload": 1,
       "accuracy": 1,
       "min": 2000,
       "max": 3000,
       "pierce": 20,
       "morale": 200,
       "melee": false,
       "aoe": 8,
       "vs": {
        "inf": 10,
        "hinf": 12,
        "light": 80,
        "veh": 80,
        "titan": 40,
        "struct": 30
       }
      }
     ]
    ]
   }
  },
  "whirlwind": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Whirlwind Hyperios",
    "icon": "inquisition_icons/whirlwind_icon",
    "model": "races/inquisition/troops/inquisition_whirlwind_hyperios",
    "hp": 5280,
    "armour": 102,
    "regen": 0,
    "speed": 16,
    "sight": 50,
    "cost": 310,
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
       "melee": false,
       "aoe": 5,
       "vs": {
        "inf": 50,
        "hinf": 35,
        "light": 10,
        "veh": 5,
        "titan": 30,
        "struct": 50
       }
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
       "melee": false,
       "aoe": 7,
       "vs": {
        "inf": 25,
        "hinf": 20,
        "light": 90,
        "veh": 70,
        "titan": 50,
        "struct": 30
       }
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
       "melee": false,
       "aoe": 3,
       "vs": {
        "inf": 15,
        "hinf": 12,
        "light": 60,
        "veh": 50,
        "titan": 11,
        "struct": 14.444000244140625
       }
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
       "melee": false,
       "aoe": 3,
       "vs": {
        "inf": 15,
        "hinf": 12,
        "light": 60,
        "veh": 50,
        "titan": 11,
        "struct": 14.444000244140625
       }
      }
     ]
    ]
   }
  }
 },
 "buildings": {
  "astra_telepathica": {
   "name": "Astra Telepathica",
   "icon": "inquisition_icons/astra_telepatica_icon",
   "model": "races/inquisition_daemonhunt/structures/domus_astra_telepatica",
   "hp": 3500,
   "armour": 100,
   "regen": 0,
   "speed": 0,
   "sight": 40,
   "cost": 190,
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
   ]
  },
  "civilian_bunker": {
   "name": "Urban Territory",
   "icon": "inquisition_icons/urban_territory_icon",
   "model": "races/inquisition/structures/civilian_structure",
   "hp": 800,
   "armour": 100,
   "regen": 0,
   "speed": 0,
   "sight": 15,
   "cost": 50,
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
     }
    ]
   ],
   "spawns": [],
   "research": []
  },
  "civilian_bunker_ai": {
   "name": "Urban Territory",
   "icon": "inquisition_icons/urban_territory_icon",
   "model": "races/inquisition/structures/civilian_structure",
   "hp": 500,
   "armour": 100,
   "regen": 0,
   "speed": 0,
   "sight": 15,
   "cost": 50,
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
     }
    ]
   ],
   "spawns": [
    "inquisition_squad_shock_troops",
    "inquisition_squad_civilian_ai"
   ],
   "research": []
  },
  "grey_knights_teleporter": {
   "name": "Grey Knights Teleporter",
   "icon": "inquisition_icons/grey_knights_teleporter",
   "model": "races/inquisition_daemonhunt/structures/gk_teleporter",
   "hp": 3000,
   "armour": 100,
   "regen": 0,
   "speed": 0,
   "sight": 25,
   "cost": 200,
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 70,
       "hinf": 60,
       "light": 25,
       "veh": 16,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 30,
       "hinf": 30,
       "light": 87.6259994506836,
       "veh": 52.55799865722656,
       "titan": 20,
       "struct": 18.152000427246094
      }
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
   ]
  },
  "imperial_icon": {
   "name": "Icon of Purification",
   "icon": "inquisition_icons/imperial_icon_icon",
   "model": "races/inquisition_daemonhunt/structures/imperial_icon",
   "hp": 2800,
   "armour": 100,
   "regen": 0,
   "speed": 0,
   "sight": 35,
   "cost": 90,
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 0,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 42,
       "hinf": 51,
       "light": 20,
       "veh": 10,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 4,
      "vs": {
       "inf": 42,
       "hinf": 51,
       "light": 60,
       "veh": 50,
       "titan": 30,
       "struct": 0
      }
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
   ]
  },
  "infantry_bunker": {
   "name": "Bunker",
   "icon": "inquisition_icons/infantry_bunker_icon",
   "model": "races/sisters/structures/sister_bunker_base",
   "hp": 5000,
   "armour": 100,
   "regen": 0,
   "speed": 0,
   "sight": 25,
   "cost": 240,
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 70,
       "hinf": 60,
       "light": 25,
       "veh": 16,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 70,
       "hinf": 60,
       "light": 25,
       "veh": 16,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 70,
       "hinf": 60,
       "light": 25,
       "veh": 16,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 70,
       "hinf": 60,
       "light": 25,
       "veh": 16,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 80,
       "hinf": 60,
       "light": 10,
       "veh": 0,
       "titan": 20,
       "struct": 0
      }
     }
    ]
   ],
   "spawns": [],
   "research": [
    "inquisition_temporal_power"
   ]
  },
  "librarium": {
   "name": "Librarium",
   "icon": "inquisition_icons/librarium_icon",
   "model": "races/inquisition_daemonhunt/structures/librarium",
   "hp": 2500,
   "armour": 100,
   "regen": 0,
   "speed": 0,
   "sight": 15,
   "cost": 175,
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
   ]
  },
  "mines": {
   "name": "",
   "icon": "inquisition_icons/IDH_mines_icon",
   "model": "races/imperial_guard/structures/guard_mines",
   "hp": 1000,
   "armour": 100,
   "regen": 0,
   "speed": 0,
   "sight": 10,
   "cost": 60,
   "time": 18,
   "hardpoints": [],
   "spawns": [],
   "research": []
  },
  "nuclear_facility": {
   "name": "",
   "icon": "inquisition_icons/idh_nuke_facility_icon",
   "model": "races/sisters/structures/sister_bunker_silo",
   "hp": 6000,
   "armour": 100,
   "regen": 0,
   "speed": 0,
   "sight": 5,
   "cost": 2500,
   "time": 290,
   "hardpoints": [],
   "spawns": [],
   "research": [
    "inquisition_begin_purification"
   ]
  },
  "purification_decree": {
   "name": "Purification Decree",
   "icon": "inquisition_icons/purification_decree_icon",
   "model": "races/inquisition_daemonhunt/structures/purification_decree",
   "hp": 1200,
   "armour": 100,
   "regen": 0,
   "speed": 0,
   "sight": 35,
   "cost": 140,
   "time": 40,
   "hardpoints": [],
   "spawns": [],
   "research": []
  },
  "shrine_to_the_emperor": {
   "name": "Shrine To The Emperor",
   "icon": "inquisition_icons/idh_shrine_to_the_emperor_icon",
   "model": "races/sisters/structures/shrine_to_the_emperor",
   "hp": 3000,
   "armour": 100,
   "regen": 0,
   "speed": 0,
   "sight": 6,
   "cost": 2250,
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
   ]
  },
  "strategic_point": {
   "name": "Emplaced Strategic Point",
   "icon": "environment_icons/strategic_point_icon",
   "model": "",
   "hp": 0,
   "armour": 0,
   "regen": 0,
   "speed": 0,
   "sight": 35,
   "cost": 100,
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
      "melee": true,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": true,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": true,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": true,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
     }
    ]
   ],
   "spawns": [],
   "research": []
  },
  "tanktrap": {
   "name": "",
   "icon": "inquisition_icons/idh_tank_trap_icon",
   "model": "",
   "hp": 200,
   "armour": 120,
   "regen": 0,
   "speed": 0,
   "sight": 0,
   "cost": 5,
   "time": 1,
   "hardpoints": [],
   "spawns": [],
   "research": []
  },
  "tower_hq": {
   "name": "Ordo Malleus Tower",
   "icon": "inquisition_icons/tower_hq_icon",
   "model": "races/inquisition_daemonhunt/structures/inquisition_tower",
   "hp": 7500,
   "armour": 100,
   "regen": 0,
   "speed": 0,
   "sight": 60,
   "cost": 450,
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
   ]
  },
  "tower_mechanicum": {
   "name": "Titanic Mechanicum Tower",
   "icon": "inquisition_icons/idh_titan_bunker_icon",
   "model": "races/idh/structures/idh_titan_assembly_tower",
   "hp": 15000,
   "armour": 100,
   "regen": 0,
   "speed": 0,
   "sight": 45,
   "cost": 1330,
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
   ]
  },
  "turret_heavy_bolter": {
   "name": "",
   "icon": "inquisition_icons/IDH_turret_icon",
   "model": "races/imperial_turrs/structures/dehun_turret_heavy_bolter",
   "hp": 2800,
   "armour": 100,
   "regen": 0,
   "speed": 0,
   "sight": 55,
   "cost": 85,
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 70,
       "hinf": 60,
       "light": 10,
       "veh": 5,
       "titan": 5.5,
       "struct": 0
      }
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
      "melee": false,
      "aoe": 3,
      "vs": {
       "inf": 25,
       "hinf": 25,
       "light": 60,
       "veh": 50,
       "titan": 10,
       "struct": 14
      }
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
      "melee": false,
      "aoe": 10,
      "vs": {
       "inf": 25,
       "hinf": 25,
       "light": 60,
       "veh": 50,
       "titan": 10,
       "struct": 14
      }
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
      "melee": false,
      "aoe": 0,
      "vs": {
       "inf": 0,
       "hinf": 0,
       "light": 0,
       "veh": 0,
       "titan": 5.5,
       "struct": 0
      }
     }
    ]
   ],
   "spawns": [],
   "research": [
    "inquisition_turret_upgrade2",
    "inquisition_turret_upgrade1"
   ]
  },
  "wall": {
   "name": "",
   "icon": "inquisition_icons/wall_0_icon",
   "model": "",
   "hp": 4000,
   "armour": 100,
   "regen": 0,
   "speed": 0,
   "sight": 5,
   "cost": 165,
   "time": 8,
   "hardpoints": [],
   "spawns": [],
   "research": [
    "inquisition_walls_research",
    "inquisition_temporal_power"
   ]
  },
  "warp_generator": {
   "name": "",
   "icon": "inquisition_icons/warp_generator_icon",
   "model": "races/inquisition_daemonhunt/structures/generator_small",
   "hp": 1500,
   "armour": 100,
   "regen": 0,
   "speed": 0,
   "sight": 15,
   "cost": 135,
   "time": 30,
   "hardpoints": [],
   "spawns": [],
   "research": [
    "inquisition_power_research_5",
    "inquisition_power_research_4",
    "inquisition_power_research_2",
    "inquisition_power_research_3",
    "inquisition_power_research_1"
   ]
  },
  "warp_reactor": {
   "name": "",
   "icon": "inquisition_icons/warp_reactor_icon",
   "model": "races/inquisition_daemonhunt/structures/generator_big",
   "hp": 2500,
   "armour": 100,
   "regen": 0,
   "speed": 0,
   "sight": 15,
   "cost": 250,
   "time": 60,
   "hardpoints": [],
   "spawns": [],
   "research": [
    "inquisition_power_research_5",
    "inquisition_power_research_4",
    "inquisition_power_research_2",
    "inquisition_power_research_3",
    "inquisition_power_research_1"
   ]
  },
  "watch": {
   "name": "Inquisition Watch",
   "icon": "inquisition_icons/watch_icon",
   "model": "races/inquisition_daemonhunt/structures/inquisition_watch",
   "hp": 5000,
   "armour": 100,
   "regen": 0,
   "speed": 0,
   "sight": 15,
   "cost": 220,
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
   ]
  }
 }
} as const;
