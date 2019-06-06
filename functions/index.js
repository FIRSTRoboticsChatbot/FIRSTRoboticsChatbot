'use strict';

const request = require('request-promise-native')
const functions = require('firebase-functions');
//const { WebhookClient } = require('dialogflow-webhook');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const choose = `Please choose an option`;

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

//global varaibles
global.teamNumber = undefined;
global.isMoreInfo = false;



exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    function getTeamNumber(agent) {
        teamNumber = agent.parameters.number;
        agent.add(`I know that team. They're awesome.`);
        agent.add(`I can help you find out a lot about them including their nickname, rookie year, city, events attended, and their website. What would you like to know?`);
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

     function getEvents(agent){
        return callTBA2(teamNumber).then(output => {
            agent.add(`The events they attended were: `)
            output.map(eventsObj => {
               agent.add(eventsObj.name);
            });
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
            console.log(`raptors in 6`)
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
            
            const quickReplies = new Suggestion({
            title: `Do you want to know anything else about them?`,
            reply: `Main Menu`
        });

            agent.add(quickReplies);    
            isMoreInfo = false;
        }
            else {
             agent.add(`error`)
              }
        }
    
    function description(agent) {
        console.log(agent.parameters);
        let type = checkWord(agent.parameters.topic);
        const quickReplies = new Suggestion({
            title: choose,
            reply: `Main Menu`
        });

        if(type==`FLL Jr.`) {
            quickReplies.title=`FIRST LEGO League Jr. is a non-competitive robotics program designed for younger robotics enthusiasts. It is designed to introduce STEM concepts to kids ages 6 to 10 while exciting them through a brand they know and love − LEGO®.`;
        
            quickReplies.addReply_(`Is FLL Jr. for me?`);
            quickReplies.addReply_(`Learn more about FLL Jr.`);
        } else if(type==`FLL`) {
            quickReplies.title=`FIRST LEGO League introduces younger students to real-world engineering challenges by building LEGO-based robots to complete tasks on a thematic playing surface.`;

            quickReplies.addReply_(`Is FLL for me?`);
            quickReplies.addReply_(`Learn more about FLL`);
        } else if(type==`FTC`) {
            quickReplies.title=`FIRST Tech Challenge teams (10+ members) are challenged to design, build, program, and operate robots to compete in a head-to-head challenge in an alliance format.`;

            quickReplies.addReply_(`Is FTC for me?`);
            quickReplies.addReply_(`Learn more about FTC`);
        } else if(type==`FRC`) {
            agent.add(`Combining the excitement of sport with the rigors of science and technology, we call FIRST Robotics Competition the ultimate Sport for the Mind.`);
            agent.add(`Built from scratch in only 6 weeks, robots compete in high intensity robo-sports.`);
            quickReplies.title=`To learn more about this program, get involved, find resources or speak to a local representative, visit https://www.firstroboticscanada.org/frc/.`;

            quickReplies.addReply_(`Is FRC for me?`);
            quickReplies.addReply_(`Find a team`);
        } else {
            quickReplies.title=`I'm sorry, I don't know what program you are referring to.`;
        }

        agent.add(quickReplies);
    }

    function isThisForMe(agent) {
        console.log(agent.parameters);
        let type = checkWord(agent.parameters.topic);
        const quickReplies = new Suggestion({
            title: choose,
            reply: `Main Menu`
        });

        if(type==`FLL Jr.`) {
            agent.add(`Guided by adult Coaches, teams of up to 6 members explore a real-world scientific problem such as food safety, recycling, energy, etc.`);
            agent.add(`They create a poster that illustrates their research and they build a motorized model of what they learned using LEGO elements.`);
            quickReplies.title=`In the process, teams learn about teamwork, the wonders of science and technology, and the FIRST LEGO League Jr. Core Values, which include respect, sharing, and critical thinking.`;
            
            quickReplies.addReply_(`Describe FLL Jr.`);
            quickReplies.addReply_(`Learn more about FLL Jr.`);
        } else if(type==`FLL`) {
            agent.add(`As a part of an FLL team, students get to design, build, test and program robots using LEGO MINDSTORMS® technology, and apply real-world math and science concepts.`);
            quickReplies.title=`Students also research challenges facing today’s scientists and create innovative and viable solutions while learning critical thinking, team-building and presentation skills.`;
        
            quickReplies.addReply_(`Describe FLL`);
            quickReplies.addReply_(`Learn more about FLL`);
        } else if(type==`FTC`) {
            agent.add(`Guided by adult Coaches and Mentors, students develop STEM skills and practice engineering principles, while realizing the value of hard work, innovation, and sharing ideas.`);
            quickReplies.title=`The robot kit can be programmed using a variety of languages. Teams must also raise funds, design and market their team brand, and do community outreach for which they can win awards.`;
            
            quickReplies.addReply_(`Describe FTC`);
            quickReplies.addReply_(`Learn more about FTC`);
        } else if(type==`FRC`) {
            agent.add(`Under strict rules, limited resources, and time limits, teams of 25 students or more are challenged to raise funds, hone teamwork skills, and build and program robots to perform prescribed tasks against a field of competitors.`);
            quickReplies.title=`To learn more about this program, get involved, find resources or speak to a local representative, visit https://www.firstroboticscanada.org/frc/.`;
        
            quickReplies.addReply_(`Describe FRC`);
            quickReplies.addReply_(`Find a team`);
        } else {
            quickReplies.title=`I'm sorry, I don't know what program you are referring to.`;
        }
        
        agent.add(quickReplies);
    }

    function learnMore(agent) {
        console.log(agent.parameters);
        let type = checkWord(agent.parameters.topic);
        const quickReplies = new Suggestion({
            title: choose,
            reply: `Main Menu`
        });

        if(type==`FLL Jr.`) {
            quickReplies.title=`To learn more about this program, get involved, find teams or speak to a local representative, visit https://www.firstroboticscanada.org/flljr/.`;
        
            quickReplies.addReply_(`Describe FLL Jr.`);
            quickReplies.addReply_(`Is FLL Jr. for me?`);
        } else if(type==`FLL`) {
            quickReplies.title=`To learn more about this program, get involved, find teams or speak to a local representative, visit https://www.firstroboticscanada.org/fll/.`;
        
            quickReplies.addReply_(`Describe FLL`);
            quickReplies.addReply_(`Is FLL for me?`);
        } else if(type==`FTC`) {
            quickReplies.title=`To learn more about this program, get involved, find teams or speak to a local representative, visit https://www.firstroboticscanada.org/ftc/.`;
        
            quickReplies.addReply_(`Describe FTC`);
            quickReplies.addReply_(`Is FTC for me?`);
        } else if(type==`FRC`) {
            quickReplies.title=`To learn more about this program, get involved, find resources or speak to a local representative, visit https://www.firstroboticscanada.org/frc/.`;
        
            quickReplies.addReply_(`Describe FRC.`);
            quickReplies.addReply_(`Is FRC. for me?`);
        } else {
            quickReplies.title=`I'm sorry, I don't know what program you are referring to.`;
        }

        agent.add(quickReplies);
    }

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    //intentMap.set('Default Welcome Intent', welcome);
    //intentMap.set('welcome', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    //intentMap.set('team-origin', teamInfo);
    intentMap.set('description', description);
    intentMap.set('is-this-for-me', isThisForMe);
    intentMap.set('learn-more', learnMore);
    intentMap.set('Nickname', nickName);
    intentMap.set('City', city);
    intentMap.set('Rookie year', rookieYear);
    intentMap.set('Website', website);
    intentMap.set('Events', getEvents);
   // intentMap.set('More info', moreInfo);
    intentMap.set('teamResponse', getTeamNumber);
    agent.handleRequest(intentMap);
});


