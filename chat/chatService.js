var Chat = require('./chatModel')
var socketIo = require('socket.io')
var ordinateurModel = require('../Ordinateur/ordinateurModel')

function socketIO(server){
    const io = socketIo(server)
    io.on('connection',(socket)=>{
        console.log("user connected !");
        socket.broadcast.emit("msg","A new user is connected !")
        socket.on('msg', async (data)=>{
            console.log(data);
            io.emit('msg',data.name+ ': ' + data.msg)
            await new Chat({
                msg: data.msg,
                date: new Date()
            }).save()
              .then((data, err)=>{
                  if(err){
                      console.log(err);
                  }
              })
        })

        socket.on('display-msg', async ()=>{
            
            var msgs= await Chat.find()
            console.log('wini data'+msgs);
            io.emit('msgList',msgs)
                      
        })
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
    })
    return io;
}

function chatView(req, res, next) {
    res.render('chat')
}

async function list(req,res,next){
    await Chat.find()
              .then((data,err)=>{
                if(err){
                    res.status(500).json(err)
                }
                    res.status(200).json(data)
              })
    //res.end('Chat List')
}

const create =async (req,res,next)=>{
    const { msg } = req.body 
    console.log(req.body.msg);
    await new Chat({
        msg: msg,
        date: new Date()
    }).save()
      .then((data, err)=>{
          if(err){
              res.status(500).json(err)
            }
            console.log(data);
      })
    
res.json('Chat added ! msg : '+ msg + ' date : '+ new Date())
}

const update = async (req, res, next)=>{
    await Chat.findByIdAndUpdate(req.params.id, req.body)
              .then((data, err)=>{
                res.json(data)
              })
}

async function deleteU(req, res, next) {
    await Chat.findByIdAndDelete(req.params.id)
              .then((data, err)=>{
                if(err){
                    res.status(500).json(err)
                }
                    res.status(200).json(data)
              })
}

module.exports = { socketIO, chatView, create, list, update, deleteU }