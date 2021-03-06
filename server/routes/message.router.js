const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
    rejectUnauthenticated,
  } = require('../modules/authentication-middleware');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// route for if a user gets an update on an incident they are following
// take in incident id to find followers and client_id to display on text message
router.post('/update', rejectUnauthenticated, (req, res) => {
  if (req.user.role > 1) {
    console.log('update message', req.body);

    const queryText = `select phone from "user" 
    join incident_followers
    on "user".id = incident_followers.user_id
    where incident_followers.incident_id = $1;`

    pool.query(queryText, [req.body.id]).then((result) => {
      console.log('result', result.rows);
      for (let i = 0; i < result.rows.length; i++) {
        client.messages
        .create({
          body: `The incident you are following, number ${req.body.client_id}, has been updated.  You may log into the PSC app to view details`,
          from: process.env.TWILIO_NUMBER,
          to: `${result.rows[i].phone}`
        })
        .then(message => console.log(message.sid));
      }
      res.sendStatus(200);
    }).catch((error)=>{
      console.log('error', error);
      res.sendStatus(500);
    });
  }
  else {
    res.sendStatus(403);
  }
});

// route for sending a notice to people on patrol / on call and admins when a new incident is submitted
router.post('/newIncident', (req, res) => {
  console.log('newIncident post router', req.body);

  const queryText =  `select phone from "user" 
                      where on_patrol = true
                      or on_call = true
                      or role = 3;`
  
  pool.query(queryText).then((result) => {
    console.log('message new incident result', result.rows);
    for( let i = 0; i < result.rows.length; i++) {
      client.messages
      .create({
        body: `There has been a new incident submitted.  You may view it in the PSC app.  It is number ${req.body.client_id}`,
        from: process.env.TWILIO_NUMBER,
        to: `${result.rows[i].phone}`
      })
      .then(message => console.log(message.sid));
    }
    res.sendStatus(200);
  }).catch((error) => {
    console.log('error', error);
    res.sendStatus(500);
  });
});

// route for sending a notice one person on patrol / on call to investigate an incident if it is assigned to them
router.post('/assigned', rejectUnauthenticated, (req, res) => {
  if (req.user.role > 1) {
    console.log('assigned req.body', req.body);
  
    const queryText =  `select phone from incidents
                        join "user"
                        on incidents.assigned_user = "user".id
                        where incidents.id = $1;`;

    pool.query(queryText, [req.body.incident]).then((result) => {

      client.messages
      .create({
        body: `You have been assigned to an incident.  You may view it in the PSC app.  It is number ${req.body.client_id}`,
        from: process.env.TWILIO_NUMBER,
        to: `${result.rows[0].phone}`
      })
      .then(message => console.log(message.sid));
      res.sendStatus(200);
    }).catch((error) => {
      console.log('error', error);
      res.sendStatus(500);
    });
  }
  else {
    res.sendStatus(403);
  }
});

module.exports = router;