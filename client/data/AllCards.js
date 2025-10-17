const AllCards = [
    // === Duelists ===
    {
        uuid: 'd-01',
        name: 'Jett',
        role: 'Duelist',
        description: 'Agile fighter who takes risks and frags out.',
        image: 'images/jett.avif',
        stats: {
            damage: 95,
            utility: 60,
            mobility: 100,
            control: 50
        }
    },
    {
        uuid: 'd-02',
        name: 'Phoenix',
        role: 'Duelist',
        description: 'Lights up the battlefield with flash and fire.',
        image: 'images/phoenix.avif',
        stats: {
            damage: 85,
            utility: 70,
            mobility: 60,
            control: 65
        }
    },
    {
        uuid: 'd-03',
        name: 'Reyna',
        role: 'Duelist',
        description: 'An all-or-nothing fragger who thrives on combat.',
        image: 'images/reyna.avif',
        stats: {
            damage: 100,
            utility: 30,
            mobility: 70,
            control: 20
        }
    },
    {
        uuid: 'd-04',
        name: 'Raze',
        role: 'Duelist',
        description: 'Explosives expert who forces enemies out of cover.',
        image: 'images/raze.avif',
        stats: {
            damage: 90,
            utility: 50,
            mobility: 90,
            control: 60
        }
    },
    {
        uuid: 'd-05',
        name: 'Yoru',
        role: 'Duelist',
        description: 'A master of deception, teleporting across the map.',
        image: 'images/yoru.avif',
        stats: {
            damage: 80,
            utility: 75,
            mobility: 95,
            control: 40
        }
    },

    // === Sentinels ===
    {
        uuid: 's-01',
        name: 'Sage',
        role: 'Sentinel',
        description: 'The team\'s bastion, healing and slowing enemies.',
        image: 'images/sage.avif',
        stats: {
            damage: 40,
            utility: 95,
            mobility: 10,
            control: 100
        }
    },
    {
        uuid: 's-02',
        name: 'Cypher',
        role: 'Sentinel',
        description: 'A one-man surveillance network who traps foes.',
        image: 'images/cypher.avif',
        stats: {
            damage: 30,
            utility: 100,
            mobility: 5,
            control: 90
        }
    },
    {
        uuid: 's-03',
        name: 'Killjoy',
        role: 'Sentinel',
        description: 'Genius inventor who locks down sites with her bots.',
        image: 'images/killjoy.avif',
        stats: {
            damage: 60,
            utility: 85,
            mobility: 10,
            control: 95
        }
    },
    {
        uuid: 's-04',
        name: 'Chamber',
        role: 'Sentinel',
        description: 'A well-dressed marksman who holds angles with style.',
        image: 'images/chamber.avif',
        stats: {
            damage: 90,
            utility: 40,
            mobility: 80,
            control: 70
        }
    },

    // === Controllers ===
    {
        uuid: 'c-01',
        name: 'Brimstone',
        role: 'Controller',
        description: 'Calls in orbital strikes and smokes from the sky.',
        image: 'images/brimstone.avif',
        stats: {
            damage: 70,
            utility: 90,
            mobility: 20,
            control: 85
        }
    },
    {
        uuid: 'c-02',
        name: 'Viper',
        role: 'Controller',
        description: 'Uses chemical warfare to slice up territory.',
        image: 'images/viper.avif',
        stats: {
            damage: 75,
            utility: 80,
            mobility: 10,
            control: 100
        }
    },
    {
        uuid: 'c-03',
        name: 'Omen',
        role: 'Controller',
        description: 'A phantom of memory, hunting from the shadows.',
        image: 'images/omen.avif',
        stats: {
            damage: 65,
            utility: 85,
            mobility: 90,
            control: 75
        }
    },
    {
        uuid: 'c-04',
        name: 'Astra',
        role: 'Controller',
        description: 'Wields cosmic energies to reshape the battlefield.',
        image: 'images/astra.avif',
        stats: {
            damage: 50,
            utility: 95,
            mobility: 20,
            control: 95
        }
    },
    {
        uuid: 'c-05',
        name: 'Harbor',
        role: 'Controller',
        description: 'Master of water, shielding allies with tidal walls.',
        image: 'images/harbor.avif',
        stats: {
            damage: 40,
            utility: 80,
            mobility: 15,
            control: 90
        }
    },

    // === Initiators ===
    {
        uuid: 'i-01',
        name: 'Sova',
        role: 'Initiator',
        description: 'Finds, tracks, and eliminates enemies with his bow.',
        image: 'images/sova.avif',
        stats: {
            damage: 70,
            utility: 100,
            mobility: 20,
            control: 60
        }
    },
    {
        uuid: 'i-02',
        name: 'Breach',
        role: 'Initiator',
        description: 'A bionic Swede who blasts his way through terrain.',
        image: 'images/breach.avif',
        stats: {
            damage: 65,
            utility: 90,
            mobility: 10,
            control: 85
        }
    },
    {
        uuid: 'i-03',
        name: 'Skye',
        role: 'Initiator',
        description: 'Leads the charge with her pack of powerful beasts.',
        image: 'images/skye.avif',
        stats: {
            damage: 60,
            utility: 95,
            mobility: 30,
            control: 70
        }
    },
    {
        uuid: 'i-04',
        name: 'KAY/O',
        role: 'Initiator',
        description: 'A war machine built to suppress enemy abilities.',
        image: 'images/kayo.avif',
        stats: {
            damage: 80,
            utility: 90,
            mobility: 10,
            control: 80
        }
    },
    {
        uuid: 'i-05',
        name: 'Gekko',
        role: 'Initiator',
        description: 'Commands a tight-knit crew of calamitous creatures.',
        image: 'images/gekko.avif',
        stats: {
            damage: 70,
            utility: 85,
            mobility: 30,
            control: 75
        }
    },
    {
        uuid: 'i-06',
        name: 'Fade',
        role: 'Initiator',
        description: 'A bounty hunter who seizes enemies with terror.',
        image: 'images/fade.avif',
        stats: {
            damage: 60,
            utility: 90,
            mobility: 20,
            control: 85
        }
    }
];

export default AllCards;