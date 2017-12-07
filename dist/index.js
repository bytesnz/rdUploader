var express = require('express');
var multer = require('multer');
var app = express();
var server = require('http').Server(app);
var fs = require('fs');
var path = require('path');
var xlsx = require('xlsx');
var Magic = require('mmmagic').Magic;
var slDataDataPaths = require('./forms/sldata').dataPaths;
var ejs = require('ejs');
var ReactDOMServer = require('react-dom/server');
var RDHeader = require('rd-base').RDHeader;
var template = require('rd-base/template').template;
var appRoot = path.join(__dirname, './app');
var multerStorage = multer.memoryStorage();
var multerUpload = multer({ storage: multerStorage });
var dataPath = '/shares/data';
var errorPage = function (errorHtml) { return template({
    header: header,
    footer: '',
    page: {
        title: 'Upload Error',
        body: "\n      <main>\n        <h1>Error Uploading</h1>\n        <p>The following errors occurred</p>\n        " + errorHtml + "\n        <p>Please go back, fix the errors and try again</p>\n      </main>\n    "
    }
}); };
var uploadTypes = {
    catch: function (params, add) { return path.join(dataPath, slDataDataPaths.catch, params.type + " " + params.village + " " + params.date + " " + params.name + add + ".xlsx"); },
    effort: function (params, add) { return path.join(dataPath, slDataDataPaths.effort, params.type + " " + params.village + " " + params.date + " " + params.name + add + ".xlsx"); }
};
console.log("Web root is " + appRoot);
app.use('/', express.static(appRoot));
var magic = new Magic();
// Render templates
var header = ReactDOMServer.renderToStaticMarkup(RDHeader());
app.post('/', multerUpload.single('file'), function (req, res, next) {
    var date;
    var errors = [];
    var printErrors = function () {
        var errorHtml = errors.reduce(function (html, error) {
            return html + "<li>" + error + "</li>";
        }, '');
        res.send(errorPage("<ul>" + errorHtml + "</ul>"));
        next();
    };
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
    if (!req.file) {
        errors.push('A file containing the data to upload must be given');
    }
    if (errors.length) {
        return printErrors();
    }
    magic.detect(req.file.buffer, function (error, result) {
        if (error) {
            errors.push('Error detecting mime type of given file');
        }
        else {
            if (result !== 'Microsoft OOXML') {
                errors.push('The file must be in Microsoft Office Excel 2007+ format (xlsx)');
            }
            else {
                try {
                    xlsx.read(req.file.buffer, { type: 'buffer' });
                }
                catch (err) {
                    errors.push('Could not parse the given file: ' + err.message);
                }
            }
        }
        if (errors.length) {
            return printErrors();
        }
        var attempts;
        for (attempts = 0; attempts < 5; attempts++) {
            var add = '';
            if (attempts) {
                add = " " + attempts;
            }
            // Create filename for file
            var fileName = uploadTypes[req.body.type](req.body, add);
            // Check the file doesn't already exist
            try {
                fs.accessSync(fileName, fs.R_OK);
                continue;
            }
            catch (error) {
                if (error.code !== 'ENOENT') {
                    res.send(errorPage('<p>There was an error determining if the file already exists. Please try again</p>'));
                }
                else {
                    try {
                        fs.writeFileSync(fileName, req.file.buffer);
                        console.log("Saved file " + fileName);
                        res.send(template({
                            header: header,
                            footer: '',
                            page: {
                                title: 'Upload Successful',
                                body: "\n                  <main>\n                    <h1>Upload Successful</h1>\n                    <p>\n                      Your file should now be uploaded to\n                      <a href=\"//data.rd/" + req.body.destination + "\">data.rd</a>\n                    </p>\n                  </main>\n                "
                            }
                        }));
                    }
                    catch (error) {
                        res.send(errorPage("<p>There was an error saving the file: " + error.message + "</p>"));
                    }
                }
                break;
            }
        }
        if (attempts === 5) {
            res.send(errorPage('<p>Could not upload as there are already 5 copies of the same file</p>'));
        }
        next();
    });
});
server.listen(8080);
console.log('listening on 8080');
//  `sl-catch ${village} ${date} ${name}.xslx`
//# sourceMappingURL=index.js.map