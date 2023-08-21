const express = require ('express');
const path = require ('path');
const bodyParser = require ('body-parser');
const app = express();


const bcrypt = require ('bcrypt');
const mongoose = require ('mongoose');
const User = require('./public/user');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

const mongoConnect = async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://sebastianbeltranbeltran:Maximiliano01*@bdpracyica.coks1gr.mongodb.net/?retryWrites=true&w=majority'
        )
        console.log('Conexión exitosa a Mongo')
    }
    catch (err) {
        console.log(err)
    }
};

mongoConnect ();

app.post('/register', (req, res) =>{
const {DNI, nombres, apellidos, nacimiento, rol, telefono, correo, nombreusuario, contraseña} = req.body;
const user = new User({DNI, nombres, apellidos, nacimiento, rol, telefono, correo, nombreusuario, contraseña});

user.save(err =>{
    if(err){
res.status(500).send('ERROR AL REGISTRAR EL USUARIO');
    } else{
res.status(200).send('USUARIO REGISTRADO');
    }
});
});

app.post('/authenticate', (req, res) => {
const {nombreusuario, contraseña} = req.body;

User.findOne({nombreusuario}, (err, user) =>{
    if(err){
        res.status(500).send('ERROR AL AUTENTICAR EL USUARIO');
    } else if(!user){
        res.status(500).send('USUARIO NO EXISTE');
    } else{
        user.contraseñacorrecta(contraseña, (err, result) =>{
            if(err){
                res.status(500).send('ERROR AL AUTENTICAR');
            } else if(result){
                res.status(200).send('USUARIO AUTENTICADO');
            } else {
                res.status(500).send('USUARIO Y/O CONTRASEÑA INCORRECTA');
            }
        });
    }
})
});

app.listen(3000, () =>{
    console.log('Servidor iniciado')
});
module.exports = app;