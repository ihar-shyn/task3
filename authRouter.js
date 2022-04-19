const Router = require('express')
const router = new Router()
const controller = require('./authController')
const {check} = require("express-validator")

router.post('/registration', [
    check('username', "The field is empty!").notEmpty(),
    check('password', "Password should include minimum 1 symbol").isLength({min:1}),
    check('email', "The field is empty!").notEmpty()
], controller.registration)
router.post('/login', controller.login)
router.get('/users', controller.getUsers)
router.get('/allUsers', controller.getAllUsers)

module.exports = router
