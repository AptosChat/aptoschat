import React, { useContext } from "react";
import RoomContext from "../context/RoomContext";

// Navigate
//@ts-ignore
export const Join: React.FC = ({roomId}) => {
    const context = useContext(RoomContext);


    if (!context) {
        return null;
    }

    const createRoom = () => {
        context.ws?.emit("create-room");
    };

   

    return (
        <div className="app">
            <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={createRoom}>
                Create Room
            </button>
        </div>
    );
};
