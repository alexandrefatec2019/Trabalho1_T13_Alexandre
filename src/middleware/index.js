const fs = require('fs');

var datetime = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

var stream = fs.createWriteStream('log.txt', { 'flags': 'a' });

module.exports = {
    log: function (req, res, next) {

        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

        stream.write(datetime + " " + req.method + " " + fullUrl + "\n");
        
        next();
    }
}
