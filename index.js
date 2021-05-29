const { runURI } = require("./temp");
var express = require('express'),
    bodyParser = require('body-parser'),
    app = express();
const fs = require('fs');

var myLimit = typeof (process.argv[2]) != 'undefined' ? process.argv[2] : '400kb';
console.log('Using limit: ', myLimit);

app.use(bodyParser.json({ limit: myLimit }));

app.all('*', function (req, res, next) {

    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
        var targetURL = req.path.slice(1,); // Target-URL ie. https://example.com or http://example.com
        
        if (!targetURL) {
            res.send(500, { error: 'There is no Target-Endpoint header in the request' });
            return;
        }

        runURI(targetURL)
        let output = fs.readFileSync("newfile.txt")
        res.send(output).set('Accept', 'text/html');
    }
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});