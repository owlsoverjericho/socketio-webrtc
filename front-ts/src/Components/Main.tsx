import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { useRef } from "react";

const Main = () => {
  const navigate = useNavigate();
  const roomInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="grid grid-cols-2 gap-4 justify-items-center content-center">
      <div>
        <button className="btn" onClick={() => navigate(`/room/${v4()}`)}>Create a room</button>
      </div>
      <div>
        <input
        className="input mr-4"
          ref={roomInputRef}
          type="text"
          placeholder="enter a room number here"
        />
        <button className="btn mx-auto" onClick={() => navigate(`/room/${roomInputRef.current.value}`)}>
          Join a room
        </button>
      </div>
    </div>
  );
};

export default Main;
