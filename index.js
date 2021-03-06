//npm install twit --save
//npm install express --save
//npm install 
//npm --save install twitter
//npm install pi-camera

var fs = require('fs');

path = require('path');

Twit = require('twit');


var config = require('./config');

//var Twitter = require('twitter');
var express = require('express');
var app = express();

var bodyParser = require("body-parser");

var port = 7777
app.use(bodyParser.urlencoded( {extended:false} ) )
app.use( bodyParser.json() )

app.use( (req, res, next) => {
	//permitimos que las peticiones se puedan hacer desde cualquier sitio
	res.header('Access-Control-Allow-Origin', '*')
	//res.header('Access-Control-Allow-Origin', '192.168.0.11')
	// configuramos las cabeceras que pueden llegar
	res.header('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method' )
	// configuramos los métodos que nos pueden llegar
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
	next(); // para que se salga de esta función
})

var T = new Twit(config);

function upload(){
    console.log('Opening an image...');
    var image_path = path.join('test.jpg'),
        b64content = fs.readFileSync(image_path, { encoding: 'base64' });
  
    console.log('Uploading an image...');
  
    T.post('media/upload', { media_data: b64content }, function (err, data, response) {
      if (err){
        console.log('ERROR:');
        console.log(err);
      }
      else{
        console.log('Image uploaded!');
        console.log('Now tweeting it...');
  
        T.post('statuses/update', {
            media_ids: new Array(data.media_id_string)
          },
          function(err, data, response) {
            if (err){
              console.log('ERROR:');
              console.log(err);
            }
            else{
              console.log('Posted an image!');
            }
          }
        );
      }
    });
  }

const PiCamera = require('pi-camera');
const myCamera = new PiCamera({
  mode: 'photo',
  output: `test.jpg`,
  width: 640,
  height: 480,
  nopreview: true,
});





/*T.post('statuses/update', { status: 'Hola!!!' }, function(err, data, response) {
  console.log(data)
});*/



app.get('/sacafoto', (req, res)=>{

	myCamera.snap()
	  .then((result) => {
	    // Your picture was captured
	    console.log("OK",result)
	
	    upload()
		
	
	  })
	  .catch((error) => {
	     // Handle your error
		console.log(error)
	res.status(500).send("Fallo al sacar la foto")
  });

	
});



app.listen(port, ()=>{
	console.log("API REST funcionando en http://localhost:7777");
});


var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(4, 'out'); //use GPIO pin 4 as output
var pushButton = new Gpio(17, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled

pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton GPIO, specify callback function
  if (err) { //if an error
    console.error('There was an error', err); //output error message to console
  return;
  }
  LED.writeSync(value); //turn LED on or off depending on the button state (0 or 1)
});

function unexportOnClose() { //function to run when exiting program
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport LED GPIO to free resources
  pushButton.unexport(); // Unexport Button GPIO to free resources
};

process.on('SIGINT', unexportOnClose); //function to run when user closes using ctrl+c