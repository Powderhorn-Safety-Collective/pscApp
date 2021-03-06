const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const router = express.Router();

// route to get list of on call members
router.get('/', rejectUnauthenticated, (req, res) => {
  if (req.user.role > 1) {
    let queryText = `select id, username, first_name from "user"
    where on_call = true;`;
    pool.query(queryText).then((result) => {
      res.send(result.rows)
    }).catch((error) => {
      console.log('Error in get patrol', error);
      res.sendStatus(500);
    })
  }
  else {
    res.sendStatus(403);
  }
})

// route to get count of on call members
router.get('/count', (req, res) => {
  const queryText =   `select count(*) from "user"
                      where on_call = true;`;

  pool.query(queryText).then((result) => {
    console.log('result', result.rows[0]);
    res.send(result.rows[0]);
  }).catch((error) => {
    console.log('error in get on call count route', error);
    res.sendStatus(500);
  });
});

// update a user's oncall status 
router.put('/status', (req,res) => {
  if (req.user.role > 1) {
    console.log('On call route', req.body.onCallValue);
    let queryText = `UPDATE "user" 
    SET "on_call" = $1
    WHERE "id" = $2;`;
    pool.query(queryText, [req.body.onCallValue, req.user.id]).then((result) => {
      res.sendStatus(202)
    }).catch(error => {
      console.log('error in patrol status router', error);
      res.sendStatus(500)
    });
  }
  else {
    res.sendStatus(403);
  }
});

module.exports = router;