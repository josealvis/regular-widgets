
'use client'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useState, useEffect, useCallback } from 'react'
import { StatusBar } from './components/StatusBar';
import { DialogModal } from './components/DialogModal';
import { plant, profile } from './types';
import { getProfile } from './plantsProfiles';
import { plantTypes } from './consts';

const ASSET_PREFIX = process.env.NODE_ENV === 'production' ? "/regular-widgets/" : "";


export default function Page() {

    const [plantProfile, setPlatProfile] = useState<profile>(getProfile(plantTypes.TOMAT))
    const [myPlant, setMyplant, cleanStorage] = useLocalStorage<plant>('myPlant', plantProfile.seed);
    const [showStats, setShowStats] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const happyness = Math.round((myPlant.stats.health / plantProfile.maxHealth) * 3);
    const saturationLevel = ['saturate-0', 'saturate-50', 'saturate-100', 'saturate-150'];
    const sprites = `${ASSET_PREFIX}/assets/plants_sprites/growing_plants/${plantProfile.plantType}/${plantProfile.plantType}_${myPlant?.currentStage}.png`


    const handlerPlantLife = useCallback(() => {
        validateExp();
        depleStats();
        depleHelathValidation();

        function depleHelathValidation() {
            if (myPlant.stats.waterLevel < plantProfile.minWaterLevel
                || myPlant.stats.waterLevel > plantProfile.maxWaterLevel
                || myPlant.stats.soildNutrients < plantProfile.minNutirentLevel
                || myPlant.stats.soildNutrients > plantProfile.maxNutrientLevel
            ) {
                setMyplant((prevVal) => {
                    let copy = { ...prevVal }
                    copy.stats.health = copy.stats.health > 0 ? copy.stats.health - plantProfile.helthDepleteRate : 0;
                    return copy;
                });
            } else {
                if (myPlant.stats.health > 0) {
                    setMyplant((prevVal) => {
                        let copy = { ...prevVal }
                        copy.stats.health = copy.stats.health < plantProfile.maxHealth ? copy.stats.health + plantProfile.helthDepleteRate : plantProfile.maxHealth;
                        return copy;
                    });
                }
            }

        }

        function depleStats() {
            setMyplant((prevVal) => {
                let copy = { ...prevVal }
                copy.stats.waterLevel = copy.stats.waterLevel > 0 ? copy.stats.waterLevel - plantProfile.waterDepleteRate : 0;
                copy.stats.soildNutrients = copy.stats.soildNutrients > 0 ? copy.stats.soildNutrients - plantProfile.nutrientDepleteRate : 0;
                copy.stats.lastUpdate = new Date();
                return copy;
            });

        }

        function validateExp() {
            if (myPlant.exp >= 100) {
                setMyplant((prevVal) => {
                    let copy = { ...prevVal }
                    copy.currentStage = copy.currentStage < plantProfile.totalStages ? copy.currentStage + 1 : copy.currentStage;
                    copy.exp = copy.currentStage < plantProfile.totalStages ? 0 : 100;
                    console.log(copy.exp)
                    return copy;
                });

            }
            if (myPlant.stats.health === plantProfile.maxHealth) {
                setMyplant((prevVal) => {
                    let copy = { ...prevVal }
                    copy.exp = copy.exp + plantProfile.expRatePerMin;
                    console.log(copy.exp)
                    return copy;
                });
            }

        }
    }, [myPlant, setMyplant, plantProfile]);

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


    function modalHandler(plantType: plantTypes) {
        let newProfile = getProfile(plantType)
        console.log("new profile: ", newProfile)
        setPlatProfile(newProfile)
        cleanStorage();
        setMyplant(newProfile.seed);
        setModalVisible(false)
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
            <div className=" flex   items-center h-screen justify-center ">
                <div className=" flex  pl-20 pr-20 pt-10 pb-10 flex-col">
                    <div className='flex flex-row'>
                        <div className='flex-1 p-5 s pl-10 pr-10 '>
                            <img className={`${happyness >= 2 ? 'plantLive' : ''} ${happyness < 2 && happyness > 0 ? 'plantDying' : ''} object-cover h-24 ${saturationLevel[happyness]}`} src={sprites} alt="Girl in a jacket"></img>
                        </div>
                        <div className='flex flex-row bg-red'> <StatusBar
                            statName="W"
                            color="bg-cyan-500"
                            currentLv={myPlant.stats.waterLevel}
                            topLv={plantProfile.topWaterLevel}
                            maxLv={plantProfile.maxWaterLevel}
                            minLv={plantProfile.minWaterLevel} ></StatusBar>
                            <StatusBar
                                statName="F"
                                color="bg-yellow-700"
                                currentLv={myPlant.stats.soildNutrients}
                                topLv={plantProfile.topNutrientLevel}
                                maxLv={plantProfile.maxNutrientLevel}
                                minLv={plantProfile.minNutirentLevel}></StatusBar>
                        </div>
                    </div>
                    <div className='flex flex-row gap-2  pt-5 align-middle items-center justify-center'>
                        <button className='bg-lime-500 text-white text-sm p-2 rounded-md border-lime-600 border-r-0 border-b-4  drop-shadow-md hover:bg-lime-600 hover:border-lime-700' type='button' onClick={() => setModalVisible(true)}>Reseed</button>
                        <button className='bg-cyan-500 text-white text-sm  p-2 rounded-md border-cyan-600 border-r-0 border-b-4  drop-shadow-md hover:bg-cyan-600 hover:border-cyan-700' type='button' onClick={addWater}>Watering</button>
                        <button className='bg-yellow-700 text-white text-sm  p-2 rounded-md border-yellow-800 border-r-0 border-b-4  drop-shadow-md hover:bg-yellow-800 hover:border-yellow-900' type='button' onClick={addFertilize}>Add Fertilize</button>
                    </div>
                    <div className='flex w-full flex-row items-end align-baseline justify-end p-2'>
                        <button type='button' onClick={() => setShowStats(!showStats)} className='text-slate-400 text-[12px]' >Stats</button>
                    </div>

                    {showStats ? <div className='flex flex-row flex-wrap text-[10px] gap-1 text-slate-400 max-w-80'>
                        <p>plant type: {myPlant.type}</p>
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
                callback={modalHandler}
                onClose={() => setModalVisible(false)} />
        </>
    )
}