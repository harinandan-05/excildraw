import { ReactNode } from "react";

export function IconBtn({icon , onClick}:{
    icon:ReactNode,
    onClick: () => void
}){
    return(
        <div className="pointer rounded-full border p-2 bg-black hover:bg-gray-400 text-white" onClick={onClick}>
            {icon}
        </div>
    )
}

