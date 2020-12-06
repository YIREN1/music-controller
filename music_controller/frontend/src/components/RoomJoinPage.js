import React, { useState } from 'react';
import { TextField, Button, Grid, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import axios from 'axios';
function RoomJoinPage(props) {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const handleTextFieldChange = (e) => {
    setRoomCode(e.target.value);
  };
  const roomButtonPressed = async () => {
    try {
      const res = await axios.post('/api/join-room', { code: roomCode });

      //success
      if (res.data?.message) {
        props.history.push(`/room/${roomCode}`);
      } else {
        setError('room not found');
      }
    } catch (error) {
      setError('room not found');
      console.log(error);
    }
  };
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align='center'>
        <Typography variant='h4' component='h4'>
          Join a Room
        </Typography>
      </Grid>
      <Grid item xs={12} align='center'>
        <TextField
          error={error}
          label='Code'
          placeholder='Enter a Room Code'
          value={roomCode}
          helperText={error}
          variant='outlined'
          onChange={handleTextFieldChange}
        />
      </Grid>
      <Grid item xs={12} align='center'>
        <Button variant='contained' color='primary' onClick={roomButtonPressed}>
          Enter Room
        </Button>
      </Grid>
      <Grid item xs={12} align='center'>
        <Button variant='contained' color='secondary' to='/' component={Link}>
          Back
        </Button>
      </Grid>
    </Grid>
  );
}

export default RoomJoinPage;
