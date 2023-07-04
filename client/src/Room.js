import { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Link,
  Typography,
  createTheme,
  ThemeProvider,
  CircularProgress
} from '@mui/material';
import { Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import AddUserComponent from './AddUserComponent';
import TagSelection from './CaptionSelection';
import GifSearchPage from './GifSelectionComponent';
import GifSelector from './GifJudgementComponent';
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
  title: {
    marginBottom: '20px',
    fontWeight: 'bold',
    color: '#fff'
  },
  subtitle: {
    fontSize: '14px',
    color: '#fff',
    marginBottom: '20px'
  },
  button: {
    width: '100%',
    marginTop: '20px',
    borderColor: '#1993F5',
    fontSize: '14px',
    padding: '8px 12px'
  },
  paper: {
    backgroundColor: '#E3F2FD',
    padding: '20px',
    marginBottom: '20px'
  },
  currentUser: {
    marginBottom: '20px'
  },
  loaderContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '20px',
    backgroundColor: '#f5f5f5', // Add a background color to the loader container
    padding: '10px' // Add padding to create space around the loader
  },
  loader: {
    marginLeft: '10px'
  }
};

function RoomComponent(props) {
  console.log(props, 'room component props');
  const {
    userList,
    user: userProp,
    onJoinRoom,
    onStartRound,
    isJudge,
    startRound,
    handleTagSelection,
    handleGifSelection,
    handleGifJudgement,
    caption,
    gifUrls,
    announcingWinner,
    winnerUser,
    winningGif,
    captionOptions,
    remainingRounds
  } = props;
  const [user, setUser] = useState(userProp ? userProp : '');
  const [gameStarted, setGameStarted] = useState(false);
  const [gifsSubmitted, setGifsSubmitted] = useState(false);
  const { roomId } = useParams();
  const navigate = useNavigate();
  //const [isHost, setIsHost] = useState(false); // New state variable

  const handleSubmit = () => {
    onStartRound(user, roomId);
    // setGameStarted(true);
  };

  useEffect(() => {
    if (user && roomId) {
      onJoinRoom(user, roomId);
    }
  }, [user, roomId]);

  const adduserandRoomInfoAndSend = (selectedTag) => {
    handleTagSelection(user, roomId, selectedTag);
  };

  const adduserandRoomInfoAndSendforGif = (selectedGif) => {
    handleGifSelection(user, roomId, selectedGif);
    setGifsSubmitted(true);
  };

  const adduserandRoomInfoAndSendforJudgement = (selectedGif) => {
    console.log(selectedGif, 'in room file');
    handleGifJudgement(user, roomId, selectedGif);
  };

  const startNewRound = () => {
    console.log('starting new round');
    onStartRound(user, roomId);
  };

  const endGame = () => {
    //write an event to remove existing clientId.
    //localStorage.removeItem('clientId');
    console.log('ending game');
  };

  console.log(props?.gifUrls, 'gifurl', gifsSubmitted);

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        spacing={2}
        justifyContent='center'
        style={styles.container}
      >
        <Grid item xs={12}>
          <Typography variant='h4' style={styles.title}>
            {`Room: ` + roomId}
          </Typography>
        </Grid>
        {!user && (
          <Grid item xs={12}>
            <AddUserComponent
              onSubmit={(user) => setUser(user)}
              buttonText='Join Room'
            />
          </Grid>
        )}
        {user && (
          <>
            <Grid item xs={12}>
              <Paper style={styles.paper}>
                <Typography variant='body1' style={styles.currentUser}>
                  <b>Current User:</b> {user}
                </Typography>
                <Typography variant='body1'>
                  <b>Users in Room:</b>
                </Typography>
                {userList.map((user) => {
                  return (
                    <Typography variant='body1' key={user}>
                      {user}
                    </Typography>
                  );
                })}
                <Typography variant='body1' style={styles.currentUser}>
                  <b>Rounds: </b> {props?.numberOfRounds}
                </Typography>
              </Paper>
            </Grid>
          </>
        )}
        {user && (
          <Grid item xs={12}>
            <Link
              component='button'
              variant='body2'
              onClick={() => setUser('')}
              style={styles.button}
            >
              Clear User
            </Link>
          </Grid>
        )}
        {user && props?.startRound}
        {user &&
          !props?.isHost &&
          !props?.startRound &&
          props?.caption === '' && (
            <Grid item xs={12} style={styles.loaderContainer}>
              <Typography variant='body1'>
                Host will start the game when everyone is in :)
              </Typography>
              <div style={styles.loader}>
                {/* Static Loader */}
                <CircularProgress size={40} />
              </div>
            </Grid>
          )}
        {user &&
          props?.isHost &&
          !props?.startRound &&
          props?.caption === '' && (
            <button onClick={handleSubmit}>Start the game</button>
          )}
        {user &&
          props?.isJudge &&
          props?.startRound &&
          props?.caption === '' && (
            <div>
              <TagSelection
                captionOptions={captionOptions}
                onSubmission={adduserandRoomInfoAndSend}
              />
            </div>
          )}
        {user &&
          props?.isJudge &&
          props?.startRound &&
          props?.caption !== '' &&
          !(props?.gifUrls?.length > 0) && (
            <Grid item xs={12} style={styles.loaderContainer}>
              <Typography variant='body1'>
                Players are selecting the GIF :)
              </Typography>
              <div style={styles.loader}>
                {/* Static Loader */}
                <CircularProgress size={40} />
              </div>
            </Grid>
          )}
        {user &&
          !props?.isJudge &&
          props?.startRound &&
          props?.caption === '' && (
            <Grid item xs={12} style={styles.loaderContainer}>
              <Typography variant='body1'>
                Judge is selecting the caption :)
              </Typography>
              <div style={styles.loader}>
                {/* Static Loader */}
                <CircularProgress size={40} />
              </div>
            </Grid>
          )}
        {user &&
          !props?.isJudge &&
          props?.startRound &&
          props?.caption !== '' &&
          !(props?.gifUrls?.length > 0) && (
            <div>
              Select the GIF for the following caption: {props?.caption}
              <GifSearchPage onSubmission={adduserandRoomInfoAndSendforGif} />
            </div>
          )}
        {props?.gifUrls?.length > 0 &&
          props?.isJudge &&
          props?.winnerUser === '' && (
            <div>
              {props?.caption}
              <GifSelector
                onGifJudgement={adduserandRoomInfoAndSendforJudgement}
                gifUrls={props?.gifUrls}
              />
            </div>
          )}
        {!props?.isJudge &&
          props?.gifUrls?.length > 0 &&
          props?.winnerUser === '' && (
            <Grid item xs={12} style={styles.loaderContainer}>
              <Typography variant='body1'>Announcing winner :)</Typography>
              <div style={styles.loader}>
                {/* Static Loader */}
                <CircularProgress size={40} />
              </div>
            </Grid>
          )}

        {!props?.announcingWinner &&
          props?.winnerUser !== '' &&
          props?.winningGif !== '' && (
            <Grid style={styles.loaderContainer}>
              <Typography variant='body1'>
                And the winner is {props?.winnerUser}
              </Typography>
              <Typography variant='body1'>
                And his GIF:{' '}
                <img src={props?.winningGif} alt={`GIF Selected`} />
              </Typography>
              {props?.isHost && props?.remainingRounds > 0 && (
                <Button onClick={startNewRound}>Start next Round</Button>
              )}
              {props?.isHost && !(props?.remainingRounds > 0) && (
                <>
                  <div>End of Rounds. Please create new room to continue</div>
                  <Button onClick={endGame}>Create new room</Button>
                </>
              )}
              {!props?.isHost && (
                <Typography>
                  Host is either starting the round or ending the game.
                </Typography>
              )}
            </Grid>
          )}
      </Grid>
    </ThemeProvider>
  );
}

export default RoomComponent;
