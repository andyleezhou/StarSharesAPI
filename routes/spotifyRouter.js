const express = require("express");
const router = express.Router();
const logger = require("../config/logger");
const SpotifyWebApi = require("spotify-web-api-node");
const { getAccessToken } = require("../util/spotify")

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID || "2f6e085b55bc4ede9131e2d7d7739c30", 
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "88eeb98034e5422099cce4f6467a3d51"
  });  

getAccessToken(spotifyApi);

router.get('/artistPopularity', async (request, response) => {
    const { artistId } = request.query

    if (!artistId) {
        logger.error("Artist ID cannot be null");
        return response.status(400).json({
        message: "Artist ID cannot be null",
        status: 400,
        });
    }

    try {
        let artist = spotifyApi.getArtist(artistId);

        return response.status(200).json({
            artist,
            popularity: artist.popularity
        })

    } catch (error) {
        logger.error("Failed to fetch artist from spotify api")
        return response.status(500).json({
            message: "Failed to create a new watchlist",
            status: 500,
            error: error.message,
          });
    }
})

router.get('/searchArtistsByName', (req, res) => {
    const { artistName } = request.query;

    if (!artistName) {
        logger.error("Artist name cannot be null");
        return response.status(400).json({
        message: "Artist name cannot be null",
        status: 400,
        });
    }

    try {
        spotifyApi
        .searchArtists(artistName)
        .then(data => {
            logger.info("Successfully fetched artist data")
            return res.status(200).json({ 
                artists: data.body.artists.items, 
                search: artistName
            });
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        })
    } catch (error) {
        return response.status(500).json({
            message: "Failed to fetch artist",
            status: 500,
            error: error.message,
          });
    }
  });


module.exports = router;
