import React, { useState, useEffect } from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import axios from 'axios';
function Room(props) {
  const defaultVotes = 2;
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
  const [isHost, setIsHost] = useState(false);
  let roomCode = props.match.params.roomCode;
  let leaveRoomCallback = props.leaveRoomCallback;
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios(`/api/get-room?code=${roomCode}`);
        const data = await response.data;

        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);
      } catch (error) {
        console.log(error);
        leaveRoomCallback();
        props.history.push('/');
      }
    };
    fetchRoom();
  }, []);

  const leaveButtonPressed = async () => {
    const res = await axios.post('/api/leave-room');
    if (res.data.Message == 'Success') {
      leaveRoomCallback();
      props.history.push('/');
    }
  };
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
      <Grid item xs={12} align='center'>
        <Typography variant='h6' component='h6'>
          Host: {isHost.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12} align='center'>
        <Button variant='contained' color='secondary' onClick={leaveButtonPressed}>
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
}

export default Room;
