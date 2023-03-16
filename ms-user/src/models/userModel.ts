const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    nickname: {type: String, required: true},
    linkNickname: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    phone: {type: String, required: true},
    role: {type: String, required: true, default: "User"},
    banned: {type: Boolean, default: false},
    photo: {type: String, default: null},
    secondEmail: {type: String, unique: true},
    dateOfBirth: {type: Date, required: true},
    IP: {type: String, required: true},
    country: {type: String, required: true},
    createdAt: {type: Date, default: Date.now },
    updatedAt: {type: Date, default: Date.now },
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
})

export interface UserI {
    firstName: string,
    lastName: string,
    nickname: string,
    linkNickname: string,
    email: string,
    password: string,
    phone: string,
    role: string,
    banned: boolean,
    photo?: string,
    secondEmail?: string,
    dateOfBirth: Date,
    IP: string,
    country: string,
    createdAt: Date,
    updatedAt: Date,
    isActivated: boolean,
    activationLink?: string,
}

module.exports.model = model('User', UserSchema)