import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://aptoschatserver.onrender.com'); // Change this to your deployed server URL

const VideoCalling: React.FC = () => {
  const [roomId, setRoomId] = useState('');
  const [isInRoom, setIsInRoom] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStream = useRef<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      localStream.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    });

    socket.on('roomCreated', (roomId: string) => {
      setRoomId(roomId);
      setIsInRoom(true);
    });

    socket.on('roomJoined', (roomId: string) => {
      setRoomId(roomId);
      setIsInRoom(true);
    });

    socket.on('ready', startCall);

    socket.on('offer', async (offer: RTCSessionDescriptionInit) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.emit('answer', roomId, answer);
      } 
    });

    socket.on('answer', (answer: RTCSessionDescriptionInit) => {
      peerConnection.current?.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', (candidate: RTCIceCandidateInit) => {
      if (peerConnection.current) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on('error', (message: string) => {
      alert(message);
      setIsInRoom(false);
    });

    return () => {
      socket.off('roomCreated');
      socket.off('roomJoined');
      socket.off('ready');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('error');
      localStream.current?.getTracks().forEach(track => track.stop());
    };
  }, [roomId]);

  const createRoom = () => {
    socket.emit('createRoom');
  };

  const joinRoom = () => {
    if (roomId.trim() !== '') {
      socket.emit('joinRoom', roomId);
    }
  };

  const startCall = async () => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'turn:yourturnserver.com', username: 'username', credential: 'password' } // Add your TURN server details
      ]
    });

    peerConnection.current.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('ice-candidate', roomId, event.candidate);
      }
    };

    peerConnection.current.ontrack = event => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    if (localStream.current) {
      localStream.current?.getTracks().forEach(track => {
        peerConnection.current?.addTrack(track, localStream.current!);
      });

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit('offer', roomId, offer);
    }
  };

  const toggleCamera = () => {
    localStream.current?.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
      setIsCameraOn(track.enabled);
    });
  };

  const toggleMic = () => {
    localStream.current?.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
      setIsMicOn(track.enabled);
    });
  };

  const endCall = () => {
    peerConnection.current?.close();
    peerConnection.current = null;
    setIsInRoom(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 space-y-4 text-white">
      {!isInRoom ? (
        <div className="flex flex-col items-center space-y-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={createRoom}
          >
            Create Room
          </button>
          <div className="flex flex-col items-center">
            <input
              type="text"
              className="px-2 py-2 border rounded bg-gray-800 text-white"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
            />
            <button
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={joinRoom}
            >
              Join Room
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
            <video ref={localVideoRef} autoPlay playsInline muted className="rounded shadow-lg w-1/2" />
            <video ref={remoteVideoRef} autoPlay playsInline className="rounded shadow-lg w-1/2" />
          </div>
          <p>Room ID: {roomId}</p>
          <div className="flex space-x-4">
            <button onClick={toggleCamera} className={`px-4 py-2 rounded ${isCameraOn ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'} transition`}>
              {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
            </button>
            <button onClick={toggleMic} className={`px-4 py-2 rounded ${isMicOn ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'} transition`}>
              {isMicOn ? 'Turn Off Mic' : 'Turn On Mic'}
            </button>
            <button onClick={endCall} className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition">
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCalling;
