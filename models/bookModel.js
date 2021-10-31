

let books = require("../data/books.json")
const helper = require("../helper")
const { writeDataToFile } = require("../util")

function getAllBook() {
    return new Promise((resolve, reject) => {
        resolve(books)
    })
}

function findWithId(id) {
    return new Promise((resolve, reject) => {
        const book = books.find((b) => b.id === id)
        resolve(book)
    })
}

function create(book) {
    return new Promise((resolve, reject) => {
        const newBook = { id: helper.createId(), ...book }
        books.push(newBook)
        writeDataToFile("./data/books.json", books)
        resolve(newBook) // this is what we want 

    })
}

function update(id, bookData) {
    return new Promise((resolve, reject) => {
        const index = books.findIndex((b) => b.id === id)
        books[index] = { id, ...bookData }

        writeDataToFile("./data/books.json", books)
        resolve(books[index])

    })
}

function remove(id) {
    return new Promise((resolve, reject) => {
        books = books.filter((b) => b.id !== id)

        writeDataToFile("./data/books.json", books)
        resolve() //nothing to be resolved

    })
}



module.exports = {
    getAllBook,
    findWithId,
    create,
    update,
    remove
}