import { useState } from 'react';
import { Grid } from '@mui/material';
import { Button, TextField } from '@mui/material';

function AddUserComponent({ onSubmit, user: userProp, buttonText }) {
    const [user, setUser] = useState(userProp ? userProp : "");
    const handleSubmit = () => {
        onSubmit(user);
    }
    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
                <Grid item xs={12}>
                    <TextField value={user}
                        onChange={(e) => setUser(e.currentTarget.value)}
                        placeholder='Name' />
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Button onClick={handleSubmit}
                    disabled={!user}
                    variant="contained">
                    {buttonText || "Submit"}
                </Button>
            </Grid>
        </Grid>
    );
}
export default AddUserComponent;
