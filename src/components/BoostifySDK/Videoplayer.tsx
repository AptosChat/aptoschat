import React, { useEffect, useRef, useState } from "react";
import { IconButton } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import { useNavigate } from "react-router-dom";
// import { Navigate } from "react-router-dom";
// useNavigate

interface VideoPlayerProps {
    stream?: MediaStream | null;
    isLocal?: boolean;
    onEndCall?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ stream, isLocal = false, onEndCall }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const navigate=useNavigate();
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    const toggleMic = () => {
        if (stream) {
            stream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
            setIsMicOn(prev => !prev);
        }
    };

    const toggleCamera = () => {
        if (stream) {
            stream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
            setIsCameraOn(prev => !prev);
        }
    };

    return (
        <div className="relative w-full h-full">
            <video ref={videoRef} autoPlay muted={!isLocal || !isMicOn} className="rounded shadow-lg w-full h-full object-cover" />
            {isLocal && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    <IconButton onClick={toggleMic} color="primary">
                        {isMicOn ? <MicIcon /> : <MicOffIcon />}
                    </IconButton>
                    <IconButton onClick={toggleCamera} color="primary">
                        {isCameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
                    </IconButton>
                    {(
                        <IconButton onClick={()=>{
                            console.log();
                            
                            navigate("/")}} color="secondary">
                            <CallEndIcon />
                        </IconButton>
                    )}
                </div>
            )}
        </div>
    );
};
