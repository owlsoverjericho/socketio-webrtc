import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { useState, useEffect } from "react";
import socket from "../Socket";
import ACTIONS from "../Socket/actions";

const Main = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [roomStatus, setRoomStatus] = useState()

  useEffect(() => {
    socket.on(ACTIONS.SHARE_ROOMS, ({rooms} = {}) => {
      setRooms(rooms);
    })
    socket.on("full", data => {
      console.log(data)
    })
  }, []);

  return (
    <div className="grid grid-rows-2 gap-4 justify-items-center content-center">
      <div className="grid w-full justify-items-center content-center">
        <h1>Сервіс для відеоконференцій в реальному часі</h1>
        <p>Ви можете створити власну кімнату, натиснувши на "CREATE ROOM"</p>
        <p>Або приєднастись до кімнати, створеної іншим користувачем, якщо такі є, натиснувши "JOIN ROOM"</p>
      </div>
      <div className="grid grid-cols-2 justify-items-center content-center h-20">
      <div>
        <button className="btn" onClick={() => navigate(`room/${v4()}`)}>
          CREATE ROOM
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
    </div>
  );
};

export default Main;
