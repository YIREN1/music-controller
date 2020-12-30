import React from 'react';
import { Grid, Typography, Card, IconButton, LinearProgress } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import axios from 'axios';

function MusicPlayer(props) {
  const songProgress = (props.time / props.duration) * 100;

  const pauseSong = async () => {
    const res = await axios.put('/spotify/pause');
  };

  const playSong = async () => {
    const res = await axios.put('/spotify/play');
  };

  const handleClickPauseResume = async () => {
    props.is_playing ? pauseSong() : playSong();
  };
  return (
    <Card>
      <Grid container alignItems='center'>
        <Grid item align='center' xs={4}>
          <img src={props.image_url} height='100%' width='100%' />
        </Grid>
        <Grid item align='center' xs={8}>
          <Typography component='h5' variant='h5'>
            {props.title}
          </Typography>
          <Typography color='textSecondary' variant='subtitle1'>
            {props.artist}
          </Typography>
          <div>
            <IconButton onClick={handleClickPauseResume}>
              {props.is_playing ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton>
              <SkipNextIcon />
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <LinearProgress variant='determinate' value={songProgress} />
    </Card>
  );
}

export default MusicPlayer;
