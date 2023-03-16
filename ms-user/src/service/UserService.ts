const UserModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./MailService')
const tokenService = require('./TokenService')
const UserDTO = require('../dtos/UserDTO')
import {UserI} from "../models/userModel";



class UserService {
    async registration(props: UserI) {
        const newUser: UserI = props
        const candidate = await UserModel.findOne(newUser.email)
        if (candidate) {
            throw new Error(`User with email ${newUser.email} already exists`)
        }
        newUser.password = await bcrypt.hash(newUser.password, 3)
        newUser.activationLink = uuid.v4()

        const user = await UserModel.create(newUser)
        await mailService.sendActivationMail(newUser.email, newUser.activationLink)

        const userDTO = new UserDTO(user);
        const tokens = tokenService.generateTokens({...userDTO})
        await tokenService.saveToken(userDTO.id, tokens.refreshToken)

        return {...tokens, user: userDTO}
    }
}

module.exports = new UserService()