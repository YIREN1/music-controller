import React, { useState, useEffect } from 'react';
import RoomJoinPage from './RoomJoinPage';
import CreateRoomPage from './CreateRoomPage';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import Room from './Room';
import { Grid, Button, ButtonGroup, Typography } from '@material-ui/core';
import Axios from 'axios';

function HomePage() {
  const [roomCode, setRoomCode] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await Axios.get('/api/user-in-room');
        setRoomCode(res.data.code);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  const clearRoomCode = () => {
    setRoomCode('');
  };
  const renderHomePage = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align='center'>
          <Typography variant='h3' compact='h3'>
            House Party
          </Typography>
        </Grid>
        <Grid item xs={12} align='center'>
          <ButtonGroup disableElevation variant='contained' color='primary'>
            <Button color='primary' to='/join' component={Link}>
              Join a Room
            </Button>
            <Button color='secondary' to='/create' component={Link}>
              Create a Room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    );
  };
  return (
    <Router>
      <Switch>
        <Route
          exact
          path='/'
          render={() => {
            return roomCode ? <Redirect to={`/room/${roomCode}`} /> : renderHomePage();
          }}
        ></Route>
        <Route path='/join' component={RoomJoinPage} />
        <Route path='/create' component={CreateRoomPage} />
        <Route
          path='/room/:roomCode'
          render={(props) => <Room {...props} leaveRoomCallback={clearRoomCode} />}
        />
      </Switch>
    </Router>
  );
}

export default HomePage;
