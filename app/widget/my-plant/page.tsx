
'use client'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useState, useEffect, useCallback } from 'react'

const ASSET_PREFIX = process.env.NODE_ENV === 'production'? "/regular-widgets/": "";


//every stage  need 100 exp to reach new stage
//every new stage start in 0 exp

type plant = {
    exp: number,
    name: string,
    stats: stats,
    plantedDate: Date,
    type: string,
    currentStage: number,
    plantProfile: profile
}

type stats = {
    waterLevel: number,
    lastUpdate: Date
    health: number,
    soildNutrients: number
}


type profile = {
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

}
//month in minutes = 44,640
const plantProfile = {
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
    helthDepleteRate: 0.005
}

const seedPlant: plant = {

    exp: 0,
    name: "plant",
    stats: {
        health: plantProfile.maxHealth,
        waterLevel: Math.floor((plantProfile.maxWaterLevel + plantProfile.minWaterLevel) / 2),
        soildNutrients: Math.floor((plantProfile.maxNutrientLevel + plantProfile.minNutirentLevel) / 2),
        lastUpdate: new Date()
    },
    plantedDate: new Date(),
    type: "tomat",
    currentStage: 1,
    plantProfile: plantProfile

}


function SatusBar({ minLv, maxLv, topLv, currentLv, statName, color }: any) {

    let currentPercent = Math.round((currentLv / topLv) * 100);
    let minLvPercent = Math.round((minLv / topLv) * 100);
    let maxLvPercent = Math.round((maxLv / topLv) * 100);
    console.log("min percernt: ", minLvPercent)
    console.log("max percernt: ", maxLvPercent)

    let barColor = color;
    let borderColer = "border-slate-200"

    if (currentPercent > maxLvPercent) {
        borderColer = "border-red-500"
    } else if (currentPercent < minLvPercent) {
        borderColer = "border-red-500"
    }


    return <div className='flex flex-1 h-full flex-col items-center'>
        <span className=' text-sm'>{statName}</span>
        <div className='flex flex-row flex-1 h-full'>
            <div className='flex  text-xs flex-col-reverse  relative bottom-2'>
                <span style={{ height: minLvPercent }} >min{">"}</span>
                <span style={{ height: (maxLvPercent - minLvPercent) }}>max{">"}</span>
            </div>
            <div className={`h-full  w-5  rounded-lg  border-4 ${borderColer} flex items-end `}>
                <div style={{ height: currentPercent }} className={`flex-1 relative overflow-hidden  ${barColor}`}></div>
                {/* <div className=' flex-1 relative overflow-hidden bg-cyan-500 h-2/6'></div>
            <div className=' flex-1 relative overflow-hidden bg-yellow-500 h-4/6'></div> */}
            </div>
        </div>
    </div>
}

function DialogModal({ visible, onClose, callback }: any) {

    if (!visible) return <></>

    return <div className='fixed inset-0 flex items-center justify-center'>
        <div className="bg-white rounded-lg p-6 h-1/2 w-1/2 bottom-5 relative shadow-md flex flex-col items-center justify-center">
            <span className='text-lg font-bold text-slate-900'>Are you sure?</span>
            <p className='text-sm p-2 text-center'>You will lose every progress.</p>
            <div className='flex flex-row gap-2 p-2'>
                <button className='bg-red-400 text-white p-2  min-w-24 rounded-md border-red-500 border-r-0 border-b-4  drop-shadow-md hover:bg-red-300 hover:border-red-400' type='button' onClick={onClose}>Cancel</button>
                <button className='bg-cyan-600 text-white p-2  min-w-24 rounded-md border-cyan-700 border-r-0 border-b-4  drop-shadow-md hover:bg-cyan-500 hover:border-cyan-600' type='button' onClick={callback}>Ok</button>

            </div>

        </div>
    </div>
}


