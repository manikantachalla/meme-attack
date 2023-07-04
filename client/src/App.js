import './App.css';
import { useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import HomeComponent from './Home';
import { WS_URL, generateUniqueId } from './ws-common';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import RoomComponent from './Room';

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(localStorage.getItem('user'));
  const [isGameStared, setIsGameStared] = useState(null);
  const [userList, setUserList] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [isJudge, setIsJudge] = useState(false);
  const [startRound, setStartRound] = useState(false);
  const [caption, setCaption] = useState('');
  const [gifUrls, setGifUrls] = useState([]);
  const [announcingWinner, setAnnouncingWinner] = useState(false);
  const [winnerUser, setWinnerUser] = useState('');
  const [winningGif, setWinningGif] = useState('');
  const [captionOptions, setCaptionOptions] = useState([]);
  const [numberOfRounds, setNumberOfRounds] = useState(1);
  const [remainingRounds, setRemainingRounds] = useState(1);
  const clientId = localStorage.getItem('clientId') || generateUniqueId(8);
  localStorage.setItem('clientId', clientId);
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    WS_URL + '?clientId=' + clientId,
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
        const data = JSON.parse(event.data);
        const eventName = data.eventName;
        console.log(data);
        if (eventName === 'GAME_STARTED') {
          console.log(data, 'data when game_started');
          const roomId = data.roomId;
          const isHost = data.isHost;
          setIsHost(isHost);
          console.log(roomId, isHost);
          setUserList([data.user]);
          setNumberOfRounds(data.numberOfRounds);
          navigate('/' + roomId);
        } else if (eventName === 'USER_LIST') {
          setUserList(data.userList);
          setNumberOfRounds(data.numberOfRounds);
        } else if (eventName === 'ALREADY_IN_ROOM') {
          setUserList(data.userList);
        } else if (eventName === 'JUDGE_SELECTED') {
          console.log('rounddd starttted', data);
          setStartRound(true);
          if (data?.isJudge) setIsJudge(true);
          else setIsJudge(false);
          setGifUrls(data?.gifList);
          setCaptionOptions(data?.roundCaptionOptions);
          setCaption('');
          setAnnouncingWinner(false);
          setWinnerUser(data?.winnerUser);
          setWinningGif(data?.winningGif);
        } else if (eventName === 'CAPTION_SELECTED') {
          console.log('hello', data?.captionValue);
          setCaption(data?.captionValue + '');
        } else if (eventName === 'GIFS_LIST_SELECTED') {
          console.log('gifs list', data?.gifList);
          setGifUrls(data?.gifList);
        } else if (eventName === 'ROUND_ENDED') {
          console.log('winner details', data?.winnerUser, data?.winningGif);
          setAnnouncingWinner(false);
          setWinnerUser(data?.winnerUser);
          setWinningGif(data?.winningGif);
          setRemainingRounds(data?.remainingRounds);
          setStartRound(false);
        }
      }
    }
  );
  const onStartGame = (user, numberOfRounds) => {
    localStorage.setItem('user', user);
    localStorage.setItem('numberOfrounds', numberOfRounds);
    sendMessage(
      JSON.stringify({
        eventName: 'START_GAME',
        user: user,
        numberOfRounds: numberOfRounds
      })
    );
    setUser(user);
  };
  const onJoinRoom = (user, roomId) => {
    localStorage.setItem('user', user);
    console.warn(user, roomId);
    sendMessage(
      JSON.stringify({
        eventName: 'JOIN_ROOM',
        user: user,
        roomId: roomId
      })
    );
    setUser(user);
  };
  const onStartRound = (user, roomId) => {
    // localStorage.setItem('user', user);
    console.warn('starting the round');
    console.warn('selecting the judge');
    console.log(user, roomId, 'starting the round console');
    sendMessage(
      JSON.stringify({
        eventName: 'SELECT_JUDGE',
        user: user,
        roomId: roomId
      })
    );
  };

  const handleTagSelection = (user, roomId, selectedTag) => {
    console.log(selectedTag);
    sendMessage(
      JSON.stringify({
        eventName: 'SELECTED_CAPTION',
        user: user,
        roomId: roomId,
        captionValue: selectedTag
      })
    );
  };

  const handleGifSelection = (user, roomId, selectedGif) => {
    console.log(selectedGif);
    sendMessage(
      JSON.stringify({
        eventName: 'SELECTED_GIF',
        user: user,
        roomId: roomId,
        selectedGif: selectedGif
      })
    );
  };

  const handleGifJudgement = (user, roomId, selectedGif) => {
    console.log(selectedGif);
    setAnnouncingWinner(true);
    sendMessage(
      JSON.stringify({
        eventName: 'JUDGED_GIF',
        user: user,
        roomId: roomId,
        judgedGif: selectedGif
      })
    );
  };

  return (
    <div className='App'>
      <Routes>
        <Route
          exact
          path='/'
          element={<HomeComponent onStartGame={onStartGame} user={user} />}
        />
        <Route
          exact
          path='/:roomId'
          element={
            <RoomComponent
              isHost={isHost}
              isJudge={isJudge}
              startRound={startRound}
              user={user}
              userList={userList}
              caption={caption}
              onJoinRoom={onJoinRoom}
              onStartRound={onStartRound}
              handleTagSelection={handleTagSelection}
              handleGifSelection={handleGifSelection}
              handleGifJudgement={handleGifJudgement}
              captionOptions={captionOptions}
              gifUrls={gifUrls}
              announcingWinner={announcingWinner}
              winnerUser={winnerUser}
              winningGif={winningGif}
              numberOfRounds={numberOfRounds}
              remainingRounds={remainingRounds}
            />
          }
        />
      </Routes>
    </div>
  );
}
export default App;
