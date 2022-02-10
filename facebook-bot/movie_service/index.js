const axios = require('axios');
const config = require('../config')
const tmbdApiKey = config.TMDB

const getMovieInfo = text => {
  return new Promise(async (resolve, reject) => {
    axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${tmbdApiKey}&language=en-US&query=${text}&page=1&include_adult=false`
    ).then(resp => {
      // console.log(resp.data)
      resolve(resp.data)
    }).catch(error => {
      // console.log('error in get getMovieInfo', error.response.data)
      reject(error.response.data);
    });
  });
}

// const echotest = txt => {
//   return new Promise(async (resolve, reject) => {
//      setTimeout(()=>{
//         if (txt=='error')
//           reject(`test error message`) 
//         else 
//           resolve(txt) 
//      }, 1000);
//   });
// }
module.exports = { getMovieInfo } //echotest