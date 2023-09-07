const Client = require('../models/Client');

async function registerClient(req, res) {
    try {
        const data = req.body;

        const client = new Client();

        client.name = data.name;
        client.phone = data.phone;
        client.email = data.email;
        client.address = data.address;

        //? Verificar si el email ya está registrado
        const existingClient = await Client.findOne({ email: data.email });
        if (existingClient) {
            // Si el email ya está registrado, devolver un error
            res.status(409).send({ error: 'El email ya está registrado' });
        } else {
            // Guardar el nuevo cliente en la base de datos
            const newClient = await client.save();
            res.status(200).send({ Client: newClient });
        } 

    } catch (error) {
        res.status(500).send({ error: 'Error en la validación del email' });
    }
}

async function listClients(req, res) {
    try {
        const name = req.params['name'];

        const newListClient = await Client.find({ name: new RegExp(name, 'i') });

        if (newListClient.length > 0) {
            res.status(200).send({ client: newListClient });
        } else {
            res.status(404).send({ message: 'No existe un cliente con ese nombre' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error en el servidor' });
    }
}

async function listClient(req, res) {
    try {
        const id = req.params['id'];

        const newListClient = await Client.findById({ _id: id });

        if (newListClient) {
            res.status(200).send({ client: newListClient });
        } else {
            res.status(403).send({ message: 'No existe el cliente' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error en el servidor' });
    }
}

async function updateClient(req, res) {
    try {
        const id = req.params.id; // TODO: Obtener el ID del cliente a actualizar desde los parámetros de la solicitud

        const update = req.body; // TODO: Obtener los datos de actualización del cuerpo de la solicitud

        const existingClient = await Client.findById(id); //* Buscar el cliente existente en la base de datos utilizando el ID

        if (!existingClient) {
            //! Si el cliente no existe, devolver un mensaje de error
            return res.status(404).send({ message: 'No existe el cliente' });
        }

        const updatedClient = await Client.findByIdAndUpdate(id, { $set: update }, { new: true });

        res.status(200).send({ client: updatedClient }); // TODO: Enviar la respuesta con el cliente actualizado
    } catch (error) {
        res.status(500).send({ message: 'Error en el servidor' }); //! En caso de error, devolver un mensaje de error genérico
    }
}

async function deleteClient(req, res) {
    try {
        const id = req.params.id; // TODO: Obtener el ID del cliente a actualizar desde los parámetros de la solicitud

        const update = req.body; // TODO: Obtener los datos de actualización del cuerpo de la solicitud

        const existingClient = await Client.findById(id); //* Buscar el cliente existente en la base de datos utilizando el ID

        if (!existingClient) {
            //! Si el cliente no existe, devolver un mensaje de error
            return res.status(404).send({ message: 'No existe el cliente' });
        }

        const updatedClient = await Client.findByIdAndDelete(id, { $set: update }, { new: true });

        res.status(200).send({ message: 'cliente eliminado con éxito', client: updatedClient }); // TODO: Enviar la respuesta con el cliente actualizado
    } catch (error) {
        res.status(500).send({ message: 'Error en el servidor' }); //! En caso de error, devolver un mensaje de error genérico
    }
}

module.exports = {
    registerClient,
    listClients,
    listClient,
    updateClient,
    deleteClient
}