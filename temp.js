const fetch = require('node-fetch');
const fs = require('fs');
module.exports = {
    runURI: runURI
}
function runURI(uri) {
    fetch(uri)
        .then(function (response) {
            switch (response.status) {
                // status "OK"
                case 200:
                    return response.text();
                // status "Not Found"
                case 404:
                    throw response;
            }
        })
        .then(function (template) {
            fs.writeFileSync("newfile.txt", template)
            console.log("done");
        })
        .catch(function (response) {
            // "Not Found"
            console.log(response);
        });
}
