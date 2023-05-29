import './App.css';
import { useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import HomeComponent from './Home'
import { WS_URL, generateUniqueId } from './ws-common'
import { useNavigate } from "react-router-dom"
import { BrowserRouter as Router } from 'react-router-dom';
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import RoomComponent from './Room';

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [isGameStared, setIsGameStared] = useState(null)
  const [userList, setUserList] = useState([])
  const clientId = localStorage.getItem("clientId") || generateUniqueId(8)
  localStorage.setItem("clientId", clientId)
  const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL + "?clientId=" + clientId,
    {
      reconnectAttempts: 10,
      reconnectInterval: 2000,
      shouldReconnect: () => true,
      onOpen: () => {
        console.log('WebSocket connection established.');
      },
      onClose: () => {
        console.log('WebSocket connection closed.');
      },
      onMessage: (event) => {
        const data = JSON.parse(event.data)
        const eventName = data.eventName
        console.log(data)
        if (eventName === "GAME_STARTED") {
          const roomId = data.roomId
          console.log(roomId)
          setUserList([data.user])
          navigate("/" + roomId)
        } else if (eventName === "USER_LIST") {
          setUserList(data.userList)
        } else if (eventName === "ALREADY_IN_ROOM") {
          setUserList(data.userList)
        }
      }
    });
  const onStartGame = (user) => {
    localStorage.setItem("user", user)
    sendMessage(JSON.stringify({
      eventName: "START_GAME",
      user: user
    }))
    setUser(user)
  }
  const onJoinRoom = (user, roomId) => {
    localStorage.setItem("user", user)
    console.warn(user, roomId)
    sendMessage(JSON.stringify({
      eventName: "JOIN_ROOM",
      user: user,
      roomId: roomId
    }))
    setUser(user)
  }
  return (
    <div className="App">
      <Routes>
        <Route exact path="/"
          element={<HomeComponent onStartGame={onStartGame}
            user={user} />} />
        <Route exact path="/:roomId"
          element={<RoomComponent user={user}
            userList={userList}
            onJoinRoom={onJoinRoom}
          />} />
      </Routes>
    </div>
  );
}
export default App;
