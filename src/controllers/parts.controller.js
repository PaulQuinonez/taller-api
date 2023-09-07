const path = require('path');
const fs = require('fs');
const Parts = require('../models/Parts');

//* Ruta de la imagen por defecto
const defaultImagePath = path.join(__dirname, 'uploads', 'default.png');

// Función para leer la imagen por defecto y obtener el buffer
const getDefaultImageBuffer = () => {
    return fs.readFileSync(defaultImagePath);
};

const registerPartWithImage = async (req, res) => {
    try {
        const { name, brand, stock, price } = req.body;

        let image = null;
        console.log(req.body);
        console.log(req.file);
        // Verificar si se ha subido una imagen
        if (req.file) {
            // Leer los datos binarios de la imagen
            const imageBuffer = fs.readFileSync(req.file.path);

            // Crear el objeto de imagen con los datos y el tipo de contenido
            image = {
                data: imageBuffer,
                contentType: req.file.mimetype
            };

            console.log(image);

            // Eliminar el archivo temporal después de leer los datos
            fs.unlinkSync(req.file.path);
        } else {
            // Leer la imagen por defecto desde uploads/default.png
            const defaultImageBuffer = fs.readFileSync('uploads/default.png');

            // Crear el objeto de imagen por defecto con los datos y el tipo de contenido
            image = {
                data: defaultImageBuffer,
                contentType: 'image/png'
            };
        }

        // Crear un nuevo repuesto con los datos proporcionados
        const newPart = new Parts({
            name,
            brand,
            price: Number(price),
            stock,
            image
        });

        // Guardar el repuesto en la base de datos
        await newPart.save();

        res.status(201).json({ success: true, part: newPart, message: 'Repuesto registrado con imagen' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ha ocurrido un error al registrar el repuesto' });
    }
};

const getAllParts = async (req, res) => {
    try {

        const name = req.params['name'];

        // Obtener todos los repuestos de la base de datos
        const parts = await Parts.find({ name: new RegExp(name, 'i') }).populate('brand');

        // Devolver los repuestos, incluyendo las imágenes
        res.status(200).json({ parts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ha ocurrido un error al obtener los repuestos' });
    }
};

const getPartById = async (req, res) => {
    try {
      const partId = req.params.id;
  
      // Buscar el repuesto por su ID en la base de datos y realizar el populate en la marca
      const part = await Parts.findById(partId).populate('brand');
  
      if (!part) {
        return res.status(404).json({ error: 'Repuesto no encontrado' });
      }
  
      // Devolver el repuesto, incluyendo la marca
      res.status(200).json({ part });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ha ocurrido un error al obtener el repuesto' });
    }
  };

const getPartImageById = async (req, res) => {
    try {
        const partId = req.params.id;

        // Buscar el repuesto por su ID en la base de datos
        const part = await Parts.findById(partId);

        if (!part) {
            return res.status(404).json({ error: 'No se encontró el repuesto' });
        }

        // Verificar si el repuesto tiene una imagen asociada
        if (!part.image || !part.image.data) {
            return res.status(404).json({ error: 'El repuesto no tiene una imagen asociada' });
        }

        // Establecer los encabezados de la respuesta para indicar el tipo de contenido de la imagen
        res.set('Content-Type', part.image.contentType);

        // Enviar los datos binarios de la imagen como respuesta
        res.send(part.image.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ha ocurrido un error al obtener la imagen del repuesto' });
    }
};

const updateParts = async (req, res) => {
    try {
        const partId = req.params.id;
        const { name, brand, stock, price } = req.body;

        //* Verificar si se ha subido una nueva imagen
        if (req.file) {
            //* Leer los datos binarios de la nueva imagen
            const imageBuffer = fs.readFileSync(req.file.path);

            // TODO: Actualizar el repuesto con los campos y la nueva imagen
            const newPart = await Parts.findByIdAndUpdate(
                partId,
                {
                    name,
                    brand,
                    price,
                    stock,
                    image: {
                        data: imageBuffer,
                        contentType: req.file.mimetype
                    }
                },
                { new: true }
            );

            console.log(newPart);

            // TODO: Eliminar la imagen anterior si existe
            const existingImagePath = `uploads/${partId}.png`;
            if (fs.existsSync(existingImagePath)) {
                fs.unlinkSync(existingImagePath);
            }

            // TODO: Renombrar el archivo temporal con el ID del repuesto
            fs.renameSync(req.file.path, `uploads/${partId}.png`);
        } else {
            // TODO: Actualizar el repuesto sin la imagen
            const newPart = await Parts.findByIdAndUpdate(
                partId,
                { name, brand, price, stock },
                { new: true }
            );

            console.log(newPart);
        }

        res.json({ success: true, message: 'Repuesto actualizado' });
    } catch (error) {
        console.log(error);
        console.error(error);
        res.status(500).json({ error: 'Ha ocurrido un error al actualizar el repuesto' });
    }
}

const deleteParts = async (req, res) => {
    try {
        const id = req.params.id;

        const existingPart = await Parts.findById(id);

        if (!existingPart) {
            //! Si el repuesto no existe, devolver un mensaje de error
            return res.status(404).status({ message: 'No existe el respuesto' });
        }

        const deletePart = await Parts.findByIdAndDelete(id, { new: true });

        res.status(200).send({ message: 'Respuesto elminado correctamente', part: deletePart }); // TODO: Enviar la respuesta con el repsuesto actualizado

    } catch (error) {
        res.status(500).send({ message: 'Error en el servidor' }); //! En caso de error, devolver un mensaje de error genérico
    }
}

module.exports = {
    registerPartWithImage,
    getAllParts,
    getPartById,
    getPartImageById,
    updateParts,
    deleteParts
};
