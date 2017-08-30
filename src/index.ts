const express = require('express');
const multer = require('multer');
const app = express();
const server = require('http').Server(app);
const fs = require('fs');
const path = require('path');

const appRoot = path.join(__dirname, './app');

const multerStorage = multer.memoryStorage()
const multerUpload = multer({ storage: multerStorage });

const dataPath = '/data/data';

const errorPage = (errorHtml) => `<!doctype HTML>
<html>
  <head>
    <title>Upload Error</title>
  </head>
  <body>
    <h1>The following errors occurred</h1>
    ${errorHtml}
  </body>
</html>`;

const uploadTypes = {
  catch: (params, add) => path.join(dataPath, 'fisheries/Catch data/Entered to check/', `${params.type} ${params.village} ${params.date} ${params.name}${add}.xlsx`),
  effort: (params, add) => path.join(dataPath, 'fisheries/Effort data/Entered to check/', `${params.type} ${params.village} ${params.date} ${params.name}${add}.xlsx`)
};

console.log(`Web root is ${appRoot}`);
app.use('/', express.static(appRoot));

app.post('/', multerUpload.single('file'), (req, res, next) => {
  let date;

  let errors = [];

  // Check have all the required data
  if (!req.body.name) {
    errors.push('Your name is required (first name and last initial)');
  }

  if (!req.body.type || typeof uploadTypes[req.body.type] === 'undefined') {
    errors.push('A valid type of data you are uploading is required');
  }

  if (!req.body.village) {
    errors.push('The village that the data is for is required');
  }

  if (!req.body.date || isNaN((date = new Date(req.body.date)).getFullYear())) {
    errors.push('The date the data is for is required');
  }

  if (!req.file || req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    errors.push('A file containing the data is required and must be in Microsoft Office 2007 format');
  }

  if (errors.length) {
    let errorHtml = errors.reduce((html, error) => {
      return `${html}<li>${error}</li>`;
    }, '');

    res.send(errorPage(`<ul>${errorHtml}</ul>`));

    next();
  } else {
    let attempts;
    for (attempts = 0; attempts < 5; attempts++) {
      let add = '';
      if (attempts) {
        add = ` ${attempts}`;
      }

      // Create filename for file
      let fileName = uploadTypes[req.body.type](req.body, add);

      // Check the file doesn't already exist
      try {
        fs.accessSync(fileName, fs.R_OK);

        continue;
      } catch(error) {
        if (error.code !== 'ENOENT') {
          res.send(errorPage('<p>There was an error determining if the file already exists. Please try again</p>'));
        } else {
          fs.writeFileSync(fileName, req.file.buffer);

          console.log(`Saved file ${fileName}`);
          res.send(`<!doctype HTML>
<html>
  <head>
    <title>Upload Successful</title>
  </head>
  <body>
    <h1>Upload Successful</h1<
  </body>
</html>
`);
        }

        break;
      }
    }

    if (attempts === 5) {
      res.send(errorPage('<p>Could not upload as there are already 5 copies of the same file</p>'));
    }
  }

  next();

});

server.listen(8080);

console.log('listening on 8080');

//  `sl-catch ${village} ${date} ${name}.xslx`
