const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt');

const saltRounds = 10;

const UserSchema = new mongoose.Schema({
    DNI: {
        type: String,
        required: true,
        unique: true
    },
    nombres: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true
    },
    nacimiento: {
        type: Date,
        required: true
    },
    rol: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true,
        unique: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    contraseña: {
        type: String,
        required: true
    },
    nombreusuario: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.pre('save', function(next){
    if(this.isNew || this.isModified('contraseña')){
        const document = this;
        bcrypt.hash(document.contraseña, saltRounds, (err, contraseñaregistrada) =>{
            if (err){
                next(err);
            } else{
                document.contraseña = contraseñaregistrada;
                next();
            }
        });
    }else{
        next();
    }
});

UserSchema.methods.contraseñacorrecta = function (contraseñaparcial, callback){
    bcrypt.compare(contraseñaparcial, this.contraseña, function(err, same){
        if(err){
            callback(err);
        }else{
            callback(err, same);
        }
    });
}

module.exports = mongoose.model('User', UserSchema);