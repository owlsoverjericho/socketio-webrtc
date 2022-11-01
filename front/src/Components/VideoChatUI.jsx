import { useEffect, useRef } from "react";



const VideoChatUI = () => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => async () => {
    let stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    localVideoRef.current.srcObject = stream;
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
