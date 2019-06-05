'use strict';

const request = require('request-promise-native')
const functions = require('firebase-functions');
//const { WebhookClient } = require('dialogflow-webhook');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

//global varaibles
global.teamNumber = undefined;
global.isMoreInfo = false;

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
    

    function welcome(agent) {
        agent.add(`Hi, I'm the FIRST Canada information bot!`);
        agent.add(`To get started, take a look through our four different programs!`);
    }

    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    function getTeamNumber(agent) {
        teamNumber = agent.parameters.number;
        agent.add(`I know that team. They're awesome.
        I can help you find out a lot about them including 
        their nickname, rookie year, city,events 
        attended and their website. What would you
        like to know?`);
        //agent.add(`${teamNumber}`);
        console.log(`team number: ${teamNumber}`)
    }

/*
    function teamInfo(agent) {
        return callTBA(agent.parameters.number).then(output => {
            let country = output.country;
            agent.add(`hahahahahaha from ${country}`)
            console.log(`It worked`)
            return Promise.resolve(agent)
        }, error => {
            console.log(`error: ${error}`)
            agent.add(`error`)
        }).catch(function (err) {
            console.log(`caught error ${err}`)
            agent.add(`more errors`)
        })
    }
*/
    function nickName(agent){
        return callTBA(teamNumber).then(output => {
            let nickname = output.nickname;
            agent.add(`Their nickname is ${nickname}`)
            console.log(`It worked`)
            isMoreInfo = true;
            //calls moreInfo method to check if user wants to keep asking info
            console.log(`raptors in 7`)
            moreInfo();
            return Promise.resolve(agent)
        }, error => {
            console.log(`error: ${error}`)
            agent.add(`error`)
        }).catch(function (err) {
            console.log(`caught error ${err}`)
            agent.add(`more errors`)
        })
        moreInfo();
    }

     function website(agent){
        return callTBA(teamNumber).then(output => {
            let website = output.website;
            agent.add(`Their website is ${website}`)
            console.log(`It worked`)
            isMoreInfo = true;
            //calls moreInfo method to check if user wants to keep asking info
            console.log(`raptors in 7`)
            moreInfo();
            return Promise.resolve(agent)  
           
        }, error => {
            console.log(`error: ${error}`)
            agent.add(`error`)
        }).catch(function (err) {
            console.log(`caught error ${err}`)
            agent.add(`more errors`)
        })
    }

     function city(agent){
        return callTBA(teamNumber).then(output => {
            let city = output.city;
            agent.add(`The city the team lives in is ${city}`)
            console.log(`It worked`)
            isMoreInfo = true;
            //calls moreInfo method to check if user wants to keep asking info
            console.log(`raptors in 7`)
            moreInfo();
            return Promise.resolve(agent)
        }, error => {
            console.log(`error: ${error}`)
            agent.add(`error`)
        }).catch(function (err) {
            console.log(`caught error ${err}`)
            agent.add(`more errors`)
        })
    }

     function rookieYear(agent){
        return callTBA(teamNumber).then(output => {
            let rookie_year = output.rookie_year;
            agent.add(`Their rookie year was ${rookie_year}`)
            console.log(`It worked`)
            isMoreInfo = true;
            //calls moreInfo method to check if user wants to keep asking info
            console.log(`raptors in 7`)
            moreInfo();
            return Promise.resolve(agent)
        }, error => {
            console.log(`error: ${error}`)
            agent.add(`error`)
        }).catch(function (err) {
            console.log(`caught error ${err}`)
            agent.add(`more errors`)
        })
    }
    
        function moreInfo(){

            if (isMoreInfo){
            agent.add(`Do you want to know anything else about them?`)

            let response;

            response = {
        "message": {
                    "text": "Hello, Facebook!"
                }
            }
         
            agent.add(`${response}`); 
            isMoreInfo = false;
        }
            else {
             agent.add(`error`)
              }


        }
    
    function description(agent) {
        console.log(agent.parameters);
        let type = agent.parameters.topic;
        if(type==`FLL Jr.`) {
            agent.add(`FIRST LEGO League Jr. is a non-competitive robotics program designed for younger robotics enthusiasts. It is designed to introduce STEM concepts to kids ages 6 to 10 while exciting them through a brand they know and love − LEGO®.`);
        } else if(type==`FLL`) {
            agent.add(`FIRST LEGO League introduces younger students to real-world engineering challenges by building LEGO-based robots to complete tasks on a thematic playing surface.`);
        } else if(type==`FTC`) {
            agent.add(`FIRST Tech Challenge teams (10+ members) are challenged to design, build, program, and operate robots to compete in a head-to-head challenge in an alliance format.`);
        } else if(type==`FRC`) {
            agent.add(`Combining the excitement of sport with the rigors of science and technology, we call FIRST Robotics Competition the ultimate Sport for the Mind.`);
            agent.add(`Built from scratch in only 6 weeks, robots compete in high intensity robo-sports.`);
        } else {
            agent.add(`I'm sorry, I don't know what program you are referring to.`);
        }
       
        /*var replies = [{
            "card": {
                "title": "card title",
                "subtitle": "card text",
                "imageUrl": "https://assistant.google.com/static/images/molecule/Molecule-Formation-stop.png",
                "buttons": [{
                    "text": "button text",
                    "postback": "https://assistant.google.com/"
                }]
            }
        }];*/
    }

    function isThisForMe(agent) {
        console.log(agent.parameters);
        let type = agent.parameters.topic;
        if(type==`FLL Jr.`) {
            agent.add(`Guided by adult Coaches, teams of up to 6 members explore a real-world scientific problem such as food safety, recycling, energy, etc.`);
            agent.add(`They create a poster that illustrates their research and they build a motorized model of what they learned using LEGO elements.`);
            agent.add(`In the process, teams learn about teamwork, the wonders of science and technology, and the FIRST LEGO League Jr. Core Values, which include respect, sharing, and critical thinking.`);
        } else if(type==`FLL`) {
            agent.add(`As a part of an FLL team, students get to design, build, test and program robots using LEGO MINDSTORMS® technology, and apply real-world math and science concepts.`);
            agent.add(`Students also research challenges facing today’s scientists and create innovative and viable solutions while learning critical thinking, team-building and presentation skills.`);
        } else if(type==`FTC`) {
            agent.add(`Guided by adult Coaches and Mentors, students develop STEM skills and practice engineering principles, while realizing the value of hard work, innovation, and sharing ideas.`);
            agent.add(`The robot kit can be programmed using a variety of languages. Teams must also raise funds, design and market their team brand, and do community outreach for which they can win awards.`);
        } else if(type==`FRC`) {
            agent.add(`Under strict rules, limited resources, and time limits, teams of 25 students or more are challenged to raise funds, hone teamwork skills, and build and program robots to perform prescribed tasks against a field of competitors.`);
            agent.add(`To learn more about this program, get involved, find resources or speak to a local representative, visit https://www.firstroboticscanada.org/frc/.`);
        } else {
            agent.add(`I'm sorry, I don't know what program you are referring to.`);
        }
    }

    function learnMore(agent) {
        console.log(agent.parameters);
        let type = agent.parameters.topic;
        if(type==`FLL Jr.`) {
            agent.add(`To learn more about this program, get involved, find teams or speak to a local representative, visit https://www.firstroboticscanada.org/flljr/.`);
        } else if(type==`FLL`) {
            agent.add(`To learn more about this program, get involved, find teams or speak to a local representative, visit https://www.firstroboticscanada.org/fll/.`);
        } else if(type==`FTC`) {
            agent.add(`To learn more about this program, get involved, find teams or speak to a local representative, visit https://www.firstroboticscanada.org/ftc/.`);
        } else if(type==`FRC`) {
            agent.add(`To learn more about this program, get involved, find resources or speak to a local representative, visit https://www.firstroboticscanada.org/frc/.`);
        } else {
            agent.add(`I'm sorry, I don't know what program you are referring to.`);
        }
    }

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('welcome', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    //intentMap.set('team-origin', teamInfo);
    intentMap.set('description', description);
    intentMap.set('is-this-for-me', isThisForMe);
    intentMap.set('learn-more', learnMore);
    intentMap.set('Nickname', nickName);
    intentMap.set('City', city);
    intentMap.set('Rookie year', rookieYear);
    intentMap.set('Website', website);
   // intentMap.set('More info', moreInfo);
    intentMap.set('teamResponse', getTeamNumber);
    agent.handleRequest(intentMap);
});


function callTBA(teamNumbers) {
    const options = {
        url: 'https://www.thebluealliance.com/api/v3/team/frc' + teamNumbers,
        headers:
        {
            'X-TBA-Auth-Key': 'iILYwywnVYDP36CtgFVYcZC97yci1cvRtd94iehC541M9gkMVn6VuFxhtSRBqVHe'
        },
        json: true
    }
    return request(options)
}
/*
function callTBA(teamNumber) {
    const options = {
        url: 'https://www.thebluealliance.com/api/v3/team/frc'+teamNumber,
        headers:
        {
            'X-TBA-Auth-Key': 'iILYwywnVYDP36CtgFVYcZC97yci1cvRtd94iehC541M9gkMVn6VuFxhtSRBqVHe'
        },
        json: true
    }
    return request(options)
}
*/
