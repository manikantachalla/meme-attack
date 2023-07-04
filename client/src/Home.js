import { useState } from 'react';
import { Button, TextField, createTheme, ThemeProvider } from '@mui/material';
import AddUserComponent from './AddUserComponent';
import { Grid, Paper, Typography } from '@mui/material';
import { Navigate } from 'react-router';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1993F5',
      light: '#BBDEFB'
    }
  }
});

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#1993F5',
    minHeight: '100vh'
  },
  titleContainer: {
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    fontWeight: 'bold',
    color: '#E3F2FD',
    textShadow:
      '2px 2px 4px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(0, 0, 0, 0.5)'
  },
  subtitle: {
    fontSize: '12px',
    color: '#E3F2FD',
    marginLeft: '10px'
  },
  batmanGif: {
    width: '100%',
    maxWidth: '200px',
    height: 'auto',
    display: 'block',
    margin: '20px auto'
  },
  button: {
    width: '100%',
    marginTop: '20px',
    borderColor: '#1993F5',
    fontSize: '14px',
    padding: '8px 12px'
  },
  card: {
    backgroundColor: '#fff',
    padding: '10px',
    marginBottom: '20px',
    width: '50%',
    maxWidth: '400px',
    margin: '0 auto'
  },
  cardGap: {
    marginTop: '20px'
  }
};

function HomeComponent({ onStartGame, user: userProp }) {
  const [showStartGame, setShowStartGame] = useState(!userProp);
  const [user, setUser] = useState(userProp);
  const navigate = useNavigate();

  const handleSubmit = (user, numberOfRounds) => {
    onStartGame(user, numberOfRounds);
  };

  const handleSubmit2 = (user, numberOfRounds) => {
    navigate('/' + user);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        spacing={2}
        justifyContent='center'
        style={styles.container}
      >
        <Grid item xs={12}>
          <Grid
            container
            spacing={1}
            alignItems='center'
            style={styles.titleContainer}
          >
            <Grid item>
              <Typography variant='h4' style={styles.title}>
                MEME-ATTACK
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant='subtitle2' style={styles.subtitle}>
                Incognito creations TM
              </Typography>
            </Grid>
          </Grid>
          <img
            src='https://media.giphy.com/media/a5viI92PAF89q/giphy.gif'
            alt='Batman GIF'
            style={styles.batmanGif}
          />
        </Grid>
        {showStartGame && (
          <Grid item xs={12} sm={6}>
            <Button
              variant='contained'
              onClick={() => {
                setShowStartGame(false);
              }}
              style={styles.button}
            >
              Start Game
            </Button>
          </Grid>
        )}
        {!showStartGame && (
          <Grid item xs={12} sm={6}>
            <Paper style={styles.card}>
              <AddUserComponent
                onSubmit={handleSubmit}
                buttonText='Create Room'
                placeholderText='Your name'
              />
            </Paper>
            <Paper style={{ ...styles.card, ...styles.cardGap }}>
              <AddUserComponent
                onSubmit={handleSubmit2}
                buttonText='Join Room'
                placeholderText='Enter Room Id'
              />
            </Paper>
          </Grid>
        )}
      </Grid>
    </ThemeProvider>
  );
}

export default HomeComponent;
