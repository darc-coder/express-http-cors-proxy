var express = require('express'),
    bodyParser = require('body-parser'),
    app = express();
var http = require('http');
const fs = require('fs');

var myLimit = typeof (process.argv[2]) != 'undefined' ? process.argv[2] : '400kb';
console.log('Using limit: ', myLimit);
console.log(runURI);

app.use(bodyParser.json({ limit: myLimit }));

app.get("/",(req, res) =>{
    res.send("Base running");
})
app.get("/active", (req, res) => {
    res.send("Site Active");
})

app.get("loadcss.css", (req,res) => {
    res.sendFile("load.css", {root: __dirname});
})

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

        runURI(targetURL, res)
        
        
    }
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});

function runURI(uri, res) {
    let site = uri;
    let regex = /^((http[s]?|ftp):?\/?\/?)([^:\/\s]+)([\/\w\W]*)/g;
    let match = Array.from(site.matchAll(regex))

    var options = {
        host: match[0][3],
        path: match[0][4],
        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 11; Z832 Build/MMB29M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Mobile Safari/537.36' }
    };
    callback = function (response) {
        var str = '';

        //another chunk of data has been received, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        str += `<link rel="stylesheet" href="https://raw.githubusercontent.com/darc-coder/express-http-cors-proxy/main/loadcss.css">`

        //the whole response has been received, so we just print it out here
        response.on('end', function () {
            res.set('Accept', 'text/html').send(str);
            console.log("done");
        });
    }

    http.request(options, callback).end();   
}
