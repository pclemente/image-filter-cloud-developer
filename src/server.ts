import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.

  app.get("/filteredimage/", async ( req, res ) => {
    let {image_url} = req.query;

    if (!image_url){
      return res.status(400).send('Please provide a Link');
    }

    try{
      let img = await filterImageFromURL(image_url);
      return res.status(200).sendFile(img, () =>{
        deleteLocalFiles([img])
      });
    }catch(err){
      return res.status(400).send('Invalid request');
    }
  } );

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
