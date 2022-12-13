import TextChatUI from "./TextChatUI";
import VideoChatUI from "./VideoChatUI";
import { useNavigate } from "react-router-dom";

const Room = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-rows-2 w-screen h-screen">
          <VideoChatUI />
          <TextChatUI />
        </div>
  );
};

export default Room;
