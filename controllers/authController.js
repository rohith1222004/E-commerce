const User = require("../models/User");
const { encryptAndStore, loginAndGenerateToken } = require("../services/authService")
const jwt = require('jsonwebtoken');

const register = async(req, res) => {
    const {name,email,password,role} = req.body
    const key = await encryptAndStore(name,email,password,role)
    res.status(201).json({ passhash: key, message: 'User registered successfully' });
}

const login = async(req, res) => {
    const {email,password} = req.body
    const token = await loginAndGenerateToken(email,password)
    res.status(201).send({ token: token, message: 'User logged in successfully' });
}


module.exports = {
    register,
    login
}