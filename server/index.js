import express from 'express';
import axios from 'axios';
import qs from 'qs';

const fetch = require

const router = express.Router();

require('dotenv').config();


const client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
const auth_token = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64');

async function authenticateToSpotify() {
  const token_url = 'https://accounts.spotify.com/api/token';
  const data = qs.stringify({ 'grant_type': 'client_credentials' });

  const spotifyParams = new URLSearchParams({
    grant_type: 'authorization_code'
  })

  const response = await axios.post(
    token_url, 
    spotifyParams,
    {
      headers: {
        'Authorization': `Basic ${auth_token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      auth: {
        username: client_id,
        password: client_secret
      },
    },
  )
  console.log(response.data.accessToken);
  return response.data.accessToken;
};


router.get('/api/artists', async (req, expressRes) => {
  console.log("here");
  // const artistId = req.params.id; // Use the artist ID from the request parameters
  const artistId = '0TnOYISbd1XYRBk9myaseg';
  const artistUrl = `${process.env.SPOTIFY_ARTIST_URL}${artistId}`;
  const accessToken = await authenticateToSpotify();
  console.log(accessToken);

  try{
    const response = await axios.get(artistUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    console.log(response.data);
    expressRes.send(response.data);
  }catch(error){
    console.log(error);
  }  
});

module.exports = router;

