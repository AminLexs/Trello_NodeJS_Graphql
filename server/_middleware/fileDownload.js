var multer  = require('multer');

var _storage = multer.diskStorage({
    destination: (req, file, cb) =>{
       cb(null, "server/attached_files");
    },
    filename: function (req, file, cb) {
       var crypto = require('crypto');
       crypto.pseudoRandomBytes(16, function (err, raw) {
          cb(null, raw.toString('hex') + '.txt' );
       });
    }
 });

 module.exports = new multer({storage: _storage});