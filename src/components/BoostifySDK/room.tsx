import { useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import RoomContext from "../../context/RoomContext";
import { PeerState } from "../../context/peerReducer";
import { VideoGrid } from "./VideoGrid"; // Adjust the import path as needed

export const Room = () => {
    const { id } = useParams<{ id: string }>();
    //@ts-ignore
    const { ws, me, stream, peers } = useContext(RoomContext);

    useEffect(() => {
        if (me && ws) {
            const peerId = me.id;
            ws.emit('join-room', { roomId: id, peerId });

            return () => {
                ws.emit('leave-room', { roomId: id, peerId });
            };
        }
    }, [id, me, ws]);

    // const handleEndCall = () => {
    //     if (stream) {
    //         //@ts-ignore
    //         stream.getTracks().forEach(track => track.stop());
    //     }
    //     // Additional logic to handle ending the call can be added here
    // };

    return (
        <div className="min-h-screen bg-gray-900 p-4 text-white">
            <p>Room ID: {id}</p>
            <VideoGrid
                localStream={stream}
                remoteStreams={Object.entries(peers as PeerState).map(([_, peerData]) => peerData.stream)}
               
            />
        </div>
    );
};
