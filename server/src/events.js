const _ = require('lodash');
const { sentences } = require('./captions');

const roomUsersMap = {};

const roundCaptionIndexesMap = {};
const judges = {}; // Global variable to store the assigned judges
const roomClientIdMap = {};
const clientIdWsMap = {};
const storeClientIdWS = (clientId, ws) => {
  clientIdWsMap[clientId] = ws;
};
const processEvent = (clientId, ws, data) => {
  storeClientIdWS(clientId, ws);
  if (!data.eventName) {
    console.warn('Invalid message');
    return;
  }
  const eventName = data.eventName;
  //console.log(data);
  if (eventName === 'START_GAME') {
    startGame(clientId, data, undefined);
  } else if (eventName === 'JOIN_ROOM') {
    joinRoom(clientId, data);
  } else if (eventName === 'SELECT_JUDGE') {
    selectJudge(clientId, data);
  } else if (eventName === 'SELECTED_CAPTION') {
    selectedCaption(clientId, data);
  } else if (eventName === 'SELECTED_GIF') {
    selectedGif(clientId, data);
  } else if (eventName === 'JUDGED_GIF') {
    judgedGif(clientId, data);
  }
};

function generateRoomId(length) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let roomId = '';
  for (let i = 0; i < length; i++) {
    roomId += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  // console.log('New roomId ' + roomId);
  return roomId;
}

const startGame = (clientId, data, roomId, isHost) => {
  const user = data.user;
  const numberOfRounds = data.numberOfRounds;
  console.debug(numberOfRounds, 'number Of Rounds');
  roomId = roomId || generateRoomId(6);
  roomUsersMap[roomId] = [
    {
      user,
      isHost: true,
      clientId: clientId,
      numberOfRounds: numberOfRounds,
      remainingRounds: numberOfRounds
    }
  ];
  let isHostactual = true;
  roomClientIdMap[roomId] = [clientId];
  console.debug(roomClientIdMap[roomId], 'array');
  roomClientIdMap[roomId]?.length === 1
    ? isHostactual == true
    : isHostactual == isHost;
  sendMessage(clientId, {
    eventName: 'GAME_STARTED',
    roomId,
    user,
    isHost: isHostactual,
    numberOfRounds: numberOfRounds
  });
};

// Function to generate a random judgeClientId
const generateRandomJudgeClientId = (roomId) => {
  const allClientIds = roomClientIdMap[roomId];
  let judgeClientId = getRandomClientId(allClientIds);

  // Check if the generated judgeClientId is already assigned as a judge
  let isAlreadyAssigned = judges[roomId]?.includes(judgeClientId);

  // If the judgeClientId is already assigned, generate a new one
  while (isAlreadyAssigned) {
    judgeClientId = getRandomClientId(allClientIds);
    isAlreadyAssigned = judges[roomId]?.includes(judgeClientId);
  }

  // Initialize the judges array for the given roomId if it doesn't exist
  if (!judges[roomId]) {
    judges[roomId] = [];
  }

  judges[roomId].push(judgeClientId);

  // Reset the judges array for the given roomId when the number of judges becomes equal to the number of players
  if (judges[roomId].length === allClientIds.length) {
    judges[roomId] = [];
  }

  // Update the roomUsersMap with judge assignment
  roomUsersMap[roomId].forEach((user) => {
    user.isJudge = user.clientId === judgeClientId;
  });

  return judgeClientId;
};

// Function to get a random clientId from the available clientIds
const getRandomClientId = (clientIds) => {
  return clientIds[Math.floor(Math.random() * clientIds.length)];
};

const selectJudge = (clientId, data) => {
  //console.log('hello');
  const user = data.user;
  const roomId = data.roomId;
  const judgeClientId = generateRandomJudgeClientId(roomId);

  // console.log(judgeClientId, 'judgeclientid');

  const selectedCaptionsIndexes = [];
  const randomlySelectedCaptions = [];

  while (randomlySelectedCaptions.length < 3) {
    const randomNumber = Math.floor(Math.random() * 36) + 1;
    const randomCaption = sentences[randomNumber];

    if (
      !selectedCaptionsIndexes.includes(randomNumber) &&
      !randomlySelectedCaptions.includes(randomCaption) &&
      (roundCaptionIndexesMap[roomId] == undefined ||
        !roundCaptionIndexesMap[roomId].includes(randomNumber))
    ) {
      selectedCaptionsIndexes.push(randomNumber);
      randomlySelectedCaptions.push(randomCaption);

      if (roundCaptionIndexesMap[roomId] == undefined) {
        roundCaptionIndexesMap[roomId] = [randomNumber];
      } else {
        roundCaptionIndexesMap[roomId].push(randomNumber);
      }
    }
  }

  // _.filter()
  // roomUsersMap[roomId] = [{ user, isHost: true }];
  // roomClientIdMap[roomId] = [clientId];

  // console.log(roundCaptionIndexesMap, randomlySelectedCaptions);

  roomClientIdMap[roomId].forEach((c) => {
    sendMessage(c, {
      eventName: 'JUDGE_SELECTED',
      roomId,
      user,
      roundStarted: true,
      isJudge: c === judgeClientId ? true : false,
      captionValue: '',
      winnerUser: '',
      winningGif: '',
      roundCaptionOptions: randomlySelectedCaptions,
      gifList: null
    });
  });
};

