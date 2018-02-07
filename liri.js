

require("dotenv").config();

//load the fs package to read and write (not sure if this is needed)
var fs = require("fs");

//load all of the other required packages
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");

//load the contents of the keys.js file
var keys = require("./keys");

//access the key information for spotify and twitter APIs
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//LIRI's vocabulary starts here
//Pick-up the uesr's inputs to LIRI
var input = process.argv[2];
var param = process.argv[3];

//my-tweets here
    if (input === "my-tweets") {
        myTweets();
    }

//spotify-this-song functionality here
    if (input === "spotify-this-song") {
        spotifyThisSong();
    }

//movie-this goes here
    if (input === "movie-this") {
        movieThis();
    }

//do-what-it-says goes here
    if (input === "do-what-it-says") {
        fs.readFile("random.txt", "utf8", function(err, data) {
            if (err) {
            return console.log(err);
            }

            var text = data.split(",");
            input = text[0];
            param = text[1];

            if (input === "my-tweets") {
                myTweets();
            }
            else if (input === "spotify-this-song") {
                spotifyThisSong();
            }
            else if (input === "movie-this") {
                movieThis();
            }
            else console.log("something is not right here");
        });

    }


//functions go here
    //my-tweets function
    function myTweets() {
        client.get("https://api.twitter.com/1.1/statuses/user_timeline.json", {screen_name: param, count: "20", }, function(error, tweets, response){
            if(error) {
                console.log("***ERROR***");
                throw error;
            };

            for (i=0; i<tweets.length; i++) {
                var num = i+1;
                console.log("--------------------------------------");
                console.log("Tweet " + num + ": " +tweets[i].text);
            }
        });
    }

    //spotify-this-song function
    function spotifyThisSong() {
        if (param == null) {param = "The Sign, Ace of Base";}
        spotify.search({type: "track", query: param}, function(err, data) {
            if (err) {
                return console.log("***ERROR***" + err);
            }
            console.log("-------------------------------");
            console.log("INFO FOR: " + param);
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Preview Link: " + data.tracks.items[0].preview_url);
            console.log("Album Name: " + data.tracks.items[0].album.name);
        })
    }

    //movie-this function
    function movieThis() {
        if (param == null) {param = "Mr. Nobody";}
        var urlParams = param.split(" ");
        console.log(urlParams);
        var url = "http://www.omdbapi.com/?i=tt3896198&apikey=4cea99fe&t=" + urlParams.join("%20");
        request(url, function (error, response, body) {
            if(error) {console.log('error:', error);} // Print the error if one occurred

            var details = JSON.parse(body)
            console.log("------------------------------");
            console.log("INFO FOR: " + param);
            console.log("Title: ", details.Title);
            console.log("Year: ", details.Year);
            console.log("IMDB Rating: ", details.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: ", details.Ratings[1].Value);
            console.log("Country Produced: ", details.Country);
            console.log("Language: ", details.Language);
            console.log("Plot: ", details.Plot);
            console.log("Actors: ", details.Actors);
        });
    }



    
