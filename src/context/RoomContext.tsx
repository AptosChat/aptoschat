import React, { createContext, ReactNode, FC, useEffect, useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';
import Peer from "peerjs";
import { peersReducer, PeerState, PeerAction } from "./peerReducer";
import { addPeerStreamAction, removePeerStreamAction } from "./peerActions";

const wsUrl = "http://localhost:3001";

interface RoomContextType {
    ws: Socket | null;
    me: Peer | null;
    stream: MediaStream | null;
    peers: PeerState;
    joinRoom: (roomId: string) => void;
}

const RoomContext = createContext<RoomContextType | null>(null);

export const RoomProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const [ws, setWs] = useState<Socket | null>(null);
    const [me, setMe] = useState<Peer | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [peers, dispatch] = useReducer<React.Reducer<PeerState, PeerAction>>(peersReducer, {});

    useEffect(() => {
        const socket = io(wsUrl);
        setWs(socket);

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const meId = uuidv4();
        const peer = new Peer(meId);
        
        peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
            setMe(peer);
            
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    setStream(stream);
                })
                .catch((error) => {
                    console.error("Error accessing media devices.", error);
                });

            if (ws) {
                ws.on("room-created", ({ roomId }) => navigate(`/room/${roomId}`));
                ws.on("get-users", ({ participants }) => console.log(participants));
                ws.on("user-disconnected", (peerId: string) => {
                    console.log("left", peerId);
                    dispatch(removePeerStreamAction(peerId));
                });
            }
        });

        return () => {
            if (ws) {
                ws.off("room-created");
                ws.off("get-users");
            }
        };
    }, [ws]);

    useEffect(() => {
        if (!me || !stream) return;

        const handleUserJoined = ({ peerId }: { peerId: string }) => {
            console.log(peerId, 'peer joined');
            const call = me.call(peerId, stream);
            call.on("stream", (peerStream) => {
                console.log(peerId, 'stream received');
                dispatch(addPeerStreamAction(peerId, peerStream));
            });
        };

        if (ws) {
            ws.on("user-joined", handleUserJoined);
        }

        me.on("call", (call) => {
            call.answer(stream);
            call.on("stream", (peerStream) => {
                console.log(call.peer, 'call answered');
                dispatch(addPeerStreamAction(call.peer, peerStream));
            });
        });

        return () => {
            if (ws) {
                ws.off("user-joined", handleUserJoined);
            }
        };
    }, [me, stream, ws]);

    const joinRoom = (roomId: string) => {
        if (ws) {
            ws.emit("join-room", { roomId, peerId: me?.id });
        }
    };

    return (
        <RoomContext.Provider value={{ ws, me, stream, peers, joinRoom }}>
            {children}
        </RoomContext.Provider>
    );
};

export default RoomContext;
