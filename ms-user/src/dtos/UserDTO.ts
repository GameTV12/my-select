import {UserI} from "../models/userModel";

module.exports = class UserDTO {
    id: string
    firstName: string
    lastName: string
    nickname: string
    linkNickname: string
    email: string
    password: string
    phone: string
    role: string
    banned: boolean
    photo?: string
    secondEmail?: string
    dateOfBirth: Date
    IP: string
    country: string
    createdAt: Date
    updatedAt: Date
    isActivated: boolean
    activationLink?: string

    constructor(model: any) {
        this.id = model._id
        this.email = model.email
        this.firstName = model.firstName
        this.lastName = model.lastName
        this.nickname = model.nickname
        this.linkNickname = model.linkNickname
        this.email = model.email
        this.password = model.password
        this.phone = model.phone
        this.role = model.role
        this.banned = model.banned
        this.photo = model.photo || ''
        this.secondEmail = model.secondEmail || ''
        this.dateOfBirth = model.dateOfBirth
        this.IP = model.IP
        this.country = model.country
        this.createdAt = model.createdAt
        this.updatedAt = model.updatedAt
        this.isActivated = model.isActivated
        this.activationLink = model.activationLink || ''
    }
}