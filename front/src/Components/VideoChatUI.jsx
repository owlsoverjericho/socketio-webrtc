import { useEffect, useRef } from "react";
import socket from "../Socket/";
import { useNavigate, useParams } from "react-router-dom";

const VideoChatUI = () => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const isCaller = useRef(false);
  const peerConnection = useRef();
  const { roomID } = useParams();
  const networkConfig = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };
  const mediaConfig = { video: true, audio: false };
  const stream = useRef();
  const remoteStream = useRef();
  const offer = useRef();
  const answer = useRef();

  const navigate = useNavigate();


  const onAddStream = (event) => {
    remoteVideoRef.current.srcObject = event.streams[0];
    remoteStream.current = event.streams[0];
  }

  const onIceCandidate = (event) => {
    if(event.candidate) {
      console.log(`sending an ICE candidate ${event.candidate}`);
      socket.emit("candidate", { 
        type: "candidate",
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
        roomID: roomID,
       })
    }
  }


  useEffect(() => async () => {
    socket.on("created", async () => {
      console.log(`Event created was triggered`);
      try {
        stream.current = await navigator.mediaDevices.getUserMedia(mediaConfig);
        localVideoRef.current.srcObject = stream.current;
        isCaller.current = true;
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("joined", async () => {
      console.log(`Event joined was triggered`);
      try {
        stream.current = await navigator.mediaDevices.getUserMedia(mediaConfig);
        localVideoRef.current.srcObject = stream.current;
        socket.emit("ready", { roomID: roomID });
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("ready", async () => {
      console.log(`Event ready was triggered`);
      if (isCaller.current) {
        try {
          peerConnection.current = new RTCPeerConnection(networkConfig);
          peerConnection.current.onicecandidate = onIceCandidate;
          peerConnection.current.ontrack = onAddStream;
          stream.current.getTracks().forEach(track => {
            peerConnection.current.addTrack(track, stream.current)
          })

          offer.current = await peerConnection.current.createOffer();
          peerConnection.current.setLocalDescription(offer.current);
          socket.emit("offer", {
            type: "offer",
            sdp: offer.current,
            roomID: roomID,
          });
        } catch (error) {
          console.error(error);
        }
      }
    });



    socket.on("offer", async (event) => {
      console.log(`Event offer was triggered`);
      if (!isCaller.current) {
        try {
          peerConnection.current = new RTCPeerConnection(networkConfig);
          peerConnection.current.onicecandidate = onIceCandidate;
          peerConnection.current.ontrack = onAddStream;
          stream.current.getTracks().forEach(track => {
            peerConnection.current.addTrack(track, stream.current)
          })
          
          peerConnection.current.setRemoteDescription(new RTCSessionDescription(event));
          answer.current = await peerConnection.current.createAnswer();
          peerConnection.current.setLocalDescription(answer.current);
          socket.emit("answer", {
            type: "answer",
            sdp: answer.current,
            roomID: roomID,
          });
        } catch (error) {
          console.error(error);
        }
      }
    });




    socket.on("answer", (event) => {
      console.log(`Event answer was triggered`);
      peerConnection.current.setRemoteDescription(new RTCSessionDescription(event));
    })


    socket.on("candidate", (event) => {
      console.log(`Event candidate was triggered`);
      const candidate = new RTCIceCandidate({
        sdpMLineIndex: event.label,
        candidate: event.candidate
      })
      peerConnection.current.addIceCandidate(candidate);
    })


    socket.on("full", () => {
      console.log("full room");
      navigate("/");
    });
  });

  return (
    <>
      <div className="grid w-3/5">
        <video
          ref={localVideoRef}
          className="object-contain w-full h-full"
          autoPlay
        ></video>
        <video
          ref={remoteVideoRef}
          className="object-contain w-full h-full"
          autoPlay
        ></video>
      </div>
    </>
  );
};

export default VideoChatUI;
