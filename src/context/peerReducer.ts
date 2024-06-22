import { ADD_PEER, REMOVE_PEER } from "./peerActions";

// Define the type for PeerState
export type PeerState = Record<string, { stream: MediaStream }>;

// Define the types for PeerAction
export type PeerAction =
    | {
          type: typeof ADD_PEER;
          payload: { peerId: string; stream: MediaStream };
      }
    | {
          type: typeof REMOVE_PEER;
          payload: { peerId: string };
      };

// Define the reducer function
export const peersReducer = (state: PeerState, action: PeerAction): PeerState => {
    switch (action.type) {
        case ADD_PEER:
            return {
                ...state,
                [action.payload.peerId]: {
                    stream: action.payload.stream,
                },
            };
        case REMOVE_PEER:
            const { [action.payload.peerId]: _, ...newState } = state;
            return newState;
        default:
            return state;
    }
};
