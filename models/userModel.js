// models connect to the data (json)


let users = require("../data/users.json")
const helper = require("../helper")
const { writeDataToFile } = require("../util")

function getAllUsers() {
    return new Promise((resolve, reject) => {
        resolve(users)
    })
}

function findUserId(id) {
    return new Promise((resolve, reject) => {
        const user = users.find((u) => u.id === id)
        resolve(user)
    })
}


function create(user) {
    return new Promise((resolve, reject) => {
        const newUser = { id: helper.createId(), ...user }
        users.push(newUser)
        writeDataToFile("./data/users.json", users)
        resolve(newUser)

    })
}

function update(id, userData) {
    return new Promise((resolve, reject) => {
        const index = users.findIndex((u) => u.id === id)
        users[index] = { id, ...userData }
        //console.log(users)

        writeDataToFile("./data/users.json", users)
        resolve(users[index])

    })
}

function remove(id) {
    return new Promise((resolve, reject) => {
        users = users.filter((u) => u.id !== id)

        writeDataToFile("./data/users.json", users)
        resolve()

    })
}

module.exports = {
    getAllUsers,
    findUserId,
    create,
    update,
    remove
}