import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import qs from 'qs';

const router = express.Router();


const client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
const auth_token = Buffer.from(`${client_id}:${client_secret}`, 'utf-8').toString('base64');
var redirect_uri = 'http://localhost:8888/callback';
var stateKey = 'spotify_auth_state';

const generateRandomString = (length) => {
  return crypto
  .randomBytes(60)
  .toString('hex')
  .slice(0, length);
}

router.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);
  var scope = 'user-read-private user-read-email';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));;
});

router.get('/callback', function(req, res){
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'client_credentials'
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});


router.get('/api/artists', async (req, expressRes) => {
  console.log("here");
  // const artistId = req.params.id; // Use the artist ID from the request parameters
  const artistId = '0TnOYISbd1XYRBk9myaseg';
  const artistUrl = `${process.env.SPOTIFY_ARTIST_URL}${artistId}`;
  // const accessToken = await authenticateToSpotify();
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

