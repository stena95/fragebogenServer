var express = require( 'express' ); // Server
var bp = require( 'body-parser' ); // Inhalte aus dem Request auslesen!!!
var fs = require( 'fs' );
var jsonData = fs.readFileSync('antworten.json');
var parsedData = JSON.parse(jsonData);

var app = express();
var server = app.listen( 3000, function() {
  console.log( 'Server Highscore Port 3000 gestartet.');
});

var clientAuswertung;
var auswertungen;
var fragen = 16;
var antwortArr = [4,3,4,4,1,4,4,3,6,3,4,10,3,3,4,3];

app.use( function( request, response, next ) {
  response.setHeader( 'Access-Control-Allow-Origin', '*' );
  response.setHeader( 'Access-Control-Allow-Methods', 'GET, POST, DELETE' );
  response.setHeader( 'Access-Control-Allow-Headers', 'Content-Type' );
  next();
});

app.use( bp.json() ); // application/json

fs.readFile( 'antworten.json', function( err, data ) {
  auswertungen = JSON.parse( data );
  console.log(auswertungen.antworten);
} );

var saveDataToFile = function(data) {
  fs.writeFile( 'antworten.json', JSON.stringify( data, null, 2 ), function() {
  });
}

app.post( '/FragebogenBSEnd', function( request, response) {
  console.log( 'POST Request an Server' );

  clientAuswertung = request.body.ergebnis;
  for(var i = 0; i < fragen; i++){
    if(i != 4){
      for(var j = 0; j < antwortArr[i]; j++){
        auswertungen.antworten[i][j] += clientAuswertung[i][j];
        //auswertungen.antworten[i][j] = 0;
      }
    }else{
      auswertungen.antworten[i] += ", ["+clientAuswertung[i]+"]";
    }
  }
  console.log("Client: ", clientAuswertung);
  console.log("Server: ", auswertungen);
  saveDataToFile(auswertungen);
  response.end( JSON.stringify( {success:true} ) );
});