const selectedCaption = (clientId, data) => {
  // console.log('selected Caption', data);
  const user = data.user;
  const roomId = data.roomId;
  const captionValue = data.captionValue;
  roomClientIdMap[roomId].forEach((c) => {
    sendMessage(c, {
      eventName: 'CAPTION_SELECTED',
      roomId,
      user,
      captionValue: captionValue
    });
  });
};

const judgedGif = (clientId, data) => {
  // console.log('judged Caption', data);
  const user = data.user;
  const roomId = data.roomId;
  const judgedGif = data.judgedGif;
  let winnerUser = '';
  let winningGif = '';
  let remainingRounds = 0;
  roomUsersMap[roomId].forEach(function (obj) {
    if (obj.selectedGif == judgedGif) {
      winnerUser = obj.user;
      winningGif = obj.selectedGif;
    }
    if (obj.isHost) {
      obj.remainingRounds = obj.remainingRounds - 1;
      remainingRounds = obj.remainingRounds;
    }
  });

  roomUsersMap[roomId].forEach(function (obj) {
    obj.roundDetails = { winnerUser: winnerUser, winningGif: winningGif };
    obj.selectedGif = null;
  });

  roomClientIdMap[roomId].forEach((c) => {
    sendMessage(c, {
      eventName: 'ROUND_ENDED',
      roomId,
      user,
      winnerUser: winnerUser,
      winningGif: winningGif,
      remainingRounds: remainingRounds
    });
  });
};

const selectedGif = (clientId, data) => {
  // console.log('selected gif', data);
  const user = data.user;
  const roomId = data.roomId;
  const selectedGif = data.selectedGif;
  //  console.log(roomUsersMap[roomId], 'map of users');

  roomUsersMap[roomId].forEach(function (obj) {
    if (obj.clientId == clientId) {
      obj.selectedGif = selectedGif;
    }
  });

  //console.log(roomUsersMap[roomId], 'map of users');

  sendMessage(clientId, {
    eventName: 'SUBMITTED_GIF',
    roomId,
    user,
    selectedGif: selectedGif
  });

  roomClientIdMap[roomId].forEach((c) => {
    sendMessage(c, {
      eventName: 'GIFS_LIST_SELECTED',
      roomId,
      user,
      gifList: roomUsersMap[roomId].map((u) => u.selectedGif)
    });
  });
};

const joinRoom = (clientId, data) => {
  const user = data.user;
  const roomId = data.roomId;
  if (!roomUsersMap[roomId]) {
    // console.log('HERE 1');
    startGame(clientId, data, roomId, true);
  } else {
    // console.log(
    //   'HERE 2',
    //   roomUsersMap[roomId].indexOf(user),
    //   roomUsersMap[roomId],
    //   user
    // );
    if (roomUsersMap[roomId].find((u) => u.user === user)) {
      sendMessage(clientId, {
        eventName: 'ALREADY_IN_ROOM',
        roomId,
        user,
        userList: roomUsersMap[roomId].map((u) => u.user)
      });
      return;
    } else {
      roomUsersMap[roomId].push({ user, isHost: false, clientId: clientId });
      let host = null;
      roomUsersMap[roomId].forEach((object) => {
        if (object?.isHost) host = object;
      });
      console.log(host, 'host', roomUsersMap[roomId]);
      roomClientIdMap[roomId].push(clientId);
      sendMessage(clientId, {
        eventName: 'JOINED_ROOM',
        roomId,
        user,
        isHost: false,
        numberOfRounds: host?.numberOfRounds
      });
      roomClientIdMap[roomId].forEach((c) => {
        sendMessage(c, {
          eventName: 'USER_LIST',
          roomId,
          userList: roomUsersMap[roomId].map((u) => u.user),
          numberOfRounds: host?.numberOfRounds
        });
      });
    }
  }
};

const sendMessage = (clientId, data) => {
  const wss = clientIdWsMap[clientId];
  if (!wss) {
    console.error(`ws is missing for clientId ${clientId} ${JSON.stringify(
      data
    )} 
        ${JSON.stringify(roo)}`);
    return;
  }
  //console.log(data);
  //console.log(JSON.stringify(data));
  wss.send(JSON.stringify(data));
};

module.exports = {
  processEvent,
  storeClientIdWS
};
