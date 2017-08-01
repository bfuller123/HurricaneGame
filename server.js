const express = require('express');
const path = require('path')
const myApp = express();

const PORT = process.env.PORT || 3000;

myApp.use(express.static(__dirname + '/public'));

myApp.get('/', function(req, res){
  res.sendFile(path.join(__dirname, "public/index.html"));
})

myApp.listen(PORT, function(){
  console.log(`Listening on port ${PORT}`);
})
