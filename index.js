//npm install twit --save
//npm install express --save
//npm install 
//npm --save install twitter
//npm install pi-camera

var fs = require('fs');

path = require('path');

Twit = require('twit');


config = require('./config');

//var Twitter = require('twitter');
var express = require('express');
var app = express();

var bodyParser = require("body-parser");

var port = 7778
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

myCamera.snap()
  .then((result) => {
    // Your picture was captured
    console.log("OK",result)

    upload()

  })
  .catch((error) => {
     // Handle your error
	console.log(error)
  });



/*T.post('statuses/update', { status: 'Hola!!!' }, function(err, data, response) {
  console.log(data)
});*/

/*var twclient = new Twitter(config);
var usuario = {
    // en screen_name, pones el nombre de usuario sin la arroba.
    screen_name: 'pedromiguelpimienta', 
    // la cantidad de mensajes a obtener
    count: 1,
    // solo mensajes propios (no re-tweets) 
    include_rts: false
}; 

twclient.get('statuses/user_timeline', usuario, function(error, tweets, response){
if(error) throw error; // se produjo un error, manejar aquí

if (tweets.length) {
  console.log(tweets[0].text);  // el texto del ultimo twit, si hay alguno
}
});*/

app.get('/sacafoto', (req, res)=>{
	res.status(200).send("Foto sacada y publicada")
});


app.listen(port, ()=>{
	console.log("API REST funcionando en http://localhost:7777");
});
