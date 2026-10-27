// Сгенерировано tools/ua-race.mjs из Ultimate Apocalypse 1.89.2. Не править руками.
export const UA_TYRANIDS = {
 "squads": {
  "biovores": {
   "min": 2,
   "max": 4,
   "reinforce": 200,
   "unit": {
    "name": "Biovores",
    "icon": "Tyranids_icons/i_biovore",
    "model": "races/tyranids/troops/biovore",
    "hp": 800,
    "armour": 100,
    "regen": 1.5,
    "speed": 16,
    "sight": 25,
    "cost": 200,
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
       "melee": false,
       "aoe": 6,
       "vs": {
        "inf": 60,
        "hinf": 30,
        "light": 16,
        "veh": 6,
        "titan": 11,
        "struct": 10
       }
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
       "melee": false,
       "aoe": 8,
       "vs": {
        "inf": 15,
        "hinf": 15,
        "light": 90,
        "veh": 75,
        "titan": 50,
        "struct": 40
       }
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
       "melee": false,
       "aoe": 4,
       "vs": {
        "inf": 50,
        "hinf": 20,
        "light": 15,
        "veh": 10,
        "titan": 5,
        "struct": 10
       }
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
       "melee": false,
       "aoe": 10,
       "vs": {
        "inf": 60,
        "hinf": 30,
        "light": 16,
        "veh": 6,
        "titan": 11,
        "struct": 10
       }
      }
     ]
    ]
   }
  },
  "broodlord": {
   "min": 3,
   "max": 6,
   "reinforce": 170,
   "unit": {
    "name": "Broodlord",
    "icon": "Tyranids_icons/i_broodlord",
    "model": "races/tyranids/troops/broodlord",
    "hp": 1900,
    "armour": 101,
    "regen": 2,
    "speed": 18,
    "sight": 25,
    "cost": 170,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 40,
        "veh": 20,
        "titan": 20,
        "struct": 15
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 55,
        "titan": 70,
        "struct": 35
       }
      }
     ]
    ]
   }
  },
  "carnifex": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Carnifex",
    "icon": "tyranids_icons/i_carnifex",
    "model": "races/tyranids/troops/carnifex",
    "hp": 6800,
    "armour": 102,
    "regen": 4,
    "speed": 16,
    "sight": 35,
    "cost": 700,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 50,
        "veh": 45,
        "titan": 15,
        "struct": 17
       }
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
       "melee": false,
       "aoe": 3,
       "vs": {
        "inf": 100,
        "hinf": 50,
        "light": 25,
        "veh": 10,
        "titan": 5.5,
        "struct": 9
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 30,
        "light": 100,
        "veh": 60,
        "titan": 22,
        "struct": 12
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 50,
        "veh": 45,
        "titan": 15,
        "struct": 17
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 70,
        "light": 80,
        "veh": 65,
        "titan": 30,
        "struct": 35
       }
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
       "melee": false,
       "aoe": 5,
       "vs": {
        "inf": 15,
        "hinf": 15,
        "light": 90,
        "veh": 80,
        "titan": 25,
        "struct": 25
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 50,
        "veh": 45,
        "titan": 15,
        "struct": 35
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 50,
        "veh": 45,
        "titan": 15,
        "struct": 35
       }
      }
     ]
    ]
   }
  },
  "carnifex_khazi": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Hellfex (Carnifex)",
    "icon": "tyranids_icons/i_hellfex",
    "model": "races/tyranids/troops/carnifex_khazi",
    "hp": 3200,
    "armour": 100,
    "regen": 4,
    "speed": 16,
    "sight": 35,
    "cost": 300,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 45,
        "light": 25,
        "veh": 40,
        "titan": 25,
        "struct": 20
       }
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
       "melee": false,
       "aoe": 6,
       "vs": {
        "inf": 63.79999923706055,
        "hinf": 40.20000076293945,
        "light": 15,
        "veh": 20,
        "titan": 35,
        "struct": 30
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 45,
        "light": 25,
        "veh": 40,
        "titan": 25,
        "struct": 20
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 30,
        "light": 100,
        "veh": 60,
        "titan": 22,
        "struct": 12
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 50,
        "veh": 45,
        "titan": 15,
        "struct": 17
       }
      }
     ]
    ]
   }
  },
  "carnifex_skiller": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Screamer Killer (Carnifex)",
    "icon": "tyranids_icons/i_screamer_killer",
    "model": "races/tyranids/troops/carnifex_skiller",
    "hp": 3400,
    "armour": 100,
    "regen": 2.5,
    "speed": 16,
    "sight": 35,
    "cost": 280,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 50,
        "veh": 45,
        "titan": 15,
        "struct": 17
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 50,
        "veh": 45,
        "titan": 15,
        "struct": 17
       }
      }
     ]
    ]
   }
  },
  "carnifex_tervigon": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Tervigon (Carnifex)",
    "icon": "tyranids_icons/i_tervigon",
    "model": "races/tyranids/troops/carnifex_uber",
    "hp": 12000,
    "armour": 100,
    "regen": 4,
    "speed": 22,
    "sight": 35,
    "cost": 1100,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 70,
        "light": 80,
        "veh": 65,
        "titan": 45,
        "struct": 35
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 70,
        "light": 80,
        "veh": 65,
        "titan": 45,
        "struct": 35
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
  "carnifex_uber": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Uberfex (Carnifex)",
    "icon": "tyranids_icons/i_uberfex",
    "model": "races/tyranids/troops/carnifex_uber",
    "hp": 16000,
    "armour": 100,
    "regen": 10,
    "speed": 22,
    "sight": 45,
    "cost": 1250,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 70,
        "light": 80,
        "veh": 65,
        "titan": 45,
        "struct": 35
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 40,
        "light": 90,
        "veh": 75,
        "titan": 40,
        "struct": 10
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
       "melee": false,
       "aoe": 7,
       "vs": {
        "inf": 70,
        "hinf": 50,
        "light": 20,
        "veh": 15,
        "titan": 10,
        "struct": 10
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 70,
        "light": 80,
        "veh": 65,
        "titan": 45,
        "struct": 35
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 80,
        "hinf": 70,
        "light": 50,
        "veh": 40,
        "titan": 45,
        "struct": 75
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
  "gargoyle": {
   "min": 6,
   "max": 15,
   "reinforce": 30,
   "unit": {
    "name": "Gargoyles",
    "icon": "Tyranids_icons/tyranids_gargoyle_icon",
    "model": "races/tyranids/troops/gargoyle",
    "hp": 195,
    "armour": 100,
    "regen": 1,
    "speed": 48,
    "sight": 55,
    "cost": 30,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 45,
        "light": 20,
        "veh": 15,
        "titan": 5.5,
        "struct": 7
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 45,
        "light": 30,
        "veh": 10,
        "titan": 9,
        "struct": 4
       }
      }
     ]
    ]
   }
  },
  "gargoyle_max": {
   "min": 4,
   "max": 8,
   "reinforce": 15,
   "unit": {
    "name": "Gargoyles",
    "icon": "Tyranids_icons/tyranids_gargoyle_icon",
    "model": "races/tyranids/troops/gargoyle",
    "hp": 195,
    "armour": 100,
    "regen": 1,
    "speed": 48,
    "sight": 55,
    "cost": 30,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 45,
        "light": 20,
        "veh": 15,
        "titan": 5.5,
        "struct": 7
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 45,
        "light": 30,
        "veh": 10,
        "titan": 9,
        "struct": 4
       }
      }
     ]
    ]
   }
  },
  "gaunt_won": {
   "min": 25,
   "max": 25,
   "reinforce": 3,
   "unit": {
    "name": "Spinegaunt (Without Number)",
    "icon": "Tyranids_icons/i_spinegaunt_won",
    "model": "races/tyranids/troops/spinegaunt",
    "hp": 133,
    "armour": 100,
    "regen": 1,
    "speed": 30,
    "sight": 25,
    "cost": 0,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 43.060001373291016,
        "hinf": 13.899999618530273,
        "light": 0,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 45,
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
  "genestealer": {
   "min": 4,
   "max": 4,
   "reinforce": 40,
   "unit": {
    "name": "Genestealers",
    "icon": "Tyranids_icons/i_genestealer",
    "model": "races/tyranids/troops/genestealer",
    "hp": 350,
    "armour": 100,
    "regen": 1,
    "speed": 18,
    "sight": 25,
    "cost": 26.25,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 35,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 40,
        "titan": 70,
        "struct": 10
       }
      }
     ]
    ]
   }
  },
  "genestealer_max": {
   "min": 2,
   "max": 4,
   "reinforce": 40,
   "unit": {
    "name": "Genestealers",
    "icon": "Tyranids_icons/i_genestealer",
    "model": "races/tyranids/troops/genestealer",
    "hp": 350,
    "armour": 100,
    "regen": 1,
    "speed": 18,
    "sight": 25,
    "cost": 0,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 35,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 40,
        "titan": 70,
        "struct": 10
       }
      }
     ]
    ]
   }
  },
  "hierophant": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Hierophant Bio Titan",
    "icon": "tyranids_icons/i_titan",
    "model": "races/tyranids/troops/tyranids_hierophant",
    "hp": 30775,
    "armour": 103,
    "regen": 30,
    "speed": 16,
    "sight": 50,
    "cost": 6500,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 35,
        "light": 80,
        "veh": 70,
        "titan": 25,
        "struct": 20
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 35,
        "light": 80,
        "veh": 70,
        "titan": 25,
        "struct": 20
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 35,
        "light": 80,
        "veh": 70,
        "titan": 25,
        "struct": 20
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 35,
        "light": 80,
        "veh": 70,
        "titan": 25,
        "struct": 20
       }
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
       "melee": true,
       "aoe": 10,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 100,
        "veh": 80,
        "titan": 40,
        "struct": 40
       }
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
       "melee": true,
       "aoe": 10,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 100,
        "veh": 80,
        "titan": 40,
        "struct": 40
       }
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
       "melee": true,
       "aoe": 10,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 100,
        "veh": 80,
        "titan": 40,
        "struct": 40
       }
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
       "melee": true,
       "aoe": 10,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 100,
        "veh": 80,
        "titan": 40,
        "struct": 40
       }
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
       "melee": false,
       "aoe": 7,
       "vs": {
        "inf": 10,
        "hinf": 10,
        "light": 150,
        "veh": 75,
        "titan": 30,
        "struct": 20
       }
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
       "melee": false,
       "aoe": 7,
       "vs": {
        "inf": 10,
        "hinf": 10,
        "light": 150,
        "veh": 75,
        "titan": 30,
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
       "melee": false,
       "aoe": 7,
       "vs": {
        "inf": 10,
        "hinf": 10,
        "light": 150,
        "veh": 75,
        "titan": 30,
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
       "melee": false,
       "aoe": 5,
       "vs": {
        "inf": 15,
        "hinf": 15,
        "light": 90,
        "veh": 90,
        "titan": 25,
        "struct": 25
       }
      }
     ]
    ]
   }
  },
  "hierophant_max": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Hierophant Bio Titan",
    "icon": "tyranids_icons/i_titan",
    "model": "races/tyranids/troops/tyranids_hierophant",
    "hp": 30775,
    "armour": 103,
    "regen": 30,
    "speed": 16,
    "sight": 50,
    "cost": 0,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 35,
        "light": 80,
        "veh": 70,
        "titan": 25,
        "struct": 20
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 35,
        "light": 80,
        "veh": 70,
        "titan": 25,
        "struct": 20
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 35,
        "light": 80,
        "veh": 70,
        "titan": 25,
        "struct": 20
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 35,
        "light": 80,
        "veh": 70,
        "titan": 25,
        "struct": 20
       }
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
       "melee": true,
       "aoe": 10,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 100,
        "veh": 80,
        "titan": 40,
        "struct": 40
       }
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
       "melee": true,
       "aoe": 10,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 100,
        "veh": 80,
        "titan": 40,
        "struct": 40
       }
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
       "melee": true,
       "aoe": 10,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 100,
        "veh": 80,
        "titan": 40,
        "struct": 40
       }
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
       "melee": true,
       "aoe": 10,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 100,
        "veh": 80,
        "titan": 40,
        "struct": 40
       }
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
       "melee": false,
       "aoe": 7,
       "vs": {
        "inf": 10,
        "hinf": 10,
        "light": 150,
        "veh": 75,
        "titan": 30,
        "struct": 20
       }
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
       "melee": false,
       "aoe": 7,
       "vs": {
        "inf": 10,
        "hinf": 10,
        "light": 150,
        "veh": 75,
        "titan": 30,
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
       "melee": false,
       "aoe": 7,
       "vs": {
        "inf": 10,
        "hinf": 10,
        "light": 150,
        "veh": 75,
        "titan": 30,
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
       "melee": false,
       "aoe": 5,
       "vs": {
        "inf": 15,
        "hinf": 15,
        "light": 90,
        "veh": 90,
        "titan": 25,
        "struct": 25
       }
      }
     ]
    ]
   }
  },
  "hive_tyrant": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Hive Tyrant",
    "icon": "Tyranids_icons/i_hivetyrant",
    "model": "races/tyranids/troops/hivetyrant",
    "hp": 1900,
    "armour": 100,
    "regen": 41,
    "speed": 12.5,
    "sight": 40,
    "cost": 440,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 20,
        "veh": 10,
        "titan": 10,
        "struct": 10
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 30,
        "light": 20,
        "veh": 15,
        "titan": 11.100000381469727,
        "struct": 10
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 55,
        "titan": 35,
        "struct": 35
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 20,
        "veh": 10,
        "titan": 10,
        "struct": 10
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 55,
        "titan": 35,
        "struct": 35
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 30,
        "light": 20,
        "veh": 15,
        "titan": 11.100000381469727,
        "struct": 10
       }
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
       "melee": false,
       "aoe": 3,
       "vs": {
        "inf": 100,
        "hinf": 50,
        "light": 25,
        "veh": 10,
        "titan": 5.5,
        "struct": 9
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 30,
        "light": 100,
        "veh": 90,
        "titan": 22,
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
  "hormagaunt": {
   "min": 6,
   "max": 12,
   "reinforce": 20,
   "unit": {
    "name": "Hormagaunt",
    "icon": "Tyranids_icons/i_hormagaunt",
    "model": "races/tyranids/troops/hormagaunt",
    "hp": 255,
    "armour": 100,
    "regen": 1,
    "speed": 18,
    "sight": 25,
    "cost": 25,
    "time": 2,
    "hardpoints": []
   }
  },
  "hormagaunt_max": {
   "min": 6,
   "max": 15,
   "reinforce": 15,
   "unit": {
    "name": "Hormagaunt",
    "icon": "Tyranids_icons/i_hormagaunt",
    "model": "races/tyranids/troops/hormagaunt",
    "hp": 275,
    "armour": 100,
    "regen": 1,
    "speed": 18,
    "sight": 25,
    "cost": 0,
    "time": 2,
    "hardpoints": []
   }
  },
  "lictor": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Lictor",
    "icon": "Tyranids_icons/i_lictor",
    "model": "races/tyranids/troops/lictor",
    "hp": 500,
    "armour": 100,
    "regen": 5,
    "speed": 24,
    "sight": 55,
    "cost": 150,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 60,
        "light": 1,
        "veh": 0,
        "titan": 20,
        "struct": 6
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 60,
        "light": 1,
        "veh": 0,
        "titan": 20,
        "struct": 6
       }
      }
     ]
    ]
   }
  },
  "lictor_alpha": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Lictor Alpha",
    "icon": "Tyranids_icons/i_lictor_alpha",
    "model": "races/tyranids/troops/lictor_alpha",
    "hp": 750,
    "armour": 100,
    "regen": 25,
    "speed": 32,
    "sight": 55,
    "cost": 250,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 55,
        "light": 20,
        "veh": 5,
        "titan": 5.5,
        "struct": 4
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 55,
        "light": 20,
        "veh": 5,
        "titan": 5.5,
        "struct": 4
       }
      }
     ]
    ]
   }
  },
  "ravener": {
   "min": 4,
   "max": 9,
   "reinforce": 50,
   "unit": {
    "name": "Ravener",
    "icon": "tyranids_icons/i_ravener",
    "model": "races/tyranids/troops/ravener",
    "hp": 420,
    "armour": 100,
    "regen": 2,
    "speed": 24,
    "sight": 30,
    "cost": 45,
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
       "melee": false,
       "aoe": 6,
       "vs": {
        "inf": 63.79999923706055,
        "hinf": 40.20000076293945,
        "light": 10,
        "veh": 0,
        "titan": 15,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 5,
       "vs": {
        "inf": 15,
        "hinf": 15,
        "light": 90,
        "veh": 90,
        "titan": 25,
        "struct": 25
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 67.9010009765625,
        "hinf": 53.900001525878906,
        "light": 30,
        "veh": 5,
        "titan": 10,
        "struct": 2
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 55,
        "titan": 30,
        "struct": 15
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 67.9010009765625,
        "hinf": 53.900001525878906,
        "light": 30,
        "veh": 5,
        "titan": 10,
        "struct": 2
       }
      }
     ]
    ]
   }
  },
  "ripperswarm": {
   "min": 1,
   "max": 5,
   "reinforce": 0,
   "unit": {
    "name": "Ripper Swarm",
    "icon": "Tyranids_icons/i_ripper",
    "model": "races/tyranids/troops/ripper",
    "hp": 100,
    "armour": 100,
    "regen": 2,
    "speed": 16,
    "sight": 20,
    "cost": 50,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50.720001220703125,
        "hinf": 45.900001525878906,
        "light": 25,
        "veh": 25,
        "titan": 30,
        "struct": 50
       }
      }
     ]
    ]
   }
  },
  "ripperswarm_global": {
   "min": 1,
   "max": 6,
   "reinforce": 0,
   "unit": {
    "name": "Ripper Swarm",
    "icon": "Tyranids_icons/i_ripper",
    "model": "races/tyranids/troops/ripper",
    "hp": 100,
    "armour": 100,
    "regen": 2,
    "speed": 16,
    "sight": 20,
    "cost": 0,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50.720001220703125,
        "hinf": 45.900001525878906,
        "light": 25,
        "veh": 25,
        "titan": 30,
        "struct": 50
       }
      }
     ]
    ]
   }
  },
  "spinegaunt": {
   "min": 4,
   "max": 10,
   "reinforce": 2,
   "unit": {
    "name": "Spinegaunt",
    "icon": "tyranids_icons/i_spinegant",
    "model": "races/tyranids/troops/spinegaunt",
    "hp": 80,
    "armour": 90,
    "regen": 1,
    "speed": 19,
    "sight": 25,
    "cost": 0,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 43.060001373291016,
        "hinf": 13.899999618530273,
        "light": 0,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 45,
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
  "spinegaunt_max": {
   "min": 4,
   "max": 10,
   "reinforce": 2,
   "unit": {
    "name": "Spinegaunt",
    "icon": "tyranids_icons/i_spinegant",
    "model": "races/tyranids/troops/spinegaunt",
    "hp": 100,
    "armour": 90,
    "regen": 1,
    "speed": 19,
    "sight": 25,
    "cost": 0,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 43.060001373291016,
        "hinf": 13.899999618530273,
        "light": 0,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 45,
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
  "spore_cluster": {
   "min": 6,
   "max": 12,
   "reinforce": 25,
   "unit": {
    "name": "Spore Cluster",
    "icon": "tyranids_icons/i_spore_cluster",
    "model": "races/tyranids/troops/sporemines",
    "hp": 113,
    "armour": 100,
    "regen": 1,
    "speed": 22,
    "sight": 15,
    "cost": 25,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 45,
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
  "spore_cluster_max": {
   "min": 6,
   "max": 6,
   "reinforce": 25,
   "unit": {
    "name": "Spore Cluster",
    "icon": "tyranids_icons/i_spore_cluster",
    "model": "races/tyranids/troops/sporemines",
    "hp": 113,
    "armour": 100,
    "regen": 1,
    "speed": 22,
    "sight": 15,
    "cost": 0,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 45,
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
  "spore_cluster_spam": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "",
    "icon": "tyranids_icons/i_spore_cluster",
    "model": "races/tyranids/troops/sporemines",
    "hp": 113,
    "armour": 100,
    "regen": 1,
    "speed": 22,
    "sight": 15,
    "cost": 0,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 45,
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
  "swarmlord": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Swarmlord",
    "icon": "Tyranids_icons/i_swarmlord",
    "model": "races/tyranids/troops/swarmlord",
    "hp": 21000,
    "armour": 106,
    "regen": 160,
    "speed": 20,
    "sight": 40,
    "cost": 8000,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 55,
        "titan": 50,
        "struct": 75
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 55,
        "titan": 50,
        "struct": 75
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 55,
        "titan": 50,
        "struct": 75
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 55,
        "titan": 50,
        "struct": 75
       }
      }
     ]
    ]
   }
  },
  "termagant": {
   "min": 6,
   "max": 12,
   "reinforce": 25,
   "unit": {
    "name": "Termagant",
    "icon": "Tyranids_icons/i_termagaunt",
    "model": "races/tyranids/troops/termagaunt",
    "hp": 190,
    "armour": 100,
    "regen": 1,
    "speed": 17,
    "sight": 25,
    "cost": 25,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 55,
        "light": 15,
        "veh": 0,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 45,
        "light": 20,
        "veh": 15,
        "titan": 5.5,
        "struct": 7
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 45,
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
  "termagant_max": {
   "min": 6,
   "max": 15,
   "reinforce": 25,
   "unit": {
    "name": "Termagant",
    "icon": "Tyranids_icons/i_termagaunt",
    "model": "races/tyranids/troops/termagaunt",
    "hp": 200,
    "armour": 100,
    "regen": 1,
    "speed": 17,
    "sight": 25,
    "cost": 0,
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 55,
        "light": 15,
        "veh": 0,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 45,
        "light": 20,
        "veh": 15,
        "titan": 5.5,
        "struct": 7
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 45,
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
  "trygon": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Trygon",
    "icon": "tyranids_icons/i_trygon",
    "model": "races/tyranids/troops/trygon",
    "hp": 13700,
    "armour": 103,
    "regen": 25,
    "speed": 36,
    "sight": 40,
    "cost": 1000,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 70,
        "veh": 50,
        "titan": 35,
        "struct": 19
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 70,
        "veh": 50,
        "titan": 35,
        "struct": 25
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 70,
        "veh": 50,
        "titan": 35,
        "struct": 19
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 70,
        "veh": 50,
        "titan": 35,
        "struct": 25
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 70,
        "veh": 50,
        "titan": 35,
        "struct": 19
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 70,
        "veh": 50,
        "titan": 35,
        "struct": 25
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 70,
        "veh": 50,
        "titan": 35,
        "struct": 19
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 60,
        "hinf": 60,
        "light": 70,
        "veh": 50,
        "titan": 35,
        "struct": 25
       }
      }
     ]
    ]
   }
  },
  "tyrant_guard": {
   "min": 2,
   "max": 2,
   "reinforce": 220,
   "unit": {
    "name": "Tyrant Guard",
    "icon": "tyranids_icons/i_tyrant_guard",
    "model": "races/tyranids/troops/tyrant_guard",
    "hp": 2500,
    "armour": 110,
    "regen": 12,
    "speed": 16,
    "sight": 30,
    "cost": 220,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 50,
        "hinf": 40,
        "light": 60,
        "veh": 50,
        "titan": 20,
        "struct": 20
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 65,
        "hinf": 47,
        "light": 80,
        "veh": 60,
        "titan": 20,
        "struct": 20
       }
      }
     ]
    ]
   }
  },
  "warrior": {
   "min": 4,
   "max": 8,
   "reinforce": 80,
   "unit": {
    "name": "Warrior",
    "icon": "tyranids_icons/i_warrior",
    "model": "races/tyranids/troops/warrior",
    "hp": 1100,
    "armour": 101,
    "regen": 2,
    "speed": 16,
    "sight": 30,
    "cost": 70,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 67.9010009765625,
        "hinf": 53.900001525878906,
        "light": 50,
        "veh": 30,
        "titan": 10,
        "struct": 10
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 55,
        "titan": 30,
        "struct": 15
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 30,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 6,
       "vs": {
        "inf": 30,
        "hinf": 25,
        "light": 10,
        "veh": 0,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 20,
        "light": 100,
        "veh": 48,
        "titan": 22,
        "struct": 14
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 67.9010009765625,
        "hinf": 53.900001525878906,
        "light": 50,
        "veh": 30,
        "titan": 10,
        "struct": 10
       }
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
       "melee": false,
       "aoe": 5,
       "vs": {
        "inf": 15,
        "hinf": 15,
        "light": 90,
        "veh": 90,
        "titan": 25,
        "struct": 25
       }
      }
     ]
    ]
   }
  },
  "warrior_max": {
   "min": 4,
   "max": 8,
   "reinforce": 80,
   "unit": {
    "name": "Warrior",
    "icon": "tyranids_icons/i_warrior",
    "model": "races/tyranids/troops/warrior",
    "hp": 1100,
    "armour": 101,
    "regen": 2,
    "speed": 16,
    "sight": 30,
    "cost": 0,
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 67.9010009765625,
        "hinf": 53.900001525878906,
        "light": 50,
        "veh": 30,
        "titan": 10,
        "struct": 10
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 75,
        "hinf": 75,
        "light": 70,
        "veh": 55,
        "titan": 30,
        "struct": 15
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 70,
        "hinf": 30,
        "light": 10,
        "veh": 0,
        "titan": 5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 6,
       "vs": {
        "inf": 30,
        "hinf": 25,
        "light": 10,
        "veh": 0,
        "titan": 5.5,
        "struct": 0
       }
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
       "melee": false,
       "aoe": 0,
       "vs": {
        "inf": 35,
        "hinf": 20,
        "light": 100,
        "veh": 48,
        "titan": 22,
        "struct": 14
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 67.9010009765625,
        "hinf": 53.900001525878906,
        "light": 50,
        "veh": 30,
        "titan": 10,
        "struct": 10
       }
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
       "melee": false,
       "aoe": 5,
       "vs": {
        "inf": 15,
        "hinf": 15,
        "light": 90,
        "veh": 90,
        "titan": 25,
        "struct": 25
       }
      }
     ]
    ]
   }
  },
  "woth": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Hivemind",
    "icon": "tyranids_icons/i_will_of_the_hive",
    "model": "races/tyranids/structures/drop_building",
    "hp": 5,
    "armour": 100,
    "regen": -0.20000000298023224,
    "speed": 0,
    "sight": 0,
    "cost": 0,
    "time": 1,
    "hardpoints": []
   }
  },
  "zoanthropes": {
   "min": 1,
   "max": 1,
   "reinforce": 0,
   "unit": {
    "name": "Zoanthrope",
    "icon": "Tyranids_icons/i_zoanthrope",
    "model": "races/tyranids/troops/zoanthrope",
    "hp": 5000,
    "armour": 100,
    "regen": 2,
    "speed": 16,
    "sight": 45,
    "cost": 340,
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
       "melee": false,
       "aoe": 4,
       "vs": {
        "inf": 15,
        "hinf": 15,
        "light": 90,
        "veh": 65,
        "titan": 25,
        "struct": 15
       }
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
       "melee": true,
       "aoe": 0,
       "vs": {
        "inf": 67.9010009765625,
        "hinf": 53.900001525878906,
        "light": 50,
        "veh": 30,
        "titan": 10,
        "struct": 10
       }
      }
     ]
    ]
   }
  }
 },
 "buildings": {
  "adv_magma_vent": {
   "name": "Magma Vent",
   "icon": "tyranids_icons/i_magma_vent",
   "model": "races/tyranids/structures/magmavent",
   "hp": 2500,
   "armour": 100,
   "regen": 5,
   "speed": 0,
   "sight": 40,
   "cost": 275,
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
   ]
  },
  "biomorph_hive": {
   "name": "Gestation Pod",
   "icon": "tyranids_icons/i_gestation_pod",
   "model": "races/tyranids/structures/stealerhive",
   "hp": 2500,
   "armour": 100,
   "regen": 5,
   "speed": 0,
   "sight": 30,
   "cost": 150,
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
   ]
  },
  "biotitan_hive": {
   "name": "Assimilation Chamber",
   "icon": "tyranids_icons/i_titan_chamber",
   "model": "races/race_tyranid/structures/tyranid_base",
   "hp": 10000,
   "armour": 100,
   "regen": 8,
   "speed": 0,
   "sight": 40,
   "cost": 1200,
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
   ]
  },
  "capillary_tower": {
   "name": "Capillary Tower",
   "icon": "tyranids_icons/i_capillary_tower",
   "model": "races/tyranids/structures/capillarytower",
   "hp": 4000,
   "armour": 100,
   "regen": 5,
   "speed": 0,
   "sight": 5,
   "cost": 3000,
   "time": 180,
   "hardpoints": [],
   "spawns": [],
   "research": [
    "tyranids_assimilation_research"
   ]
  },
  "capillary_vein": {
   "name": "Capillary Vein",
   "icon": "tyranids_icons/i_capillary_vein",
   "model": "races/race_tyranid/structures/capillary_tower",
   "hp": 1000,
   "armour": 100,
   "regen": 5,
   "speed": 0,
   "sight": 10,
   "cost": 100,
   "time": 190,
   "hardpoints": [],
   "spawns": [],
   "research": [
    "tyranids_requisition_research_5",
    "tyranids_requisition_research_4",
    "tyranids_requisition_research_2",
    "tyranids_requisition_research_3",
    "tyranids_requisition_research_1"
   ]
  },
  "carnifex_hive": {
   "name": "Carnifex Chamber",
   "icon": "tyranids_icons/i_spawning_chamb",
   "model": "races/tyranids/structures/heavyhive",
   "hp": 4000,
   "armour": 100,
   "regen": 5,
   "speed": 0,
   "sight": 30,
   "cost": 400,
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
   ]
  },
  "digest_pool": {
   "name": "Reclamation Pool",
   "icon": "tyranids_icons/i_reclamation_pool",
   "model": "races/tyranids/structures/reclamationpool",
   "hp": 1000,
   "armour": 100,
   "regen": 5,
   "speed": 0,
   "sight": 25,
   "cost": 150,
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
   ]
  },
  "gaunt_hive": {
   "name": "Gaunt Hive",
   "icon": "tyranids_icons/i_hive_node",
   "model": "races/tyranids/structures/troophive",
   "hp": 2500,
   "armour": 100,
   "regen": 5,
   "speed": 0,
   "sight": 30,
   "cost": 170,
   "time": 70,
   "hardpoints": [],
   "spawns": [
    "tyranids_squad_hormagaunt",
    "tyranids_squad_gargoyle",
    "tyranids_squad_spinegaunt",
    "tyranids_squad_spore_cluster",
    "tyranids_squad_termagant"
   ],
   "research": []
  },
  "hq": {
   "name": "Hive Spire",
   "icon": "tyranids_icons/i_hq",
   "model": "races/tyranids/structures/hq",
   "hp": 5000,
   "armour": 100,
   "regen": 5,
   "speed": 0,
   "sight": 50,
   "cost": 450,
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
   ]
  },
  "mines": {
   "name": "Frag Spore Mines",
   "icon": "tyranids_icons/i_spore_cluster",
   "model": "races/tyranids/troops/sporemines",
   "hp": 113,
   "armour": 100,
   "regen": 1,
   "speed": 0,
   "sight": 10,
   "cost": 25,
   "time": 1,
   "hardpoints": [],
   "spawns": [],
   "research": []
  },
  "relic_hive": {
   "name": "Tunnel Warrens",
   "icon": "tyranids_icons/i_tunnel_warrens",
   "model": "races/tyranids/structures/relichive",
   "hp": 5000,
   "armour": 100,
   "regen": 5,
   "speed": 0,
   "sight": 30,
   "cost": 635,
   "time": 120,
   "hardpoints": [],
   "spawns": [
    "tyranids_squad_carnifex_tervigon",
    "tyranids_squad_trygon",
    "tyranids_squad_carnifex_uber"
   ],
   "research": [
    "tyranids_arrival3_research"
   ]
  },
  "spore_chimney": {
   "name": "Spore Chimney",
   "icon": "tyranids_icons/i_spore_chimney",
   "model": "races/tyranids/structures/sporechimney",
   "hp": 3200,
   "armour": 100,
   "regen": 12,
   "speed": 0,
   "sight": 55,
   "cost": 90,
   "time": 30,
   "hardpoints": [],
   "spawns": [],
   "research": [
    "tyranids_requisition_research_5",
    "tyranids_requisition_research_4",
    "tyranids_requisition_research_2",
    "tyranids_requisition_research_3",
    "tyranids_requisition_research_1"
   ]
  },
  "turret": {
   "name": "",
   "icon": "tyranids_icons\\i_turret",
   "model": "races/tyranids/structures/hive_nest",
   "hp": 2400,
   "armour": 100,
   "regen": 3,
   "speed": 0,
   "sight": 55,
   "cost": 20,
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
      "melee": false,
      "aoe": 5,
      "vs": {
       "inf": 70,
       "hinf": 50,
       "light": 20,
       "veh": 10,
       "titan": 50,
       "struct": 20
      }
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
      "melee": false,
      "aoe": 5,
      "vs": {
       "inf": 15,
       "hinf": 15,
       "light": 70,
       "veh": 50,
       "titan": 15,
       "struct": 20
      }
     }
    ]
   ],
   "spawns": [
    "tyranids_squad_spore_cluster_spam"
   ],
   "research": []
  },
  "turret_bioacid": {
   "name": "Bio Acid Hive Node",
   "icon": "tyranids_icons\\i_turret_bioacid",
   "model": "races/tyranids/structures/improved_nest",
   "hp": 7400,
   "armour": 100,
   "regen": 6,
   "speed": 0,
   "sight": 75,
   "cost": 140,
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
      "melee": false,
      "aoe": 5,
      "vs": {
       "inf": 15,
       "hinf": 15,
       "light": 70,
       "veh": 50,
       "titan": 15,
       "struct": 10
      }
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
      "melee": false,
      "aoe": 5,
      "vs": {
       "inf": 70,
       "hinf": 50,
       "light": 20,
       "veh": 10,
       "titan": 50,
       "struct": 20
      }
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
      "melee": false,
      "aoe": 5,
      "vs": {
       "inf": 70,
       "hinf": 50,
       "light": 20,
       "veh": 10,
       "titan": 50,
       "struct": 20
      }
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
      "melee": false,
      "aoe": 5,
      "vs": {
       "inf": 70,
       "hinf": 50,
       "light": 20,
       "veh": 10,
       "titan": 50,
       "struct": 20
      }
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
      "melee": false,
      "aoe": 5,
      "vs": {
       "inf": 70,
       "hinf": 50,
       "light": 20,
       "veh": 10,
       "titan": 50,
       "struct": 20
      }
     }
    ]
   ],
   "spawns": [
    "tyranids_squad_spore_cluster_spam"
   ],
   "research": [
    "tyranids_arrival3_research"
   ]
  },
  "warrior_hive": {
   "name": "Brood Hive",
   "icon": "tyranids_icons/i_birthing_sacs",
   "model": "races/tyranids/structures/warriorhive",
   "hp": 2500,
   "armour": 100,
   "regen": 5,
   "speed": 0,
   "sight": 30,
   "cost": 180,
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
   "research": []
  },
  "xeno_hive": {
   "name": "Manipulator Hive",
   "icon": "tyranids_icons/i_mutation_lair",
   "model": "races/tyranids/structures/elitehive",
   "hp": 2500,
   "armour": 100,
   "regen": 5,
   "speed": 0,
   "sight": 30,
   "cost": 290,
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
   ]
  }
 }
} as const;