function callTBA2(teamNumbers) {
    const options = {
        url: 'https://www.thebluealliance.com/api/v3/team/frc' + teamNumbers + '/events/2019/simple',
        headers:
        {
            'X-TBA-Auth-Key': 'iILYwywnVYDP36CtgFVYcZC97yci1cvRtd94iehC541M9gkMVn6VuFxhtSRBqVHe'
        },
        json: true
    }
    return request(options)
}

function callTBA(teamNumbers) {
    const options = {
        url: 'https://www.thebluealliance.com/api/v3/team/frc' + teamNumbers ,
        headers:
        {
            'X-TBA-Auth-Key': 'iILYwywnVYDP36CtgFVYcZC97yci1cvRtd94iehC541M9gkMVn6VuFxhtSRBqVHe'
        },
        json: true
    }
    return request(options)
}

function checkWord(word) {
    word = word.toLowerCase();
    if(word==`first lego league jr` ||
        word==`first lego league jr.` ||
        word==`fll jr` ||
        word==`fll jr.`) return `FLL Jr.`;
    else if(word==`first lego league`||
        word==`fll`) return `FLL`;
    else if(word==`first tech challenge` ||
        word==`first technology challenge` ||
        word==`ftc`) return `FTC`;
    else if(word==`first robotics competition` ||
        word==`first robotics challenge` ||
        word==`frc`) return `FRC`;
    else return word;
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
