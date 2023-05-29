import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { getConnectionStatus } from './ws-common'

const WS_URL = 'ws://127.0.0.1:7071';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function UserListComponent(props) {
    const userList = props.userList;
    return <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} justifyContent="center">
            <Grid item> User List </Grid>
            {userList.map(user => {
                return <Grid item xs={8}>
                    <Item>{user}</Item>
                </Grid>
            })}
        </Grid>
    </Box>
}