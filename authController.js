const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')
const {secret} = require("./config")
const path = require('path')

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"} )
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Registration error", errors})
            }
            const {username, password, email} = req.body;
            const candidate = await User.findOne({username})
            if (candidate) {
                return res.status(400).json({message: "User with this nickname is exist"})
            }
            const emailRegistration = await User.findOne({email})
            if (emailRegistration) {
                return res.status(400).json({message: "User with this email is exist"})
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: "USER"})
            const RegistrationTime = new Date();
            const user = new User({username, password: hashPassword, roles: [userRole], email, RegistrationTime})
            await user.save()
            return res.json({message: "Rigistration is completed"})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body
            const user = await User.findOne({username})
            if (!user) {
                return res.status(400).json({message: `User ${username} is not found`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: `Invalid password!`})
            }
            const token = generateAccessToken(user._id, user.roles)
            const tokenTime = new Date();
            return res.json({token, tokenTime})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {
            console.log(e)
        }
    }

    async getAllUsers(req, res) {
        const users = await User.find()
        res.render('users', {users: users});
    }

    async getAuthorizationPage(req, res) {
        res.render('authorization', {helloText: 'Hello from Warsaw!'});
    }
}

module.exports = new authController()
