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

    function nickName(agent){
        return callTBA(teamNumber).then(output => {
            let nickname = output.nickname;
            if(nickname == null) agent.add(`That team does not have a nickname.`);
            else agent.add(`Their nickname is ${nickname}`)
            console.log(`It worked`)
            isMoreInfo = true;
            moreInfo();
            return Promise.resolve(agent)
        }, error => {
            console.log(`error: ${error}`)
            findATeam(agent);
        }).catch(function (err) {
            console.log(`caught error ${err}`)
            findATeam(agent);
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
            findATeam(agent);
        }).catch(function (err) {
            console.log(`caught error ${err}`)
            findATeam(agent);
        })
        moreInfo();
    }

     function website(agent){
        return callTBA(teamNumber).then(output => {
            let website = output.website;
            if(website == null) agent.add(`That team does not have a website.`);
            else agent.add(`Their website is ${website}`)

            isMoreInfo = true;
            //calls moreInfo method to check if user wants to keep asking info
            console.log(`raptors in 7`)
            moreInfo();
            return Promise.resolve(agent)  
           
        }, error => {
            console.log(`error: ${error}`)
            findATeam(agent);
        }).catch(function (err) {
            console.log(`caught error ${err}`)
            findATeam(agent);
        })
    }

     function city(agent){
        return callTBA(teamNumber).then(output => {
            let city = output.city;
            if(city == null) agent.add(`That team does not have a city on file.`);
            else agent.add(`They are from ${city}`)
            console.log(`It worked`)
            isMoreInfo = true;
            //calls moreInfo method to check if user wants to keep asking info
            moreInfo();
            return Promise.resolve(agent)
        }, error => {
            console.log(`error: ${error}`)
            findATeamByCity(agent);
        }).catch(function (err) {
            console.log(`caught error ${err}`)
            findATeamByCity(agent);
        })
    }


     function rookieYear(agent){
        return callTBA(teamNumber).then(output => {
            let rookie_year = output.rookie_year;
            if(rookie_year == null) agent.add(`That team does not have a rookie year on file.`);
            else agent.add(`Their rookie year was ${rookie_year}`);
            console.log(`It worked`)
            isMoreInfo = true;
            //calls moreInfo method to check if user wants to keep asking info
            console.log(`raptors in 7`)
            moreInfo();
            return Promise.resolve(agent)
        }, error => {
            console.log(`error: ${error}`)
            findATeam(agent);
        }).catch(function (err) {
            console.log(`caught error ${err}`)
            findATeam(agent);
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
                findATeam(agent);
            }
        }
    
    function description(agent) {
        teamNumber = undefined;


        console.log(agent.parameters);
        let type = checkWord(agent.parameters.topic);
        const quickReplies = new Suggestion({
            title: choose,
            reply: `Main Menu`
        });

        if(type==`FLL Jr.`) {
            agent.add(`FIRST LEGO League Jr. is a non-competitive robotics program designed for younger robotics enthusiasts. It is designed to introduce STEM concepts to kids ages 6 to 10 while exciting them through a brand they know and love − LEGO®.`)
            quickReplies.title=`Teams learn about teamwork and the FLL Jr. Core Values, which include respect, sharing, and critical thinking.`;

            quickReplies.addReply_(`Is FLL Jr. for me?`);
            quickReplies.addReply_(`Learn about FLL Jr.`);
        } else if(type==`FLL`) {
            agent.add(`FIRST LEGO League introduces all kids ages 9 to 14 to real-world engineering challenges by building LEGO-based robots to complete tasks on a thematic playing surface.`);
            quickReplies.title=`Teams learn how to program a fully autonomous robot while integrating various sensors. They also learn about teamwork and the FIRST LEGO League Core Values, which include respect, sharing, and critical thinking.`;

            quickReplies.addReply_(`Is FLL for me?`);
            quickReplies.addReply_(`Learn more about FLL`);
        } else if(type==`FTC`) {
            agent.add(`FIRST Tech Challenge teams are comprised of kids in grades 7 to 12 who are challenged to design, build, program, and operate robots to compete in a head-to-head challenge in an alliance format.`);
            quickReplies.title=`Teams learn how to design, build, program and test a fully functioning robot. In the process, they also learn about teamwork, branding, sponsorship and gracious professionalism.`;

            quickReplies.addReply_(`Is FTC for me?`);
            quickReplies.addReply_(`Learn more about FTC`);
        } else if(type==`FRC`) {
            agent.add(`FIRST Robotics Competition teams include kids in grades 9 to 12 who compete in the ultimate sport of the mind.`);
            quickReplies.title=`Teams learn how to design, build, program and test a fully functioning robot. In the process, they also learn about teamwork, branding, sponsorship and gracious professionalism.`;
            
            quickReplies.addReply_(`Is FRC for me?`);
            quickReplies.addReply_(`Find a team`);
        } else {
            quickReplies.title=`I'm sorry, I don't know what program you are referring to.`;
        }

        agent.add(quickReplies);
    }

    function isThisForMe(agent) {
        teamNumber = undefined;

        
        console.log(agent.parameters);
        let type = checkWord(agent.parameters.topic);
        const quickReplies = new Suggestion({
            title: choose,
            reply: `Main Menu`
        });

        if(type==`FLL Jr.`) {
            agent.add(`Guided by adult Coaches, teams of up to 6 members explore a real-world scientific problem such as food safety, recycling, energy, etc.`);
            quickReplies.title=`They create a poster that illustrates their research and they build a motorized model of what they learned using LEGO elements.`;
            
            quickReplies.addReply_(`Describe FLL Jr.`);
            quickReplies.addReply_(`Learn about FLL Jr.`);
        } else if(type==`FLL`) {
            agent.add(`FLL teams are comprised of up to 10 students. They get to design, build, test and program robots using LEGO MINDSTORMS® technology, and apply real-world math and science concepts.`);
            quickReplies.title=`Students also research challenges facing today’s scientists and create innovative and viable solutions while learning critical thinking, team-building and presentation skills.`;
        
            quickReplies.addReply_(`Describe FLL`);
            quickReplies.addReply_(`Learn more about FLL`);
        } else if(type==`FTC`) {
            agent.add(`Guided by adult Coaches, teams of up to 15 students develop STEM skills and practice engineering principles, while realizing the value of hard work, innovation, and sharing ideas.`);
            quickReplies.title=`The robot kit can be programmed using a variety of languages. Teams must also raise funds, design and market their team brand, and do community outreach for which they can win awards.`;
            
            quickReplies.addReply_(`Describe FTC`);
            quickReplies.addReply_(`Learn more about FTC`);
        } else if(type==`FRC`) {
            agent.add(`Under strict rules, limited resources, and time limits, teams of 10 students or more are challenged to raise funds, hone teamwork skills, and build and program robots to perform prescribed tasks against a field of competitors.`);
            quickReplies.title=`To learn more about this program, get involved, find resources or speak to a local representative, visit https://www.firstroboticscanada.org/frc/.`;
        
            quickReplies.addReply_(`Describe FRC`);
            quickReplies.addReply_(`Find a team`);
        } else {
            quickReplies.title=`I'm sorry, I don't know what program you are referring to.`;
        }
        
        agent.add(quickReplies);
    }

    function learnMore(agent) {
        teamNumber = undefined;


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

    function findATeam(agent) {
        teamNumber = undefined;

        const quickReplies = new Suggestion({
            title: choose,
            reply: `Main Menu`
        });


        quickReplies.title=`Great! I can help you do that. Do you want to find a team by their city or by their number?`;
        quickReplies.addReply_(`By City`);
        quickReplies.addReply_(`By Number`);
    }

    function findATeamByNumber(agent) {
        teamNumber = undefined;

        agent.add(`Please type in the team number you are interested in.`);
    }

    
    function findATeamByCity(agent) {
        teamNumber = undefined;

        agent.add(`You can find a team near you by visiting this site https://www.firstroboticscanada.org/map/`);
        agent.add(`On this website you will be able to zoom into your city and find the closest FLL Jr., FLL, FTC, and FRC teams!`);
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
    intentMap.set(`findATeam`, findATeam);
    intentMap.set(`findATeamByNumber`, findATeamByNumber);
    intentMap.set(`findATeamByCity`, findATeamByCity);
    intentMap.set(`parentInquiry`, parentInquiry)
    intentMap.set(`mentorInquiry`, mentorInquiry)
    intentMap.set(`volunterInquiry`, volunterInquiry)
    intentMap.set(`travelInquiry`, travelInquiry)
    intentMap.set(`bestProgram`, bestProgram)
   // intentMap.set('More info', moreInfo);
    intentMap.set('teamResponse', getTeamNumber);
    agent.handleRequest(intentMap);
});

function parentInquiry(agent) {
    teamNumber = undefined;

    agent.add(`Parents can help out with their child’s team and/or sign up to be a volunteer at a competition!`);
    agent.add(`Reach out to your team lead if you are interested in helping out your child’s team or visit us for volunteer roles at https://www.firstroboticscanada.org/get-involved/volunteer/`);
}

function mentorInquiry(agent) {
    teamNumber = undefined;

    agent.add(`Students of all ages always need passionate mentors! To get involved with a team, visit us at https://www.firstroboticscanada.org/get-involved/mentor/`);
}

function volunterInquiry(agent) {
    teamNumber = undefined;

    agent.add(`There are lots of positions to fill at all levels of FIRST competitions. Visit us to learn more https://www.firstroboticscanada.org/get-involved/volunteer/`);
}

function travelInquiry(agent) {
    teamNumber = undefined;

    agent.add(`Team practices may occur on weekends but each team is different. Competitions on the other hand are always at least one weekend day long and take place locally.`);
    agent.add(`If your team qualifies for the World Championship, this competition is hosted in the US and will require international travel.`);
}



function \(agent) {
    teamNumber = undefined;

    const quickReplies = new Suggestion({
        title: choose,
        reply: `Main Menu`
    });

    quickReplies.title=`FLL Jr. is for kids 6-10, FLL for kids 9-14, FTC for kids 12-18 and FRC for kids 14-18.`;

    quickReplies.addReply_(`Learn more about FLL Jr.`);
    quickReplies.addReply_(`Learn more about FLL`);
    quickReplies.addReply_(`Learn more about FTC`);
    quickReplies.addReply_(`Learn more about FRC`);
}





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
