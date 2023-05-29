import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import AddUserComponent from './AddUserComponent'
import { Grid, Paper } from '@mui/material';

function HomeComponent({ onStartGame, user: userProp }) {
    const [showStartGame, setShowStartGame] = useState(!userProp);
    const [user, setUser] = useState(userProp);
    const handleSubmit = (user) => {
        onStartGame(user);
    }
    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={8}><b>Home</b></Grid>
            {showStartGame && <Grid item xs={8}>
                <Button variant='contained'
                    onClick={() => { setShowStartGame(false) }}>
                    Start Game</Button></Grid>}
            {!showStartGame && <Grid item xs={8}>
                <Paper>
                    <AddUserComponent
                        onSubmit={handleSubmit}
                        buttonText="Create Room"
                    />
                </Paper>
            </Grid>}
        </Grid>
    );
}
export default HomeComponent;
