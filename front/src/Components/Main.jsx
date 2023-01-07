import { useNavigate } from "react-router-dom";
import { v4, validate } from "uuid";
import { useState, useEffect } from "react";
import socket from "../Socket";
import ACTIONS from "../Socket/actions";

const Main = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    socket.on(ACTIONS.SHARE_ROOMS, ({rooms} = {}) => {
      setRooms(rooms);
    })
    socket.on("full", data => {
      console.log(data)
    })
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 justify-items-center content-center">
      <div>
        <button className="btn" onClick={() => navigate(`room/${v4()}`)}>
          Create a room
        </button>
      </div>
      <div>
        <ul>
            {
              rooms.map(roomID => (
                <li className="p-2" key={roomID}>{roomID} <button className="btn" onClick={()=>navigate(`room/${roomID}`)}>JOIN ROOM</button></li>
              ))
            }
        </ul>
      </div>
    </div>
  );
};

export default Main;
