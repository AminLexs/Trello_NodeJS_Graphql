require('dotenv').config();
const { AuthenticationError } = require('apollo-server-errors');
var jwt = require('jsonwebtoken');

exports.checkTokenQL = ({ req }) => {
    const operation = req.body.operationName.toLowerCase();
    if (operation !== 'getquery' && operation !== 'registermutation'
        && operation !== 'loginquery' && operation !== 'loginmutation' && operation !== 'logoutquery') {
        let err = new AuthenticationError('login please');
        err.code = 401;
        let token = getCookie(req.headers.cookie);
        if (!token)
            throw err;
            
        try {
            const verified = jwt.verify(token, process.env.KEY)
            // req.user = verified;
            // next();
        } catch {
            throw err;
        }
    }


    return { request: req };
    //const x =req.cookies['auth-token']
    //console.log(req.headers)
    //console.log(x);
    // try {
    //   return { id, email } = jwt.verify(token.split(' ')[1], SECRET_KEY)
    // } catch (e) {
    //   throw new AuthenticationError(
    //     'Authentication token is invalid, please log in',
    //   )
    // }
}

function getCookie(cookies) {
    if (!cookies)
        return null;
    var name = "auth-token=";
    var ca = cookies.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}