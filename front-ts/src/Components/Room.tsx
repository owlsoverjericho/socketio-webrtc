import TextChatUI from "./TextChatUI";
import VideoChatUI from "./VideoChatUI";

const Room = () => {
  return (
    <div className="flex flex-rows-2 w-screen h-screen">
          <VideoChatUI />
          <TextChatUI />
        </div>
  );
};

export default Room;
