const roomUsersMap = {}
const roomClientIdMap = {}
const clientIdWsMap = {}
const storeClientIdWS = (clientId, ws) => {
    clientIdWsMap[clientId] = ws;
}
const processEvent = (clientId, ws, data) => {
    storeClientIdWS(clientId, ws)
    if (!data.eventName) {
        console.warn("Invalid message");
        return;
    }
    const eventName = data.eventName;
    console.log(data)
    if (eventName === "START_GAME") {
        startGame(clientId, data, undefined)
    } else if (eventName === "JOIN_ROOM") {
        joinRoom(clientId, data)
    }
}

function generateRoomId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let roomId = '';
    for (let i = 0; i < length; i++) {
        roomId += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    console.log("New roomId " + roomId)
    return roomId;
}

const startGame = (clientId, data, roomId) => {
    const user = data.user;
    roomId = roomId || generateRoomId(6);
    roomUsersMap[roomId] = [user]
    roomClientIdMap[roomId] = [clientId]
    sendMessage(clientId, {
        eventName: "GAME_STARTED",
        roomId,
        user
    })
}

const joinRoom = (clientId, data) => {
    const user = data.user;
    const roomId = data.roomId;
    if (!roomUsersMap[roomId]) {
        console.log("HERE 1")
        startGame(clientId, data, roomId)
    } else {
        console.log("HERE 2", roomUsersMap[roomId].indexOf(user), roomUsersMap[roomId], user)
        if (roomUsersMap[roomId].indexOf(user) != -1) {
            sendMessage(clientId, {
                eventName: "ALREADY_IN_ROOM",
                roomId,
                user,
                userList: roomUsersMap[roomId]
            })
            return;
        } else {
            roomUsersMap[roomId].push(user)
            roomClientIdMap[roomId].push(clientId)
            sendMessage(clientId, {
                eventName: "JOINED_ROOM",
                roomId,
                user
            })
            roomClientIdMap[roomId].forEach(c => {
                console.log("a")
                sendMessage(c, {
                    eventName: "USER_LIST",
                    roomId,
                    userList: roomUsersMap[roomId]
                })
            })
        }
    }
}

const sendMessage = (clientId, data) => {
    const wss = clientIdWsMap[clientId]
    if (!wss) {
        console.error(`ws is missing for clientId ${clientId} ${JSON.stringify(data)} 
        ${JSON.stringify(roo)}`)
        return;
    }
    console.log(JSON.stringify(data))
    wss.send(JSON.stringify(data))
}

module.exports = {
    processEvent, storeClientIdWS
}

