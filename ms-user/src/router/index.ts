import {Router as RouterType} from "express";

const userController = require('../controllers/userController')
const Router = require('express').Router

const router: RouterType = new Router()


/**
 * @swagger
 * components:
 *   schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - id
 *        - firstName
 *        - lastName
 *        - nickname
 *        - linkNickname
 *        - email
 *        - password
 *        - phone
 *        - role
 *        - banned
 *        - photo
 *        - secondEmail
 *        - dateOfBirth
 *        - IP
 *        - country
 *        - createdAt
 *        - updatedAt
 *        - isActivated
 *        - activationLink
 *      properties:
 *        id:
 *          type: string
 *          default: d5fE_asz
 *        firstName:
 *          type: string
 *          default: Viktor
 *        lastName:
 *          type: string
 *          default: Kozhemiakin
 *        nickname:
 *          type: string
 *          default: GameTV
 *        linkNickname:
 *          type: string
 *          default: gametv14
 *        email:
 *          type: string
 *          default: kozhevik@cvut.cz
 *        password:
 *          type: string
 *          default: 123456Ab
 *        phone:
 *          type: string
 *          default: 420773225995
 *        role:
 *          type: string
 *          default: User
 *        banned:
 *          type: boolean
 *          default: false
 *        photo:
 *          type: string
 *          default: https://photos.com/photo1234522.jpg
 *        secondEmail:
 *          type: string
 *          default: kozhevik1@cvut.cz
 *        dateOfBirth:
 *          type: string
 *          format: date
 *          default: 2000-03-10T04:05:06.157Z
 *        IP:
 *          type: string
 *          default: 127.0.0.1
 *        country:
 *          type: string
 *          default: Czechia
 *        createdAt:
 *          type: string
 *          format: date
 *          default: 2020-03-10T04:05:06.157Z
 *        updatedAt:
 *          type: string
 *          format: date
 *          default: 2020-03-10T04:05:06.157Z
 *        isActivated:
 *          type: boolean
 *          default: false
 *        activationLink:
 *          type: string
 *          default: none
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - firstName
 *         - lastName
 *         - nickname
 *         - linkNickname
 *         - email
 *         - password
 *         - phone
 *         - role
 *         - banned
 *         - photo
 *         - secondEmail
 *         - dateOfBirth
 *         - IP
 *         - country
 *         - createdAt
 *         - updatedAt
 *         - isActivated
 *         - activationLink
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         firstName:
 *           type: string
 *           description: The firstName of this user
 *         lastName:
 *           type: string
 *           description: The lastName of this user
 *         nickname:
 *           type: string
 *           description: The nickname of this user
 *         linkNickname:
 *           type: string
 *           description: The linkNickname of this user
 *         email:
 *           type: string
 *           description: The email of this user
 *         password:
 *           type: string
 *           description: The password of this user
 *         phone:
 *           type: string
 *           description: The phone of this user
 *         role:
 *           type: string
 *           description: The role of this user
 *         banned:
 *           type: boolean
 *           description: Is user banned or not
 *         photo:
 *           type: string
 *           description: The photo of this user
 *         secondEmail:
 *           type: string
 *           description: The second email of this user
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: The birthday of this user
 *         IP:
 *           type: string
 *           description: The IP of registration
 *         country:
 *           type: string
 *           description: The country of registration
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the user was added
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the user was added
 *         isActivated:
 *           type: boolean
 *           description: Is it activated
 *         activationLink:
 *           type: string
 *           description: Link for activation
 *       example:
 *         id: d5fE_asz
 *         firstName: Viktor
 *         lastName: Kozhemiakin
 *         nickname: GameTV
 *         linkNickname: gametv14
 *         email: kozhevik@cvut.cz
 *         password: 123456Ab
 *         phone: 420773225995
 *         role: User
 *         banned: false
 *         photo: https://photos.com/photo1234522.jpg
 *         secondEmail: kozhevik1@cvut.cz
 *         dateOfBirth: 2000-03-10T04:05:06.157Z
 *         IP: 127.0.0.1
 *         country: Czechia
 *         createdAt: 2020-03-10T04:05:06.157Z
 *         updatedAt: 2020-03-10T04:05:06.157Z
 *         isActivated: false
 *         activationLink: none
 */

/**
 * @swagger
 * tags:
 *  name: Interactions
 *  description: API for interactions with users
 */

/**
 * @swagger
 * /users:
 *  get:
 *      summary: Returns the list of all users
 *      tags: [Interactions]
 *      responses:
 *          200:
 *              description: The list of users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          $ref: '#/components/schemas/User'
 *          500:
 *              description: Some server error
 * /registration:
 *  post:
 *      summary: Create a new user
 *      tags: [Interactions]
 *      requestBody:
 *          required: true
 *          content:
*               application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateUserInput'
 *      responses:
 *          200:
 *              description: Json cookie
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CreateUserInput'
 *          500:
 *              description: Some server error
 */

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', userController.getUsers)

module.exports = router