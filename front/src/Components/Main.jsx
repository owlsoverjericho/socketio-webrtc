import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { useRef } from "react";

const Main = () => {
  const navigate = useNavigate();
  const roomInputRef = useRef("");

  return (
    <>
      <div>Main</div>
      <div className="container">
        <button
          onClick={() => navigate(`/room/${v4()}`)}
          className="btn"
        >
          Create a room
        </button>
      </div>
      <div className="container">
        <input ref={roomInputRef} className="input input-primary" type="text" placeholder="enter a room number here" />
        <button
          onClick={() => navigate(`/room/${roomInputRef.current.value}`)}
          className="btn"
        >
          Join a room
        </button>
      </div>
    </>
  );
};

export default Main;
