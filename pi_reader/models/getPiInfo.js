var prompt = require('prompt');
var fs = require('fs');
const uuid = require('node-uuid');

module.exports = function getPi(callback) {
    console.log('in getPi')
    prompt.start();

    prompt.get(['name', 'description', 'group'], function (err, result) {
        if (err) { return onErr(err); }
        var pi = { 
            createdAt : Date.now(), 
            id : uuid.v4(), 
            name : result.name, 
            description : result.description, 
            group : result.group
        }             
        console.log(pi);
        callback(null, pi);
    });

    function onErr(err) {
        console.log(err);
        return 1;
    } 
}
