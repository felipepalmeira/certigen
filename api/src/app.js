
const express = require('express');


const bodyParser = require('body-parser');


const certificateRoutes = require('./routes/certificateRoutes');


const app = express();


app.use(bodyParser.json());


app.use(certificateRoutes);


const PORT = 3000;


app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
