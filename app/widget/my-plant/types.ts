export type plant = {
    exp: number,
    name: string,
    stats: stats,
    plantedDate: Date,
    type: string,
    currentStage: number,
}

export type stats = {
    waterLevel: number,
    lastUpdate: Date
    health: number,
    soildNutrients: number
}


export type profile = {
    plantType: string,
    totalStages: number,
    expRatePerMin: number,
    maxHealth: number,
    minWaterLevel: number,
    maxWaterLevel: number,
    minNutirentLevel: number,
    maxNutrientLevel: number,
    /** deplete  time in minutes of depletion */
    waterDepleteRate: number,
    nutrientDepleteRate: number,
    helthDepleteRate: number,
    topNutrientLevel: number,
    topWaterLevel: number
    seed: plant
}