import { useState } from "react";
import { plantTypes } from "../consts"


type props = {
    visible: boolean,
    onClose: any,
    callback: (plantType: plantTypes) => void
}

export function DialogModal({ visible, onClose, callback }: props) {

    const plants =  Object.values(plantTypes);
    const [selectedType , setSelectedType] = useState<string>(plants[0]);

    function onOkHandler(){
        callback(selectedType as plantTypes);
    }

    if (!visible) return <></>

    return <div className='fixed inset-0 flex items-center justify-center'>
        <div className="bg-white rounded-lg p-6 h-1/2 w-1/2 bottom-5 relative shadow-md flex flex-col items-center justify-center">
            <span className='text-lg font-bold text-slate-900'>Are you sure?</span>
            <p className='text-sm p-2 text-center'>You will lose every progress.</p>

            <label className="text-sm font-bold" htmlFor="cars">Select seed:</label>

            <select className=" border-2 rounded-md pl-2 pr-2 m-2" name="cars" id="cars" onChange={(event)=>setSelectedType(event.target.value)} value={selectedType}>
                {plants.map(el =>  <option key={el} value={el}>{el}</option>)}          
            </select>


            <div className='flex flex-row gap-2 p-2'>
                <button className='bg-red-400 text-white p-2  min-w-24 rounded-md border-red-500 border-r-0 border-b-4  drop-shadow-md hover:bg-red-300 hover:border-red-400' type='button' onClick={onClose}>Cancel</button>
                <button className='bg-cyan-600 text-white p-2  min-w-24 rounded-md border-cyan-700 border-r-0 border-b-4  drop-shadow-md hover:bg-cyan-500 hover:border-cyan-600' type='button' onClick={onOkHandler}>Ok</button>
            </div>
        </div>
    </div>
}
