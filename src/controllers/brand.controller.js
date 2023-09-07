const Brand = require("../models/Brand");


async function registerBrand(req, res) {
    try {
        const data = req.body;

        const brand = new Brand();

        brand.name = data.name;

        const newBrand = await brand.save();
        res.status(200).send({ Brand: newBrand });

    } catch (error) {
        res.status(500).send({ error: 'Error en el servidor' });
    }
}

async function listBrands(req, res) {
    try {
        const name = req.params['name'];

        const newListBrand = await Brand.find({ name: new RegExp(name, 'i') });

        if (newListBrand.length > 0) {
            res.status(200).send({ brand: newListBrand });
        } else {
            res.status(404).send({ message: 'No existe una marca con ese nombre' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Error en el servidor' });
    }
}

async function listBrand(req, res) {
    try {
        const id = req.params['id'];

        const newListBrand = await Brand.findById({ _id: id });

        if (newListBrand) {
            res.status(200).send({ brand: newListBrand });
        } else {
            res.status(403).send({ message: 'No existe la marca' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error en el servidor' });
    }
}

async function updateBrand(req, res) {
    try {
        const id = req.params.id; // TODO: Obtener el ID de la marca a actualizar desde los parámetros de la solicitud

        const update = req.body; // TODO: Obtener los datos de actualización del cuerpo de la solicitud

        const existingBrand = await Brand.findById(id); //* Buscar la marca existente en la base de datos utilizando el ID

        if (!existingBrand) {
            //! Si el usuario no existe, devolver un mensaje de error
            return res.status(404).send({ message: 'No existe la marca' });
        }

        const updatedBrand = await Brand.findByIdAndUpdate(id, { $set: update }, { new: true });

        res.status(200).send({ brand: updatedBrand }); // TODO: Enviar la respuesta con la marca actualizado
    } catch (error) {
        res.status(500).send({ message: 'Error en el servidor' }); //! En caso de error, devolver un mensaje de error genérico
    }
}

async function deleteBrand(req, res) {
    try {
        const id = req.params.id; // TODO: Obtener el ID de la marca a actualizar desde los parámetros de la solicitud

        const update = req.body; // TODO: Obtener los datos de actualización del cuerpo de la solicitud

        const existingBrand = await Brand.findById(id); //* Buscar la marca existente en la base de datos utilizando el ID

        if (!existingBrand) {
            //! Si el usuario no existe, devolver un mensaje de error
            return res.status(404).send({ message: 'No existe la marca' });
        }

        const updatedBrand = await Brand.findByIdAndDelete(id, { $set: update }, { new: true });

        res.status(200).send({ message: 'Marca eliminada con éxito', brand: updatedBrand }); // TODO: Enviar la respuesta con la marca actualizada
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error en el servidor' }); //! En caso de error, devolver un mensaje de error genérico
    }
}

module.exports = {
    registerBrand,
    listBrands,
    listBrand,
    updateBrand,
    deleteBrand
}