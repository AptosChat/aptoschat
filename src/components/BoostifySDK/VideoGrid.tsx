import React, { useState } from "react";
import { VideoPlayer } from "./Videoplayer";
import { Button } from "@mui/material";
import { CallEnd, Mic, MicOff, Videocam, VideocamOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface VideoGridProps {
    localStream: MediaStream | null;
    remoteStreams: MediaStream[];
}

export const VideoGrid: React.FC<VideoGridProps> = ({ localStream, remoteStreams }) => {
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const navigate = useNavigate();

    const toggleMic = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
            setIsMicOn(!isMicOn);
        }
    };

    const toggleCamera = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
            setIsCameraOn(!isCameraOn);
        }
    };

    const handleEndCall = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        navigate("/");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {localStream && (
                    <div className="relative bg-black w-full aspect-w-16 aspect-h-9">
                        <VideoPlayer stream={localStream} />
                    </div>
                )}
                {remoteStreams.map((stream, index) => (
                    <div className="relative bg-black w-full aspect-w-16 aspect-h-9" key={index}>
                        <VideoPlayer stream={stream} />
                    </div>
                ))}
            </div>
            <div className="flex space-x-4 mt-4">
                <Button onClick={toggleMic} variant="contained" color="primary" startIcon={isMicOn ? <Mic /> : <MicOff />}>
                    {isMicOn ? "Mute" : "Unmute"}
                </Button>
                <Button onClick={toggleCamera} variant="contained" color="primary" startIcon={isCameraOn ? <Videocam /> : <VideocamOff />}>
                    {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
                </Button>
                <Button onClick={handleEndCall} variant="contained" color="secondary" startIcon={<CallEnd />}>
                    End Call
                </Button>
            </div>
        </div>
    );
};
