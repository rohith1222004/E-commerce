const bcrypt = require('bcrypt');   
const User = require('../models/User')
const jwt = require('jsonwebtoken');
require('dotenv').config()

const encryptAndStore = async(name,email,password,role) => {
    const salt = 10
    bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Hashed password:', hash);
        const user = new User({name:name,email:email,password: hash,role:role})
        user.save()
        .then(() => console.log('User created successfully'))
        .catch(err => console.log(err));
    });
}

const loginAndGenerateToken = async(email, password,role) => {

    const user = await User.findOne({email:email})
    if(!user){
        return "User not found"
    }
    console.log("hello",user);
    
    const passwordMatch = await bcrypt.compare(password, user.password)
    if(!passwordMatch){
        return "Invalid password"
    }
    const token = jwt.sign({ userId: user._id,email,role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    console.log("token : ", token);
    
    return token
}

module.exports = {
    encryptAndStore,
    loginAndGenerateToken
}