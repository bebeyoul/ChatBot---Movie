'use strict';
const matcher = require('./matcher');
const timeservice = require('./time-service')


async function handler(fb, msg) {
  await fb.action(msg.sender, 'typing_on');

  matcher(msg.content, async data => {
    try {
      switch (data.intent) {
        case 'Hello':
          await fb.txt(msg.sender, `${data.entities.greeting} to you too!`);
          await fb.img(msg.sender, 'https://picsum.photos/300/200');
          break;


        case 'Exit':
          await fb.txt(msg.sender, "Have a great day!");
          break;


        case 'Time':
          await fb.txt(msg.sender, `Let me check... it takes time`);
          await fb.action(msg.sender, 'typing_on');
          let city = data.entities.city;
          timeservice.getTime(city)
            .then(async response => {
              await fb.txt(msg.sender, `${city}'s time is ${response}`);
            })
            .catch(async error => {
              console.error(error);
              await fb.txt(msg.sender, "There seems to be a problem connecting to the time service.");
            });
          break;

        // case 'get weather':
        //   console.log(`Meteo `)
          // console.log(`Meteo in ${data.entities.city}`);
          
        //   break;

        // case 'current weather':
        //   console.log(`current weather is: `)
          // console.log(`Current meteo in ${data.entities.city}`);
          // console.log(`Temperature: ${weather(data.entities.city)}`)

          // weather(data.entities.city, 'current')
          //   .then(response => {
          //     console.log(currentWeather(response));
          //     rl.prompt();
          //   })
          //   .catch(error => {
          //     console.log("There seems to be a problem connecting to the Weather service.");
          //     rl.prompt();
          //   });


        case 'Help':
          await fb.txt(msg.sender, `Ask me: what is the time of Paris?`);
          break;


        default:
          // await fb.txt(msg.sender, "I don't know what you mean :( May be you were taking about a movie");
          // await fb.action(msg.sender, 'typing_on');
          // timeservice.echotest(msg.content)
          //   .then(async response => {
          //     await fb.txt(msg.sender, `i know you said ${response}`);
          //   })
          //   .catch(async error => {
          //     console.error(error);
          //     await fb.txt(msg.sender, "There seems to be a problem connecting to the time service.");
          //   });
      }
    } catch (e) {
      console.error("Error occurred", e);
      await fb.txt(msg.sender, "An internal error occurred.");
    }
  });
}

module.exports = handler;