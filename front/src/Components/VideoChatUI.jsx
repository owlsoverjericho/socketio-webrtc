import { useEffect, useRef } from "react";
import socket from "../Socket/";
import { useNavigate } from "react-router-dom"; 


const VideoChatUI = () => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  
  const navigate = useNavigate();
  
  useEffect(() => async () => {
    socket.on("full", () => {
      console.log("full room")
      navigate("/")
    });
  });

  return (
    <>
      <div className="grid w-3/5">
            <video ref={localVideoRef} className="object-contain w-full h-full" autoPlay></video>
            <video ref={remoteVideoRef} className="object-contain w-full h-full" autoPlay></video>
      </div>
    </>
  );
};

export default VideoChatUI;
