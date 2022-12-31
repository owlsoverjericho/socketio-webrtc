import { useRef, useEffect, useCallback } from "react";
import useStateWithCallback from "./useStateWithCallback";
import socket from "../Socket";
import ACTIONS from "../Socket/actions";

export const LOCAL_VIDEO = "LOCAL_VIDEO";

const useWebRTC = (roomID) => {
    const [clients, updateClients] = useStateWithCallback([]);
    const peerConnection = useRef({});
    const localMediaStream = useRef(null);
    const peerMediaElements = useRef({});

    const addNewClient = useCallback((newClient, cb) => {
        if (!clients.includes(newClient)) {
            updateClients(list => [...list, newClient], cb);
        }
    }, [clients, updateClients]);

    const mediaConfig = {
        video: {
            width: 1280,
            height: 720,
        },
        audio: true,
      };

    useEffect(() => {
        async function startCapture() {
            localMediaStream.current = await navigator.mediaDevices.getUserMedia(mediaConfig);
            addNewClient(LOCAL_VIDEO, () => {
                const localVideoElement = peerMediaElements.current[LOCAL_VIDEO];
                if (localVideoElement) {
                    localVideoElement.volume = 0;
                    localVideoElement.srcObject = localMediaStream.current;
                }
            });
        }
        startCapture()
        .then(() => socket.emit(ACTIONS.JOIN, {room: roomID}))
        .catch(e => console.error(`Error while getting user media`, e));
    }, [roomID])

    const provideMediaRef = useCallback((id, node) => {
        peerMediaElements.current[id] = node;
    }, []) 

    return { clients, provideMediaRef };
};

export default useWebRTC;