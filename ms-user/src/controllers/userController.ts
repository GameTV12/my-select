import {NextFunction, Request, Response} from "express";
import {UserI} from "../models/userModel";
const userService = require('../service/UserService')

class UserController {
    async registration(req: any, res: Response, next: NextFunction) {
        try {
            const requestData: UserI = req.body
            // const userData = await userService.registration(requestData)
            //
            // res.cookie('refreshToken', userData.refreshToken, {maxAge: 65 * 24 * 3600 * 1000, httpOnly: true})
            console.log(`requestData - ${req}`)
            return res.json(requestData)
        } catch (e) {
            console.log(e)
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (e) {

        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (e) {

        }
    }

    async activate(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (e) {

        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {

        } catch (e) {

        }
    }

    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            res.json(['12', '34'])
        } catch (e) {

        }
    }
}

module.exports = new UserController()