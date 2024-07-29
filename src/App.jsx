import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = 'http://localhost:8888/callback'; // Replace with your redirect URI

function App() {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      fetchAccessToken(code);
    }
  }, []);

  const authorizeWithSpotify = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=user-read-private user-read-email`;
    window.location.href = authUrl;
  };

  const fetchAccessToken = async (code) => {
    try {
      const response = await axios.post('/login', {
        client_id: CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      });

      setAccessToken(response.data.access_token);
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  const fetchArtistData = async () => {
    try {
      const response = await axios.get('/api/artists', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error('#Error fetching artist data:', error);
    }
  };

  return (
    <div>
      <button onClick={authorizeWithSpotify}>Authorize with Spotify</button>
      <button onClick={fetchArtistData}>Fetch Artist Data</button>
    </div>
  );
}

export default App;