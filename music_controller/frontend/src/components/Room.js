import React, { useState, useEffect } from 'react';

function Room(props) {
  const defaultVotes = 2;
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [votesToSkip, setVotesToSkip] = useState(defaultVotes);
  const [isHost, setIsHost] = useState(false);
  let roomCode = props.match.params.roomCode;
  useEffect(() => {
    const fetchRoom = async () => {
      const response = await fetch('/api/get-room' + '?code=' + roomCode);
      const data = await response.json();

      setVotesToSkip(data.votes_to_skip);
      setGuestCanPause(data.guest_can_pause);
      setIsHost(data.is_host);
    };
    fetchRoom();
  }, []);
  return (
    <div>
      <h3>{roomCode}</h3>
      <p>Votes: {votesToSkip}</p>
      <p>Guest Can Pause: {guestCanPause.toString()}</p>
      <p>Host: {isHost.toString()}</p>
    </div>
  );
}

export default Room;
