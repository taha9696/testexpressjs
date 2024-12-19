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
function chat(req, res, next) {
    res.render('ordinateur')
}
async function searchByCategory(category, socket) {
    try {
        const ordinateurs = await Ordinateur.find({ categorie: category });
        socket.emit('searchResults', ordinateurs); // Emit results to the client
    } catch (err) {
        console.error('Error fetching ordinateurs:', err);
        socket.emit('error', { message: 'Failed to fetch ordinateurs', details: err });
    }
}


module.exports = { create, list, update, deleteU ,searchByPrice,chat,searchByCategory}

