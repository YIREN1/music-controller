import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import axios from 'axios';
import CreateRoomPage from './CreateRoomPage';
import MusicPlayer from './MusicPlayer';

function Room({ leaveRoomCallback, ...props }) {
  const defaultVotes = 2;
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState();
  let roomCode = props.match.params.roomCode;
  const fetchRoom = async () => {
    try {
      const response = await axios(`/api/get-room?code=${roomCode}`);
      const data = await response.data;

      setVotesToSkip(data.votes_to_skip);
      setGuestCanPause(data.guest_can_pause);
      setIsHost(data.is_host);
      if (data.is_host) {
        await authenticateSpotify();
        await getCurrentSong();
      }
      // setShowSettings(false);
    } catch (error) {
      console.log(error);
      leaveRoomCallback();
      props.history.push('/');
    }
  };
  useEffect(() => {
    fetchRoom();
  }, []);
  const getCurrentSong = async () => {
    try {
      const res = await axios.get('/spotify/current-song');
      const data = res.data;
      setSong(data);
    } catch (error) {
      console.log(error);
      setSong({});
    }
  };
  const authenticateSpotify = async () => {
    try {
      const res = await axios.get('/spotify/is-authenticated');
      const data = res.data;
      setSpotifyAuthenticated(data.status);
      console.log('Authenticated: ', data.status);

      if (!data.status) {
        const { url } = await (await axios.get('/spotify/get-auth-url')).data;
        window.location.replace(url);
      }
    } catch (error) {}
  };

  const updateShowSettings = (value) => {
    setShowSettings(value);
  };

  const leaveButtonPressed = async () => {
    const res = await axios.post('/api/leave-room');
    if (res.data.Message == 'Success') {
      leaveRoomCallback();
      props.history.push('/');
    }
  };

  const Settings = () => (
    <Grid container spacing={1}>
      <Grid item xs={12} align='center'>
        <CreateRoomPage
          update
          votesToSkip={votesToSkip}
          guestCanPause={guestCanPause}
          roomCode={roomCode}
          updateCallback={fetchRoom}
        />
      </Grid>
      <Grid item xs={12} align='center'>
        <Button variant='contained' color='secondary' onClick={() => updateShowSettings(false)}>
          Close
        </Button>
      </Grid>
    </Grid>
  );
  // FISRT LETTER CAPITAL, OTHERWISE NOT A COMPONENT
  function SettingsButton() {
    return (
      <Grid item xs={12} align='center'>
        <Button variant='contained' color='primary' onClick={() => updateShowSettings(true)}>
          Settings
        </Button>
      </Grid>
    );
  }

  if (showSettings) {
    return <Settings />;
  }
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align='center'>
        <Typography variant='h4' component='h4'>
          Code: {roomCode}
        </Typography>
      </Grid>
      <Grid item xs={12} align='center'>
        <Typography variant='h6' component='h6'>
          Votes: {votesToSkip}
        </Typography>
      </Grid>
      <Grid item xs={12} align='center'>
        <Typography variant='h6' component='h6'>
          Guest Can Pause: {guestCanPause.toString()}
        </Typography>
      </Grid>
      <MusicPlayer {...song} />
      <Grid item xs={12} align='center'>
        <Typography variant='h6' component='h6'>
          Host: {isHost.toString()}
        </Typography>
      </Grid>
      {isHost ? <SettingsButton /> : null}
      <Grid item xs={12} align='center'>
        <Button variant='contained' color='secondary' onClick={leaveButtonPressed}>
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
}

export default Room;
