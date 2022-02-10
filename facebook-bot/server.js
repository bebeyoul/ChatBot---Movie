'use strict';

const express = require('express');
const server = express();
const bodyparser = require('body-parser');
server.use(bodyparser.json())


// Tokens
const config = require('./config');
console.log(config);

// FBeamer
const FBeamer = require('./fbeamer');
const fb = new FBeamer(config.FB);

// Weather
const timezonebot = require('../timezone-app');

//ntl - tmbd
const nlp = require('./tmdb');

// MovieDB
const moviedb = require('./movie_service');

let path = "https://image.tmdb.org/t/p/w500"




// Default page when opening https://your-repository.repl.co/
server.get('/', (request, response) => response.send(`
<h1>chatbot team name-group name</h1>
<h2>Members</h2>
<ul>
  <li>Julie HIGELIN</li>
  <li>Romain GIRODET</li>
</ul>
<a href='https://m.me/pageid'>click here to chat with my bot</a> (open it on a new tab)
`));


// Registering WebHook
server.get('/fb', (request, response) => fb.registerHook(request, response));


// Receive all incoming messages
server.post('/fb', (request, response, next) => {
  fb.incoming(request, response, async msg => {

    // TD5 Ex8
    try {
      try {
        msg.nlp = await nlp(msg.content)
      } catch (e) {
        console.log('error in nlp', e)
      }

      console.log("msg.nlp", msg.nlp);
      if (msg.nlp.intents[0].confidence > 0.8) {
        console.log(`name: ${msg.nlp.intents[0].name}`)

        // Equivalent of the exercice 8 & 9
        switch (msg.nlp.intents[0].name) {
          case 'movieinfo':
            if ("releaseYear:releaseYear" in msg.nlp["entities"]) {
              let movieinfoDate = Object.values(msg.nlp.entities)[0][0].value;
              let movieinfoTitle = Object.values(msg.nlp.entities)[1][0].value;

              try {
                msg.moviedb = await moviedb.getMovieInfo(movieinfoTitle)
                console.log("Resume:", msg.moviedb.results[0].overview)
              } catch (e) {
                console.log('error in moviedb', e)
              }

              fb.txt(msg.sender, `${Object.values(msg.moviedb.results)[0].original_title}'s overview:\n ${Object.values(msg.moviedb.results)[0].overview}`);

              let path_image = path + Object.values(msg.moviedb.results)[0].poster_path
              fb.img(msg.sender, path_image);


            }
            else {
              let movieinfoTitle = Object.values(msg.nlp.entities)[0][0].value;
              try {
                msg.moviedb = await moviedb.getMovieInfo(movieinfoTitle)
              } catch (e) {
                console.log('error in moviedb', e)
              }

              fb.txt(msg.sender, `${Object.values(msg.moviedb.results)[0].original_title}'s overview:\n ${Object.values(msg.moviedb.results)[0].overview}`);

              let path_image = path + Object.values(msg.moviedb.results)[0].poster_path
              fb.img(msg.sender, path_image);
            }
            break;



          case 'director':
            let directorMovieTitle = Object.values(msg.nlp.entities)[0][0].value;
            console.log("director values:", directorMovieTitle);

            try {
              msg.moviedb = await moviedb.getMovieInfo(directorMovieTitle)
            } catch (e) {
              console.log('error in moviedb', e)
            }
            if (Object.values(msg.moviedb.results)[0].vote_average > 6) {
              fb.txt(msg.sender, `There is no information about the director of the movie ${Object.values(msg.moviedb.results)[0].original_title}. But I can tell you that it has a score of ${Object.values(msg.moviedb.results)[0].vote_average} over 10. You should watch it ;)`);
            }
            else {
              fb.txt(msg.sender, `There is no information about the director of the movie ${Object.values(msg.moviedb.results)[0].original_title}. But I can tell you that it has a score of ${Object.values(msg.moviedb.results)[0].vote_average} over 10. You should watch something else ;)`);
            }


            break;



          case 'releaseYear':
            let releasedYearMovieTitle = Object.values(msg.nlp.entities)[0][0].value;
            console.log("releaseYear values:", releasedYearMovieTitle);
            try {
              msg.moviedb = await moviedb.getMovieInfo(releasedYearMovieTitle)
            } catch (e) {
              console.log('error in moviedb', e)
            }

            fb.txt(msg.sender, `${Object.values(msg.moviedb.results)[0].original_title} was released in ${Object.values(msg.moviedb.results)[0].release_date}.`);




            break;


          default:
            fb.txt(msg.sender, `idk ${Object.values(msg.nlp.entities)[0][0].value}`);
            console.log(Object.values(msg.nlp.entities)[0][0].value);
            break;
        }
      }// end of if
    timezonebot(fb, msg);
    } catch (e) { console.log('error' + e); }

    // try {
    //   timezonebot(fb, msg);
    // } catch (e) {
    //   console.log(e)
    // }

  })
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`The bot server is running on port ${PORT}`));