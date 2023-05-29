// import React, { useState } from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import useWebSocket, { ReadyState } from 'react-use-websocket';
// import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
// import Grid from '@mui/material/Grid';
// import { styled } from '@mui/material/styles';
// import { Button } from '@mui/material';

// const WS_URL = 'ws://127.0.0.1:7071';

// export default function NoUserComponent() {
//     const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL + "?user=manikanta", {
//         reconnectAttempts: 10,
//         reconnectInterval: 2000,
//         shouldReconnect: () => true,
//         onOpen: () => {
//             console.log('WebSocket connection established.');
//         },
//         onClose: () => {
//             console.log('WebSocket connection closed.');
//         }
//     });

//     const connectionStatus = {
//         [ReadyState.CONNECTING]: 'Connecting',
//         [ReadyState.OPEN]: 'Open',
//         [ReadyState.CLOSING]: 'Closing',
//         [ReadyState.CLOSED]: 'Closed',
//         [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
//     }[readyState];

//     const handleCreateRoomClick = () => {
//         sendMessage("CREATE_ROOM", function (response) {
//             console.log(response)
//         })
//     }

//     const [users, setUsers] = useState([]);
//     return <Box sx={{ flexGrow: 1 }}>
//         <Grid container spacing={2} justifyContent="center">
//             <Grid item xs={8}>Connection Status : {connectionStatus} </Grid>
//             <Grid item xs={8}>
//                 <Button onClick={handleCreateRoomClick}>Create Room</Button>
//             </Grid>
//             {users.map(user => {
//                 return <Grid item xs={8}>
//                     <Item>{user}</Item>
//                 </Grid>
//             })}
//         </Grid>
//     </Box>
// }