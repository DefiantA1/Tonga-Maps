import { Dispatch, SetStateAction, useEffect, useState } from "react";


type MarkerTypeRadioProps = {
    markerType: string,
    setMarkerType: Dispatch<SetStateAction<string>>
}

export function MarkerTypeRadio({markerType, setMarkerType} : MarkerTypeRadioProps){
    const markerTypes = ["Shop", "Bus Stop", "Pot Hole", "ATM", "Tsunami Evacuation"];

    useEffect(() => {
        setMarkerType("Shop");
    }, [])
    
    return (
        <div>
            <p className="text-gray-600">Marker Type</p>
            <div className="flex flex-row items-center">
                {
                    markerTypes.map((m,i) => (
                        <Btn 
                            key={m} 
                            title={m} 
                            isFirst={i == 0} 
                            isLast={i == (markerTypes.length - 1)} 
                            isActive={m == markerType}
                            onClick={() => setMarkerType(m)}
                        />
                    ))
                }
            </div>
        </div>
    );
}


type BtnProps = {
    title: string,
    isFirst?: boolean,
    isLast?: boolean,
    isActive: boolean,
    onClick: () => void
}

function Btn({title, isFirst, isLast, isActive, onClick} : BtnProps){
    return (
        <div 
            className={`flex flex-row items-center justify-center h-18 cursor-pointer ${isActive ? 'bg-green-500 text-white font-bold' : 'border border-gray-400 text-gray-600'} p-2 flex-1 text-center mb-3 ${isFirst ? 'rounded-l-xl' : ''} ${isLast ? 'rounded-r-xl' : ''}`}
            onClick={onClick}
        >
            <p className=''>{title}</p>
        </div>
    );
}