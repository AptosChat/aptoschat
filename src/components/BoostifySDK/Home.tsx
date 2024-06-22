import React, { useRef, useState, useContext } from "react";
import { Join } from "../JoinButton";
import RoomContext from "../../context/RoomContext";
import { useNavigate } from "react-router-dom";
// import RoomContext from "./RoomContext";
// RoomContext

export const Home = () => {
    const navigate=useNavigate();
    const context = useContext(RoomContext);
    const [roomId, setRoomId] = useState('');
    const [isInRoom, setIsInRoom] = useState(false);
   
    
    const localVideoRef = useRef<HTMLVideoElement>(null);
  
    const localStream = useRef<MediaStream | null>(null);


    const handleJoinRoom = async () => {
        if (context) {
            //@ts-ignore
            context.ws.emit("check-room-exists", roomId);
            
            //@ts-ignore
            context.ws.on("room-exists", async () => {
                context.joinRoom(roomId);
                setIsInRoom(true);
                navigate(`/room/${roomId}`);

                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    localStream.current = stream;
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = stream;
                    }
                } catch (error) {
                    console.error("Error accessing media devices.", error);
                }
            });
            //@ts-ignore
            context.ws.on("room-not-found", () => {
                alert("Room not found");
            });
        }
    };

   



    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 space-y-4 text-white">
            {!isInRoom ? (
                <div className="flex flex-col items-center space-y-4">
             
                    <Join  />
                    <div className="flex flex-col items-center">
                        <input
                            type="text"
                            className="px-2 py-2 border rounded bg-gray-800 text-white"
                            placeholder="Enter Room ID"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
                        />
                        <button
                            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            onClick={handleJoinRoom}
                        >
                            Join Room
                        </button>
                    </div>
                </div>
            ):(null) }
        </div>
    );
};
