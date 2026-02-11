export const MUTATION_SETS = {
  alien: {
    INSECT: {
      wings: 'wings_alien_insect.svg',
      legs: 'legs_alien_insect.svg',
      label: 'Insectoid'
    },
    CYBER_X: {
      wings: 'wings_alien_cyber.svg',
      legs: 'legs_alien_cyber.svg',
      label: 'Cyber-X'
    },
    LIZARD: {
      wings: 'wings_alien_lizard.svg',
      legs: 'legs_alien_lizard.svg',
      label: 'Reptilian'
    },
    TENTACLES: {
      wings: 'wings_alien_tentacles.svg',
      legs: 'legs_alien_tentacles.svg',
      label: 'Lovecraftian'
    }
  },
  robot: {
    AERO: {
      wings: 'wings_h_robot_aero.svg',
      legs: 'legs_h_robot_aero.svg',
      label: 'Aero-Mech'
    },
    GEARS: {
      wings: 'wings_h_robot_gears.svg',
      legs: 'legs_h_robot_gears.svg',
      label: 'Steampunk'
    },
    HEAVY: {
      wings: 'wings_h_robot_heavy.svg',
      legs: 'legs_h_robot_heavy.svg',
      label: 'Heavy Metal'
    },
    NEON: {
      wings: 'wings_h_robot_neon.svg',
      legs: 'legs_h_robot_neon.svg',
      label: 'Neon Cyber'
    }
  },
  griffin: {
    EAGLE: {
      wings: 'wings_h_alado.svg',
      legs: 'legs_h_alado_eagle.svg',
      label: 'Eagle Hybrid'
    },
    DIVINE: {
      wings: 'wings_h_divine.svg',
      legs: 'legs_h_divine_gold.svg',
      label: 'Divine Hybrid'
    },
    LION: {
      wings: 'wings_h_griffin.svg',
      legs: 'legs_h_griffin_lion.svg',
      label: 'Griffin'
    }
  }
};

export const ADDONS_CONFIG = {
  alien: {
    HEAD: [
      { id: 'alien_antenna', file: 'addon_alien_head_alien_antenna.svg', name: 'Antenna' },
      { id: 'alien_helmet', file: 'addon_alien_head_space_helmet.svg', name: 'Space Helmet' },
      { id: 'alien_eye', file: 'addon_alien_face_third_eye.svg', name: 'Third Eye' }
    ],
    BODY: [
      { id: 'alien_slime', file: 'addon_alien_body_slime.svg', name: 'Slime Coat' }
    ]
  },
  robot: {
    HEAD: [
      { id: 'robot_antenna', file: 'addon_robot_head_antenna_blue.svg', name: 'Blue Antenna' },
      { id: 'robot_crest', file: 'addon_robot_head_crest_mech.svg', name: 'Mech Crest' }
    ],
    BODY: [
      { id: 'robot_battery', file: 'addon_robot_body_battery_pack.svg', name: 'Battery Pack' },
      { id: 'robot_gears', file: 'addon_robot_body_gears.svg', name: 'External Gears' }
    ]
  }
};