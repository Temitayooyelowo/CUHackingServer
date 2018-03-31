/*
CUHacking Server
Before you can run this app first execute:
>npm install ecstatic
Then launch this server:
>node app.js

Then open several browsers to: http://localhost:3000/index.html
*/

var http = require('http'); //needed to receive http requests
var ecStatic = require('ecstatic');  //provides convenient static file server service
var WebSocketServer = require('ws').Server;
//var id = 1;
var sentId = 0;

const SECRET_CODE = "12UYIUmkjkjhlj";
const MASTER_ID = 0;
const BRANCH_ID = 1;

//static file server based on npm module ecstatic
var server = http.createServer(ecStatic({root: __dirname + '/www'}));

var wss = new WebSocketServer({server: server});
wss.on('connection', function(ws) {
  console.log('Client connecting');
 
  ws.on('message', function(msg) {
	  
	  if((ws.id !== MASTER_ID) && (ws.id !== BRANCH_ID)){ //check if user does not have an id
		  console.log("No id set!!!!!!!!!!!!");
		  if(msg === SECRET_CODE){
			  ws.send('Connected to Server. Master...');
			  
			  ws.id = MASTER_ID;
			  console.log(`Master id is ${ws.id}`);
		  }else{
			  ws.send('Connected to Server. NOT Master....');
			  
			  ws.id = BRANCH_ID; // sets the MASTER ID if the id is not defined
			  console.log(`Branch Id is ${ws.id}`);
		  }
	  }else{ // in this case the user has an id
		  if(ws.id === MASTER_ID){
			  console.log(`Master id just sent a message`);
			  broadcast(msg);
		  }else{
			  console.log(`Branch id not allowed to send a message`);
		  }
	  }
	  
  })
  
  ws.on('error', function(e){
	 console.log("Connection killed abruptly"); 
  });

})

function broadcast(msg) {
  wss.clients.forEach(function(client) {
	  if(client.id !== MASTER_ID){ //send to connected client 
		client.send(`Client ${BRANCH_ID}: ${msg}`);
	  }
  })
}

server.listen(3000); //listen on port 3000
console.log('Server Running at port 3000  CNTL-C to quit');
console.log('To Test: open several browsers to: http://localhost:3000/index.html')
