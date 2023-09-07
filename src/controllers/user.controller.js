const User = require('../models/User');
const bcrypt = require('bcrypt-nodejs');

async function registerUser(req, res) {
    try {
        const params = req.body;
        const user = new User();

        if (params.password) {
            //* Generar el hash de la contraseña
            const hash = await new Promise((resolve, reject) => {
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            });

            if (hash) {
                // TODO: Asignar los valores al objeto de usuario
                user.password = hash;
                user.name = params.name;
                user.username = params.username;
                user.role = params.role;
                user.phone = params.phone;
                user.email = params.email;
                user.address = params.address;

                //? Verificar si el email ya está registrado
                const existingUser = await User.findOne({ email: params.email });
                if (existingUser) {
                    // Si el email ya está registrado, devolver un error
                    res.status(409).send({ error: 'El email ya está registrado' });
                } else {
                    // Guardar el nuevo usuario en la base de datos
                    const newUser = await user.save();
                    res.status(200).send({ user: newUser });
                }
            }
        } else {
            //? Si no se ingresó una contraseña, devolver un error
            res.status(403).send({ error: 'No se ingresó una contraseña' });
        }
    } catch (error) {
        //! Si ocurre algún error durante el proceso, devolver un error genérico
        res.status(500).send({ error: 'Error en la validación del email' });
    }
}

async function listUsers(req, res) {
    try {
        const name = req.params['name'];

        const newListUsers = await User.find({ name: new RegExp(name, 'i') });

        if (newListUsers.length > 0) {
            res.status(200).send({ users: newListUsers });
        } else {
            res.status(404).send({ message: 'No existe un usuario con ese nombre' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error en el servidor' });
    }
}

async function listUser(req, res) {
    try {
        const id = req.params['id'];

        const newListUser = await User.findById({ _id: id });

        if (newListUser) {
            res.status(200).send({ user: newListUser });
        } else {
            res.status(403).send({ message: 'No existe el usuario' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error en el servidor' });
    }
}

async function updateUser(req, res) {
    try {
        const id = req.params.id; // TODO: Obtener el ID del usuario a actualizar desde los parámetros de la solicitud

        const update = req.body; // TODO: Obtener los datos de actualización del cuerpo de la solicitud

        const existingUser = await User.findById(id); //* Buscar el usuario existente en la base de datos utilizando el ID

        if (!existingUser) {
            //! Si el usuario no existe, devolver un mensaje de error
            return res.status(404).send({ message: 'No existe el usuario' });
        }

        const updatedUser = await User.findByIdAndUpdate(id, { $set: update }, { new: true });

        res.status(200).send({ user: updatedUser }); // TODO: Enviar la respuesta con el usuario actualizado
    } catch (error) {
        res.status(500).send({ message: 'Error en el servidor' }); //! En caso de error, devolver un mensaje de error genérico
    }
}

async function deleteUser(req, res) {
    try {
        const id = req.params.id; // TODO: Obtener el ID del usuario a actualizar desde los parámetros de la solicitud

        const update = req.body; // TODO: Obtener los datos de actualización del cuerpo de la solicitud

        const existingUser = await User.findById(id); //* Buscar el usuario existente en la base de datos utilizando el ID

        if (!existingUser) {
            //! Si el usuario no existe, devolver un mensaje de error
            return res.status(404).send({ message: 'No existe el usuario' });
        }

        const updatedUser = await User.findByIdAndDelete(id, { $set: update }, { new: true });

        res.status(200).send({ message: 'Usuario Eliminado con éxito', user: updatedUser }); // TODO: Enviar la respuesta con el usuario actualizado
    } catch (error) {
        res.status(500).send({ message: 'Error en el servidor' }); //! En caso de error, devolver un mensaje de error genérico
    }
}

module.exports = {
    registerUser,
    listUsers,
    listUser,
    updateUser,
    deleteUser
}


