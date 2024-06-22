import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VideoGrid } from "./VideoGrid";
import RoomContext from "../../context/RoomContext";

const Video: React.FC = () => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
    const { id } = useParams<{ id: string }>();
    //@ts-ignore
    const { ws, me, stream, peers } = useContext(RoomContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate setting up the local stream
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(stream => setLocalStream(stream))
            .catch(error => console.error("Error accessing media devices.", error));

        // Simulate receiving remote streams
        const remoteStream1 = new MediaStream();
        const remoteStream2 = new MediaStream();
        setRemoteStreams([remoteStream1, remoteStream2]);
    }, []);

    // const handleEndCall = () => {
    //     if (localStream) {
    //         console.log("localstream",localStream);
            
    //         localStream.getTracks().forEach(track => track.stop());
    //     }
    //     console.log("jjjjjjjjj");
        

    //     if (ws && me && id) {
    //         ws.emit("disconnect", { roomId: id, peerId: me.id });
    //     }

    //     setLocalStream(null);
    //     setRemoteStreams([]);
    //     navigate("/");
    // };

    return (
        <div className="min-h-screen bg-gray-900 p-4 text-white">
            <VideoGrid localStream={localStream} remoteStreams={remoteStreams}  />
        </div>
    );
};

export default Video;
