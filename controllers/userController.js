const User = require('../models/User')

const getUsers = async(req, res) => {
    const users = await User.find()
    return res.status(200).send(users);
}

module.exports = {
    getUsers
}