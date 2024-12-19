const ordinateurModel = require('./ordinateurModel');
var Ordinateur = require('./ordinateurModel')
const io = require('socket.io');
async function list(req,res,next){
    await Ordinateur.find()
              .then((data,err)=>{
                if(err){
                    res.status(500).json(err)
                }
                    res.status(200).json(data)
              })
}
const create =async (req,res,next)=>{
    const { modele, categorie, dateFabrication ,prix } = req.body 
    await new Ordinateur({
        modele: modele,
        categorie: categorie,
        dateFabrication: dateFabrication,
        prix:prix
    }).save()
      .then((data, err)=>{
          if(err){
              res.status(500).json(err)
            }
            console.log(data);
      })
}
const update = async (req, res, next)=>{
    await Ordinateur.findByIdAndUpdate(req.params.id, req.body)
              .then((data, err)=>{
                res.json(data)
              })
}
async function deleteU(req, res, next) {
    await Ordinateur.findByIdAndDelete(req.params.id)
              .then((data, err)=>{
                if(err){
                    res.status(500).json(err)
                }
                    res.status(200).json(data)
              })
}

async function searchByPrice(req, res, next) {
    const x = parseFloat(req.query.x);
    const y = parseFloat(req.query.y);

    // Log parsed parameters to ensure correctness
    console.log("Parsed values: x =", x, ", y =", y);

    // Validate that x and y are numbers
    if (isNaN(x) || isNaN(y)) {
        return res.status(400).json({ error: 'Invalid price range parameters' });
    }

    // Ensure the range is valid
    if (x > y) {
        return res.status(400).json({ error: "Invalid range: x should be less than or equal to y." });
    }

    try {
        // MongoDB query with numeric range comparison
        const ordinateurs = await Ordinateur.find({ prix: { $gte: x, $lte: y } });
        res.status(200).json(ordinateurs);
    } catch (err) {
        console.error("Error fetching ordinateurs:", err);
        res.status(500).json({ error: 'Failed to fetch ordinateurs', details: err });
    }
}
const socketIO = (server) => {
    const io = socketIo(server);
  

    io.on('connection', (socket) => {
        console.log('User connected via Socket.IO');

        socket.on('display-ord', async (categorie) => {
                    try {
                        let ords;
                        if (categorie) {
                            ords = await ordinateurModel.find({ categorie });
                            console.log(`Data found for category "${categorie}":`, ords);
                        } else {
                       
                            ords = await ordinateurModel.find();
                            console.log('All data:', ords);
                        }
                        io.emit('ordList', ords); 
                    } catch (error) {
                        console.error('Error fetching data:', error.message);
                        io.emit('error', { message: 'Failed to fetch data' }); 
                    }
         });

    });

    return io;
};


module.exports = { create, list, update, deleteU ,searchByPrice,socketIO}