export default function Page() {
    const [myPlant, setMyplant, cleanStorage] = useLocalStorage<plant>('myPlant', seedPlant);
    const [showStats, setShowStats] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const happyness = Math.round((myPlant.stats.health / myPlant.plantProfile.maxHealth) * 3);
    const saturationLevel = ['saturate-0', 'saturate-50', 'saturate-100', 'saturate-150'];
    const sprites = `${ASSET_PREFIX}/assets/plants_sprites/growing_plants/tomat/tomat_${myPlant?.currentStage}.png`


    const handlerPlantLife = useCallback(() => {
        validateExp();
        depleStats();
        depleHelathValidation();

        function depleHelathValidation() {
            if (myPlant.stats.waterLevel < myPlant.plantProfile.minWaterLevel
                || myPlant.stats.waterLevel > myPlant.plantProfile.maxWaterLevel
                || myPlant.stats.soildNutrients < myPlant.plantProfile.minNutirentLevel
                || myPlant.stats.soildNutrients > myPlant.plantProfile.maxNutrientLevel
            ) {
                setMyplant((prevVal) => {
                    let copy = { ...prevVal }
                    copy.stats.health = copy.stats.health > 0 ? copy.stats.health - copy.plantProfile.helthDepleteRate : 0;
                    return copy;
                });
            } else {
                if (myPlant.stats.health > 0) {
                    setMyplant((prevVal) => {
                        let copy = { ...prevVal }
                        copy.stats.health = copy.stats.health < copy.plantProfile.maxHealth ? copy.stats.health + copy.plantProfile.helthDepleteRate : copy.plantProfile.maxHealth;
                        return copy;
                    });
                }
            }

        }

        function depleStats() {
            setMyplant((prevVal) => {
                let copy = { ...prevVal }
                copy.stats.waterLevel = copy.stats.waterLevel > 0 ? copy.stats.waterLevel - copy.plantProfile.waterDepleteRate : 0;
                copy.stats.soildNutrients = copy.stats.soildNutrients > 0 ? copy.stats.soildNutrients - copy.plantProfile.nutrientDepleteRate : 0;
                copy.stats.lastUpdate = new Date();
                return copy;
            });

        }

        function validateExp() {
            if (myPlant.exp >= 100) {
                setMyplant((prevVal) => {
                    let copy = { ...prevVal }
                    copy.currentStage = copy.currentStage < copy.plantProfile.totalStages ? copy.currentStage + 1 : copy.currentStage;
                    copy.exp = copy.currentStage < copy.plantProfile.totalStages ? 0 : 100;
                    console.log(copy.exp)
                    return copy;
                });

            }
            if (myPlant.stats.health === myPlant.plantProfile.maxHealth) {
                setMyplant((prevVal) => {
                    let copy = { ...prevVal }
                    copy.exp = copy.exp + copy.plantProfile.expRatePerMin;
                    console.log(copy.exp)
                    return copy;
                });
            }

        }
    }, [myPlant, setMyplant]);

    useEffect(() => {
        const lastUpdate = new Date(myPlant.stats.lastUpdate);
        const now = new Date();

        let dif = (now.getTime() - lastUpdate.getTime());
        dif = Math.round((dif / 1000) / 60);
        console.log("last update:", lastUpdate)
        console.log("last update:", dif)

        if (dif > 1) {
            for (let i = 0; i < dif; i++) {
                handlerPlantLife()
            }
        }

    }, [handlerPlantLife, myPlant.stats.lastUpdate])

    useEffect(() => {
        const interval = setInterval(() => {
            console.log('This will be called every 1 seconds');
            handlerPlantLife()
        }, 60000);

        return () => clearInterval(interval);
    }, [handlerPlantLife])


    function modalCloseHandler() {
        setModalVisible(false)
        cleanStorage();
        setMyplant(seedPlant);
    }



    function addWater() {
        let copy = { ...myPlant };
        copy.stats.waterLevel = copy.stats.waterLevel + 1;
        copy.stats.lastUpdate = new Date();
        setMyplant(copy);
    }

    function addFertilize() {
        let copy = { ...myPlant };
        copy.stats.soildNutrients = copy.stats.soildNutrients + 1;
        copy.stats.lastUpdate = new Date();
        setMyplant(copy);
    }


    return (
        <>
            <div className=" flex   items-center justify-center ">
                <div className=" flex  pl-20 pr-20 pt-10 pb-10 flex-col">
                    <div className='flex flex-row'>
                        <div className='flex-1 p-5 s pl-10 pr-10 '>
                            <img className={`${happyness >= 2 ? 'plantLive' : ''} ${happyness < 2 && happyness > 0 ? 'plantDying' : ''} object-cover h-24 ${saturationLevel[happyness]}`} src={sprites} alt="Girl in a jacket"></img>
                        </div>
                        <div className='flex flex-row bg-red'> <SatusBar
                            statName="Water"
                            color="bg-cyan-500"
                            currentLv={myPlant.stats.waterLevel}
                            topLv={myPlant.plantProfile.topWaterLevel}
                            maxLv={myPlant.plantProfile.maxWaterLevel}
                            minLv={myPlant.plantProfile.minWaterLevel} ></SatusBar>
                            <SatusBar
                                statName="Fertilizing"
                                color="bg-yellow-700"
                                currentLv={myPlant.stats.soildNutrients}
                                topLv={myPlant.plantProfile.topNutrientLevel}
                                maxLv={myPlant.plantProfile.maxNutrientLevel}
                                minLv={myPlant.plantProfile.minNutirentLevel}></SatusBar>
                        </div>
                    </div>
                    <div className='flex flex-row gap-2  pt-5'>
                        <button className='bg-lime-500 text-white p-2 rounded-md border-lime-600 border-r-0 border-b-4  drop-shadow-md hover:bg-lime-600 hover:border-lime-700' type='button' onClick={() => setModalVisible(true)}>Reseed</button>
                        <button className='bg-cyan-500 text-white p-2 rounded-md border-cyan-600 border-r-0 border-b-4  drop-shadow-md hover:bg-cyan-600 hover:border-cyan-700' type='button' onClick={addWater}>Watering</button>
                        <button className='bg-yellow-700 text-white p-2 rounded-md border-yellow-800 border-r-0 border-b-4  drop-shadow-md hover:bg-yellow-800 hover:border-yellow-900' type='button' onClick={addFertilize}>Add Fertilize</button>
                    </div>
                    <div className='flex w-full flex-row items-end align-baseline justify-end p-2'>
                        <button type='button' onClick={() => setShowStats(!showStats)} className='text-slate-400 text-[12px]' >Stats</button>
                    </div>

                    {showStats ? <div className='flex flex-row flex-wrap text-[10px] gap-1 text-slate-400'>
                        <p>health: {myPlant.stats.health}</p>
                        <p>water: {myPlant.stats.waterLevel}</p>
                        <p>nutrients: {myPlant.stats.soildNutrients}</p>
                        <p>stage: {myPlant.currentStage}</p>
                        <p>happiness: {happyness}</p>
                        <p>exp: {myPlant.exp}</p>
                        <p>planted on: {myPlant.plantedDate.toString()}</p>
                    </div> : <></>}

                </div>

            </div>
            <DialogModal visible={modalVisible} 
            callback={modalCloseHandler} 
            onClose={()=>setModalVisible(false)}/>
        </>
    )
}