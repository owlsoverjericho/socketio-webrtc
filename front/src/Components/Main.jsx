import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { useRef } from "react";

const Main = () => {
  const navigate = useNavigate();
  const roomInputRef = useRef();

  const uuidValidator =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

  const validateRoom = (roomID) => {
    if (uuidValidator.test(roomID)) {
      navigate(`/room/${roomID}`);
    } else {
      return <div>Hello wrong</div>;
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 justify-items-center content-center">
      <div>
        <button className="btn" onClick={() => navigate(`/room/${v4()}`)}>
          Create a room
        </button>
      </div>
      <div>
        <input
          className="input mr-4"
          ref={roomInputRef}
          type="text"
          placeholder="enter a room number here"
        />
        <button
          className="btn mx-auto"
          onClick={() => validateRoom(roomInputRef.current.value)}
        >
          Join a room
        </button>
      </div>
    </div>
  );
};

export default Main;
