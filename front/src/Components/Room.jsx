import { useParams } from "react-router-dom";
import TextChatUI from "../Components/TextChatUI";
import VideoChatUI from "./VideoChatUI";

const Room = () => {
  return (
    <>
    <div className="container flex h-screen">
        <VideoChatUI />
        <TextChatUI />
    </div>
    </>
  );
};

export default Room;
