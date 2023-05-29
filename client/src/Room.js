import { useEffect, useState } from 'react';
import { Grid, Paper, Link } from '@mui/material';
import { Button, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import AddUserComponent from './AddUserComponent'


function RoomComponent(props) {
    const { userList, user: userProp, onJoinRoom } = props
    const [user, setUser] = useState(userProp ? userProp : "")
    const { roomId } = useParams();
    useEffect(() => {
        if (user && roomId) {
            console.warn("sadsss", user, roomId)
            onJoinRoom(user, roomId)
        }
    }, [user, roomId])
    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}><b>Room</b></Grid>
            {!user && <Grid item xs={12}>
                <AddUserComponent onSubmit={(user) => setUser(user)} buttonText="Join Room" />
            </Grid>}
            {user && <>
                <Grid item xs={12}>
                    <Paper><b>Current User :</b> {user}</Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper>
                        <b>Users in room :</b>
                        {userList.map(user => {
                            return <Grid item xs={12} key={user}>
                                {user}
                            </Grid>

                        })}
                    </Paper>
                </Grid>
            </>}
            {user && <Link
                component="button"
                variant="body2"
                onClick={() => {
                    setUser("")
                }}
            >
                Clear User
            </Link>}
        </Grid>
    );
}
export default RoomComponent;