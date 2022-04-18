const {Schema, model} = require('mongoose')


const User = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    roles: [{type: String, ref: 'Role'}],
    email:{type: String, unique: true, required: true},
    RegistrationTime:{type: String, unique: true, required: true}

})

module.exports = model('User', User)
