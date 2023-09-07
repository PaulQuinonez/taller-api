const Maintenance = require("../models/Maintenance")
const Client = require("../models/Client");
const Technician = require("../models/User")
const Parts = require("../models/Parts");
const moment = require('moment');

// TODO: Registrar nuevo mantenimiento
async function createMaintenance(req, res) {
    try {
        const { technicianId, clientId, title, description, partsUsed, price, date } = req.body;

        //? Validar el formato de la fecha utilizando moment.js
        if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
            return res.status(400).send({ error: 'Formato de fecha inválido. Utilice el formato YYYY-MM-DD.' });
        }

        //? Verificar si el cliente y el tecnico existen en la base de datos
        const client = await Client.findById(clientId);
        const technician = await Technician.findById(technicianId);

        if (!client || !technician) {
            return res.status(404).send({ error: 'Cliente o técnico no encontrado!' });
        }

        if (partsUsed && partsUsed.length > 0) {
            for (const partUsed of partsUsed) {
                const { quantity } = partUsed;

                //? Verificar si existe el repuesto
                const part = await Parts.findById(partUsed.part);

                if (!part) {
                    return res.status(404).send({ error: 'Repuesto no encontrado!' });
                }

                //? Verificar si hay suficientes repuestos en stock
                if (part.stock < quantity) {
                    return res.status(400).send({ error: 'Stock insuficiente!' });
                }

                //* Actualizar el stock de repuestos
                part.stock -= quantity;
                await part.save();

            }
        }

        //* Crear un nuevo mantenimiento
        const newMaintenance = new Maintenance({
            technician: technicianId,
            client: clientId,
            title,
            description,
            partsUsed,
            price,
            date
        });

        //* Guardar el mantenimiento en la base de datos
        const savedMaintenance = await newMaintenance.save();

        res.status(201).send({ message: 'Mantenimiento registrado con éxito!', manteinance: savedMaintenance })
    } catch (error) {
        return res.status(500).send({ error: 'Error en el servidor!' })
    }
}

// TODO: Obtener todos los mantenimientos con filtros opcionales
async function getMaintenancesByUser(req, res) {
  try {
    const { title, technician, client, date } = req.query;

    let filter = {
      technician: technician || req.params['id'],
      title: new RegExp(title, 'i')
    };

    if (client) {
      filter.client = client;
    }

    if (date) {
      filter.date = date;
    }

    const maintenance = await Maintenance.find(filter)
      .populate('technician')
      .populate('client');

    res.status(200).json({ maintenance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ha ocurrido un error al obtener los mantenimientos' });
  }
}

async function getMaintenances(req, res) {
  try {
    const { title, technician, client, date } = req.query;

    let filter = {
      title: new RegExp(title, 'i')
    };

    if (technician) {
      filter.technician = technician;
    }

    if (client) {
      filter.client = client;
    }

    if (date) {
      filter.date = date;
    }

    const maintenance = await Maintenance.find(filter)
      .populate('technician')
      .populate('client')
      .populate('partsUsed.part');

    res.status(200).json({ maintenance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ha ocurrido un error al obtener los mantenimientos' });
  }
}


// TODO: Obtener mantenimiento por su ID
async function getMaintenanceById(req, res) {
    try {
        const maintenanceId = req.params.id;

        // TODO: Buscar el mantenimiento por su ID y obtener los detalles
        const maintenance = await Maintenance.findById(maintenanceId)
            .populate('client')
            .populate('technician')
            .populate('partsUsed.part')
            .exec();

        //? Verificar si existe el mantenimiento
        if (!maintenance) {
            res.status(404).send({ error: 'Mantenimiento no encontrado!' });
        }

        res.status(200).send({ manteinance: maintenance });

    } catch (error) {
        res.status(500).send({ error: 'Error en el servidor' });
    }
}

// TODO: Actualizar un mantenimiento
async function updateMaintenance(req, res) {
    try {
      const maintenanceId = req.params.id;
      const { technicianId, clientId, title, description, partsUsed, price } = req.body;
  
      // Verificar si el mantenimiento existe en la base de datos
      const maintenance = await Maintenance.findById(maintenanceId);
  
      // Verificar si existe el mantenimiento
      if (!maintenance) {
        return res.status(404).send({ error: 'Mantenimiento no encontrado' });
      }
  
      // Guardar el stock actual de las partes utilizadas en el mantenimiento
      const oldPartsUsed = maintenance.partsUsed;
  
      // Actualizar solo los campos que se necesiten
      if (technicianId) {
        // Verificar si el cliente y el técnico existen en la base de datos
        const client = await Client.findById(clientId);
        if (client) {
          maintenance.technician = technicianId;
        } else {
          return res.status(404).send({ error: 'Cliente no encontrado!' });
        }
      }
      if (clientId) {
        const technician = await Technician.findById(technicianId);
        if (technician) {
          maintenance.client = clientId;
        } else {
          return res.status(404).send({ error: 'Técnico no encontrado!' });
        }
      }
      if (title) {
        maintenance.title = title;
      }
      if (description) {
        maintenance.description = description;
      }
      if (partsUsed) {
        maintenance.partsUsed = partsUsed;
      }
      if (price) {
        maintenance.price = price;
      }
  
      //* Guardar los cambios
      const updatedMaintenance = await maintenance.save();
  
      // Actualizar el stock de las partes utilizadas
      await updatePartsStock(oldPartsUsed, updatedMaintenance.partsUsed);
  
      res.status(200).send({ message: 'Mantenimiento actualizado', newMaintenance: updatedMaintenance });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: 'Error en el servidor!' });
    }
  }
  
  async function deleteMaintenance(req, res) {
    try {
      const maintenanceId = req.params.id;
  
      // Buscar y eliminar el mantenimiento
      const deletedMaintenance = await Maintenance.findByIdAndDelete(maintenanceId);
  
      // Verificar si existe el mantenimiento
      if (!deletedMaintenance) {
        return res.status(404).send({ error: 'Mantenimiento no encontrado' });
      }
  
      // Actualizar el stock de las partes utilizadas
      await updatePartsStock(deletedMaintenance.partsUsed, []);
  
      res.status(200).send({ message: 'Mantenimiento eliminado correctamente', maintenance: deletedMaintenance });
    } catch (error) {
      res.status(500).send({ error: 'Error en el servidor' });
    }
  }
  
  async function updatePartsStock(oldPartsUsed, newPartsUsed) {
    for (const oldPartUsed of oldPartsUsed) {
      const { part: oldPartId, quantity: oldQuantity } = oldPartUsed;
  
      // Buscar el repuesto utilizado anteriormente
      const oldPart = await Parts.findById(oldPartId);
  
      if (oldPart) {
        // Restaurar el stock del repuesto
        oldPart.stock += oldQuantity;
        await oldPart.save();
      }
    }
  
    for (const newPartUsed of newPartsUsed) {
      const { part: newPartId, quantity: newQuantity } = newPartUsed;
  
      // Buscar el repuesto utilizado actualmente
      const newPart = await Parts.findById(newPartId);
  
      if (newPart) {
        // Actualizar el stock del repuesto
        newPart.stock -= newQuantity;
        await newPart.save();
      }
    }
  }
  

module.exports = {
    createMaintenance,
    getMaintenances,
    getMaintenancesByUser,
    getMaintenanceById,
    updateMaintenance,
    deleteMaintenance
};

