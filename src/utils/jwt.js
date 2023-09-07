const jwt = require('jwt-simple');
const moment = require('moment');

//* LLAVE DEL TOKEN
const secret = process.env.SECRET_KEY;

// TODO: GENERACION DE TOKENS
exports.createToken = function (user) {
    const payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    }

    return jwt.encode(payload, secret);
}



