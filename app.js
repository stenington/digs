var express = require('express')
  , config = require('./config.js')
  , path = require('path')
  ;

var app = express.createServer(),
    store = {};

// require from static/scripts dir?
function randomString(length) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  var randomstring = '';
  for (var i=0; i<length; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum,rnum+1);
  }
  return randomstring;
}

app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'static')));

app.get('/dwellers', function(req, res){
  res.json(store, 200);
});
app.put('/dwellers', function(req, res){
  store = req.body; 
  res.send(200);
});
app.post('/dwellers', function(req, res){
  var key = randomString(6);
  store[key] = req.body;
  res.json(key, 201);
});
app.del('/dwellers', function(req, res){
  store = {};
  res.send(204);
});

app.get('/dwellers/:id', function(req, res){
  var key = req.params.id;
  if(store[key])
    res.json(store[key], 200);
  else 
    res.send(404);
});
app.put('/dwellers/:id', function(req, res){
  var key = req.params.id;
  var value = req.body;
  if(!key || !value || Object.keys(value).length == 0) {
    res.send(400);
  }
  else {
    var code = store[key] ? 200 : 201;
    store[key] = req.body;
    res.send(code);
  }
});
app.del('/dwellers/:id', function(req, res){
  var key = req.params.id;
  if(store[key])
    delete store[key];
  res.send(204);
});

module.exports = app;

if (!module.parent) {
  var port = process.env.PORT || config.port;
  console.log("Listening on", port);
  app.listen(port);
}
