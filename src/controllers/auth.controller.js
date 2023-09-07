const User = require('../models/User');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../utils/jwt');

async function login(req, res) {
    const data = req.body;
    try {
        const user = await User.findOne({ email: data.email });

        if (user) {
            bcrypt.compare(data.password, user.password, function (err, check) {
                console.log(data.password, user.password);
                if(check){
                    if(data.gettoken){
                        const token = jwt.createToken(user)
                        res.status(200).send({
                            jwt: token,
                            user: user,
                        });
                        console.log(token);
                    } else {
                        res.status(200).send({
                            user: user,
                            message: 'no token',
                            jwt: jwt.createToken(user)
                        })
                    }
                } else {
                    res.status(403).send({ message: 'Las credenciales de ingreso no coinciden' })
                }
            })
        } else {
            res.status(403).send({ message: 'El email no existe' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error en el servidor' });
    }
}

module.exports = {
    login
}