import { useEffect, useRef } from "react";
import socket from "../Socket";
import { useNavigate, useParams } from "react-router-dom";
import ACTIONS from "../Socket/actions.mjs";

const VideoChatUI = () => {
  const localVideoRef = useRef<HTMLVideoElement>();
  const remoteVideoRef = useRef<HTMLVideoElement>();
  const isCaller = useRef(false);
  const peerConnection = useRef<RTCPeerConnection>();
  const { roomID } = useParams();
  const networkConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };
  const mediaConfig = {
    video: true,
    audio: false,
  };
  const stream = useRef<MediaStream>();
  const remoteStream = useRef<MediaStream>();
  const offer = useRef();
  const answer = useRef();

  const navigate = useNavigate();

  const onAddStream = (event) => {
    remoteVideoRef.current.srcObject = event.streams[0];
    remoteStream.current = event.streams[0];
  };

  const onIceCandidate = (event: RTCIceCandidate) => {
    if (event.candidate) {
      console.log(
        `sending an ICE candidate ${JSON.stringify(event.candidate)}`
      );
      socket.emit("candidate", {
        type: "candidate",
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
        roomID: roomID,
      });
    }
  };

  const getLocalStream = async () => {
    try {
      stream.current = await navigator.mediaDevices.getUserMedia(mediaConfig);
      if (localVideoRef.current !== undefined) localVideoRef.current.srcObject = stream.current;
    } catch (error) {
      console.error(error);
    }
  };

  const getPeerConnection = async () => {
    try {
      peerConnection.current = new RTCPeerConnection(networkConfig);
      peerConnection.current.onicecandidate = onIceCandidate;
      peerConnection.current.ontrack = onAddStream;
      if (stream.current !== undefined) {
        stream.current.getTracks().forEach((track) => {
          peerConnection.current.addTrack(track, stream.current);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const generateOffer = async () => {
    offer.current = await peerConnection.current.createOffer();
    peerConnection.current.setLocalDescription(offer.current);
    socket.emit("offer", {
      type: "offer",
      sdp: offer.current,
      roomID: roomID,
    });
  };

  const generateAnswer = async (event: RTCSessionDescription) => {
    if (peerConnection.current !== undefined) {
      peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(event)
        );
        answer.current = await peerConnection.current.createAnswer();
        peerConnection.current.setLocalDescription(answer.current);
        socket.emit("answer", {
          type: "answer",
          sdp: answer.current,
          roomID: roomID,
        });
    }
  };
  
  
  useEffect(() => async () => {
    socket.emit("connected", { roomID: roomID });

    socket.on("created", async () => {
      console.log(`Event created was triggered`);
      await getLocalStream();
      isCaller.current = true;
    });

    socket.on("joined", async () => {
      console.log(`Event joined was triggered`);
      await getLocalStream();
      socket.emit("ready", { roomID: roomID });
    });

    socket.on("ready", async () => {
      console.log(`Event ready was triggered`);
      if (isCaller.current) {
        await getPeerConnection();
        await generateOffer();
      }
    });

    socket.on("offer", async (event) => {
      console.log(`Event offer was triggered`);
      if (!isCaller.current) {
        await getPeerConnection();
        await generateAnswer(event);
      }
    });

    socket.on("answer", async (event) => {
      console.log(`Event answer was triggered`);
      if (peerConnection.current !== undefined) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(event)
        );
      }
    });

    socket.on("candidate", async (event) => {
      console.log(`Event candidate was triggered`);
      const candidate = new RTCIceCandidate({
        sdpMLineIndex: event.label,
        candidate: event.candidate,
      });
      if (peerConnection.current !== undefined) {
        await peerConnection.current.addIceCandidate(candidate);
      }
    });

    socket.on("full", () => {
      console.log("full room");
      navigate("/");
    });
  });

  return (
    <div className="flex flex-col w-full">
      <video className="aspect-square w-64 h-64" ref={localVideoRef} autoPlay playsInline></video>
      <video className="aspect-video" ref={remoteVideoRef} autoPlay playsInline></video>
    </div>
  );
};

export default VideoChatUI;
