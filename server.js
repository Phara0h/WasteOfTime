var express = require('express');
var http = require('http');
var config = require('./config.js');

var app = express();
var server = http.createServer(app);

var stats = require('nstats')();
stats.interval = 0;
app.use(stats.express);


app.get('/wot/api/time/random?', function(req, res, next)
{
  var min = req.query.min || 1;
  var max = req.query.max || 5;
  wastetime((Math.random() * max + min), ()=>{
      res.status(200).send();
  });
});

app.get('/wot/api/time/seconds/:seconds', function(req, res, next)
{
  wastetime(req.params.seconds, ()=>{
      res.status(200).send();
  });
});

app.get('/wot/api/time/minutes/:minutes', function(req, res, next)
{
  wastetime(req.params.minutes*60, ()=>{
      res.status(200).send();
  });
});


app.get('/wot/api/time/hours/:hours', function(req, res, next)
{
  wastetime(req.params.hours*3600, ()=>{
      res.status(200).send();
  });
});


function wastetime(seconds, cb)
{
  setTimeout(cb,seconds*1000);
}

/**
 * @api {get} /server/stats Get Server Stats
 * @apiName GetServerStats
 * @apiGroup Server
 * @apiDescription Get the node server stats of the Symbiont server.
 *
 * @apiSuccessExample Example-Response:
 *   {
 *     "uptime": "00:00:01",
 *     "totalMemory": "33.00",
 *     "totalOnlineUsers": 0,
 *     "avgWriteKBs": "0.00",
 *     "avgReadKBs": "0.62",
 *     "avgPacketsSecond": "1.28",
 *     "bytesWritten": 0,
 *     "totalBytesWritten": 0,
 *     "totalMBytesWritten": 0,
 *     "bytesRead": 0,
 *     "totalBytesRead": 993,
 *     "totalMBytesRead": 0,
 *     "writeKBS": "0.00",
 *     "readKBS": "0.76",
 *     "totalPackets": 2
 *   }
 *
 * @apiSampleRequest /server/stats
 */
app.get('/wot/api/server/stats', (req, res) =>
{
    process.nextTick(() =>
    {
        stats.calc(() =>
        {
            res.json(stats.data);
        });
    })
});


server.listen(config.port, config.host);

console.log('Waste Of Time');
console.log('Version: 1.0');
console.log('Running on ' + config.host + ':' + config.port);

process.on('uncaughtException', function(error)
{
    console.log(error.stack);
});
