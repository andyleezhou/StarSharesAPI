const SpotifyWebApi = require("spotify-web-api-node");

const getAccessToken = (spotifyApi) => {
    spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        //console.log(data.body)
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });
}

module.exports = {
    getAccessToken
}