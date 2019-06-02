'use strict';

const request = require('request-promise-native')
const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    function welcome(agent) {
        agent.add(`Welcome to my agent!`);
    }

    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    function teamInfo(agent) {
        return callTBA(agent.parameters.number).then(output => {
            let country = output.country;
            agent.add(`hahahahahaha from ${country}`)
            return Promise.resolve(agent)
        }, error => {
            console.log(`error: ${error}`)
            agent.add(`error`)
        }).catch(function (err) {
            console.log(`caught error ${err}`)
            agent.add(`more errors`)
        })
    }

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('team-origin', teamInfo);
    agent.handleRequest(intentMap);
});

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