

type props = {
    minLv: number,
    maxLv: number,
    topLv: number, 
    currentLv:number, 
    statName: String, 
    color: string
}


export function StatusBar({ minLv, maxLv, topLv, currentLv, statName, color }: props) {

    let currentPercent = Math.round((currentLv / topLv) * 100);
    let minLvPercent = Math.round((minLv / topLv) * 100);
    let maxLvPercent = Math.round((maxLv / topLv) * 100);
    let barColor = color;
    let borderColer = "border-slate-200"


    if (currentPercent > maxLvPercent) {
        borderColer = "border-red-500"
    } else if (currentPercent < minLvPercent) {
        borderColer = "border-red-500"
    }


    return <div className='flex flex-1 h-full flex-col items-center text-slate-400'>
        <span className=' text-sm pl-7 pb-1'>{statName}</span>
        <div className='flex flex-row flex-1 h-full'>
            <div className='flex  text-xs flex-col-reverse  relative bottom-2'>
                <span style={{ height: minLvPercent }} >min{">"}</span>
                <span style={{ height: (maxLvPercent - minLvPercent) }}>max{">"}</span>
            </div>
            <div className={`h-full  w-5  rounded-lg  border-4 ${borderColer} flex items-end `}>
                <div style={{ height: currentPercent }} className={`flex-1 relative overflow-hidden  ${barColor}`}></div>
            </div>
        </div>
    </div>
}
