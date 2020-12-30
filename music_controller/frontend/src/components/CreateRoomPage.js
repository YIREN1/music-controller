import React, { useState } from 'react';
import {
  Grid,
  Typography,
  TextField,
  FormHelperText,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Collapse } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

function CreateRoomPage({ update = false, roomCode = null, updateCallback = () => {}, ...props }) {
  const defaultVotes = 2;
  const [guestCanPause, setGuestCanPause] = useState(props.guestCanPause ?? true);
  const [votesToSkip, setVotesToSkip] = useState(props.votesToSkip || defaultVotes);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const handleVotesChange = (e) => {
    setVotesToSkip(e.target.value);
  };

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === 'true' ? true : false);
  };
  const handleRoomButtonPressed = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      }),
    };
    try {
      const response = await fetch('/api/create-room', requestOptions);
      const data = await response.json();

      props.history.push(`/room/${data.code}`);
    } catch (error) {
      console.error(error);
    }
  };
  const handleUpdateButtonPressed = async () => {
    try {
      const response = await axios.patch('/api/update-room', {
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: roomCode,
      });
      const data = await response.data;
      if (data.code) {
        setSuccessMsg('Room updated successfully!');
      }
      updateCallback();
    } catch (error) {
      // todo set specific error msg
      setErrorMsg('Error updating room...');
      console.error(error);
    }
  };

  function CreateButtons() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align='center'>
          <Button color='primary' variant='contained' onClick={handleRoomButtonPressed}>
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align='center'>
          <Button color='secondary' variant='contained' to='/' component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  }

  function UpdateButtons() {
    return (
      <Grid item xs={12} align='center'>
        <Button color='primary' variant='contained' onClick={handleUpdateButtonPressed}>
          Update Room
        </Button>
      </Grid>
    );
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align='center'>
        <Collapse in={errorMsg !== '' || successMsg !== ''}>
          {successMsg !== '' ? (
            <Alert
              severity='success'
              onClose={() => {
                setSuccessMsg('');
              }}
            >
              {successMsg}
            </Alert>
          ) : (
            <Alert
              severity='error'
              onClose={() => {
                setErrorMsg('');
              }}
            >
              {errorMsg}
            </Alert>
          )}
        </Collapse>
      </Grid>
      <Grid item xs={12} align='center'>
        <Typography component='h4' variant='h4'>
          Create A Room
        </Typography>
      </Grid>
      <Grid item xs={12} align='center'>
        <FormControl component='fieldset'>
          <FormHelperText>
            <div align='center'>Guest Control of Playback State</div>
          </FormHelperText>
          <RadioGroup
            row
            defaultValue={guestCanPause.toString()}
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value='true'
              control={<Radio color='primary' />}
              label='Play/Pause'
              labelPlacement='bottom'
            />
            <FormControlLabel
              value='false'
              control={<Radio color='secondary' />}
              label='No Control'
              labelPlacement='bottom'
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} align='center'>
        <FormControl>
          <TextField
            required={true}
            type='number'
            onChange={handleVotesChange}
            defaultValue={votesToSkip}
            inputProps={{
              min: 1,
              style: { textAlign: 'center' },
            }}
          />
          <FormHelperText>
            <div align='center'>Votes Required To Skip Song</div>
          </FormHelperText>
        </FormControl>
      </Grid>
      {update ? <UpdateButtons /> : <CreateButtons />}
    </Grid>
  );
}

export default CreateRoomPage;
