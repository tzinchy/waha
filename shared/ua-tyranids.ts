// Сгенерировано tools/ua-race.mjs из Ultimate Apocalypse 1.89.2. Не править руками.
export const UA_TYRANIDS = {
 "squads": {
  "biovores": {
   "min": 2,
   "max": 4,
   "reinforce": 200,
   "ups": 2,
   "cap": 4,
   "support": 0,
   "unit": {
    "id": "tyranids_biovores",
    "name": "Biovores",
    "icon": "Tyranids_icons/i_biovore",
    "model": "races/tyranids/troops/biovore",
    "hp": 800,
    "armour": 100,
    "armourType": "vehicle_med",
    "regen": 1.5,
    "speed": 16,
    "sight": 25,
    "cost": 200,
    "power": 50,
    "time": 20,
    "hardpoints": [
     [
      {
       "file": "tyranids_biovores_spores",
       "name": "",
       "range": 90,
       "minRange": 10,
       "reload": 5,
       "accuracy": 0.5,
       "min": 500,
       "max": 600,
       "pierce": 0,
       "morale": 80,
       "setup": 1,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 6,
       "vs": {
        "inf": 60,
        "hinf": 30,
        "light": 16,
        "veh": 6,
        "titan": 11,
        "struct": 10,
        "cmd": 20
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "tyranids_biovores_spores_bioacid",
       "name": "Bio Acid Spore Mine",
       "range": 100,
       "minRange": 10,
       "reload": 5,
       "accuracy": 0.699999988079071,
       "min": 250,
       "max": 350,
       "pierce": 0,
       "morale": 90,
       "setup": 1,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 8,
       "vs": {
        "inf": 15,
        "hinf": 15,
        "light": 90,
        "veh": 75,
        "titan": 50,
        "struct": 40,
        "cmd": 24
       },
       "cost": 20,
       "power": 70,
       "time": 1.600000023841858,
       "icon": "tyranids_icons/i_spore_acid",
       "requires": [
        "tyranids_hq_addon_2",
        "tyranids_biomorph_hive"
       ]
      },
      {
       "file": "tyranids_biovores_spores_frag",
       "name": "",
       "range": 110,
       "minRange": 0,
       "reload": 5,
       "accuracy": 1,
       "min": 800,
       "max": 1350,
       "pierce": 2,
       "morale": 160,
       "setup": 1,
       "moveAcc": 1,
       "melee": false,
       "aoe": 4,
       "vs": {
        "inf": 50,
        "hinf": 20,
        "light": 15,
        "veh": 10,
        "titan": 5,
        "struct": 10,
        "cmd": 9.600000381469727
       },
       "cost": 40,
       "power": 100,
       "time": 2,
       "icon": "tyranids_icons/i_spore_frag",
       "requires": [
        "tyranids_hq_addon_2",
        "tyranids_biomorph_hive",
        "tyranids_arrival3_research"
       ]
      },
      {
       "file": "tyranids_biovores_spores_toxin",
       "name": "Toxin Spore Mine",
       "range": 100,
       "minRange": 10,
       "reload": 5,
       "accuracy": 0.5,
       "min": 500,
       "max": 600,
       "pierce": 0,
       "morale": 50,
       "setup": 1,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 10,
       "vs": {
        "inf": 60,
        "hinf": 30,
        "light": 16,
        "veh": 6,
        "titan": 11,
        "struct": 10,
        "cmd": 20
       },
       "cost": 20,
       "power": 40,
       "time": 7,
       "icon": "tyranids_icons/i_spore_toxin",
       "requires": [
        "tyranids_hq_addon_2",
        "tyranids_biomorph_hive"
       ]
      }
     ]
    ]
   },
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    }
   ]
  },
  "broodlord": {
   "min": 3,
   "max": 6,
   "reinforce": 170,
   "ups": 0,
   "cap": 6,
   "support": 0,
   "unit": {
    "id": "tyranids_broodlord",
    "name": "Broodlord",
    "icon": "Tyranids_icons/i_broodlord",
    "model": "races/tyranids/troops/broodlord",
    "hp": 1900,
    "armour": 101,
    "armourType": "infantry_heavy_high",
    "regen": 2,
    "speed": 18,
    "sight": 25,
    "cost": 170,
    "power": 0,
    "time": 20,
    "hardpoints": [
     [
      {
       "file": "tyranids_melee_broodlord",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.75,
       "min": 210,
       "max": 248,
       "pierce": 10,
       "morale": 26,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 40,
        "veh": 20,
        "titan": 20,
        "struct": 15,
        "cmd": 15
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "tyranids_scyth_broodlord",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.949999988079071,
       "min": 400,
       "max": 480,
       "pierce": 3,
       "morale": 60,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 55,
        "titan": 70,
        "struct": 35,
        "cmd": 60
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
      "tyranids_arrival3_research"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    }
   ]
  },
  "carnifex": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 1,
   "cap": 0,
   "support": 4,
   "unit": {
    "id": "tyranids_carnifex",
    "name": "Carnifex",
    "icon": "tyranids_icons/i_carnifex",
    "model": "races/tyranids/troops/carnifex",
    "hp": 6800,
    "armour": 102,
    "armourType": "vehicle_high",
    "regen": 4,
    "speed": 16,
    "sight": 35,
    "cost": 700,
    "power": 150,
    "time": 45,
    "hardpoints": [
     [
      {
       "file": "tyranids_melee_carnifex",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 168,
       "max": 203,
       "pierce": 10,
       "morale": 60,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 50,
        "veh": 45,
        "titan": 15,
        "struct": 17,
        "cmd": 12
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "tyranids_barbed_strangler_carnifex",
       "name": "Barbed Strangler",
       "range": 40,
       "minRange": 0,
       "reload": 1.5,
       "accuracy": 1,
       "min": 498,
       "max": 658,
       "pierce": 0,
       "morale": 62,
       "setup": 0,
       "moveAcc": 0.3499999940395355,
       "melee": false,
       "aoe": 3,
       "vs": {
        "inf": 100,
        "hinf": 50,
        "light": 25,
        "veh": 10,
        "titan": 5.5,
        "struct": 9,
        "cmd": 20
       },
       "cost": 120,
       "power": 0,
       "time": 3,
       "icon": "Tyranids_icons/i_strangler",
       "requires": []
      },
      {
       "file": "tyranids_venom_canon_carnifex",
       "name": "Venom Cannon",
       "range": 30,
       "minRange": 0,
       "reload": 2.5,
       "accuracy": 1,
       "min": 543,
       "max": 760,
       "pierce": 5,
       "morale": 60,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 30,
        "light": 100,
        "veh": 60,
        "titan": 22,
        "struct": 12,
        "cmd": 12
       },
       "cost": 120,
       "power": 0,
       "time": 7,
       "icon": "tyranids_icons/i_venom",
       "requires": []
      }
     ],
     [
      {
       "file": "tyranids_melee_carnifex",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 168,
       "max": 203,
       "pierce": 10,
       "morale": 60,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 50,
        "veh": 45,
        "titan": 15,
        "struct": 17,
        "cmd": 12
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "tyranids_melee_carnifex_crushclaw",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.8500000238418579,
       "min": 223,
       "max": 283,
       "pierce": 12,
       "morale": 90,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 70,
        "light": 80,
        "veh": 65,
        "titan": 30,
        "struct": 35,
        "cmd": 10
       },
       "cost": 100,
       "power": 0,
       "time": 2,
       "icon": "tyranids_icons/i_claw",
       "requires": []
      }
     ],
     [
      {
       "file": "chaos_marine_dummy_weapon",
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
       "file": "tyranids_bioplasma_carnifex",
       "name": "",
       "range": 30,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 650,
       "max": 800,
       "pierce": 10,
       "morale": 90,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 5,
       "vs": {
        "inf": 15,
        "hinf": 15,
        "light": 90,
        "veh": 80,
        "titan": 25,
        "struct": 25,
        "cmd": 12
       },
       "cost": 120,
       "power": 0,
       "time": 4,
       "icon": "Tyranids_icons/i_plasma",
       "requires": [
        "tyranids_arrival3_research"
       ]
      }
     ],
     [
      {
       "file": "tyranids_spinefist_carnifex",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.30000001192092896,
       "min": 30,
       "max": 60,
       "pierce": 10,
       "morale": 10,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 50,
        "veh": 45,
        "titan": 15,
        "struct": 35,
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
       "file": "tyranids_spinefist_carnifex",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.30000001192092896,
       "min": 30,
       "max": 60,
       "pierce": 10,
       "morale": 10,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 50,
        "veh": 45,
        "titan": 15,
        "struct": 35,
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
      "tyranids_arrival3_research"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_carnifex_hive"
     ]
    }
   ]
  },
  "carnifex_khazi": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 1,
   "cap": 0,
   "support": 2,
   "unit": {
    "id": "tyranids_carnifex_khazi",
    "name": "Hellfex (Carnifex)",
    "icon": "tyranids_icons/i_hellfex",
    "model": "races/tyranids/troops/carnifex_khazi",
    "hp": 3200,
    "armour": 100,
    "armourType": "vehicle_med",
    "regen": 4,
    "speed": 16,
    "sight": 35,
    "cost": 300,
    "power": 0,
    "time": 25,
    "hardpoints": [
     [
      {
       "file": "tyranids_devourer_khazi_carnifex",
       "name": "Devourer",
       "range": 28,
       "minRange": 0,
       "reload": 0.30000001192092896,
       "accuracy": 0.75,
       "min": 28,
       "max": 35,
       "pierce": 0,
       "morale": 5,
       "setup": 0,
       "moveAcc": 0.44999998807907104,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 45,
        "light": 25,
        "veh": 40,
        "titan": 25,
        "struct": 20,
        "cmd": 18.600000381469727
       },
       "cost": 25,
       "power": 0,
       "time": 1.399999976158142,
       "icon": "tyranids_icons/i_devourer",
       "requires": []
      },
      {
       "file": "tyranids_deathspitter_khazi_carnifex",
       "name": "Deathspitter",
       "range": 35,
       "minRange": 0,
       "reload": 5,
       "accuracy": 0.550000011920929,
       "min": 320,
       "max": 450,
       "pierce": 2,
       "morale": 30,
       "setup": 0,
       "moveAcc": 0.4000000059604645,
       "melee": false,
       "aoe": 6,
       "vs": {
        "inf": 63.79999923706055,
        "hinf": 40.20000076293945,
        "light": 15,
        "veh": 20,
        "titan": 35,
        "struct": 30,
        "cmd": 18.600000381469727
       },
       "cost": 70,
       "power": 0,
       "time": 2,
       "icon": "tyranids_icons/i_spitter",
       "requires": []
      }
     ],
     [
      {
       "file": "tyranids_devourer_khazi_carnifex",
       "name": "Devourer",
       "range": 28,
       "minRange": 0,
       "reload": 0.30000001192092896,
       "accuracy": 0.75,
       "min": 28,
       "max": 35,
       "pierce": 0,
       "morale": 5,
       "setup": 0,
       "moveAcc": 0.44999998807907104,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 45,
        "light": 25,
        "veh": 40,
        "titan": 25,
        "struct": 20,
        "cmd": 18.600000381469727
       },
       "cost": 25,
       "power": 0,
       "time": 1.399999976158142,
       "icon": "tyranids_icons/i_devourer",
       "requires": []
      },
      {
       "file": "tyranids_venom_canon_khazi_carnifex",
       "name": "Venom Cannon",
       "range": 30,
       "minRange": 0,
       "reload": 2.5,
       "accuracy": 1,
       "min": 240,
       "max": 300,
       "pierce": 5,
       "morale": 25,
       "setup": 0,
       "moveAcc": 0.550000011920929,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 30,
        "light": 100,
        "veh": 60,
        "titan": 22,
        "struct": 12,
        "cmd": 12
       },
       "cost": 80,
       "power": 0,
       "time": 4,
       "icon": "tyranids_icons/i_venom",
       "requires": [
        "tyranids_hq_addon_2",
        "tyranids_biomorph_hive"
       ]
      }
     ],
     [
      {
       "file": "tyranids_melee_carnifex",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 168,
       "max": 203,
       "pierce": 10,
       "morale": 60,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 50,
        "veh": 45,
        "titan": 15,
        "struct": 17,
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
     "t": "structure",
     "ids": [
      "tyranids_carnifex_hive"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    }
   ]
  },
  "carnifex_skiller": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 2,
   "unit": {
    "id": "tyranids_carnifex_skiller",
    "name": "Screamer Killer (Carnifex)",
    "icon": "tyranids_icons/i_screamer_killer",
    "model": "races/tyranids/troops/carnifex_skiller",
    "hp": 3400,
    "armour": 100,
    "armourType": "vehicle_med",
    "regen": 2.5,
    "speed": 16,
    "sight": 35,
    "cost": 280,
    "power": 100,
    "time": 25,
    "hardpoints": [
     [
      {
       "file": "tyranids_melee_carnifex",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 168,
       "max": 203,
       "pierce": 10,
       "morale": 60,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 50,
        "veh": 45,
        "titan": 15,
        "struct": 17,
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
       "file": "tyranids_melee_carnifex",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 168,
       "max": 203,
       "pierce": 10,
       "morale": 60,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 50,
        "veh": 45,
        "titan": 15,
        "struct": 17,
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
     "t": "structure",
     "ids": [
      "tyranids_carnifex_hive"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    }
   ]
  },
  "carnifex_tervigon": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "tyranids_carnifex_tervigon",
    "name": "Tervigon (Carnifex)",
    "icon": "tyranids_icons/i_tervigon",
    "model": "races/tyranids/troops/carnifex_uber",
    "hp": 12000,
    "armour": 100,
    "armourType": "monster_high",
    "regen": 4,
    "speed": 22,
    "sight": 35,
    "cost": 1100,
    "power": 0,
    "time": 60,
    "hardpoints": [
     [
      {
       "file": "tyranids_melee_uberfex",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 2,
       "accuracy": 0.8500000238418579,
       "min": 750,
       "max": 900,
       "pierce": 8,
       "morale": 150,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 70,
        "light": 80,
        "veh": 65,
        "titan": 45,
        "struct": 35,
        "cmd": 10
       },
       "cost": 100,
       "power": 0,
       "time": 2,
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
       "file": "tyranids_melee_uberfex",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 2,
       "accuracy": 0.8500000238418579,
       "min": 750,
       "max": 900,
       "pierce": 8,
       "morale": 150,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 70,
        "light": 80,
        "veh": 65,
        "titan": 45,
        "struct": 35,
        "cmd": 10
       },
       "cost": 100,
       "power": 0,
       "time": 2,
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
     "t": "structure",
     "ids": [
      "tyranids_relic_hive"
     ]
    },
    {
     "t": "research",
     "ids": [
      "tyranids_arrival3_research"
     ]
    }
   ]
  },
  "carnifex_uber": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 1,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "tyranids_carnifex_uber",
    "name": "Uberfex (Carnifex)",
    "icon": "tyranids_icons/i_uberfex",
    "model": "races/tyranids/troops/carnifex_uber",
    "hp": 16000,
    "armour": 100,
    "armourType": "monster_high",
    "regen": 10,
    "speed": 22,
    "sight": 45,
    "cost": 1250,
    "power": 0,
    "time": 60,
    "hardpoints": [
     [
      {
       "file": "tyranids_melee_uberfex",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 2,
       "accuracy": 0.8500000238418579,
       "min": 750,
       "max": 900,
       "pierce": 8,
       "morale": 150,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 70,
        "light": 80,
        "veh": 65,
        "titan": 45,
        "struct": 35,
        "cmd": 10
       },
       "cost": 100,
       "power": 0,
       "time": 2,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "tyranids_venom_canon_uberfex",
       "name": "Venom Cannon",
       "range": 45,
       "minRange": 0,
       "reload": 1.5,
       "accuracy": 0.800000011920929,
       "min": 1100,
       "max": 1300,
       "pierce": 5,
       "morale": 67,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 90,
        "veh": 75,
        "titan": 40,
        "struct": 10,
        "cmd": 10
       },
       "cost": 120,
       "power": 0,
       "time": 10,
       "icon": "tyranids_icons/i_venom",
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
       "file": "tyranids_bioplasma_uberfex",
       "name": "",
       "range": 45,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 900,
       "max": 1200,
       "pierce": 10,
       "morale": 90,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 7,
       "vs": {
        "inf": 70,
        "hinf": 50,
        "light": 20,
        "veh": 15,
        "titan": 10,
        "struct": 10,
        "cmd": 50
       },
       "cost": 250,
       "power": 0,
       "time": 10,
       "icon": "Tyranids_icons/i_plasma",
       "requires": [
        "tyranids_arrival3_research"
       ]
      }
     ],
     [
      {
       "file": "tyranids_melee_uberfex",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 2,
       "accuracy": 0.8500000238418579,
       "min": 750,
       "max": 900,
       "pierce": 8,
       "morale": 150,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 70,
        "light": 80,
        "veh": 65,
        "titan": 45,
        "struct": 35,
        "cmd": 10
       },
       "cost": 100,
       "power": 0,
       "time": 2,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "tyranids_melee_uberfex_crushclaw",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 2,
       "accuracy": 0.8500000238418579,
       "min": 700,
       "max": 980,
       "pierce": 8,
       "morale": 180,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 70,
        "light": 50,
        "veh": 40,
        "titan": 45,
        "struct": 75,
        "cmd": 10
       },
       "cost": 275,
       "power": 0,
       "time": 15,
       "icon": "tyranids_icons/i_claw",
       "requires": [
        "tyranids_assimilation_research"
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
     ]
    ]
   },
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_relic_hive"
     ]
    },
    {
     "t": "research",
     "ids": [
      "tyranids_arrival3_research"
     ]
    }
   ]
  },
  "gargoyle": {
   "min": 6,
   "max": 15,
   "reinforce": 30,
   "ups": 0,
   "cap": 2,
   "support": 0,
   "unit": {
    "id": "tyranids_gargoyle",
    "name": "Gargoyles",
    "icon": "Tyranids_icons/tyranids_gargoyle_icon",
    "model": "races/tyranids/troops/gargoyle",
    "hp": 195,
    "armour": 100,
    "armourType": "infantry_med",
    "regen": 1,
    "speed": 48,
    "sight": 55,
    "cost": 30,
    "power": 0,
    "time": 1,
    "hardpoints": [
     [
      {
       "file": "tyranids_devourer_gaunt",
       "name": "Devourer",
       "range": 28,
       "minRange": 0,
       "reload": 0.30000001192092896,
       "accuracy": 0.6200000047683716,
       "min": 10.970000267028809,
       "max": 16.399999618530273,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0.3499999940395355,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 45,
        "light": 20,
        "veh": 15,
        "titan": 5.5,
        "struct": 7,
        "cmd": 18
       },
       "cost": 10,
       "power": 0,
       "time": 1,
       "icon": "tyranids_icons/i_devourer",
       "requires": [
        "tyranids_gaunt_devourer_research"
       ]
      },
      {
       "file": "tyranids_devourer_gargoyle",
       "name": "Devourer",
       "range": 28,
       "minRange": 0,
       "reload": 0.30000001192092896,
       "accuracy": 0.6200000047683716,
       "min": 10,
       "max": 14,
       "pierce": 0,
       "morale": 3,
       "setup": 0,
       "moveAcc": 0.3499999940395355,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 45,
        "light": 30,
        "veh": 10,
        "titan": 9,
        "struct": 4,
        "cmd": 18
       },
       "cost": 10,
       "power": 0,
       "time": 1,
       "icon": "tyranids_icons/i_devourer",
       "requires": [
        "tyranids_gaunt_devourer_research"
       ]
      }
     ]
    ]
   },
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_1"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_gaunt_hive"
     ]
    }
   ]
  },
  "gargoyle_max": {
   "min": 4,
   "max": 8,
   "reinforce": 15,
   "ups": 0,
   "morale": {
    "max": 200,
    "rate": 0,
    "minTime": 12,
    "minMorale": 30,
    "acc": 0.20000000298023224,
    "speed": 1.2000000476837158
   },
   "cap": 2,
   "support": 0,
   "unit": {
    "id": "tyranids_gargoyle",
    "name": "Gargoyles",
    "icon": "Tyranids_icons/tyranids_gargoyle_icon",
    "model": "races/tyranids/troops/gargoyle",
    "hp": 195,
    "armour": 100,
    "armourType": "infantry_med",
    "regen": 1,
    "speed": 48,
    "sight": 55,
    "cost": 30,
    "power": 0,
    "time": 1,
    "hardpoints": [
     [
      {
       "file": "tyranids_devourer_gaunt",
       "name": "Devourer",
       "range": 28,
       "minRange": 0,
       "reload": 0.30000001192092896,
       "accuracy": 0.6200000047683716,
       "min": 10.970000267028809,
       "max": 16.399999618530273,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0.3499999940395355,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 45,
        "light": 20,
        "veh": 15,
        "titan": 5.5,
        "struct": 7,
        "cmd": 18
       },
       "cost": 10,
       "power": 0,
       "time": 1,
       "icon": "tyranids_icons/i_devourer",
       "requires": [
        "tyranids_gaunt_devourer_research"
       ]
      },
      {
       "file": "tyranids_devourer_gargoyle",
       "name": "Devourer",
       "range": 28,
       "minRange": 0,
       "reload": 0.30000001192092896,
       "accuracy": 0.6200000047683716,
       "min": 10,
       "max": 14,
       "pierce": 0,
       "morale": 3,
       "setup": 0,
       "moveAcc": 0.3499999940395355,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 45,
        "light": 30,
        "veh": 10,
        "titan": 9,
        "struct": 4,
        "cmd": 18
       },
       "cost": 10,
       "power": 0,
       "time": 1,
       "icon": "tyranids_icons/i_devourer",
       "requires": [
        "tyranids_gaunt_devourer_research"
       ]
      }
     ]
    ]
   },
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_gaunt_hive"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_1"
     ]
    }
   ]
  },
  "gaunt_won": {
   "min": 25,
   "max": 25,
   "reinforce": 3,
   "ups": 0,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "tyranids_gaunt_won",
    "name": "Spinegaunt (Without Number)",
    "icon": "Tyranids_icons/i_spinegaunt_won",
    "model": "races/tyranids/troops/spinegaunt",
    "hp": 133,
    "armour": 100,
    "armourType": "infantry_med",
    "regen": 1,
    "speed": 30,
    "sight": 25,
    "cost": 0,
    "power": 0,
    "time": 1,
    "hardpoints": [
     [
      {
       "file": "tyranids_spinefist_gaunt",
       "name": "Spinefist",
       "range": 25,
       "minRange": 0,
       "reload": 0.800000011920929,
       "accuracy": 0.75,
       "min": 9,
       "max": 12,
       "pierce": 2,
       "morale": 3,
       "setup": 0,
       "moveAcc": 0.6000000238418579,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 43.060001373291016,
        "hinf": 13.899999618530273,
        "light": 0,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 12
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "Tyranids_icons/i_fist",
       "requires": []
      }
     ],
     [
      {
       "file": "tyranids_melee_termagant",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.5,
       "min": 7,
       "max": 13,
       "pierce": 0,
       "morale": 7,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
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
      }
     ]
    ]
   },
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_xeno_hive"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    }
   ]
  },
  "genestealer": {
   "min": 4,
   "max": 4,
   "reinforce": 40,
   "ups": 0,
   "cap": 3,
   "support": 0,
   "unit": {
    "id": "tyranids_genestealer",
    "name": "Genestealers",
    "icon": "Tyranids_icons/i_genestealer",
    "model": "races/tyranids/troops/genestealer",
    "hp": 350,
    "armour": 100,
    "armourType": "infantry_med",
    "regen": 1,
    "speed": 18,
    "sight": 25,
    "cost": 26.25,
    "power": 0,
    "time": 3,
    "hardpoints": [
     [
      {
       "file": "tyranids_rending_claw_genestealer",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.699999988079071,
       "min": 30,
       "max": 50,
       "pierce": 0,
       "morale": 16,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 35,
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
       "file": "tyranids_scyth_genestealer",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 90,
       "max": 120,
       "pierce": 0,
       "morale": 15,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 40,
        "titan": 70,
        "struct": 10,
        "cmd": 60
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
   "req": []
  },
  "genestealer_max": {
   "min": 2,
   "max": 4,
   "reinforce": 40,
   "ups": 0,
   "cap": 3,
   "support": 0,
   "unit": {
    "id": "tyranids_genestealer_max",
    "name": "Genestealers",
    "icon": "Tyranids_icons/i_genestealer",
    "model": "races/tyranids/troops/genestealer",
    "hp": 350,
    "armour": 100,
    "armourType": "infantry_med",
    "regen": 1,
    "speed": 18,
    "sight": 25,
    "cost": 0,
    "power": 30,
    "time": 6,
    "hardpoints": [
     [
      {
       "file": "tyranids_rending_claw_genestealer",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.699999988079071,
       "min": 30,
       "max": 50,
       "pierce": 0,
       "morale": 16,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 35,
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
       "file": "tyranids_scyth_genestealer",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 90,
       "max": 120,
       "pierce": 0,
       "morale": 15,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 40,
        "titan": 70,
        "struct": 10,
        "cmd": 60
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
      "tyranids_biomorph_hive"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    }
   ]
  },
  "hierophant": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 1,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "tyranids_hierophant",
    "name": "Hierophant Bio Titan",
    "icon": "tyranids_icons/i_titan",
    "model": "races/tyranids/troops/tyranids_hierophant",
    "hp": 30775,
    "armour": 103,
    "armourType": "titan",
    "regen": 30,
    "speed": 16,
    "sight": 50,
    "cost": 6500,
    "power": 0,
    "time": 200,
    "hardpoints": [
     [
      {
       "file": "tyranids_venom_canon_hierophant",
       "name": "Venom Cannon",
       "range": 50,
       "minRange": 0,
       "reload": 1,
       "accuracy": 1,
       "min": 188,
       "max": 242,
       "pierce": 5,
       "morale": 35,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 35,
        "light": 80,
        "veh": 70,
        "titan": 25,
        "struct": 20,
        "cmd": 25
       },
       "cost": 80,
       "power": 0,
       "time": 8,
       "icon": "tyranids_icons/i_venom",
       "requires": []
      },
      {
       "file": "tyranids_venom_canon_improved_left_hierophant",
       "name": "",
       "range": 50,
       "minRange": 0,
       "reload": 1,
       "accuracy": 1,
       "min": 347,
       "max": 495,
       "pierce": 5,
       "morale": 55,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 35,
        "light": 80,
        "veh": 70,
        "titan": 25,
        "struct": 20,
        "cmd": 25
       },
       "cost": 250,
       "power": 0,
       "time": 8,
       "icon": "tyranids_icons/i_weapon_hierophant_venomcannon_2",
       "requires": []
      }
     ],
     [
      {
       "file": "tyranids_venom_canon_hierophant",
       "name": "Venom Cannon",
       "range": 50,
       "minRange": 0,
       "reload": 1,
       "accuracy": 1,
       "min": 188,
       "max": 242,
       "pierce": 5,
       "morale": 35,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 35,
        "light": 80,
        "veh": 70,
        "titan": 25,
        "struct": 20,
        "cmd": 25
       },
       "cost": 80,
       "power": 0,
       "time": 8,
       "icon": "tyranids_icons/i_venom",
       "requires": []
      },
      {
       "file": "tyranids_venom_canon_improved_hierophant",
       "name": "",
       "range": 50,
       "minRange": 0,
       "reload": 1,
       "accuracy": 1,
       "min": 347,
       "max": 495,
       "pierce": 5,
       "morale": 55,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 35,
        "light": 80,
        "veh": 70,
        "titan": 25,
        "struct": 20,
        "cmd": 25
       },
       "cost": 250,
       "power": 0,
       "time": 8,
       "icon": "tyranids_icons/i_weapon_hierophant_venomcannon_1",
       "requires": []
      }
     ],
     [
      {
       "file": "tyranids_melee_hiero",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 1898,
       "max": 2378,
       "pierce": 14,
       "morale": 300,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 10,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 100,
        "veh": 80,
        "titan": 40,
        "struct": 40,
        "cmd": 30
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "tyranids_melee_hiero_improved_left",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 2372,
       "max": 3091,
       "pierce": 18,
       "morale": 400,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 10,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 100,
        "veh": 80,
        "titan": 40,
        "struct": 40,
        "cmd": 30
       },
       "cost": 500,
       "power": 0,
       "time": 15,
       "icon": "tyranids_icons/i_weapon_hierophant_melee_2",
       "requires": []
      }
     ],
     [
      {
       "file": "tyranids_melee_hiero",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 1898,
       "max": 2378,
       "pierce": 14,
       "morale": 300,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 10,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 100,
        "veh": 80,
        "titan": 40,
        "struct": 40,
        "cmd": 30
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "tyranids_melee_hiero_improved",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 2372,
       "max": 3091,
       "pierce": 18,
       "morale": 400,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 10,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 100,
        "veh": 80,
        "titan": 40,
        "struct": 40,
        "cmd": 30
       },
       "cost": 500,
       "power": 0,
       "time": 15,
       "icon": "tyranids_icons/i_weapon_hierophant_melee_1",
       "requires": []
      }
     ],
     [
      {
       "file": "tyranids_turret_mine_hierophant",
       "name": "Bio Acid Spore Mine",
       "range": 50,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 245,
       "max": 670,
       "pierce": 0,
       "morale": 30,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 7,
       "vs": {
        "inf": 10,
        "hinf": 10,
        "light": 150,
        "veh": 75,
        "titan": 30,
        "struct": 20,
        "cmd": 50
       },
       "cost": 50,
       "power": 0,
       "time": 1.600000023841858,
       "icon": "tyranids_icons/i_spore_acid",
       "requires": []
      }
     ],
     [
      {
       "file": "tyranids_turret_mine_hierophant",
       "name": "Bio Acid Spore Mine",
       "range": 50,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 245,
       "max": 670,
       "pierce": 0,
       "morale": 30,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 7,
       "vs": {
        "inf": 10,
        "hinf": 10,
        "light": 150,
        "veh": 75,
        "titan": 30,
        "struct": 20,
        "cmd": 50
       },
       "cost": 50,
       "power": 0,
       "time": 1.600000023841858,
       "icon": "tyranids_icons/i_spore_acid",
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
       "file": "tyranids_turret_mine_launcher_improved_hierophant",
       "name": "",
       "range": 50,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 0.800000011920929,
       "min": 245,
       "max": 470,
       "pierce": 0,
       "morale": 30,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 7,
       "vs": {
        "inf": 10,
        "hinf": 10,
        "light": 150,
        "veh": 75,
        "titan": 30,
        "struct": 20,
        "cmd": 50
       },
       "cost": 1000,
       "power": 0,
       "time": 20,
       "icon": "tyranids_icons/i_weapon_hierophant_back",
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
       "file": "tyranids_bioplasma_hierophant",
       "name": "",
       "range": 50,
       "minRange": 0,
       "reload": 2,
       "accuracy": 1,
       "min": 845,
       "max": 1003,
       "pierce": 10,
       "morale": 90,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 5,
       "vs": {
        "inf": 15,
        "hinf": 15,
        "light": 90,
        "veh": 90,
        "titan": 25,
        "struct": 25,
        "cmd": 12
       },
       "cost": 300,
       "power": 0,
       "time": 9,
       "icon": "Tyranids_icons/i_weapon_hierophant_head",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "tyranids_assimilation_research"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_biotitan_hive"
     ]
    }
   ]
  },
  "hierophant_max": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 1,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "tyranids_hierophant_max",
    "name": "Hierophant Bio Titan",
    "icon": "tyranids_icons/i_titan",
    "model": "races/tyranids/troops/tyranids_hierophant",
    "hp": 30775,
    "armour": 103,
    "armourType": "titan",
    "regen": 30,
    "speed": 16,
    "sight": 50,
    "cost": 0,
    "power": 6500,
    "time": 270,
    "hardpoints": [
     [
      {
       "file": "tyranids_venom_canon_hierophant",
       "name": "Venom Cannon",
       "range": 50,
       "minRange": 0,
       "reload": 1,
       "accuracy": 1,
       "min": 188,
       "max": 242,
       "pierce": 5,
       "morale": 35,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 35,
        "light": 80,
        "veh": 70,
        "titan": 25,
        "struct": 20,
        "cmd": 25
       },
       "cost": 80,
       "power": 0,
       "time": 8,
       "icon": "tyranids_icons/i_venom",
       "requires": []
      },
      {
       "file": "tyranids_venom_canon_improved_left_hierophant",
       "name": "",
       "range": 50,
       "minRange": 0,
       "reload": 1,
       "accuracy": 1,
       "min": 347,
       "max": 495,
       "pierce": 5,
       "morale": 55,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 35,
        "light": 80,
        "veh": 70,
        "titan": 25,
        "struct": 20,
        "cmd": 25
       },
       "cost": 250,
       "power": 0,
       "time": 8,
       "icon": "tyranids_icons/i_weapon_hierophant_venomcannon_2",
       "requires": []
      }
     ],
     [
      {
       "file": "tyranids_venom_canon_hierophant",
       "name": "Venom Cannon",
       "range": 50,
       "minRange": 0,
       "reload": 1,
       "accuracy": 1,
       "min": 188,
       "max": 242,
       "pierce": 5,
       "morale": 35,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 35,
        "light": 80,
        "veh": 70,
        "titan": 25,
        "struct": 20,
        "cmd": 25
       },
       "cost": 80,
       "power": 0,
       "time": 8,
       "icon": "tyranids_icons/i_venom",
       "requires": []
      },
      {
       "file": "tyranids_venom_canon_improved_hierophant",
       "name": "",
       "range": 50,
       "minRange": 0,
       "reload": 1,
       "accuracy": 1,
       "min": 347,
       "max": 495,
       "pierce": 5,
       "morale": 55,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 35,
        "light": 80,
        "veh": 70,
        "titan": 25,
        "struct": 20,
        "cmd": 25
       },
       "cost": 250,
       "power": 0,
       "time": 8,
       "icon": "tyranids_icons/i_weapon_hierophant_venomcannon_1",
       "requires": []
      }
     ],
     [
      {
       "file": "tyranids_melee_hiero",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 1898,
       "max": 2378,
       "pierce": 14,
       "morale": 300,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 10,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 100,
        "veh": 80,
        "titan": 40,
        "struct": 40,
        "cmd": 30
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "tyranids_melee_hiero_improved_left",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 2372,
       "max": 3091,
       "pierce": 18,
       "morale": 400,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 10,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 100,
        "veh": 80,
        "titan": 40,
        "struct": 40,
        "cmd": 30
       },
       "cost": 500,
       "power": 0,
       "time": 15,
       "icon": "tyranids_icons/i_weapon_hierophant_melee_2",
       "requires": []
      }
     ],
     [
      {
       "file": "tyranids_melee_hiero",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 1898,
       "max": 2378,
       "pierce": 14,
       "morale": 300,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 10,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 100,
        "veh": 80,
        "titan": 40,
        "struct": 40,
        "cmd": 30
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "tyranids_melee_hiero_improved",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 3,
       "accuracy": 1,
       "min": 2372,
       "max": 3091,
       "pierce": 18,
       "morale": 400,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 10,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 100,
        "veh": 80,
        "titan": 40,
        "struct": 40,
        "cmd": 30
       },
       "cost": 500,
       "power": 0,
       "time": 15,
       "icon": "tyranids_icons/i_weapon_hierophant_melee_1",
       "requires": []
      }
     ],
     [
      {
       "file": "tyranids_turret_mine_hierophant",
       "name": "Bio Acid Spore Mine",
       "range": 50,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 245,
       "max": 670,
       "pierce": 0,
       "morale": 30,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 7,
       "vs": {
        "inf": 10,
        "hinf": 10,
        "light": 150,
        "veh": 75,
        "titan": 30,
        "struct": 20,
        "cmd": 50
       },
       "cost": 50,
       "power": 0,
       "time": 1.600000023841858,
       "icon": "tyranids_icons/i_spore_acid",
       "requires": []
      }
     ],
     [
      {
       "file": "tyranids_turret_mine_hierophant",
       "name": "Bio Acid Spore Mine",
       "range": 50,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 245,
       "max": 670,
       "pierce": 0,
       "morale": 30,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 7,
       "vs": {
        "inf": 10,
        "hinf": 10,
        "light": 150,
        "veh": 75,
        "titan": 30,
        "struct": 20,
        "cmd": 50
       },
       "cost": 50,
       "power": 0,
       "time": 1.600000023841858,
       "icon": "tyranids_icons/i_spore_acid",
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
       "file": "tyranids_turret_mine_launcher_improved_hierophant",
       "name": "",
       "range": 50,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 0.800000011920929,
       "min": 245,
       "max": 470,
       "pierce": 0,
       "morale": 30,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 7,
       "vs": {
        "inf": 10,
        "hinf": 10,
        "light": 150,
        "veh": 75,
        "titan": 30,
        "struct": 20,
        "cmd": 50
       },
       "cost": 1000,
       "power": 0,
       "time": 20,
       "icon": "tyranids_icons/i_weapon_hierophant_back",
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
       "file": "tyranids_bioplasma_hierophant",
       "name": "",
       "range": 50,
       "minRange": 0,
       "reload": 2,
       "accuracy": 1,
       "min": 845,
       "max": 1003,
       "pierce": 10,
       "morale": 90,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 5,
       "vs": {
        "inf": 15,
        "hinf": 15,
        "light": 90,
        "veh": 90,
        "titan": 25,
        "struct": 25,
        "cmd": 12
       },
       "cost": 300,
       "power": 0,
       "time": 9,
       "icon": "Tyranids_icons/i_weapon_hierophant_head",
       "requires": []
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "tyranids_assimilation_research"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_xeno_hive"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_biotitan_hive"
     ]
    }
   ]
  },
  "hive_tyrant": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "tyranids_hive_tyrant",
    "name": "Hive Tyrant",
    "icon": "Tyranids_icons/i_hivetyrant",
    "model": "races/tyranids/troops/hivetyrant",
    "hp": 1900,
    "armour": 100,
    "armourType": "commander",
    "regen": 41,
    "speed": 12.5,
    "sight": 40,
    "cost": 440,
    "power": 0,
    "time": 50,
    "hardpoints": [
     [
      {
       "file": "tyranids_melee_hivetyrant",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.8999999761581421,
       "min": 111,
       "max": 132,
       "pierce": 3,
       "morale": 30,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 20,
        "veh": 10,
        "titan": 10,
        "struct": 10,
        "cmd": 36
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "tyranids_devourer_hivetyrant",
       "name": "Devourer",
       "range": 28,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.6499999761581421,
       "min": 65,
       "max": 74,
       "pierce": 0,
       "morale": 10,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 30,
        "light": 20,
        "veh": 15,
        "titan": 11.100000381469727,
        "struct": 10,
        "cmd": 36
       },
       "cost": 25,
       "power": 0,
       "time": 2.4000000953674316,
       "icon": "tyranids_icons/i_devourer",
       "requires": []
      },
      {
       "file": "tyranids_scyth_hivetyrant",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.8999999761581421,
       "min": 200,
       "max": 300,
       "pierce": 6,
       "morale": 60,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 55,
        "titan": 35,
        "struct": 35,
        "cmd": 42
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
       "file": "tyranids_melee_hivetyrant",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.8999999761581421,
       "min": 111,
       "max": 132,
       "pierce": 3,
       "morale": 30,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 20,
        "veh": 10,
        "titan": 10,
        "struct": 10,
        "cmd": 36
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "tyranids_scyth_hivetyrant",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.8999999761581421,
       "min": 200,
       "max": 300,
       "pierce": 6,
       "morale": 60,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 55,
        "titan": 35,
        "struct": 35,
        "cmd": 42
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "tyranids_devourer_hivetyrant",
       "name": "Devourer",
       "range": 28,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.6499999761581421,
       "min": 65,
       "max": 74,
       "pierce": 0,
       "morale": 10,
       "setup": 0,
       "moveAcc": 0.5,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 30,
        "light": 20,
        "veh": 15,
        "titan": 11.100000381469727,
        "struct": 10,
        "cmd": 36
       },
       "cost": 25,
       "power": 0,
       "time": 2.4000000953674316,
       "icon": "tyranids_icons/i_devourer",
       "requires": []
      },
      {
       "file": "tyranids_barbed_strangler_hivetyrant",
       "name": "Barbed Strangler",
       "range": 40,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.75,
       "min": 499,
       "max": 622,
       "pierce": 0,
       "morale": 150,
       "setup": 0,
       "moveAcc": 0.3499999940395355,
       "melee": false,
       "aoe": 3,
       "vs": {
        "inf": 100,
        "hinf": 50,
        "light": 25,
        "veh": 10,
        "titan": 5.5,
        "struct": 9,
        "cmd": 40
       },
       "cost": 30,
       "power": 0,
       "time": 15,
       "icon": "Tyranids_icons/i_strangler",
       "requires": []
      },
      {
       "file": "tyranids_venom_canon_hivetyrant",
       "name": "Venom Cannon",
       "range": 40,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.75,
       "min": 158,
       "max": 228,
       "pierce": 5,
       "morale": 30,
       "setup": 0,
       "moveAcc": 0.3499999940395355,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 30,
        "light": 100,
        "veh": 90,
        "titan": 22,
        "struct": 20,
        "cmd": 12
       },
       "cost": 80,
       "power": 0,
       "time": 8,
       "icon": "tyranids_icons/i_venom",
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
    ]
   },
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    }
   ]
  },
  "hormagaunt": {
   "min": 6,
   "max": 12,
   "reinforce": 20,
   "ups": 0,
   "cap": 2,
   "support": 0,
   "unit": {
    "id": "tyranids_hormagaunt",
    "name": "Hormagaunt",
    "icon": "Tyranids_icons/i_hormagaunt",
    "model": "races/tyranids/troops/hormagaunt",
    "hp": 255,
    "armour": 100,
    "armourType": "infantry_med",
    "regen": 1,
    "speed": 18,
    "sight": 25,
    "cost": 25,
    "power": 0,
    "time": 2,
    "hardpoints": [
     [
      {
       "file": "tyranids_melee_hormagaunt",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0.6000000238418579,
       "accuracy": 0.800000011920929,
       "min": 11.800000190734863,
       "max": 15.449999809265137,
       "pierce": 0,
       "morale": 4,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 45,
        "light": 18,
        "veh": 1,
        "titan": 10,
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
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_gaunt_hive"
     ]
    }
   ]
  },
  "hormagaunt_max": {
   "min": 6,
   "max": 15,
   "reinforce": 15,
   "ups": 0,
   "cap": 2,
   "support": 0,
   "unit": {
    "id": "tyranids_hormagaunt_max",
    "name": "Hormagaunt",
    "icon": "Tyranids_icons/i_hormagaunt",
    "model": "races/tyranids/troops/hormagaunt",
    "hp": 275,
    "armour": 100,
    "armourType": "infantry_med",
    "regen": 1,
    "speed": 18,
    "sight": 25,
    "cost": 0,
    "power": 15,
    "time": 2,
    "hardpoints": []
   },
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_gaunt_hive"
     ]
    }
   ]
  },
  "lictor": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 1,
   "support": 0,
   "unit": {
    "id": "tyranids_lictor",
    "name": "Lictor",
    "icon": "Tyranids_icons/i_lictor",
    "model": "races/tyranids/troops/lictor",
    "hp": 500,
    "armour": 100,
    "armourType": "infantry_high",
    "regen": 5,
    "speed": 24,
    "sight": 55,
    "cost": 150,
    "power": 0,
    "time": 25,
    "hardpoints": [
     [
      {
       "file": "tyranids_melee_lictor",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.8999999761581421,
       "min": 79,
       "max": 105,
       "pierce": 6,
       "morale": 30,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 60,
        "light": 1,
        "veh": 0,
        "titan": 20,
        "struct": 6,
        "cmd": 78
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
       "file": "tyranids_melee_lictor",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.8999999761581421,
       "min": 79,
       "max": 105,
       "pierce": 6,
       "morale": 30,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 60,
        "light": 1,
        "veh": 0,
        "titan": 20,
        "struct": 6,
        "cmd": 78
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
   "req": []
  },
  "lictor_alpha": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "tyranids_lictor_alpha",
    "name": "Lictor Alpha",
    "icon": "Tyranids_icons/i_lictor_alpha",
    "model": "races/tyranids/troops/lictor_alpha",
    "hp": 750,
    "armour": 100,
    "armourType": "commander",
    "regen": 25,
    "speed": 32,
    "sight": 55,
    "cost": 250,
    "power": 0,
    "time": 55,
    "hardpoints": [
     [
      {
       "file": "tyranids_melee_lictor_alpha",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0.6000000238418579,
       "accuracy": 1,
       "min": 80,
       "max": 100,
       "pierce": 6,
       "morale": 30,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 55,
        "light": 20,
        "veh": 5,
        "titan": 5.5,
        "struct": 4,
        "cmd": 60
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
       "file": "tyranids_melee_lictor_alpha",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0.6000000238418579,
       "accuracy": 1,
       "min": 80,
       "max": 100,
       "pierce": 6,
       "morale": 30,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 55,
        "light": 20,
        "veh": 5,
        "titan": 5.5,
        "struct": 4,
        "cmd": 60
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
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_1"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    }
   ]
  },
  "ravener": {
   "min": 4,
   "max": 9,
   "reinforce": 50,
   "ups": 2,
   "cap": 2,
   "support": 0,
   "unit": {
    "id": "tyranids_ravener",
    "name": "Ravener",
    "icon": "tyranids_icons/i_ravener",
    "model": "races/tyranids/troops/ravener",
    "hp": 420,
    "armour": 100,
    "armourType": "infantry_high",
    "regen": 2,
    "speed": 24,
    "sight": 30,
    "cost": 45,
    "power": 0,
    "time": 7,
    "hardpoints": [
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
       "file": "tyranids_deathspitter_ravener",
       "name": "Barbed Strangler",
       "range": 35,
       "minRange": 0,
       "reload": 4,
       "accuracy": 0.550000011920929,
       "min": 60,
       "max": 100,
       "pierce": 2,
       "morale": 5,
       "setup": 0,
       "moveAcc": 0.4000000059604645,
       "melee": false,
       "aoe": 6,
       "vs": {
        "inf": 63.79999923706055,
        "hinf": 40.20000076293945,
        "light": 10,
        "veh": 0,
        "titan": 15,
        "struct": 0,
        "cmd": 18.600000381469727
       },
       "cost": 35,
       "power": 0,
       "time": 2,
       "icon": "tyranids_icons/i_spitter",
       "requires": [
        "tyranids_hq_addon_1",
        "tyranids_biomorph_hive"
       ]
      },
      {
       "file": "tyranids_bioplasma_ravener",
       "name": "",
       "range": 30,
       "minRange": 0,
       "reload": 4,
       "accuracy": 1,
       "min": 485,
       "max": 552,
       "pierce": 10,
       "morale": 60,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 5,
       "vs": {
        "inf": 15,
        "hinf": 15,
        "light": 90,
        "veh": 90,
        "titan": 25,
        "struct": 25,
        "cmd": 12
       },
       "cost": 85,
       "power": 0,
       "time": 4,
       "icon": "Tyranids_icons/i_plasma",
       "requires": [
        "tyranids_arrival3_research",
        "tyranids_biomorph_hive"
       ]
      }
     ],
     [
      {
       "file": "tyranids_melee_ravener",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0.6000000238418579,
       "accuracy": 0.800000011920929,
       "min": 15,
       "max": 19,
       "pierce": 0,
       "morale": 4,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 67.9010009765625,
        "hinf": 53.900001525878906,
        "light": 30,
        "veh": 5,
        "titan": 10,
        "struct": 2,
        "cmd": 28.799999237060547
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "tyranids_melee_ravener_rend",
       "name": "Rending Claws",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 67,
       "max": 89,
       "pierce": 0,
       "morale": 19,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 55,
        "titan": 30,
        "struct": 15,
        "cmd": 20
       },
       "cost": 20,
       "power": 0,
       "time": 2,
       "icon": "tyranids_icons/i_claw",
       "requires": [
        "tyranids_hq_addon_1"
       ]
      }
     ],
     [
      {
       "file": "tyranids_melee_ravener",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0.6000000238418579,
       "accuracy": 0.800000011920929,
       "min": 15,
       "max": 19,
       "pierce": 0,
       "morale": 4,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 67.9010009765625,
        "hinf": 53.900001525878906,
        "light": 30,
        "veh": 5,
        "titan": 10,
        "struct": 2,
        "cmd": 28.799999237060547
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
      "tyranids_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_warrior_hive"
     ]
    }
   ]
  },
  "ripperswarm": {
   "min": 1,
   "max": 5,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "tyranids_ripperswarm",
    "name": "Ripper Swarm",
    "icon": "Tyranids_icons/i_ripper",
    "model": "races/tyranids/troops/ripper",
    "hp": 100,
    "armour": 100,
    "armourType": "infantry_low",
    "regen": 2,
    "speed": 16,
    "sight": 20,
    "cost": 50,
    "power": 0,
    "time": 10,
    "hardpoints": [
     [
      {
       "file": "tyranids_melee_ripperswarm",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 0.5,
       "min": 2,
       "max": 6,
       "pierce": 0,
       "morale": 6,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50.720001220703125,
        "hinf": 45.900001525878906,
        "light": 25,
        "veh": 25,
        "titan": 30,
        "struct": 50,
        "cmd": 18
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
      "tyranids_hq"
     ]
    }
   ]
  },
  "ripperswarm_global": {
   "min": 1,
   "max": 6,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "tyranids_ripperswarm_global",
    "name": "Ripper Swarm",
    "icon": "Tyranids_icons/i_ripper",
    "model": "races/tyranids/troops/ripper",
    "hp": 100,
    "armour": 100,
    "armourType": "infantry_low",
    "regen": 2,
    "speed": 16,
    "sight": 20,
    "cost": 0,
    "power": 30,
    "time": 18,
    "hardpoints": [
     [
      {
       "file": "tyranids_melee_ripperswarm",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 0.5,
       "accuracy": 0.5,
       "min": 2,
       "max": 6,
       "pierce": 0,
       "morale": 6,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50.720001220703125,
        "hinf": 45.900001525878906,
        "light": 25,
        "veh": 25,
        "titan": 30,
        "struct": 50,
        "cmd": 18
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
      "tyranids_biomorph_hive"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    }
   ]
  },
  "spinegaunt": {
   "min": 4,
   "max": 10,
   "reinforce": 2,
   "ups": 0,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "tyranids_spinegaunt",
    "name": "Spinegaunt",
    "icon": "tyranids_icons/i_spinegant",
    "model": "races/tyranids/troops/spinegaunt",
    "hp": 80,
    "armour": 90,
    "armourType": "infantry_med",
    "regen": 1,
    "speed": 19,
    "sight": 25,
    "cost": 0,
    "power": 0,
    "time": 4,
    "hardpoints": [
     [
      {
       "file": "tyranids_spinefist_gaunt",
       "name": "Spinefist",
       "range": 25,
       "minRange": 0,
       "reload": 0.800000011920929,
       "accuracy": 0.75,
       "min": 9,
       "max": 12,
       "pierce": 2,
       "morale": 3,
       "setup": 0,
       "moveAcc": 0.6000000238418579,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 43.060001373291016,
        "hinf": 13.899999618530273,
        "light": 0,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 12
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "Tyranids_icons/i_fist",
       "requires": []
      }
     ],
     [
      {
       "file": "tyranids_melee_termagant",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.5,
       "min": 7,
       "max": 13,
       "pierce": 0,
       "morale": 7,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
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
      }
     ]
    ]
   },
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_gaunt_hive"
     ]
    }
   ]
  },
  "spinegaunt_max": {
   "min": 4,
   "max": 10,
   "reinforce": 2,
   "ups": 0,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "tyranids_spinegaunt_max",
    "name": "Spinegaunt",
    "icon": "tyranids_icons/i_spinegant",
    "model": "races/tyranids/troops/spinegaunt",
    "hp": 100,
    "armour": 90,
    "armourType": "infantry_med",
    "regen": 1,
    "speed": 19,
    "sight": 25,
    "cost": 0,
    "power": 5,
    "time": 1,
    "hardpoints": [
     [
      {
       "file": "tyranids_spinefist_gaunt",
       "name": "Spinefist",
       "range": 25,
       "minRange": 0,
       "reload": 0.800000011920929,
       "accuracy": 0.75,
       "min": 9,
       "max": 12,
       "pierce": 2,
       "morale": 3,
       "setup": 0,
       "moveAcc": 0.6000000238418579,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 43.060001373291016,
        "hinf": 13.899999618530273,
        "light": 0,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 12
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "Tyranids_icons/i_fist",
       "requires": []
      }
     ],
     [
      {
       "file": "tyranids_melee_termagant",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.5,
       "min": 7,
       "max": 13,
       "pierce": 0,
       "morale": 7,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
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
      }
     ]
    ]
   },
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_gaunt_hive"
     ]
    }
   ]
  },
  "spore_cluster": {
   "min": 6,
   "max": 12,
   "reinforce": 25,
   "ups": 0,
   "cap": 2,
   "support": 0,
   "unit": {
    "id": "tyranids_spore_cluster",
    "name": "Spore Cluster",
    "icon": "tyranids_icons/i_spore_cluster",
    "model": "races/tyranids/troops/sporemines",
    "hp": 113,
    "armour": 100,
    "armourType": "infantry_low",
    "regen": 1,
    "speed": 22,
    "sight": 15,
    "cost": 25,
    "power": 0,
    "time": 3,
    "hardpoints": [
     [
      {
       "file": "tyranids_spore_cluster",
       "name": "Deathspitter",
       "range": 2,
       "minRange": 0,
       "reload": 0.20000000298023224,
       "accuracy": 1,
       "min": 0,
       "max": 0,
       "pierce": 0,
       "morale": 0,
       "setup": 0,
       "moveAcc": 0,
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
       "icon": "tyranids_icons/i_spitter",
       "requires": []
      }
     ],
     [
      {
       "file": "tyranids_melee_termagant",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.5,
       "min": 7,
       "max": 13,
       "pierce": 0,
       "morale": 7,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
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
      }
     ]
    ]
   },
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_1"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_gaunt_hive"
     ]
    }
   ]
  },
  "spore_cluster_max": {
   "min": 6,
   "max": 6,
   "reinforce": 25,
   "ups": 0,
   "cap": 2,
   "support": 0,
   "unit": {
    "id": "tyranids_spore_cluster_max",
    "name": "Spore Cluster",
    "icon": "tyranids_icons/i_spore_cluster",
    "model": "races/tyranids/troops/sporemines",
    "hp": 113,
    "armour": 100,
    "armourType": "infantry_low",
    "regen": 1,
    "speed": 22,
    "sight": 15,
    "cost": 0,
    "power": 25,
    "time": 6,
    "hardpoints": [
     [
      {
       "file": "tyranids_spore_cluster",
       "name": "Deathspitter",
       "range": 2,
       "minRange": 0,
       "reload": 0.20000000298023224,
       "accuracy": 1,
       "min": 0,
       "max": 0,
       "pierce": 0,
       "morale": 0,
       "setup": 0,
       "moveAcc": 0,
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
       "icon": "tyranids_icons/i_spitter",
       "requires": []
      }
     ],
     [
      {
       "file": "tyranids_melee_termagant",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.5,
       "min": 7,
       "max": 13,
       "pierce": 0,
       "morale": 7,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
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
      }
     ]
    ]
   },
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_xeno_hive"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_gaunt_hive"
     ]
    }
   ]
  },
  "spore_cluster_spam": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "tyranids_spore_cluster_spam",
    "name": "",
    "icon": "tyranids_icons/i_spore_cluster",
    "model": "races/tyranids/troops/sporemines",
    "hp": 113,
    "armour": 100,
    "armourType": "infantry_low",
    "regen": 1,
    "speed": 22,
    "sight": 15,
    "cost": 0,
    "power": 0,
    "time": 50,
    "hardpoints": [
     [
      {
       "file": "tyranids_spore_cluster",
       "name": "Deathspitter",
       "range": 2,
       "minRange": 0,
       "reload": 0.20000000298023224,
       "accuracy": 1,
       "min": 0,
       "max": 0,
       "pierce": 0,
       "morale": 0,
       "setup": 0,
       "moveAcc": 0,
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
       "icon": "tyranids_icons/i_spitter",
       "requires": []
      }
     ],
     [
      {
       "file": "tyranids_melee_termagant",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.5,
       "min": 7,
       "max": 13,
       "pierce": 0,
       "morale": 7,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
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
      }
     ]
    ]
   },
   "req": [
    {
     "t": "local_addon",
     "ids": [
      "tyranids_turret_production_addon"
     ]
    }
   ]
  },
  "swarmlord": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "tyranids_swarmlord",
    "name": "Swarmlord",
    "icon": "Tyranids_icons/i_swarmlord",
    "model": "races/tyranids/troops/swarmlord",
    "hp": 21000,
    "armour": 106,
    "armourType": "commander",
    "regen": 160,
    "speed": 20,
    "sight": 40,
    "cost": 8000,
    "power": 4000,
    "time": 180,
    "hardpoints": [
     [
      {
       "file": "tyranids_melee_swarmlord",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.75,
       "min": 410,
       "max": 630,
       "pierce": 6,
       "morale": 80,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 55,
        "titan": 50,
        "struct": 75,
        "cmd": 50
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
       "file": "tyranids_melee_swarmlord",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.75,
       "min": 410,
       "max": 630,
       "pierce": 6,
       "morale": 80,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 55,
        "titan": 50,
        "struct": 75,
        "cmd": 50
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
       "file": "tyranids_melee_swarmlord",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.75,
       "min": 410,
       "max": 630,
       "pierce": 6,
       "morale": 80,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 55,
        "titan": 50,
        "struct": 75,
        "cmd": 50
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
       "file": "tyranids_melee_swarmlord",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.75,
       "min": 410,
       "max": 630,
       "pierce": 6,
       "morale": 80,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 55,
        "titan": 50,
        "struct": 75,
        "cmd": 50
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
      "tyranids_apocalypse_research"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    }
   ]
  },
  "termagant": {
   "min": 6,
   "max": 12,
   "reinforce": 25,
   "ups": 0,
   "cap": 2,
   "support": 0,
   "unit": {
    "id": "tyranids_termagant",
    "name": "Termagant",
    "icon": "Tyranids_icons/i_termagaunt",
    "model": "races/tyranids/troops/termagaunt",
    "hp": 190,
    "armour": 100,
    "armourType": "infantry_med",
    "regen": 1,
    "speed": 17,
    "sight": 25,
    "cost": 25,
    "power": 0,
    "time": 2,
    "hardpoints": [
     [
      {
       "file": "tyranids_fleshborer_gaunt",
       "name": "Fleshborer",
       "range": 25,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.6000000238418579,
       "min": 5.420000076293945,
       "max": 7.78000020980835,
       "pierce": 2,
       "morale": 1,
       "setup": 0,
       "moveAcc": 0.3499999940395355,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 55,
        "light": 15,
        "veh": 0,
        "titan": 5.5,
        "struct": 0,
        "cmd": 18
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "Tyranids_icons/i_borer",
       "requires": []
      },
      {
       "file": "tyranids_devourer_gaunt",
       "name": "Devourer",
       "range": 28,
       "minRange": 0,
       "reload": 0.30000001192092896,
       "accuracy": 0.6200000047683716,
       "min": 10.970000267028809,
       "max": 16.399999618530273,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0.3499999940395355,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 45,
        "light": 20,
        "veh": 15,
        "titan": 5.5,
        "struct": 7,
        "cmd": 18
       },
       "cost": 10,
       "power": 0,
       "time": 1,
       "icon": "tyranids_icons/i_devourer",
       "requires": [
        "tyranids_gaunt_devourer_research"
       ]
      }
     ],
     [
      {
       "file": "tyranids_melee_termagant",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.5,
       "min": 7,
       "max": 13,
       "pierce": 0,
       "morale": 7,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
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
      }
     ]
    ]
   },
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_gaunt_hive"
     ]
    }
   ]
  },
  "termagant_max": {
   "min": 6,
   "max": 15,
   "reinforce": 25,
   "ups": 0,
   "cap": 2,
   "support": 0,
   "unit": {
    "id": "tyranids_termagant_max",
    "name": "Termagant",
    "icon": "Tyranids_icons/i_termagaunt",
    "model": "races/tyranids/troops/termagaunt",
    "hp": 200,
    "armour": 100,
    "armourType": "infantry_med",
    "regen": 1,
    "speed": 17,
    "sight": 25,
    "cost": 0,
    "power": 15,
    "time": 2,
    "hardpoints": [
     [
      {
       "file": "tyranids_fleshborer_gaunt",
       "name": "Fleshborer",
       "range": 25,
       "minRange": 0,
       "reload": 0.4000000059604645,
       "accuracy": 0.6000000238418579,
       "min": 5.420000076293945,
       "max": 7.78000020980835,
       "pierce": 2,
       "morale": 1,
       "setup": 0,
       "moveAcc": 0.3499999940395355,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 55,
        "light": 15,
        "veh": 0,
        "titan": 5.5,
        "struct": 0,
        "cmd": 18
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "Tyranids_icons/i_borer",
       "requires": []
      },
      {
       "file": "tyranids_devourer_gaunt",
       "name": "Devourer",
       "range": 28,
       "minRange": 0,
       "reload": 0.30000001192092896,
       "accuracy": 0.6200000047683716,
       "min": 10.970000267028809,
       "max": 16.399999618530273,
       "pierce": 0,
       "morale": 2,
       "setup": 0,
       "moveAcc": 0.3499999940395355,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 45,
        "light": 20,
        "veh": 15,
        "titan": 5.5,
        "struct": 7,
        "cmd": 18
       },
       "cost": 10,
       "power": 0,
       "time": 1,
       "icon": "tyranids_icons/i_devourer",
       "requires": [
        "tyranids_gaunt_devourer_research"
       ]
      }
     ],
     [
      {
       "file": "tyranids_melee_termagant",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.5,
       "min": 7,
       "max": 13,
       "pierce": 0,
       "morale": 7,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
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
      }
     ]
    ]
   },
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_gaunt_hive"
     ]
    }
   ]
  },
  "trygon": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 1,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "tyranids_trygon",
    "name": "Trygon",
    "icon": "tyranids_icons/i_trygon",
    "model": "races/tyranids/troops/trygon",
    "hp": 13700,
    "armour": 103,
    "armourType": "monster_high",
    "regen": 25,
    "speed": 36,
    "sight": 40,
    "cost": 1000,
    "power": 0,
    "time": 90,
    "hardpoints": [
     [
      {
       "file": "tyranids_melee_trygon",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 190,
       "max": 230,
       "pierce": 10,
       "morale": 40,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 70,
        "veh": 50,
        "titan": 35,
        "struct": 19,
        "cmd": 12
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "tyranids_melee_trygon_crushclaw",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 226,
       "max": 290,
       "pierce": 10,
       "morale": 60,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 70,
        "veh": 50,
        "titan": 35,
        "struct": 25,
        "cmd": 20
       },
       "cost": 100,
       "power": 0,
       "time": 6,
       "icon": "tyranids_icons/i_claw",
       "requires": [
        "tyranids_assimilation_research"
       ]
      }
     ],
     [
      {
       "file": "tyranids_melee_trygon",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 190,
       "max": 230,
       "pierce": 10,
       "morale": 40,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 70,
        "veh": 50,
        "titan": 35,
        "struct": 19,
        "cmd": 12
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "tyranids_melee_trygon_crushclaw",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 226,
       "max": 290,
       "pierce": 10,
       "morale": 60,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 70,
        "veh": 50,
        "titan": 35,
        "struct": 25,
        "cmd": 20
       },
       "cost": 100,
       "power": 0,
       "time": 6,
       "icon": "tyranids_icons/i_claw",
       "requires": [
        "tyranids_assimilation_research"
       ]
      }
     ],
     [
      {
       "file": "tyranids_melee_trygon",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 190,
       "max": 230,
       "pierce": 10,
       "morale": 40,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 70,
        "veh": 50,
        "titan": 35,
        "struct": 19,
        "cmd": 12
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "tyranids_melee_trygon_crushclaw",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 226,
       "max": 290,
       "pierce": 10,
       "morale": 60,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 70,
        "veh": 50,
        "titan": 35,
        "struct": 25,
        "cmd": 20
       },
       "cost": 100,
       "power": 0,
       "time": 6,
       "icon": "tyranids_icons/i_claw",
       "requires": [
        "tyranids_assimilation_research"
       ]
      }
     ],
     [
      {
       "file": "tyranids_melee_trygon",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 190,
       "max": 230,
       "pierce": 10,
       "morale": 40,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 70,
        "veh": 50,
        "titan": 35,
        "struct": 19,
        "cmd": 12
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "tyranids_melee_trygon_crushclaw",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.6499999761581421,
       "min": 226,
       "max": 290,
       "pierce": 10,
       "morale": 60,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 70,
        "veh": 50,
        "titan": 35,
        "struct": 25,
        "cmd": 20
       },
       "cost": 100,
       "power": 0,
       "time": 6,
       "icon": "tyranids_icons/i_claw",
       "requires": [
        "tyranids_assimilation_research"
       ]
      }
     ]
    ]
   },
   "req": [
    {
     "t": "research",
     "ids": [
      "tyranids_arrival3_research"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_relic_hive"
     ]
    }
   ]
  },
  "tyrant_guard": {
   "min": 2,
   "max": 2,
   "reinforce": 220,
   "ups": 2,
   "cap": 0,
   "support": 2,
   "unit": {
    "id": "tyranids_tyrant_guard",
    "name": "Tyrant Guard",
    "icon": "tyranids_icons/i_tyrant_guard",
    "model": "races/tyranids/troops/tyrant_guard",
    "hp": 2500,
    "armour": 110,
    "armourType": "monster_med",
    "regen": 12,
    "speed": 16,
    "sight": 30,
    "cost": 220,
    "power": 0,
    "time": 20,
    "hardpoints": [
     [
      {
       "file": "tyranids_melee_tyrant_guard",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.75,
       "min": 115,
       "max": 150,
       "pierce": 0,
       "morale": 50,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 40,
        "light": 60,
        "veh": 50,
        "titan": 20,
        "struct": 20,
        "cmd": 10
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "tyranids_melee_tyrant_guard_crushclaw",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.8500000238418579,
       "min": 140,
       "max": 200,
       "pierce": 8,
       "morale": 50,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 47,
        "light": 80,
        "veh": 60,
        "titan": 20,
        "struct": 20,
        "cmd": 14.399999618530273
       },
       "cost": 100,
       "power": 0,
       "time": 2,
       "icon": "tyranids_icons/i_claw",
       "requires": [
        "tyranids_hq_addon_2"
       ]
      }
     ]
    ]
   },
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_carnifex_hive"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    }
   ]
  },
  "warrior": {
   "min": 4,
   "max": 8,
   "reinforce": 80,
   "ups": 3,
   "cap": 3,
   "support": 0,
   "unit": {
    "id": "tyranids_warrior",
    "name": "Warrior",
    "icon": "tyranids_icons/i_warrior",
    "model": "races/tyranids/troops/warrior",
    "hp": 1100,
    "armour": 101,
    "armourType": "infantry_high",
    "regen": 2,
    "speed": 16,
    "sight": 30,
    "cost": 70,
    "power": 0,
    "time": 8,
    "hardpoints": [
     [
      {
       "file": "tyranids_melee_warrior",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 30,
       "max": 40,
       "pierce": 0,
       "morale": 16,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 67.9010009765625,
        "hinf": 53.900001525878906,
        "light": 50,
        "veh": 30,
        "titan": 10,
        "struct": 10,
        "cmd": 28.799999237060547
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "tyranids_melee_warrior_rend",
       "name": "Rending Claws",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 78,
       "max": 90,
       "pierce": 0,
       "morale": 25,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 55,
        "titan": 30,
        "struct": 15,
        "cmd": 20
       },
       "cost": 25,
       "power": 0,
       "time": 2,
       "icon": "tyranids_icons/i_claw",
       "requires": []
      },
      {
       "file": "tyranids_devourer_warrior",
       "name": "Devourer",
       "range": 28,
       "minRange": 0,
       "reload": 0.20000000298023224,
       "accuracy": 0.75,
       "min": 19,
       "max": 23,
       "pierce": 0,
       "morale": 5,
       "setup": 0,
       "moveAcc": 0.44999998807907104,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 30,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 18.600000381469727
       },
       "cost": 50,
       "power": 0,
       "time": 1.399999976158142,
       "icon": "tyranids_icons/i_devourer",
       "requires": [
        "tyranids_hq_addon_1",
        "tyranids_biomorph_hive"
       ]
      },
      {
       "file": "tyranids_deathspitter_warrior",
       "name": "Deathspitter",
       "range": 36,
       "minRange": 0,
       "reload": 5,
       "accuracy": 0.550000011920929,
       "min": 140,
       "max": 220,
       "pierce": 2,
       "morale": 30,
       "setup": 0,
       "moveAcc": 0.4000000059604645,
       "melee": false,
       "aoe": 6,
       "vs": {
        "inf": 30,
        "hinf": 25,
        "light": 10,
        "veh": 0,
        "titan": 5.5,
        "struct": 0,
        "cmd": 18.600000381469727
       },
       "cost": 45,
       "power": 0,
       "time": 2,
       "icon": "tyranids_icons/i_spitter",
       "requires": [
        "tyranids_hq_addon_1",
        "tyranids_biomorph_hive"
       ]
      },
      {
       "file": "tyranids_venom_canon_warrior",
       "name": "Venom Cannon",
       "range": 36,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.75,
       "min": 124,
       "max": 210,
       "pierce": 5,
       "morale": 25,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 20,
        "light": 100,
        "veh": 48,
        "titan": 22,
        "struct": 14,
        "cmd": 12
       },
       "cost": 70,
       "power": 0,
       "time": 4,
       "icon": "tyranids_icons/i_venom",
       "requires": [
        "tyranids_hq_addon_1",
        "tyranids_biomorph_hive"
       ]
      }
     ],
     [
      {
       "file": "tyranids_melee_warrior",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 30,
       "max": 40,
       "pierce": 0,
       "morale": 16,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 67.9010009765625,
        "hinf": 53.900001525878906,
        "light": 50,
        "veh": 30,
        "titan": 10,
        "struct": 10,
        "cmd": 28.799999237060547
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
       "file": "chaos_marine_dummy_weapon",
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
       "file": "tyranids_bioplasma_warrior",
       "name": "Biomorph - Warrior Bio-Plasma",
       "range": 30,
       "minRange": 0,
       "reload": 4,
       "accuracy": 1,
       "min": 557,
       "max": 634,
       "pierce": 10,
       "morale": 60,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 5,
       "vs": {
        "inf": 15,
        "hinf": 15,
        "light": 90,
        "veh": 90,
        "titan": 25,
        "struct": 25,
        "cmd": 12
       },
       "cost": 85,
       "power": 0,
       "time": 4,
       "icon": "Tyranids_icons/i_plasma",
       "requires": [
        "tyranids_arrival3_research",
        "tyranids_biomorph_hive"
       ]
      }
     ]
    ]
   },
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_1"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_warrior_hive"
     ]
    }
   ]
  },
  "warrior_max": {
   "min": 4,
   "max": 8,
   "reinforce": 80,
   "ups": 3,
   "cap": 3,
   "support": 0,
   "unit": {
    "id": "tyranids_warrior_max",
    "name": "Warrior",
    "icon": "tyranids_icons/i_warrior",
    "model": "races/tyranids/troops/warrior",
    "hp": 1100,
    "armour": 101,
    "armourType": "infantry_high",
    "regen": 2,
    "speed": 16,
    "sight": 30,
    "cost": 0,
    "power": 60,
    "time": 8,
    "hardpoints": [
     [
      {
       "file": "tyranids_melee_warrior",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 30,
       "max": 40,
       "pierce": 0,
       "morale": 16,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 67.9010009765625,
        "hinf": 53.900001525878906,
        "light": 50,
        "veh": 30,
        "titan": 10,
        "struct": 10,
        "cmd": 28.799999237060547
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "space_marine_icons/upgrade",
       "requires": []
      },
      {
       "file": "tyranids_melee_warrior_rend",
       "name": "Rending Claws",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 78,
       "max": 90,
       "pierce": 0,
       "morale": 25,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 55,
        "titan": 30,
        "struct": 15,
        "cmd": 20
       },
       "cost": 25,
       "power": 0,
       "time": 2,
       "icon": "tyranids_icons/i_claw",
       "requires": []
      },
      {
       "file": "tyranids_devourer_warrior",
       "name": "Devourer",
       "range": 28,
       "minRange": 0,
       "reload": 0.20000000298023224,
       "accuracy": 0.75,
       "min": 19,
       "max": 23,
       "pierce": 0,
       "morale": 5,
       "setup": 0,
       "moveAcc": 0.44999998807907104,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 30,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0,
        "cmd": 18.600000381469727
       },
       "cost": 50,
       "power": 0,
       "time": 1.399999976158142,
       "icon": "tyranids_icons/i_devourer",
       "requires": [
        "tyranids_hq_addon_1",
        "tyranids_biomorph_hive"
       ]
      },
      {
       "file": "tyranids_deathspitter_warrior",
       "name": "Deathspitter",
       "range": 36,
       "minRange": 0,
       "reload": 5,
       "accuracy": 0.550000011920929,
       "min": 140,
       "max": 220,
       "pierce": 2,
       "morale": 30,
       "setup": 0,
       "moveAcc": 0.4000000059604645,
       "melee": false,
       "aoe": 6,
       "vs": {
        "inf": 30,
        "hinf": 25,
        "light": 10,
        "veh": 0,
        "titan": 5.5,
        "struct": 0,
        "cmd": 18.600000381469727
       },
       "cost": 45,
       "power": 0,
       "time": 2,
       "icon": "tyranids_icons/i_spitter",
       "requires": [
        "tyranids_hq_addon_1",
        "tyranids_biomorph_hive"
       ]
      },
      {
       "file": "tyranids_venom_canon_warrior",
       "name": "Venom Cannon",
       "range": 36,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.75,
       "min": 124,
       "max": 210,
       "pierce": 5,
       "morale": 25,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 20,
        "light": 100,
        "veh": 48,
        "titan": 22,
        "struct": 14,
        "cmd": 12
       },
       "cost": 70,
       "power": 0,
       "time": 4,
       "icon": "tyranids_icons/i_venom",
       "requires": [
        "tyranids_hq_addon_1",
        "tyranids_biomorph_hive"
       ]
      }
     ],
     [
      {
       "file": "tyranids_melee_warrior",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 30,
       "max": 40,
       "pierce": 0,
       "morale": 16,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 67.9010009765625,
        "hinf": 53.900001525878906,
        "light": 50,
        "veh": 30,
        "titan": 10,
        "struct": 10,
        "cmd": 28.799999237060547
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
       "file": "chaos_marine_dummy_weapon",
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
       "file": "tyranids_bioplasma_warrior",
       "name": "Biomorph - Warrior Bio-Plasma",
       "range": 30,
       "minRange": 0,
       "reload": 4,
       "accuracy": 1,
       "min": 557,
       "max": 634,
       "pierce": 10,
       "morale": 60,
       "setup": 0,
       "moveAcc": 0.6499999761581421,
       "melee": false,
       "aoe": 5,
       "vs": {
        "inf": 15,
        "hinf": 15,
        "light": 90,
        "veh": 90,
        "titan": 25,
        "struct": 25,
        "cmd": 12
       },
       "cost": 85,
       "power": 0,
       "time": 4,
       "icon": "Tyranids_icons/i_plasma",
       "requires": [
        "tyranids_arrival3_research",
        "tyranids_biomorph_hive"
       ]
      }
     ]
    ]
   },
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_1"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_warrior_hive"
     ]
    }
   ]
  },
  "woth": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "cap": 0,
   "support": 0,
   "unit": {
    "id": "tyranids_woth",
    "name": "Hivemind",
    "icon": "tyranids_icons/i_will_of_the_hive",
    "model": "races/tyranids/structures/drop_building",
    "hp": 5,
    "armour": 100,
    "armourType": "hivefleet",
    "regen": -0.20000000298023224,
    "speed": 0,
    "sight": 0,
    "cost": 0,
    "power": 0,
    "time": 1,
    "hardpoints": []
   },
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    }
   ]
  },
  "zoanthropes": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "ups": 0,
   "morale": {
    "max": 600,
    "rate": 2,
    "minTime": 20,
    "minMorale": 100,
    "acc": 0.20000000298023224,
    "speed": 1.2000000476837158
   },
   "cap": 3,
   "support": 0,
   "unit": {
    "id": "tyranids_zoanthropes",
    "name": "Zoanthrope",
    "icon": "Tyranids_icons/i_zoanthrope",
    "model": "races/tyranids/troops/zoanthrope",
    "hp": 5000,
    "armour": 100,
    "armourType": "infantry_heavy_high",
    "regen": 2,
    "speed": 16,
    "sight": 45,
    "cost": 340,
    "power": 0,
    "time": 65,
    "hardpoints": [
     [
      {
       "file": "tyranids_zoanthropes_blast",
       "name": "Warp Blast",
       "range": 65,
       "minRange": 5,
       "reload": 6,
       "accuracy": 1,
       "min": 1350,
       "max": 2000,
       "pierce": 10,
       "morale": 200,
       "setup": 0,
       "moveAcc": 0,
       "melee": false,
       "aoe": 4,
       "vs": {
        "inf": 15,
        "hinf": 15,
        "light": 90,
        "veh": 65,
        "titan": 25,
        "struct": 15,
        "cmd": 12
       },
       "cost": 0,
       "power": 0,
       "time": 0,
       "icon": "tyranids_icons/i_blast",
       "requires": []
      }
     ],
     [
      {
       "file": "tyranids_melee_warrior",
       "name": "",
       "range": 0,
       "minRange": 0,
       "reload": 1,
       "accuracy": 0.800000011920929,
       "min": 30,
       "max": 40,
       "pierce": 0,
       "morale": 16,
       "setup": 0,
       "moveAcc": 0,
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 67.9010009765625,
        "hinf": 53.900001525878906,
        "light": 50,
        "veh": 30,
        "titan": 10,
        "struct": 10,
        "cmd": 28.799999237060547
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
      "tyranids_arrival3_research"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    }
   ]
  }
 },
 "buildings": {
  "adv_magma_vent": {
   "id": "tyranids_adv_magma_vent",
   "name": "Magma Vent",
   "icon": "tyranids_icons/i_magma_vent",
   "model": "races/tyranids/structures/magmavent",
   "hp": 2500,
   "armour": 100,
   "armourType": "building_med",
   "regen": 5,
   "speed": 0,
   "sight": 40,
   "cost": 275,
   "power": 0,
   "time": 60,
   "hardpoints": [],
   "spawns": [],
   "research": [
    "tyranids_power_research_5",
    "tyranids_power_research_3",
    "tyranids_ripper_toxin_sacs_research",
    "tyranids_ripper_leaping_research",
    "tyranids_power_research_2",
    "tyranids_power_research_4",
    "tyranids_building_synapse_aurax2_research",
    "tyranids_power_research",
    "tyranids_building_miasmax2_research"
   ],
   "addons": [
    "tyranids_structure_shield_addon"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_1"
     ]
    }
   ]
  },
  "biomorph_hive": {
   "id": "tyranids_biomorph_hive",
   "name": "Gestation Pod",
   "icon": "tyranids_icons/i_gestation_pod",
   "model": "races/tyranids/structures/stealerhive",
   "hp": 2500,
   "armour": 100,
   "armourType": "building_med",
   "regen": 5,
   "speed": 0,
   "sight": 30,
   "cost": 150,
   "power": 0,
   "time": 60,
   "hardpoints": [],
   "spawns": [
    "tyranids_squad_woth"
   ],
   "research": [
    "tyranids_hormagaunt_adrenal_glands_research",
    "tyranids_lictor_upgrade_research_1",
    "tyranids_genestealer_implant_research",
    "tyranids_lictor_upgrade_research_2",
    "tyranids_genestealer_upgrade_research_2",
    "tyranids_genestealer_scyth_research",
    "tyranids_warrior_leaping_research",
    "tyranids_warrior_adrenal_glands_research",
    "tyranids_warrior_weapons_research",
    "tyranids_lictor_upgrade_research_3",
    "tyranids_genestealer_upgrade_research_1",
    "tyranids_genestealer_tendrils_research",
    "tyranids_genestealer_senses_research",
    "tyranids_genestealer_upgrade_research_3",
    "tyranids_gaunt_upgrade_research_2",
    "tyranids_genestealer_bl_infiltration_research",
    "tyranids_gaunt_upgrade_research_3",
    "tyranids_gaunt_upgrade_research_1",
    "tyranids_gaunt_devourer_research"
   ],
   "addons": [],
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    }
   ]
  },
  "biotitan_hive": {
   "id": "tyranids_biotitan_hive",
   "name": "Assimilation Chamber",
   "icon": "tyranids_icons/i_titan_chamber",
   "model": "races/race_tyranid/structures/tyranid_base",
   "hp": 10000,
   "armour": 100,
   "armourType": "building_high",
   "regen": 8,
   "speed": 0,
   "sight": 40,
   "cost": 1200,
   "power": 0,
   "time": 200,
   "hardpoints": [],
   "spawns": [
    "tyranids_squad_hierophant"
   ],
   "research": [
    "tyranids_titan_armor2_research",
    "tyranids_titan_armor_research",
    "tyranids_titan_melee_research",
    "tyranids_titan_bioplasma_research",
    "tyranids_titan_regen_research",
    "tyranids_assimilation_research"
   ],
   "addons": [
    "tyranids_titanchamber_addon_1",
    "tyranids_titanchamber_addon_2"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "research",
     "ids": [
      "tyranids_assimilation_research"
     ]
    }
   ]
  },
  "capillary_tower": {
   "id": "tyranids_capillary_tower",
   "name": "Capillary Tower",
   "icon": "tyranids_icons/i_capillary_tower",
   "model": "races/tyranids/structures/capillarytower",
   "hp": 4000,
   "armour": 100,
   "armourType": "building_super",
   "regen": 5,
   "speed": 0,
   "sight": 5,
   "cost": 3000,
   "power": 0,
   "time": 180,
   "hardpoints": [],
   "spawns": [],
   "research": [
    "tyranids_assimilation_research"
   ],
   "addons": [
    "addon_superweapon"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "research",
     "ids": [
      "tyranids_assimilation_research"
     ]
    }
   ]
  },
  "capillary_vein": {
   "id": "tyranids_capillary_vein",
   "name": "Capillary Vein",
   "icon": "tyranids_icons/i_capillary_vein",
   "model": "races/race_tyranid/structures/capillary_tower",
   "hp": 1000,
   "armour": 100,
   "armourType": "building_low",
   "regen": 5,
   "speed": 0,
   "sight": 10,
   "cost": 100,
   "power": 300,
   "time": 190,
   "hardpoints": [],
   "spawns": [],
   "research": [
    "tyranids_requisition_research_5",
    "tyranids_requisition_research_4",
    "tyranids_requisition_research_2",
    "tyranids_requisition_research_3",
    "tyranids_requisition_research_1"
   ],
   "addons": [
    "tyranids_structure_production_addon",
    "tyranids_structure_sight_addon",
    "tyranids_structure_regeneration_addon",
    "tyranids_structure_shield_addon"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    }
   ]
  },
  "carnifex_hive": {
   "id": "tyranids_carnifex_hive",
   "name": "Carnifex Chamber",
   "icon": "tyranids_icons/i_spawning_chamb",
   "model": "races/tyranids/structures/heavyhive",
   "hp": 4000,
   "armour": 100,
   "armourType": "building_med",
   "regen": 5,
   "speed": 0,
   "sight": 30,
   "cost": 400,
   "power": 0,
   "time": 40,
   "hardpoints": [],
   "spawns": [
    "tyranids_squad_carnifex",
    "tyranids_squad_carnifex_khazi",
    "tyranids_squad_carnifex_skiller",
    "tyranids_squad_tyrant_guard"
   ],
   "research": [
    "tyranids_carnifex_regeneration_research",
    "tyranids_carnifex_implant_research",
    "tyranids_carnifex_thorned_carapace_research",
    "tyranids_carnifex_toxic_miasma_research",
    "tyranids_carnifex_ext_carapace_research"
   ],
   "addons": [],
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_1"
     ]
    }
   ]
  },
  "digest_pool": {
   "id": "tyranids_digest_pool",
   "name": "Reclamation Pool",
   "icon": "tyranids_icons/i_reclamation_pool",
   "model": "races/tyranids/structures/reclamationpool",
   "hp": 1000,
   "armour": 100,
   "armourType": "building_low",
   "regen": 5,
   "speed": 0,
   "sight": 25,
   "cost": 150,
   "power": 0,
   "time": 50,
   "hardpoints": [],
   "spawns": [],
   "research": [
    "tyranids_power_research_5",
    "tyranids_power_research_3",
    "tyranids_ripper_toxin_sacs_research",
    "tyranids_ripper_leaping_research",
    "tyranids_power_research_2",
    "tyranids_power_research_4",
    "tyranids_building_synapse_aurax2_research",
    "tyranids_power_research",
    "tyranids_building_miasmax2_research"
   ],
   "addons": [],
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    }
   ]
  },
  "gaunt_hive": {
   "id": "tyranids_gaunt_hive",
   "name": "Gaunt Hive",
   "icon": "tyranids_icons/i_hive_node",
   "model": "races/tyranids/structures/troophive",
   "hp": 2500,
   "armour": 100,
   "armourType": "building_med",
   "regen": 5,
   "speed": 0,
   "sight": 30,
   "cost": 170,
   "power": 0,
   "time": 70,
   "hardpoints": [],
   "spawns": [
    "tyranids_squad_hormagaunt",
    "tyranids_squad_gargoyle",
    "tyranids_squad_spinegaunt",
    "tyranids_squad_spore_cluster",
    "tyranids_squad_termagant"
   ],
   "research": [],
   "addons": [],
   "req": []
  },
  "hq": {
   "id": "tyranids_hq",
   "name": "Hive Spire",
   "icon": "tyranids_icons/i_hq",
   "model": "races/tyranids/structures/hq",
   "hp": 5000,
   "armour": 100,
   "armourType": "building_high",
   "regen": 5,
   "speed": 0,
   "sight": 50,
   "cost": 450,
   "power": 0,
   "time": 150,
   "hardpoints": [],
   "spawns": [
    "tyranids_squad_swarmlord",
    "tyranids_squad_ripperswarm",
    "tyranids_squad_genestealer",
    "tyranids_squad_hive_tyrant"
   ],
   "research": [
    "tyranids_caps_research_2",
    "tyranids_caps_research",
    "tyranids_assimilation_research",
    "tyranids_caps_research_4",
    "tyranids_arrival3_research",
    "tyranids_caps_research_3",
    "tyranids_apocalypse_research",
    "tyranids_relic_research_2",
    "tyranids_relic_research_1",
    "tyranids_caps_research_1"
   ],
   "addons": [
    "tyranids_hq_addon_1",
    "tyranids_hq_addon_2"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    }
   ]
  },
  "mines": {
   "id": "tyranids_mines",
   "name": "Frag Spore Mines",
   "icon": "tyranids_icons/i_spore_cluster",
   "model": "races/tyranids/troops/sporemines",
   "hp": 113,
   "armour": 100,
   "armourType": "building_low",
   "regen": 1,
   "speed": 0,
   "sight": 10,
   "cost": 25,
   "power": 0,
   "time": 1,
   "hardpoints": [],
   "spawns": [],
   "research": [],
   "addons": [],
   "req": []
  },
  "relic_hive": {
   "id": "tyranids_relic_hive",
   "name": "Tunnel Warrens",
   "icon": "tyranids_icons/i_tunnel_warrens",
   "model": "races/tyranids/structures/relichive",
   "hp": 5000,
   "armour": 100,
   "armourType": "building_med",
   "regen": 5,
   "speed": 0,
   "sight": 30,
   "cost": 635,
   "power": 0,
   "time": 120,
   "hardpoints": [],
   "spawns": [
    "tyranids_squad_carnifex_tervigon",
    "tyranids_squad_trygon",
    "tyranids_squad_carnifex_uber"
   ],
   "research": [
    "tyranids_arrival3_research"
   ],
   "addons": [],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "research",
     "ids": [
      "tyranids_arrival3_research"
     ]
    }
   ]
  },
  "spore_chimney": {
   "id": "tyranids_spore_chimney",
   "name": "Spore Chimney",
   "icon": "tyranids_icons/i_spore_chimney",
   "model": "races/tyranids/structures/sporechimney",
   "hp": 3200,
   "armour": 100,
   "armourType": "building_low",
   "regen": 12,
   "speed": 0,
   "sight": 55,
   "cost": 90,
   "power": 0,
   "time": 30,
   "hardpoints": [],
   "spawns": [],
   "research": [
    "tyranids_requisition_research_5",
    "tyranids_requisition_research_4",
    "tyranids_requisition_research_2",
    "tyranids_requisition_research_3",
    "tyranids_requisition_research_1"
   ],
   "addons": [
    "tyranids_list_post_addon_1",
    "tyranids_list_post_addon_2"
   ],
   "req": []
  },
  "turret": {
   "id": "tyranids_turret",
   "name": "",
   "icon": "tyranids_icons\\i_turret",
   "model": "races/tyranids/structures/hive_nest",
   "hp": 2400,
   "armour": 100,
   "armourType": "building_low",
   "regen": 3,
   "speed": 0,
   "sight": 55,
   "cost": 20,
   "power": 180,
   "time": 35,
   "hardpoints": [
    [
     {
      "file": "tyranids_turret_mine_launcher",
      "name": "",
      "range": 40,
      "minRange": 5,
      "reload": 5,
      "accuracy": 1,
      "min": 241,
      "max": 354,
      "pierce": 0,
      "morale": 35,
      "setup": 0,
      "moveAcc": 1,
      "melee": false,
      "aoe": 5,
      "vs": {
       "inf": 70,
       "hinf": 50,
       "light": 20,
       "veh": 10,
       "titan": 50,
       "struct": 20,
       "cmd": 30
      },
      "cost": 0,
      "power": 0,
      "time": 0,
      "icon": "space_marine_icons/upgrade",
      "requires": []
     },
     {
      "file": "tyranids_turret_mine_launcher_bioacid",
      "name": "",
      "range": 45,
      "minRange": 0,
      "reload": 5,
      "accuracy": 1,
      "min": 545,
      "max": 765,
      "pierce": 10,
      "morale": 35,
      "setup": 0,
      "moveAcc": 1,
      "melee": false,
      "aoe": 5,
      "vs": {
       "inf": 15,
       "hinf": 15,
       "light": 70,
       "veh": 50,
       "titan": 15,
       "struct": 20,
       "cmd": 12
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
    "tyranids_squad_spore_cluster_spam"
   ],
   "research": [],
   "addons": [
    "tyranids_turret_production_addon",
    "tyranids_turret_bioacid_addon",
    "tyranids_turret_launcher_addon"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "either",
     "ids": [
      "tyranids_warrior_hive",
      "tyranids_biomorph_hive"
     ]
    }
   ]
  },
  "turret_bioacid": {
   "id": "tyranids_turret_bioacid",
   "name": "Bio Acid Hive Node",
   "icon": "tyranids_icons\\i_turret_bioacid",
   "model": "races/tyranids/structures/improved_nest",
   "hp": 7400,
   "armour": 100,
   "armourType": "building_low",
   "regen": 6,
   "speed": 0,
   "sight": 75,
   "cost": 140,
   "power": 660,
   "time": 190,
   "hardpoints": [
    [
     {
      "file": "tyranids_turret_mine_launcher_bioacid_improved",
      "name": "",
      "range": 70,
      "minRange": 0,
      "reload": 5,
      "accuracy": 0.800000011920929,
      "min": 900,
      "max": 1300,
      "pierce": 10,
      "morale": 76,
      "setup": 0,
      "moveAcc": 1,
      "melee": false,
      "aoe": 5,
      "vs": {
       "inf": 15,
       "hinf": 15,
       "light": 70,
       "veh": 50,
       "titan": 15,
       "struct": 10,
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
      "file": "tyranids_turret_mine_launcher_pivot",
      "name": "",
      "range": 70,
      "minRange": 0,
      "reload": 5,
      "accuracy": 1,
      "min": 261,
      "max": 341,
      "pierce": 0,
      "morale": 35,
      "setup": 0,
      "moveAcc": 1,
      "melee": false,
      "aoe": 5,
      "vs": {
       "inf": 70,
       "hinf": 50,
       "light": 20,
       "veh": 10,
       "titan": 50,
       "struct": 20,
       "cmd": 36
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
      "file": "tyranids_turret_mine_launcher_pivot",
      "name": "",
      "range": 70,
      "minRange": 0,
      "reload": 5,
      "accuracy": 1,
      "min": 261,
      "max": 341,
      "pierce": 0,
      "morale": 35,
      "setup": 0,
      "moveAcc": 1,
      "melee": false,
      "aoe": 5,
      "vs": {
       "inf": 70,
       "hinf": 50,
       "light": 20,
       "veh": 10,
       "titan": 50,
       "struct": 20,
       "cmd": 36
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
      "file": "tyranids_turret_mine_launcher_pivot",
      "name": "",
      "range": 70,
      "minRange": 0,
      "reload": 5,
      "accuracy": 1,
      "min": 261,
      "max": 341,
      "pierce": 0,
      "morale": 35,
      "setup": 0,
      "moveAcc": 1,
      "melee": false,
      "aoe": 5,
      "vs": {
       "inf": 70,
       "hinf": 50,
       "light": 20,
       "veh": 10,
       "titan": 50,
       "struct": 20,
       "cmd": 36
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
      "file": "tyranids_turret_mine_launcher_pivot",
      "name": "",
      "range": 70,
      "minRange": 0,
      "reload": 5,
      "accuracy": 1,
      "min": 261,
      "max": 341,
      "pierce": 0,
      "morale": 35,
      "setup": 0,
      "moveAcc": 1,
      "melee": false,
      "aoe": 5,
      "vs": {
       "inf": 70,
       "hinf": 50,
       "light": 20,
       "veh": 10,
       "titan": 50,
       "struct": 20,
       "cmd": 36
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
    "tyranids_squad_spore_cluster_spam"
   ],
   "research": [
    "tyranids_arrival3_research"
   ],
   "addons": [
    "tyranids_turret_production_addon",
    "tyranids_turret_launcher_addon"
   ],
   "req": [
    {
     "t": "either",
     "ids": [
      "tyranids_gaunt_hive",
      "tyranids_biomorph_hive"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "research",
     "ids": [
      "tyranids_arrival3_research"
     ]
    }
   ]
  },
  "warrior_hive": {
   "id": "tyranids_warrior_hive",
   "name": "Brood Hive",
   "icon": "tyranids_icons/i_birthing_sacs",
   "model": "races/tyranids/structures/warriorhive",
   "hp": 2500,
   "armour": 100,
   "armourType": "building_med",
   "regen": 5,
   "speed": 0,
   "sight": 30,
   "cost": 180,
   "power": 0,
   "time": 35,
   "hardpoints": [],
   "spawns": [
    "tyranids_squad_lictor_alpha",
    "tyranids_squad_warrior",
    "tyranids_squad_zoanthropes",
    "tyranids_squad_lictor",
    "tyranids_squad_biovores",
    "tyranids_squad_ravener",
    "tyranids_squad_broodlord"
   ],
   "research": [],
   "addons": [],
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    }
   ]
  },
  "xeno_hive": {
   "id": "tyranids_xeno_hive",
   "name": "Manipulator Hive",
   "icon": "tyranids_icons/i_mutation_lair",
   "model": "races/tyranids/structures/elitehive",
   "hp": 2500,
   "armour": 100,
   "armourType": "building_med",
   "regen": 5,
   "speed": 0,
   "sight": 30,
   "cost": 290,
   "power": 0,
   "time": 60,
   "hardpoints": [],
   "spawns": [
    "tyranids_squad_woth"
   ],
   "research": [
    "tyranids_eatworld_research",
    "tyranids_errection_research",
    "tyranids_biobomb_research",
    "tyranids_hivefleet_research"
   ],
   "addons": [],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    }
   ]
  }
 },
 "research": {
  "tyranids_power_research_5": {
   "name": "Increased Power Income V",
   "info": "",
   "icon": "space_marine_icons/power_inc_research_5",
   "cost": 800,
   "power": 100,
   "time": 125,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "income_power_player",
     "value": 1.149999976158142,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "adv_magma_vent"
  },
  "tyranids_power_research_3": {
   "name": "Increased Power Income III",
   "info": "",
   "icon": "space_marine_icons/power_inc_research_3",
   "cost": 500,
   "power": 60,
   "time": 115,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "income_power_player",
     "value": 1.25,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "adv_magma_vent"
  },
  "tyranids_ripper_toxin_sacs_research": {
   "name": "Biomorph - Ripper Swarm Toxin Sacs",
   "info": "- Tick like organisms that excrete lethal poisons into and over weapons.",
   "icon": "tyranids_icons/i_sacs",
   "cost": 0,
   "power": 35,
   "time": 30,
   "requires": [
    "tyranids_hq",
    "tyranids_hq_addon_1"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_1"
     ]
    }
   ],
   "mods": [
    {
     "type": "min_damage_weapon",
     "value": 1.2999999523162842,
     "add": false,
     "target": "tyranids_melee_ripperswarm",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.2999999523162842,
     "add": false,
     "target": "tyranids_melee_ripperswarm",
     "on": "weapon_type"
    }
   ],
   "building": "adv_magma_vent"
  },
  "tyranids_ripper_leaping_research": {
   "name": "Biomorph - Ripper Speed Increase",
   "info": "- Enhances the muscles and tendons of Ripper Swarms.",
   "icon": "tyranids_icons/i_leap",
   "cost": 0,
   "power": 50,
   "time": 50,
   "requires": [
    "tyranids_hq",
    "tyranids_hq_addon_1"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_1"
     ]
    }
   ],
   "mods": [
    {
     "type": "speed_maximum",
     "value": 1.3300000429153442,
     "add": false,
     "target": "tyranids_ripperswarm_global",
     "on": "entity_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.3300000429153442,
     "add": false,
     "target": "tyranids_ripperswarm",
     "on": "entity_type"
    }
   ],
   "building": "adv_magma_vent"
  },
  "tyranids_power_research_2": {
   "name": "Increased Power Income II",
   "info": "",
   "icon": "space_marine_icons/power_inc_research_2",
   "cost": 350,
   "power": 40,
   "time": 95,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "income_power_player",
     "value": 1.2000000476837158,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "adv_magma_vent"
  },
  "tyranids_power_research_4": {
   "name": "Increased Power Income IV",
   "info": "",
   "icon": "space_marine_icons/power_inc_research_4",
   "cost": 650,
   "power": 80,
   "time": 125,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "income_power_player",
     "value": 1.149999976158142,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "adv_magma_vent"
  },
  "tyranids_building_synapse_aurax2_research": {
   "name": "Biomorph - Strengthen Synapse Aura",
   "info": "- The Tyranids' grip tightens on the planet.",
   "icon": "tyranids_icons/i_miasma",
   "cost": 0,
   "power": 250,
   "time": 60,
   "requires": [
    "tyranids_hq_addon_2"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    }
   ],
   "mods": [],
   "building": "adv_magma_vent"
  },
  "tyranids_power_research": {
   "name": "Increased Power Income I",
   "info": "",
   "icon": "space_marine_icons/power_inc_research_1",
   "cost": 200,
   "power": 20,
   "time": 60,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "income_power_player",
     "value": 1.149999976158142,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "adv_magma_vent"
  },
  "tyranids_building_miasmax2_research": {
   "name": "Biomorph - Strengthen Toxic Miasma",
   "info": "- The Tyranids' grip tightens on the planet.",
   "icon": "tyranids_icons/i_strengthen_toxic_miasma",
   "cost": 0,
   "power": 250,
   "time": 60,
   "requires": [
    "tyranids_hq_addon_2"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    }
   ],
   "mods": [
    {
     "type": "sight_radius",
     "value": 20,
     "add": true,
     "target": "tyranids_spore_chimney",
     "on": "entity_type"
    },
    {
     "type": "keen_sight_radius",
     "value": 5,
     "add": true,
     "target": "tyranids_spore_chimney",
     "on": "entity_type"
    }
   ],
   "building": "adv_magma_vent"
  },
  "tyranids_hormagaunt_adrenal_glands_research": {
   "name": "Biomorph - Adrenal Glands Research I",
   "info": "- Decreases reaction time and increases overall creature strength.",
   "icon": "tyranids_icons/i_adrenalin",
   "cost": 0,
   "power": 60,
   "time": 45,
   "requires": [
    "tyranids_hq_addon_1"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_1"
     ]
    }
   ],
   "mods": [
    {
     "type": "min_damage_weapon",
     "value": 1.2999999523162842,
     "add": false,
     "target": "tyranids_melee_hormagaunt",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.2999999523162842,
     "add": false,
     "target": "tyranids_melee_hormagaunt",
     "on": "weapon_type"
    },
    {
     "type": "armour_piercing_weapon",
     "value": 7,
     "add": true,
     "target": "tyranids_melee_hormagaunt",
     "on": "weapon_type"
    }
   ],
   "building": "biomorph_hive"
  },
  "tyranids_lictor_upgrade_research_1": {
   "name": "Lictor Acclimatization I",
   "info": "- Allows Lictors to adapt to this planet.",
   "icon": "Tyranids_icons/i_lictor1",
   "cost": 0,
   "power": 75,
   "time": 25,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "sight_radius",
     "value": 5,
     "add": true,
     "target": "tyranids_lictor",
     "on": "entity_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_lictor_alpha",
     "on": "weapon_type"
    },
    {
     "type": "keen_sight_radius",
     "value": 2,
     "add": true,
     "target": "tyranids_lictor_alpha",
     "on": "entity_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_lictor",
     "on": "weapon_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.1666699647903442,
     "add": false,
     "target": "tyranids_lictor",
     "on": "entity_type"
    },
    {
     "type": "keen_sight_radius",
     "value": 2,
     "add": true,
     "target": "tyranids_lictor",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 100,
     "add": true,
     "target": "tyranids_lictor_alpha",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_lictor_alpha",
     "on": "weapon_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.1666699647903442,
     "add": false,
     "target": "tyranids_lictor_alpha",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_lictor",
     "on": "weapon_type"
    },
    {
     "type": "sight_radius",
     "value": 10,
     "add": true,
     "target": "tyranids_lictor_alpha",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 50,
     "add": true,
     "target": "tyranids_lictor",
     "on": "entity_type"
    }
   ],
   "building": "biomorph_hive"
  },
  "tyranids_genestealer_implant_research": {
   "name": "Biomorph - Genestealer Implant Attack",
   "info": "- A barbed stinger delivers acids and toxins.",
   "icon": "tyranids_icons/i_implant",
   "cost": 0,
   "power": 170,
   "time": 35,
   "requires": [
    "tyranids_hq_addon_1"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_1"
     ]
    }
   ],
   "mods": [
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "tyranids_rending_claw_genestealer",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "tyranids_scyth_genestealer",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "tyranids_rending_claw_genestealer",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "tyranids_scyth_genestealer",
     "on": "weapon_type"
    }
   ],
   "building": "biomorph_hive"
  },
  "tyranids_lictor_upgrade_research_2": {
   "name": "Lictor Acclimatization II",
   "info": "- Allows Lictors to adapt to this planet.",
   "icon": "Tyranids_icons/i_lictor2",
   "cost": 0,
   "power": 95,
   "time": 35,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "sight_radius",
     "value": 5,
     "add": true,
     "target": "tyranids_lictor",
     "on": "entity_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_lictor_alpha",
     "on": "weapon_type"
    },
    {
     "type": "keen_sight_radius",
     "value": 2,
     "add": true,
     "target": "tyranids_lictor_alpha",
     "on": "entity_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_lictor",
     "on": "weapon_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.1666699647903442,
     "add": false,
     "target": "tyranids_lictor",
     "on": "entity_type"
    },
    {
     "type": "keen_sight_radius",
     "value": 2,
     "add": true,
     "target": "tyranids_lictor",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 100,
     "add": true,
     "target": "tyranids_lictor_alpha",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_lictor_alpha",
     "on": "weapon_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.1666699647903442,
     "add": false,
     "target": "tyranids_lictor_alpha",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_lictor",
     "on": "weapon_type"
    },
    {
     "type": "sight_radius",
     "value": 10,
     "add": true,
     "target": "tyranids_lictor_alpha",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 50,
     "add": true,
     "target": "tyranids_lictor",
     "on": "entity_type"
    }
   ],
   "building": "biomorph_hive"
  },
  "tyranids_genestealer_upgrade_research_2": {
   "name": "Genestealer Acclimatization II",
   "info": "- Allows Genestealers to adapt to this planet.",
   "icon": "Tyranids_icons/i_genestealer2",
   "cost": 0,
   "power": 120,
   "time": 45,
   "requires": [
    "tyranids_hq_addon_1"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_1"
     ]
    }
   ],
   "mods": [
    {
     "type": "armour",
     "value": 2,
     "add": true,
     "target": "tyranids_genestealer",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 2,
     "add": true,
     "target": "tyranids_genestealer_max",
     "on": "entity_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 4,
     "add": true,
     "target": "tyranids_squad_genestealer",
     "on": "squad_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_genestealer_max",
     "on": "entity_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_genestealer_max",
     "on": "entity_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 4,
     "add": true,
     "target": "tyranids_squad_genestealer_max",
     "on": "squad_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_genestealer",
     "on": "entity_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_genestealer",
     "on": "entity_type"
    }
   ],
   "building": "biomorph_hive"
  },
  "tyranids_genestealer_scyth_research": {
   "name": "Biomorph - Genestealer Scything Talons",
   "info": "- Changes claws to long, sharp bones.",
   "icon": "tyranids_icons/i_scyth",
   "cost": 0,
   "power": 190,
   "time": 45,
   "requires": [
    "tyranids_hq_addon_2"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    }
   ],
   "mods": [
    {
     "type": "default_weapon_modifier_hardpoint1",
     "value": 1,
     "add": true,
     "target": "tyranids_genestealer",
     "on": "entity_type"
    },
    {
     "type": "default_weapon_modifier_hardpoint1",
     "value": 1,
     "add": true,
     "target": "tyranids_genestealer_max",
     "on": "entity_type"
    }
   ],
   "building": "biomorph_hive"
  },
  "tyranids_warrior_leaping_research": {
   "name": "Biomorph - Adaptive Speeds",
   "info": "- Strengthens muscles and tendons.",
   "icon": "tyranids_icons/i_leap",
   "cost": 0,
   "power": 100,
   "time": 30,
   "requires": [
    "tyranids_hq_addon_2"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    }
   ],
   "mods": [
    {
     "type": "speed_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_broodlord",
     "on": "entity_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_biovores",
     "on": "entity_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_warrior_hvy",
     "on": "entity_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_warrior_max",
     "on": "entity_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_ravener",
     "on": "entity_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_zoanthropes",
     "on": "entity_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_warrior",
     "on": "entity_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_warrior_hvy_bs",
     "on": "entity_type"
    }
   ],
   "building": "biomorph_hive"
  },
  "tyranids_warrior_adrenal_glands_research": {
   "name": "Biomorph - Adrenal Glands Research I",
   "info": "- Decreases reaction time and increases overall creature strength.",
   "icon": "tyranids_icons/i_adrenalin_warrior",
   "cost": 0,
   "power": 270,
   "time": 70,
   "requires": [
    "tyranids_arrival3_research",
    "tyranids_hq_addon_2"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "tyranids_arrival3_research"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "tyranids_broodlord",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "tyranids_warrior_max",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "tyranids_warrior_hvy",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_melee_ravener_rend",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_melee_broodlord",
     "on": "weapon_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "tyranids_warrior",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 2,
     "add": true,
     "target": "tyranids_warrior_max",
     "on": "entity_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_melee_ravener",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_melee_broodlord",
     "on": "weapon_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "tyranids_zoanthropes",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 2,
     "add": true,
     "target": "tyranids_warrior",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_melee_warrior",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_melee_ravener_rend",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_melee_warrior_rend",
     "on": "weapon_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "tyranids_biovores",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "tyranids_warrior_hvy_bs",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_melee_ravener",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_melee_warrior",
     "on": "weapon_type"
    },
    {
     "type": "health_maximum",
     "value": 1.25,
     "add": false,
     "target": "tyranids_ravener",
     "on": "entity_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_melee_warrior_rend",
     "on": "weapon_type"
    }
   ],
   "building": "biomorph_hive"
  },
  "tyranids_warrior_weapons_research": {
   "name": "",
   "info": "",
   "icon": "tyranids_icons/i_whip_bonesword_research",
   "cost": 0,
   "power": 75,
   "time": 21,
   "requires": [
    "tyranids_hq_addon_1"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_1"
     ]
    }
   ],
   "mods": [
    {
     "type": "max_upgrades_squad",
     "value": 2,
     "add": true,
     "target": "tyranids_squad_ravener",
     "on": "squad_type"
    },
    {
     "type": "max_upgrades_squad",
     "value": 3,
     "add": true,
     "target": "tyranids_squad_warrior_max",
     "on": "squad_type"
    },
    {
     "type": "max_upgrades_squad",
     "value": 3,
     "add": true,
     "target": "tyranids_squad_warrior",
     "on": "squad_type"
    },
    {
     "type": "max_upgrades_squad",
     "value": 2,
     "add": true,
     "target": "tyranids_squad_biovores",
     "on": "squad_type"
    }
   ],
   "building": "biomorph_hive"
  },
  "tyranids_lictor_upgrade_research_3": {
   "name": "Lictor Acclimatization III",
   "info": "- Allows Lictors to adapt to this planet.",
   "icon": "Tyranids_icons/i_lictor3",
   "cost": 0,
   "power": 115,
   "time": 45,
   "requires": [
    "tyranids_hq_addon_2"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    }
   ],
   "mods": [
    {
     "type": "sight_radius",
     "value": 5,
     "add": true,
     "target": "tyranids_lictor",
     "on": "entity_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_lictor_alpha",
     "on": "weapon_type"
    },
    {
     "type": "keen_sight_radius",
     "value": 2,
     "add": true,
     "target": "tyranids_lictor_alpha",
     "on": "entity_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_lictor",
     "on": "weapon_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.1666699647903442,
     "add": false,
     "target": "tyranids_lictor",
     "on": "entity_type"
    },
    {
     "type": "keen_sight_radius",
     "value": 2,
     "add": true,
     "target": "tyranids_lictor",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 100,
     "add": true,
     "target": "tyranids_lictor_alpha",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_lictor_alpha",
     "on": "weapon_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.1666699647903442,
     "add": false,
     "target": "tyranids_lictor_alpha",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_lictor",
     "on": "weapon_type"
    },
    {
     "type": "sight_radius",
     "value": 10,
     "add": true,
     "target": "tyranids_lictor_alpha",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 50,
     "add": true,
     "target": "tyranids_lictor",
     "on": "entity_type"
    }
   ],
   "building": "biomorph_hive"
  },
  "tyranids_genestealer_upgrade_research_1": {
   "name": "Genestealer Acclimatization I",
   "info": "- Allows Genestealers to adapt to this planet.",
   "icon": "Tyranids_icons/i_genestealer1",
   "cost": 0,
   "power": 100,
   "time": 55,
   "requires": [
    "tyranids_hq_addon_1"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_1"
     ]
    }
   ],
   "mods": [
    {
     "type": "max_troopers_squad",
     "value": 4,
     "add": true,
     "target": "tyranids_squad_genestealer",
     "on": "squad_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_genestealer_max",
     "on": "entity_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_genestealer_max",
     "on": "entity_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 4,
     "add": true,
     "target": "tyranids_squad_genestealer_max",
     "on": "squad_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_genestealer",
     "on": "entity_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_genestealer",
     "on": "entity_type"
    }
   ],
   "building": "biomorph_hive"
  },
  "tyranids_genestealer_tendrils_research": {
   "name": "Biomorph - Feeder Tendrils",
   "info": "- Genestealers, Hormagaunts, Termagaunts, Spinegaunts, Lictors, and Raveners grow Feeder Tendrils.",
   "icon": "tyranids_icons/i_tendrils",
   "cost": 0,
   "power": 80,
   "time": 28,
   "requires": [
    "tyranids_hq_addon_1"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_1"
     ]
    }
   ],
   "mods": [
    {
     "type": "sight_radius",
     "value": 15,
     "add": true,
     "target": "tyranids_lictor",
     "on": "entity_type"
    },
    {
     "type": "sight_radius",
     "value": 15,
     "add": true,
     "target": "tyranids_termagant_max",
     "on": "entity_type"
    },
    {
     "type": "sight_radius",
     "value": 15,
     "add": true,
     "target": "tyranids_hormagaunt_max",
     "on": "entity_type"
    },
    {
     "type": "sight_radius",
     "value": 15,
     "add": true,
     "target": "tyranids_gaunt_won",
     "on": "entity_type"
    },
    {
     "type": "sight_radius",
     "value": 15,
     "add": true,
     "target": "tyranids_ravener",
     "on": "entity_type"
    },
    {
     "type": "sight_radius",
     "value": 15,
     "add": true,
     "target": "tyranids_genestealer_max",
     "on": "entity_type"
    },
    {
     "type": "sight_radius",
     "value": 15,
     "add": true,
     "target": "tyranids_hormagaunt",
     "on": "entity_type"
    },
    {
     "type": "sight_radius",
     "value": 15,
     "add": true,
     "target": "tyranids_spinegaunt_max",
     "on": "entity_type"
    },
    {
     "type": "sight_radius",
     "value": 15,
     "add": true,
     "target": "tyranids_termagant",
     "on": "entity_type"
    },
    {
     "type": "sight_radius",
     "value": 15,
     "add": true,
     "target": "tyranids_genestealer",
     "on": "entity_type"
    },
    {
     "type": "sight_radius",
     "value": 15,
     "add": true,
     "target": "tyranids_spinegaunt",
     "on": "entity_type"
    }
   ],
   "building": "biomorph_hive"
  },
  "tyranids_genestealer_senses_research": {
   "name": "Biomorph - Genestealer Keen Senses",
   "info": "- Allows Genestealers to detect infiltrated units.",
   "icon": "tyranids_icons/i_senses",
   "cost": 0,
   "power": 30,
   "time": 10,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "keen_sight_radius",
     "value": 20,
     "add": true,
     "target": "tyranids_genestealer_max",
     "on": "entity_type"
    },
    {
     "type": "keen_sight_radius",
     "value": 20,
     "add": true,
     "target": "tyranids_genestealer",
     "on": "entity_type"
    }
   ],
   "building": "biomorph_hive"
  },
  "tyranids_genestealer_upgrade_research_3": {
   "name": "Genestealer Acclimatization III",
   "info": "- Allows Genestealers to adapt to this planet.",
   "icon": "Tyranids_icons/i_genestealer3",
   "cost": 0,
   "power": 140,
   "time": 35,
   "requires": [
    "tyranids_hq_addon_2"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_regeneration",
     "value": 5,
     "add": true,
     "target": "tyranids_genestealer",
     "on": "entity_type"
    },
    {
     "type": "special_attack_physics_mass",
     "value": 60,
     "add": true,
     "target": "tyranids_genestealer",
     "on": "entity_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 4,
     "add": true,
     "target": "tyranids_squad_genestealer",
     "on": "squad_type"
    },
    {
     "type": "special_attack_physics_mass",
     "value": 60,
     "add": true,
     "target": "tyranids_genestealer_max",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_genestealer_max",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 5,
     "add": true,
     "target": "tyranids_genestealer_max",
     "on": "entity_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_genestealer_max",
     "on": "entity_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 4,
     "add": true,
     "target": "tyranids_squad_genestealer_max",
     "on": "squad_type"
    },
    {
     "type": "health_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_genestealer",
     "on": "entity_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_genestealer",
     "on": "entity_type"
    }
   ],
   "building": "biomorph_hive"
  },
  "tyranids_gaunt_upgrade_research_2": {
   "name": "Gaunt Acclimatization II",
   "info": "- Allows Spinegaunts, Termagants and Hormagaunts to adapt to this planet.",
   "icon": "Tyranids_icons/i_hormagaunt2",
   "cost": 0,
   "power": 120,
   "time": 35,
   "requires": [
    "tyranids_hq_addon_1"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_1"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_hormagaunt",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 0.25,
     "add": false,
     "target": "tyranids_hormagaunt_max",
     "on": "entity_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.725000023841858,
     "add": false,
     "target": "tyranids_fleshborer_gaunt",
     "on": "weapon_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 2,
     "add": true,
     "target": "tyranids_squad_spinegaunt_max",
     "on": "squad_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.1666699647903442,
     "add": false,
     "target": "tyranids_hormagaunt",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_gaunt_won",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_termagant_max",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_spinegaunt_max",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 0.25,
     "add": false,
     "target": "tyranids_termagant_max",
     "on": "entity_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_hormagaunt",
     "on": "weapon_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 1,
     "add": true,
     "target": "tyranids_squad_termagant",
     "on": "squad_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 1,
     "add": true,
     "target": "tyranids_squad_termagant_max",
     "on": "squad_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_spinefist_gaunt",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_devourer_gaunt",
     "on": "weapon_type"
    },
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_spinegaunt",
     "on": "entity_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_termagant",
     "on": "weapon_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 1,
     "add": true,
     "target": "tyranids_squad_hormagaunt",
     "on": "squad_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_spinefist_gaunt",
     "on": "weapon_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.15788996219635,
     "add": false,
     "target": "tyranids_spinegaunt",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_hormagaunt_max",
     "on": "entity_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.1764700412750244,
     "add": false,
     "target": "tyranids_termagant",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 0.20000000298023224,
     "add": false,
     "target": "tyranids_termagant",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_hormagaunt",
     "on": "weapon_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 1,
     "add": true,
     "target": "tyranids_squad_hormagaunt_max",
     "on": "squad_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_gargoyle",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 50,
     "add": true,
     "target": "tyranids_gargoyle",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 25,
     "add": true,
     "target": "tyranids_gaunt_won",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_gargoyle",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_devourer_gaunt",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_termagant",
     "on": "weapon_type"
    },
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_termagant",
     "on": "entity_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 1,
     "add": true,
     "target": "tyranids_squad_spinegaunt",
     "on": "squad_type"
    },
    {
     "type": "health_maximum",
     "value": 0.15000000596046448,
     "add": false,
     "target": "tyranids_spinegaunt",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 0.25,
     "add": false,
     "target": "tyranids_spinegaunt_max",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.725000023841858,
     "add": false,
     "target": "tyranids_fleshborer_gaunt",
     "on": "weapon_type"
    },
    {
     "type": "health_maximum",
     "value": 0.20000000298023224,
     "add": false,
     "target": "tyranids_hormagaunt",
     "on": "entity_type"
    }
   ],
   "building": "biomorph_hive"
  },
  "tyranids_genestealer_bl_infiltration_research": {
   "name": "Biomorph - Infiltration/Stealth",
   "info": "- Allows the Broodlord and Genestealers to become infiltrated.",
   "icon": "tyranids_icons/i_infiltrate",
   "cost": 0,
   "power": 300,
   "time": 50,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "enable_infiltration_veil_of_darkness",
     "value": 1,
     "add": false,
     "target": "tyranids_genestealer",
     "on": "entity_type"
    },
    {
     "type": "enable_infiltration_veil_of_darkness",
     "value": 1,
     "add": false,
     "target": "tyranids_broodlord",
     "on": "entity_type"
    },
    {
     "type": "enable_infiltration_veil_of_darkness",
     "value": 1,
     "add": false,
     "target": "tyranids_genestealer_max",
     "on": "entity_type"
    }
   ],
   "building": "biomorph_hive"
  },
  "tyranids_gaunt_upgrade_research_3": {
   "name": "Gaunt Acclimatization III",
   "info": "- Allows Spinegaunts, Termagants and Hormagaunts to adapt to this planet.",
   "icon": "Tyranids_icons/i_hormagaunt3",
   "cost": 0,
   "power": 140,
   "time": 40,
   "requires": [
    "tyranids_hq_addon_2"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_hormagaunt",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 35,
     "add": true,
     "target": "tyranids_hormagaunt_max",
     "on": "entity_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_fleshborer_gaunt",
     "on": "weapon_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 2,
     "add": true,
     "target": "tyranids_squad_spinegaunt_max",
     "on": "squad_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.1666699647903442,
     "add": false,
     "target": "tyranids_hormagaunt",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_gaunt_won",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_termagant_max",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_spinegaunt_max",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 35,
     "add": true,
     "target": "tyranids_termagant_max",
     "on": "entity_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_hormagaunt",
     "on": "weapon_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 1,
     "add": true,
     "target": "tyranids_squad_termagant",
     "on": "squad_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 1,
     "add": true,
     "target": "tyranids_squad_termagant_max",
     "on": "squad_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_spinefist_gaunt",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_devourer_gaunt",
     "on": "weapon_type"
    },
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_spinegaunt",
     "on": "entity_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_termagant",
     "on": "weapon_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 1,
     "add": true,
     "target": "tyranids_squad_hormagaunt",
     "on": "squad_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_spinefist_gaunt",
     "on": "weapon_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.15788996219635,
     "add": false,
     "target": "tyranids_spinegaunt",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_hormagaunt_max",
     "on": "entity_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.1764700412750244,
     "add": false,
     "target": "tyranids_termagant",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 0.20000000298023224,
     "add": false,
     "target": "tyranids_termagant",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_hormagaunt",
     "on": "weapon_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 1,
     "add": true,
     "target": "tyranids_squad_hormagaunt_max",
     "on": "squad_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_gargoyle",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 50,
     "add": true,
     "target": "tyranids_gargoyle",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 25,
     "add": true,
     "target": "tyranids_gaunt_won",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_gargoyle",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_devourer_gaunt",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_termagant",
     "on": "weapon_type"
    },
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_termagant",
     "on": "entity_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 1,
     "add": true,
     "target": "tyranids_squad_spinegaunt",
     "on": "squad_type"
    },
    {
     "type": "health_maximum",
     "value": 0.15000000596046448,
     "add": false,
     "target": "tyranids_spinegaunt",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 25,
     "add": true,
     "target": "tyranids_spinegaunt_max",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_fleshborer_gaunt",
     "on": "weapon_type"
    },
    {
     "type": "health_maximum",
     "value": 0.20000000298023224,
     "add": false,
     "target": "tyranids_hormagaunt",
     "on": "entity_type"
    }
   ],
   "building": "biomorph_hive"
  },
  "tyranids_gaunt_upgrade_research_1": {
   "name": "Gaunt Acclimatization I",
   "info": "- Allows Spinegaunts, Termagants and Hormagaunts to adapt to this planet.",
   "icon": "tyranids_icons/i_hormagaunt1",
   "cost": 0,
   "power": 100,
   "time": 30,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_hormagaunt",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 35,
     "add": true,
     "target": "tyranids_hormagaunt_max",
     "on": "entity_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_fleshborer_gaunt",
     "on": "weapon_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 2,
     "add": true,
     "target": "tyranids_squad_spinegaunt_max",
     "on": "squad_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.1666699647903442,
     "add": false,
     "target": "tyranids_hormagaunt",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_gaunt_won",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_termagant_max",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_spinegaunt_max",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 35,
     "add": true,
     "target": "tyranids_termagant_max",
     "on": "entity_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_hormagaunt",
     "on": "weapon_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 1,
     "add": true,
     "target": "tyranids_squad_termagant",
     "on": "squad_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 1,
     "add": true,
     "target": "tyranids_squad_termagant_max",
     "on": "squad_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_spinefist_gaunt",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_devourer_gaunt",
     "on": "weapon_type"
    },
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_spinegaunt",
     "on": "entity_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_termagant",
     "on": "weapon_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 1,
     "add": true,
     "target": "tyranids_squad_hormagaunt",
     "on": "squad_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_spinefist_gaunt",
     "on": "weapon_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.15788996219635,
     "add": false,
     "target": "tyranids_spinegaunt",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_hormagaunt_max",
     "on": "entity_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.1764700412750244,
     "add": false,
     "target": "tyranids_termagant",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 0.20000000298023224,
     "add": false,
     "target": "tyranids_termagant",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_hormagaunt",
     "on": "weapon_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 1,
     "add": true,
     "target": "tyranids_squad_hormagaunt_max",
     "on": "squad_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_gargoyle",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 50,
     "add": true,
     "target": "tyranids_gargoyle",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 25,
     "add": true,
     "target": "tyranids_gaunt_won",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_gargoyle",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_devourer_gaunt",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_termagant",
     "on": "weapon_type"
    },
    {
     "type": "health_regeneration",
     "value": 0.5,
     "add": true,
     "target": "tyranids_termagant",
     "on": "entity_type"
    },
    {
     "type": "max_troopers_squad",
     "value": 1,
     "add": true,
     "target": "tyranids_squad_spinegaunt",
     "on": "squad_type"
    },
    {
     "type": "health_maximum",
     "value": 0.15000000596046448,
     "add": false,
     "target": "tyranids_spinegaunt",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 25,
     "add": true,
     "target": "tyranids_spinegaunt_max",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_fleshborer_gaunt",
     "on": "weapon_type"
    },
    {
     "type": "health_maximum",
     "value": 0.20000000298023224,
     "add": false,
     "target": "tyranids_hormagaunt",
     "on": "entity_type"
    }
   ],
   "building": "biomorph_hive"
  },
  "tyranids_gaunt_devourer_research": {
   "name": "Biomorph - Devourer Weapon Effectiveness",
   "info": "- Improves the damage dealt of all Devourers used by Termagaunts, Gargoyles, Warriors, and the Hive Tyrant.",
   "icon": "tyranids_icons/i_devourer",
   "cost": 0,
   "power": 100,
   "time": 45,
   "requires": [
    "tyranids_hq_addon_1"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_1"
     ]
    }
   ],
   "mods": [
    {
     "type": "default_weapon_modifier_hardpoint1",
     "value": 1,
     "add": true,
     "target": "tyranids_gargoyle",
     "on": "entity_type"
    },
    {
     "type": "default_weapon_modifier_hardpoint1",
     "value": 1,
     "add": true,
     "target": "tyranids_termagant",
     "on": "entity_type"
    }
   ],
   "building": "biomorph_hive"
  },
  "tyranids_titan_armor2_research": {
   "name": "Biomorph - Spiked Carapace",
   "info": "- Further thickens and evolves the carapace armor of the Hierophant massively.",
   "icon": "tyranids_icons/i_thorn",
   "cost": 0,
   "power": 600,
   "time": 80,
   "requires": [
    "tyranids_titan_armor_research",
    "tyranids_assimilation_research"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "tyranids_titan_armor_research"
     ]
    },
    {
     "t": "research",
     "ids": [
      "tyranids_titan_armor_research"
     ]
    },
    {
     "t": "research",
     "ids": [
      "tyranids_assimilation_research"
     ]
    }
   ],
   "mods": [
    {
     "type": "armour",
     "value": 8,
     "add": true,
     "target": "tyranids_hierophant",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 4000,
     "add": true,
     "target": "tyranids_hierophant",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 5,
     "add": true,
     "target": "tyranids_trygon",
     "on": "entity_type"
    },
    {
     "type": "armour",
     "value": 8,
     "add": true,
     "target": "tyranids_hierophant_max",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 2000,
     "add": true,
     "target": "tyranids_trygon",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 4000,
     "add": true,
     "target": "tyranids_hierophant_max",
     "on": "entity_type"
    }
   ],
   "building": "biotitan_hive"
  },
  "tyranids_titan_armor_research": {
   "name": "Biomorph - Bridged Carapace",
   "info": "- Thickens and evolves the carapace armor of the Hierophant.",
   "icon": "tyranids_icons/i_banks",
   "cost": 0,
   "power": 450,
   "time": 60,
   "requires": [
    "tyranids_relic_hive",
    "tyranids_assimilation_research"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_relic_hive"
     ]
    },
    {
     "t": "research",
     "ids": [
      "tyranids_assimilation_research"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_maximum",
     "value": 4000,
     "add": true,
     "target": "tyranids_hierophant",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 2000,
     "add": true,
     "target": "tyranids_trygon",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 4000,
     "add": true,
     "target": "tyranids_hierophant_max",
     "on": "entity_type"
    }
   ],
   "building": "biotitan_hive"
  },
  "tyranids_titan_melee_research": {
   "name": "Biomorph - Massive Limb Improvement",
   "info": "- Strengthens and evolves the limbs of the Hierophant.",
   "icon": "tyranids_icons/i_bonded",
   "cost": 0,
   "power": 350,
   "time": 50,
   "requires": [
    "tyranids_relic_hive",
    "tyranids_assimilation_research"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_relic_hive"
     ]
    },
    {
     "t": "research",
     "ids": [
      "tyranids_assimilation_research"
     ]
    }
   ],
   "mods": [
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_hiero_improved_left",
     "on": "weapon_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_hierophant_max",
     "on": "entity_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_hiero_improved",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_hiero",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_hiero_improved_left",
     "on": "weapon_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_hierophant",
     "on": "entity_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_hiero_improved",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_melee_trygon",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_hiero",
     "on": "weapon_type"
    },
    {
     "type": "speed_maximum",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_trygon",
     "on": "entity_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.2000000476837158,
     "add": false,
     "target": "tyranids_melee_trygon",
     "on": "weapon_type"
    }
   ],
   "building": "biotitan_hive"
  },
  "tyranids_titan_bioplasma_research": {
   "name": "Biomorph - Bioplasma",
   "info": "- Changes the bio organisms of the Trygon, allowing it to use vile toxins.",
   "icon": "tyranids_icons/i_plasma",
   "cost": 0,
   "power": 200,
   "time": 50,
   "requires": [
    "tyranids_relic_hive",
    "tyranids_assimilation_research"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_relic_hive"
     ]
    },
    {
     "t": "research",
     "ids": [
      "tyranids_assimilation_research"
     ]
    }
   ],
   "mods": [],
   "building": "biotitan_hive"
  },
  "tyranids_titan_regen_research": {
   "name": "Biomorph - Regenerative Organs",
   "info": "- Imbues the Hierophant with ultimate regenerative organs and replaceable biomass.",
   "icon": "tyranids_icons/i_regenerate",
   "cost": 0,
   "power": 350,
   "time": 50,
   "requires": [
    "tyranids_relic_hive",
    "tyranids_assimilation_research"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_relic_hive"
     ]
    },
    {
     "t": "research",
     "ids": [
      "tyranids_assimilation_research"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_regeneration",
     "value": 1.5,
     "add": false,
     "target": "tyranids_hierophant",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 1.25,
     "add": false,
     "target": "tyranids_trygon",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 1.5,
     "add": false,
     "target": "tyranids_hierophant_max",
     "on": "entity_type"
    }
   ],
   "building": "biotitan_hive"
  },
  "tyranids_assimilation_research": {
   "name": "Planetary Assimilation (Tier IV)",
   "info": "- Allows the Tyranids to progress to Tier IV.",
   "icon": "tyranids_icons/planetary_assimilation",
   "cost": 1800,
   "power": 1200,
   "time": 240,
   "requires": [
    "tyranids_relic_hive",
    "tyranids_hq_addon_2",
    "tyranids_arrival3_research"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_relic_hive"
     ]
    },
    {
     "t": "local_addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    },
    {
     "t": "research",
     "ids": [
      "tyranids_arrival3_research"
     ]
    },
    {
     "t": "research",
     "ids": [
      "tyranids_arrival3_research"
     ]
    }
   ],
   "mods": [],
   "building": "biotitan_hive"
  },
  "tyranids_requisition_research_5": {
   "name": "Increased Requisition Income V",
   "info": "",
   "icon": "space_marine_icons/req_inc_research_5",
   "cost": 300,
   "power": 1100,
   "time": 125,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "income_requisition_player",
     "value": 1.2000000476837158,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "capillary_vein"
  },
  "tyranids_requisition_research_4": {
   "name": "Increased Requisition Income IV",
   "info": "",
   "icon": "space_marine_icons/req_inc_research_4",
   "cost": 150,
   "power": 550,
   "time": 125,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "income_requisition_player",
     "value": 1.100000023841858,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "capillary_vein"
  },
  "tyranids_requisition_research_2": {
   "name": "Increased Requisition Income II",
   "info": "",
   "icon": "space_marine_icons/req_inc_research_2",
   "cost": 100,
   "power": 350,
   "time": 95,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "income_requisition_player",
     "value": 1.100000023841858,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "capillary_vein"
  },
  "tyranids_requisition_research_3": {
   "name": "Increased Requisition Income III",
   "info": "",
   "icon": "space_marine_icons/req_inc_research_3",
   "cost": 125,
   "power": 450,
   "time": 115,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "income_requisition_player",
     "value": 1.100000023841858,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "capillary_vein"
  },
  "tyranids_requisition_research_1": {
   "name": "Increased Requisition Income I",
   "info": "",
   "icon": "space_marine_icons/req_inc_research_1",
   "cost": 75,
   "power": 250,
   "time": 60,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "income_requisition_player",
     "value": 1.100000023841858,
     "add": false,
     "target": "",
     "on": "player"
    }
   ],
   "building": "capillary_vein"
  },
  "tyranids_carnifex_regeneration_research": {
   "name": "Biomorph - Carnifex Regeneration",
   "info": "- Increases the natural Carnifex metabolism in order to accelerate healing.",
   "icon": "tyranids_icons/i_regenerate",
   "cost": 0,
   "power": 170,
   "time": 25,
   "requires": [
    "tyranids_hq_addon_2"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_regeneration",
     "value": 12,
     "add": true,
     "target": "tyranids_tyrant_guard",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 6,
     "add": true,
     "target": "tyranids_carnifex_skiller",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 12,
     "add": true,
     "target": "tyranids_carnifex_uber",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 12,
     "add": true,
     "target": "tyranids_carnifex_tervigon",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 12,
     "add": true,
     "target": "tyranids_carnifex",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 6,
     "add": true,
     "target": "tyranids_carnifex_khazi",
     "on": "entity_type"
    }
   ],
   "building": "carnifex_hive"
  },
  "tyranids_carnifex_implant_research": {
   "name": "Biomorph - Carnifex Implant Attack",
   "info": "- A barbed stinger delivers acids and toxins.",
   "icon": "tyranids_icons/i_implant",
   "cost": 0,
   "power": 125,
   "time": 50,
   "requires": [
    "tyranids_hq_addon_2"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    }
   ],
   "mods": [
    {
     "type": "min_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "tyranids_melee_uberfex",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_tyrant_guard",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_carnifex",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.25,
     "add": false,
     "target": "tyranids_melee_uberfex",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_carnifex_crushclaw",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_tyrant_guard",
     "on": "weapon_type"
    },
    {
     "type": "max_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_carnifex",
     "on": "weapon_type"
    },
    {
     "type": "min_damage_weapon",
     "value": 1.149999976158142,
     "add": false,
     "target": "tyranids_melee_carnifex_crushclaw",
     "on": "weapon_type"
    }
   ],
   "building": "carnifex_hive"
  },
  "tyranids_carnifex_thorned_carapace_research": {
   "name": "Biomorph - Spiked Carapace",
   "info": "- Thickens and hardens carapace armor.",
   "icon": "tyranids_icons/i_thorn",
   "cost": 0,
   "power": 300,
   "time": 50,
   "requires": [
    "tyranids_hq_addon_2"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_maximum",
     "value": 1250,
     "add": true,
     "target": "tyranids_tyrant_guard",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 0.20000000298023224,
     "add": false,
     "target": "tyranids_carnifex_skiller",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 2500,
     "add": true,
     "target": "tyranids_carnifex_uber",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 2500,
     "add": true,
     "target": "tyranids_carnifex_tervigon",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 0.20000000298023224,
     "add": false,
     "target": "tyranids_carnifex",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1500,
     "add": true,
     "target": "tyranids_carnifex_khazi",
     "on": "entity_type"
    }
   ],
   "building": "carnifex_hive"
  },
  "tyranids_carnifex_toxic_miasma_research": {
   "name": "Biomorph - Carnifex Toxic Miasma",
   "info": "- Exudes an aura of Toxic Miasma (slows enemies and reduces damage).",
   "icon": "tyranids_icons/i_miasma",
   "cost": 0,
   "power": 80,
   "time": 25,
   "requires": [
    "tyranids_hq_addon_2"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    }
   ],
   "mods": [
    {
     "type": "keen_sight_radius",
     "value": 4,
     "add": true,
     "target": "tyranids_carnifex_skiller",
     "on": "entity_type"
    },
    {
     "type": "keen_sight_radius",
     "value": 4,
     "add": true,
     "target": "tyranids_carnifex_uber",
     "on": "entity_type"
    },
    {
     "type": "keen_sight_radius",
     "value": 4,
     "add": true,
     "target": "tyranids_carnifex_khazi",
     "on": "entity_type"
    },
    {
     "type": "keen_sight_radius",
     "value": 4,
     "add": true,
     "target": "tyranids_carnifex",
     "on": "entity_type"
    },
    {
     "type": "keen_sight_radius",
     "value": 4,
     "add": true,
     "target": "tyranids_carnifex_tervigon",
     "on": "entity_type"
    }
   ],
   "building": "carnifex_hive"
  },
  "tyranids_carnifex_ext_carapace_research": {
   "name": "Biomorph - Carnifex Extended Carapace",
   "info": "- Thickens and hardens carapace armor.",
   "icon": "tyranids_icons/i_carapace",
   "cost": 0,
   "power": 200,
   "time": 30,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "health_maximum",
     "value": 1000,
     "add": true,
     "target": "tyranids_tyrant_guard",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 0.20000000298023224,
     "add": false,
     "target": "tyranids_carnifex_skiller",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 2500,
     "add": true,
     "target": "tyranids_carnifex_uber",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 2500,
     "add": true,
     "target": "tyranids_carnifex_tervigon",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 0.20000000298023224,
     "add": false,
     "target": "tyranids_carnifex",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1500,
     "add": true,
     "target": "tyranids_carnifex_khazi",
     "on": "entity_type"
    }
   ],
   "building": "carnifex_hive"
  },
  "tyranids_caps_research_2": {
   "name": "Hive Expansion III",
   "info": "",
   "icon": "tyranids_icons/i_cap_squad_3",
   "cost": 0,
   "power": 150,
   "time": 30,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "squad_cap_player",
     "value": 30,
     "add": true,
     "target": "",
     "on": "player"
    }
   ],
   "building": "hq"
  },
  "tyranids_caps_research": {
   "name": "Hive Expansion I",
   "info": "",
   "icon": "tyranids_icons/i_cap_squad",
   "cost": 0,
   "power": 150,
   "time": 30,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "squad_cap_player",
     "value": 6,
     "add": true,
     "target": "",
     "on": "player"
    }
   ],
   "building": "hq"
  },
  "tyranids_caps_research_4": {
   "name": "Carnifex Expansion II",
   "info": "",
   "icon": "tyranids_icons/i_cap_support_2",
   "cost": 0,
   "power": 150,
   "time": 30,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "support_cap_player",
     "value": 30,
     "add": true,
     "target": "",
     "on": "player"
    }
   ],
   "building": "hq"
  },
  "tyranids_arrival3_research": {
   "name": "Planetary Harvest (Tier III)",
   "info": "- Advances the Tyranids higher up the tech tree.",
   "icon": "tyranids_icons/i_hq3",
   "cost": 1200,
   "power": 800,
   "time": 180,
   "requires": [
    "tyranids_hq_addon_2"
   ],
   "req": [
    {
     "t": "local_addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    },
    {
     "t": "local_addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    }
   ],
   "mods": [
    {
     "type": "cost_requisition",
     "value": 100,
     "add": true,
     "target": "tyranids_lictor_alpha",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 250,
     "add": true,
     "target": "tyranids_lictor_alpha",
     "on": "entity_type"
    },
    {
     "type": "health_regeneration",
     "value": 5,
     "add": true,
     "target": "tyranids_lictor_alpha",
     "on": "entity_type"
    }
   ],
   "building": "hq"
  },
  "tyranids_caps_research_3": {
   "name": "Carnifex Expansion I",
   "info": "",
   "icon": "tyranids_icons/i_cap_support",
   "cost": 0,
   "power": 150,
   "time": 30,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "support_cap_player",
     "value": 12,
     "add": true,
     "target": "",
     "on": "player"
    }
   ],
   "building": "hq"
  },
  "tyranids_apocalypse_research": {
   "name": "Apocalypse (Tier V)",
   "info": "- Time consuming final tier that will allow the use of win-buttons and apocalypse like technology.",
   "icon": "npc/apocalypse_icon",
   "cost": 8000,
   "power": 4000,
   "time": 300,
   "requires": [
    "tyranids_assimilation_research",
    "tyranids_hq_addon_2"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "tyranids_assimilation_research"
     ]
    },
    {
     "t": "local_addon",
     "ids": [
      "tyranids_hq_addon_2"
     ]
    },
    {
     "t": "research",
     "ids": [
      "tyranids_assimilation_research"
     ]
    }
   ],
   "mods": [],
   "building": "hq"
  },
  "tyranids_relic_research_2": {
   "name": "Tier II Relics",
   "info": "- Further upgrades the relics to add an extra bonus to the relic resource, along with increasing its income rates.",
   "icon": "npc/relic_inc_research2",
   "cost": 0,
   "power": 3000,
   "time": 120,
   "requires": [
    "tyranids_assimilation_research",
    "tyranids_relic_research_1"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "tyranids_assimilation_research"
     ]
    },
    {
     "t": "research",
     "ids": [
      "tyranids_relic_research_1"
     ]
    },
    {
     "t": "research",
     "ids": [
      "tyranids_relic_research_1"
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
   "building": "hq"
  },
  "tyranids_relic_research_1": {
   "name": "Tier I Relics",
   "info": "- Upgrades the relics to add an extra bonus to the relic resource, along with increasing its income rates.",
   "icon": "npc/relic_inc_research1",
   "cost": 0,
   "power": 1500,
   "time": 90,
   "requires": [
    "tyranids_arrival3_research"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "tyranids_arrival3_research"
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
   "building": "hq"
  },
  "tyranids_caps_research_1": {
   "name": "Hive Expansion II",
   "info": "",
   "icon": "tyranids_icons/i_cap_squad_2",
   "cost": 0,
   "power": 150,
   "time": 30,
   "requires": [],
   "req": [],
   "mods": [
    {
     "type": "squad_cap_player",
     "value": 6,
     "add": true,
     "target": "",
     "on": "player"
    }
   ],
   "building": "hq"
  },
  "tyranids_eatworld_research": {
   "name": "End Game Research - Claim World",
   "info": "- Allows the tyranoformation of the entire planet.",
   "icon": "tyranids_icons/i_eatworld",
   "cost": 0,
   "power": 30000,
   "time": 300,
   "requires": [
    "tyranids_apocalypse_research"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "tyranids_apocalypse_research"
     ]
    }
   ],
   "mods": [
    {
     "type": "cost_time",
     "value": 0.05000000074505806,
     "add": false,
     "target": "tyranids_genestealer_max",
     "on": "entity_type"
    },
    {
     "type": "cost_time",
     "value": 0.05000000074505806,
     "add": false,
     "target": "tyranids_spore_cluster_max",
     "on": "entity_type"
    },
    {
     "type": "cost_power",
     "value": 0.05000000074505806,
     "add": false,
     "target": "tyranids_termagant_max",
     "on": "entity_type"
    },
    {
     "type": "cost_time",
     "value": 0.05000000074505806,
     "add": false,
     "target": "tyranids_hormagaunt_max",
     "on": "entity_type"
    },
    {
     "type": "cost_time",
     "value": 0.05000000074505806,
     "add": false,
     "target": "tyranids_ripperswarm_global",
     "on": "entity_type"
    },
    {
     "type": "cost_time",
     "value": 0.05000000074505806,
     "add": false,
     "target": "tyranids_spinegaunt_max",
     "on": "entity_type"
    },
    {
     "type": "cost_power",
     "value": 0.5,
     "add": false,
     "target": "tyranids_genestealer_max",
     "on": "entity_type"
    },
    {
     "type": "cost_time",
     "value": 0.05000000074505806,
     "add": false,
     "target": "tyranids_gaunt_won",
     "on": "entity_type"
    },
    {
     "type": "cost_power",
     "value": 0.5,
     "add": false,
     "target": "tyranids_hierophant_max",
     "on": "entity_type"
    },
    {
     "type": "cost_power",
     "value": 0.5,
     "add": false,
     "target": "tyranids_hormagaunt_max",
     "on": "entity_type"
    },
    {
     "type": "cost_power",
     "value": 0.5,
     "add": false,
     "target": "tyranids_spinegaunt_max",
     "on": "entity_type"
    },
    {
     "type": "cost_power",
     "value": 0,
     "add": false,
     "target": "tyranids_gaunt_won",
     "on": "entity_type"
    },
    {
     "type": "cost_power",
     "value": 0.5,
     "add": false,
     "target": "tyranids_spore_cluster_max",
     "on": "entity_type"
    },
    {
     "type": "cost_power",
     "value": 0.5,
     "add": false,
     "target": "tyranids_termagant_max",
     "on": "entity_type"
    },
    {
     "type": "sight_radius",
     "value": 2000,
     "add": true,
     "target": "tyranids_woth",
     "on": "entity_type"
    },
    {
     "type": "cost_power",
     "value": 0.5,
     "add": false,
     "target": "tyranids_ripperswarm_global",
     "on": "entity_type"
    },
    {
     "type": "cost_time",
     "value": 0.05000000074505806,
     "add": false,
     "target": "tyranids_hierophant_max",
     "on": "entity_type"
    }
   ],
   "building": "xeno_hive"
  },
  "tyranids_errection_research": {
   "name": "End Game Research - Errect Ground",
   "info": "- Allows the tyranoforming of the ground nearby a capillary tower, creating Capillary Veins.",
   "icon": "tyranids_icons/i_capillary_errection",
   "cost": 0,
   "power": 5000,
   "time": 300,
   "requires": [
    "tyranids_apocalypse_research"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "tyranids_apocalypse_research"
     ]
    }
   ],
   "mods": [],
   "building": "xeno_hive"
  },
  "tyranids_biobomb_research": {
   "name": "Biomorph - Biobomb",
   "info": "- Devastating massed impact ability.",
   "icon": "tyranids_icons/i_biobomb",
   "cost": 0,
   "power": 2000,
   "time": 100,
   "requires": [
    "tyranids_apocalypse_research"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "tyranids_apocalypse_research"
     ]
    }
   ],
   "mods": [],
   "building": "xeno_hive"
  },
  "tyranids_hivefleet_research": {
   "name": "End Game Research - Summon The Hive Fleet",
   "info": "- Allows Capillary Towers to summon the Hive Fleet!",
   "icon": "tyranids_icons/i_hive_fleet_summon",
   "cost": 0,
   "power": 10000,
   "time": 200,
   "requires": [
    "tyranids_apocalypse_research"
   ],
   "req": [
    {
     "t": "research",
     "ids": [
      "tyranids_apocalypse_research"
     ]
    }
   ],
   "mods": [],
   "building": "xeno_hive"
  }
 },
 "addons": {
  "tyranids_structure_shield_addon": {
   "name": "Attachment: Regen Field Synapse (Add-On)",
   "info": "- Attaches this structure with a regen like aura which will massively regenerate all allied units and structures within a 25m radius.",
   "icon": "Tyranids_icons/i_gene_regeneration",
   "cost": 0,
   "power": 500,
   "time": 190,
   "requires": [
    "tyranids_xeno_hive",
    "tyranids_hq",
    "tyranids_arrival3_research"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_xeno_hive"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "research",
     "ids": [
      "tyranids_arrival3_research"
     ]
    }
   ],
   "mods": [
    {
     "type": "ability_energy_field_event",
     "value": 1,
     "add": false,
     "target": "",
     "on": "entity"
    }
   ],
   "building": "adv_magma_vent"
  },
  "tyranids_titanchamber_addon_1": {
   "name": "Growth Chamber",
   "info": "- CRITICAL STRUCTURE!!! Increases the population (relic resource) of the Tyranids required to advance in technology.",
   "icon": "tyranids_icons/i_titan_chamber_addon1",
   "cost": 600,
   "power": 130,
   "time": 20,
   "requires": [
    "tyranids_biotitan_hive"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_biotitan_hive"
     ]
    }
   ],
   "mods": [
    {
     "type": "cost_requisition",
     "value": -500,
     "add": true,
     "target": "tyranids_hierophant",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1000,
     "add": true,
     "target": "",
     "on": "entity"
    }
   ],
   "building": "biotitan_hive"
  },
  "tyranids_titanchamber_addon_2": {
   "name": "Growth Chamber II",
   "info": "- Exudes toxic miasma and synapse.",
   "icon": "tyranids_icons/i_titan_chamber_addon2",
   "cost": 750,
   "power": 250,
   "time": 70,
   "requires": [
    "tyranids_titanchamber_addon_1",
    "tyranids_biotitan_hive"
   ],
   "req": [
    {
     "t": "local_addon",
     "ids": [
      "tyranids_titanchamber_addon_1"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_biotitan_hive"
     ]
    }
   ],
   "mods": [
    {
     "type": "cost_requisition",
     "value": -500,
     "add": true,
     "target": "tyranids_hierophant",
     "on": "entity_type"
    },
    {
     "type": "health_maximum",
     "value": 1000,
     "add": true,
     "target": "",
     "on": "entity"
    }
   ],
   "building": "biotitan_hive"
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
   "building": "capillary_tower"
  },
  "tyranids_structure_production_addon": {
   "name": "Attachment: Production Core (Add-On)",
   "info": "- Speeds up the production rates of all structures 90m from the Capillary Vein by 40%.",
   "icon": "Tyranids_icons/i_gene_production",
   "cost": 0,
   "power": 200,
   "time": 25,
   "requires": [
    "tyranids_xeno_hive",
    "tyranids_hq"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_xeno_hive"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    }
   ],
   "mods": [
    {
     "type": "production_speed",
     "value": 2,
     "add": false,
     "target": "",
     "on": "entity"
    }
   ],
   "building": "capillary_vein"
  },
  "tyranids_structure_sight_addon": {
   "name": "Attachment: Sight Node (Add-On)",
   "info": "- Increases the sight and keen sight radius of this Capillary Vein.",
   "icon": "Tyranids_icons/i_gene_sight",
   "cost": 0,
   "power": 80,
   "time": 25,
   "requires": [
    "tyranids_hq_addon_1",
    "tyranids_hq"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_1"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    }
   ],
   "mods": [
    {
     "type": "keen_sight_radius",
     "value": 20,
     "add": true,
     "target": "",
     "on": "entity"
    },
    {
     "type": "sight_radius",
     "value": 60,
     "add": true,
     "target": "",
     "on": "entity"
    }
   ],
   "building": "capillary_vein"
  },
  "tyranids_structure_regeneration_addon": {
   "name": "Attachment: Regeneration Biomorph (Add-On)",
   "info": "- Increases the health regeneration of all structures 50m from the Capillary Vein.",
   "icon": "Tyranids_icons/obliterator_gene",
   "cost": 0,
   "power": 100,
   "time": 25,
   "requires": [
    "tyranids_xeno_hive",
    "tyranids_hq"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_xeno_hive"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_regeneration",
     "value": 6,
     "add": true,
     "target": "",
     "on": "entity"
    }
   ],
   "building": "capillary_vein"
  },
  "tyranids_hq_addon_1": {
   "name": "Established Link (Tier I)",
   "info": "- Matures the psychic connection with the Hive Mind in orbit.",
   "icon": "tyranids_icons/i_hq1",
   "cost": 250,
   "power": 130,
   "time": 90,
   "requires": [
    "tyranids_gaunt_hive",
    "tyranids_warrior_hive",
    "tyranids_biomorph_hive",
    "tyranids_hq"
   ],
   "req": [
    {
     "t": "either",
     "ids": [
      "tyranids_gaunt_hive",
      "tyranids_warrior_hive"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_biomorph_hive"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
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
   "building": "hq"
  },
  "tyranids_hq_addon_2": {
   "name": "Perfect Link (Tier II)",
   "info": "- Establishes perfect connection between the Hive Mind and the Spire.",
   "icon": "tyranids_icons/i_hq2",
   "cost": 600,
   "power": 400,
   "time": 150,
   "requires": [
    "tyranids_hq_addon_1",
    "tyranids_carnifex_hive",
    "tyranids_hq"
   ],
   "req": [
    {
     "t": "local_addon",
     "ids": [
      "tyranids_hq_addon_1"
     ]
    },
    {
     "t": "local_addon",
     "ids": [
      "tyranids_hq_addon_1"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_carnifex_hive"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
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
   "building": "hq"
  },
  "tyranids_list_post_addon_1": {
   "name": "Spore Chinmey Heavily Fortified Add-on",
   "info": "- Fortify this Strategic Point.",
   "icon": "tyranids_icons/i_spore_chimney1",
   "cost": 0,
   "power": 170,
   "time": 35,
   "requires": [
    "tyranids_spore_chimney"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_spore_chimney"
     ]
    }
   ],
   "mods": [
    {
     "type": "health_maximum",
     "value": 800,
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
     "type": "keen_sight_radius",
     "value": 20,
     "add": true,
     "target": "",
     "on": "entity"
    }
   ],
   "building": "spore_chimney"
  },
  "tyranids_list_post_addon_2": {
   "name": "Spore Chinmey Heavily Fortified Add-on",
   "info": "- Heavily fortify this Strategic Point.",
   "icon": "tyranids_icons/i_spore_chimney2",
   "cost": 0,
   "power": 420,
   "time": 55,
   "requires": [
    "tyranids_list_post_addon_1",
    "tyranids_hq_addon_1",
    "tyranids_spore_chimney"
   ],
   "req": [
    {
     "t": "local_addon",
     "ids": [
      "tyranids_list_post_addon_1"
     ]
    },
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_1"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_spore_chimney"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_spore_chimney"
     ]
    }
   ],
   "mods": [
    {
     "type": "keen_sight_radius",
     "value": 40,
     "add": true,
     "target": "",
     "on": "entity"
    },
    {
     "type": "garrison_requisition",
     "value": 2.1500000953674316,
     "add": false,
     "target": "",
     "on": "entity"
    },
    {
     "type": "health_maximum",
     "value": 2000,
     "add": true,
     "target": "",
     "on": "entity"
    }
   ],
   "building": "spore_chimney"
  },
  "tyranids_turret_production_addon": {
   "name": "Attachment: Spore Mine Production (Add-On)",
   "info": "- Allows this structure to continuously produce spore mines for free.",
   "icon": "Tyranids_icons/i_spore_frag",
   "cost": 0,
   "power": 200,
   "time": 25,
   "requires": [
    "tyranids_hq",
    "tyranids_xeno_hive"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_xeno_hive"
     ]
    }
   ],
   "mods": [],
   "building": "turret"
  },
  "tyranids_turret_bioacid_addon": {
   "name": "Attachment: Acid Spore Mine (Add-On)",
   "info": "- Permanently replaces default weapon with acid spore mines as an attack.",
   "icon": "Tyranids_icons/i_spore_acid",
   "cost": 0,
   "power": 60,
   "time": 15,
   "requires": [
    "tyranids_hq_addon_1",
    "tyranids_hq"
   ],
   "req": [
    {
     "t": "addon",
     "ids": [
      "tyranids_hq_addon_1"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
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
   "building": "turret"
  },
  "tyranids_turret_launcher_addon": {
   "name": "Attachment: Spore Mine Launchers (Add-On)",
   "info": "- Allows this structure to launch a barrage of Spore Mines, both toxin and acid from a distance.",
   "icon": "Tyranids_icons/i_spore_launch",
   "cost": 0,
   "power": 100,
   "time": 15,
   "requires": [
    "tyranids_xeno_hive",
    "tyranids_hq"
   ],
   "req": [
    {
     "t": "structure",
     "ids": [
      "tyranids_xeno_hive"
     ]
    },
    {
     "t": "structure",
     "ids": [
      "tyranids_hq"
     ]
    }
   ],
   "mods": [],
   "building": "turret"
  }
 }
} as const;
