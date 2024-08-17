import { plantTypes } from "./consts";
import { type plant, type profile } from "./types";

//month in minutes = 44,640
const BasePlantProfile: profile = {
  plantType: "",
  totalStages: 20,
  expRatePerMin: 0.04,
  maxHealth: 100,
  minWaterLevel: 40,
  maxWaterLevel: 184,
  topWaterLevel: 200,
  minNutirentLevel: 55,
  maxNutrientLevel: 75,
  topNutrientLevel: 100,
  /** deplete  time in minutes of depletion */
  waterDepleteRate: 0.05,
  nutrientDepleteRate: 0.0005,
  helthDepleteRate: 0.005,
  seed: {
    exp: 0,
    name: "",
    stats: {
      waterLevel: 0,
      lastUpdate: new Date(),
      health: 0,
      soildNutrients: 0,
    },
    plantedDate: new Date(),
    type: "",
    currentStage: 0,
  },
};

function generateSeed(profile: profile) {
  return {
    exp: 0,
    name: "plant",
    stats: {
      health: profile.maxHealth,
      waterLevel: Math.floor(
        (profile.maxWaterLevel + profile.minWaterLevel) / 2
      ),
      soildNutrients: Math.floor(
        (profile.maxNutrientLevel + profile.minNutirentLevel) / 2
      ),
      lastUpdate: new Date(),
    },
    plantedDate: new Date(),
    type: profile.plantType,
    currentStage: 1,
  } as plant;
}

function getProfile(plantType: plantTypes) {
  let profile = { ...BasePlantProfile };
  profile.plantType = plantType;

  switch (plantType) {
    case plantTypes.TOMAT:
      profile.totalStages = 20;
      profile.seed = generateSeed(profile);
      return profile;
    case plantTypes.BEET:
      profile.totalStages = 13;
      profile.seed = generateSeed(profile);
      return profile;
    case plantTypes.CABBAGE:
      profile.totalStages = 20;
      profile.seed = generateSeed(profile);
      return profile;
    case plantTypes.CARROT:
      profile.totalStages = 16;
      profile.seed = generateSeed(profile);
      return profile;
    case plantTypes.CORN:
      profile.totalStages = 20;
      profile.seed = generateSeed(profile);
      return profile;
    case plantTypes.CUCUMBER:
      profile.totalStages = 20;
      profile.seed = generateSeed(profile);
      return profile;
    case plantTypes.EGGPLANT:
      profile.totalStages = 9;
      profile.seed = generateSeed(profile);
      return profile;
    case plantTypes.ONION:
      profile.totalStages = 6;
      profile.seed = generateSeed(profile);
      return profile;
    case plantTypes.PEAS:
      profile.totalStages = 8;
      profile.seed = generateSeed(profile);
      return profile;
    case plantTypes.PEPPER:
      profile.totalStages = 12;
      profile.seed = generateSeed(profile);
      return profile;
    case plantTypes.POTATO:
      profile.totalStages = 7;
      profile.seed = generateSeed(profile);
      return profile;
    case plantTypes.PUMPKIN:
      profile.totalStages = 20;
      profile.seed = generateSeed(profile);
      return profile;
    case plantTypes.RADISH:
      profile.totalStages = 8;
      profile.seed = generateSeed(profile);
      return profile;
    case plantTypes.SALAD:
      profile.totalStages = 7;
      profile.seed = generateSeed(profile);
      return profile;
    case plantTypes.SPINACH:
      profile.totalStages = 5;
      profile.seed = generateSeed(profile);
      return profile;
    case plantTypes.WATERMELON:
      profile.totalStages = 19;
      profile.seed = generateSeed(profile);
      return profile;
    case plantTypes.WHEAT:
      profile.totalStages = 7;
      profile.seed = generateSeed(profile);
      return profile;
    default:
      return BasePlantProfile;
  }
}

export { getProfile, generateSeed };
