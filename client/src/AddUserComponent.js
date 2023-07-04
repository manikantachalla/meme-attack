import { useState } from 'react';
import { Grid, TextField, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  container: {
    background: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
  },
  field: {
    marginBottom: '1rem'
  },
  submitButton: {
    background: 'white',
    color: 'black'
  }
}));

function AddUserComponent({
  onSubmit,
  user: userProp,
  buttonText,
  placeholderText
}) {
  const classes = useStyles();
  const [user, setUser] = useState(userProp ? userProp : '');
  const [numberOfRounds, setNumberOfRounds] = useState('');

  const handleSubmit = () => {
    const formData = {
      user,
      numberOfRounds
    };
    onSubmit(user, numberOfRounds);
  };

  return (
    <div className={classes.container}>
      <Grid container spacing={2} justifyContent='center'>
        <Grid item xs={12}>
          <TextField
            value={user}
            onChange={(e) => setUser(e.currentTarget.value)}
            placeholder={placeholderText || 'Your name'}
            fullWidth
            className={classes.field}
          />
        </Grid>
        {buttonText === 'Create Room' && (
          <Grid item xs={12}>
            <TextField
              value={numberOfRounds}
              onChange={(e) => setNumberOfRounds(e.currentTarget.value)}
              placeholder='Number of Rounds'
              type='number'
              required
              fullWidth
              className={classes.field}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Button
            onClick={handleSubmit}
            disabled={
              !user || (!numberOfRounds && buttonText === 'Create Room')
            }
            variant='contained'
            size='large'
            className={classes.submitButton}
          >
            {buttonText || 'Submit'}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default AddUserComponent;
