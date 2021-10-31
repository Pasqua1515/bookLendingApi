const Books = require("../models/bookModel")
const Users = require("../models/userModel")
const admin = require("../data/admin.json")
const { writeDataToFile } = require("../util")

const { getPostData } = require("../util")

//console.log(admin[0].id)
//////BOOKS///////

async function getBooks(req, res) { // all the books GETY /books
    try {
        const books = await Books.getAllBook()

        res.writeHead(200, { "Content-type": "application/json" })
        res.end(JSON.stringify(books))
    } catch (error) {
        console.log(error)
    }
}


async function getoneBook(req, res, id) {
    try {
        const book = await Books.findWithId(id)

        if (!book) {// if it doesnt exist send an error
            res.writeHead(404, { "Content-type": "application/json" })
            res.end(JSON.stringify({ message: "Book not found" }))

        } else {
            res.writeHead(200, { "Content-type": "application/json" })
            res.end(JSON.stringify(book))
        }
    } catch (error) {
        console.log(error)
    }
}

async function createBook(req, res, userid) {  //POST
    try {

        if (userid !== admin[0].id) {
            console.log("jello")

            res.writeHead(404, { "Content-type": "application/json" })
            return res.end(JSON.stringify({ message: "This user is not allowed to create any book" }))
        }

        const body = await getPostData(req)

        const { title, content, availableCopies } = JSON.parse(body)
        const book = {

            title,
            content,
            availableCopies
        }


        const newBook = await Books.create(book) //always await a promise if you want it to be displayed

        res.writeHead(201, { "Content-type": "application/json" })
        return res.end(JSON.stringify(newBook))


    } catch (error) {
        console.log(error)
    }
}



async function updateBook(req, res, id, userID) {  //POST
    try {
        if (userID !== admin[0].id) {
            console.log(false)
            res.writeHead(404, { "Content-type": "application/json" })
            return res.end(JSON.stringify({ message: "Missing Admin parameter. Unable to edit book" }))


        }

        const book = await Books.findWithId(id)

        if (!book) {
            res.writeHead(404, { "Content-type": "application/json" })
            res.end(JSON.stringify({ message: "Book not found" }))

        } else {

            const body = await getPostData(req)

            const { title, content, availableCopies } = JSON.parse(body)

            const bookData = {

                title: title || book.title,
                content: content || book.content,
                availableCopies: availableCopies || book.availableCopies
            }


            const updatedBook = await Books.update(id, bookData) //always await a promise if you want it to be displayed

            res.writeHead(200, { "Content-type": "application/json" })
            return res.end(JSON.stringify(updatedBook))

        }


    } catch (error) {
        console.log(error)
    }
}


async function deleteBook(req, res, id, userID) {
    try {

        if (userID !== admin[0].id) {
            res.writeHead(404, { "Content-type": "application/json" })
            return res.end(JSON.stringify({ message: "Missing admin parameter. Cannot Delete Book" }))
        }


        const book = await Books.findWithId(id)

        if (!book) {// if it doesnt exist send an error
            res.writeHead(404, { "Content-type": "application/json" })
            res.end(JSON.stringify({ message: "Book not found" }))

        } else {
            await Books.remove(id)
            res.writeHead(200, { "Content-type": "application/json" })
            res.end(JSON.stringify({ message: `Book ${book.title} has been deleted ` }))
        }
    } catch (error) {
        console.log(error)
    }
}

async function updateBookAvailability(req, res, userid, bookId) {
    try {
        const users = await Users.getAllUsers()

        const userNeeded = await users.find((u) => u.id === userid)

        if (!userNeeded) {
            res.writeHead(404, { "Content-type": "application/json" })
            res.end(JSON.stringify({ message: "User is not available" }))
        }


        //console.log(userNeeded)

        //console.log(bookId)

        const books = await Books.getAllBook()
        const bookNeeded = books.find((b) => b.id === bookId)

        if (!bookNeeded) {
            res.writeHead(404, { "Content-type": "application/json" })
            res.end(JSON.stringify({ message: "Book not found" }))
        }

        if (bookNeeded.availableCopies <= 0) {
            res.writeHead(404, { "Content-type": "application/json" })
            res.end(JSON.stringify({ message: "Book is not available" }))
        }



        if (bookNeeded.id === bookId) {
            const { title, content, availableCopies } = bookNeeded //destructuring 
            const bookData = {
                title: title || bookNeeded.title,
                content: content || bookNeeded.content,
                availableCopies: bookNeeded.availableCopies - 1
            }
            const { name, booksRented } = userNeeded
            const userData = {
                name: name || userNeeded.name,
                booksRented: [...booksRented, { id: bookNeeded.id, title: title }] || booksRented// [{id: 1, name: alice in wonderland}]
            }


            const bookInWQuestion = userNeeded.booksRented.find((b) => b.id = bookId)
            if (userNeeded.booksRented.includes(bookInWQuestion)) {
                res.writeHead(404, { "Content-type": "application/json" })
                return res.end(JSON.stringify({ message: "Book already rented" }))
            }



            const updatedBook = await Books.update(bookId, bookData)
            const updatedUser = await Users.update(userid, userData)

            res.writeHead(200, { "Content-type": "application/json" })
            res.end(JSON.stringify(updatedUser))
        } else {
            res.writeHead(404, { "Content-type": "application/json" })
            return res.end(JSON.stringify({ message: "Unable to update books availability" }))
        }
    } catch (error) {
        console.log(error)
    }
}

async function returnBook(req, res, userid, bookId) {
    try {

        const user = await Users.findUserId(userid)
        const bookFromJSON = await Books.findWithId(bookId)
        //console.log(user)




        if (user.booksRented === []) {
            res.writeHead(404, { "Content-type": "application/json" })
            return res.end(JSON.stringify({ message: "No Book has been rented " }))
        }

        const book = user.booksRented.find((br) => br.id === bookId)

        if (!book) {
            res.writeHead(404, { "Content-type": "application/json" })
            return res.end(JSON.stringify({ message: ` User has not rented ${bookId}` }))
        }

        if (book.id !== bookFromJSON.id) {
            res.writeHead(404, { "Content-type": "application/json" })
            return res.end(JSON.stringify({ message: "Unable to return book" }))
        } else {

            const filteredUserBooks = user.booksRented.filter((br) => br.id !== bookId)
            console.log(filteredUserBooks)

            const { title, content, availableCopies } = bookFromJSON //destructuring 
            const bookData = {
                title: title || bookFromJSON.title,
                content: content || bookFromJSON.content,
                availableCopies: bookFromJSON.availableCopies + 1
            }

            const { name, booksRented } = user
            const userData = {
                name: name || user.name,
                booksRented: [...filteredUserBooks]
            }

            const updatedBook = await Books.update(bookId, bookData)
            const updatedUser = await Users.update(userid, userData)

            res.writeHead(200, { "Content-type": "application/json" })
            res.end(JSON.stringify(updatedBook))
        }
    } catch (error) {
        console.log(error)
    }


}


///////////USERS////////////////
async function getUsers(req, res) { // all the books GETY /books
    try {
        const users = await Users.getAllUsers()

        res.writeHead(200, { "Content-type": "application/json" })
        res.end(JSON.stringify(users))
    } catch (error) {
        console.log(error)
    }
}

async function getOneUser(req, res, id) {
    try {
        const user = await Users.findUserId(id)

        if (!user) {
            res.writeHead(404, { "Content-type": "application/json" })
            res.end(JSON.stringify({ message: "User not found" }))

        } else {
            res.writeHead(200, { "Content-type": "application/json" })
            res.end(JSON.stringify(user))
        }
    } catch (error) {
        console.log(error)
    }
}


async function createUser(req, res, id) {  //P OST
    try {

        const body = await getPostData(req)

        const { name, booksRented } = JSON.parse(body)
        const user = {
            name,
            booksRented: []
        }



        const newUser = await Users.create(user) //always await a promise if you want it to be displayed

        res.writeHead(201, { "Content-type": "application/json" })
        return res.end(JSON.stringify(newUser))

    } catch (error) {
        console.log(error)
    }
}


async function updateUser(req, res, id) {  //P OST
    try {
        const user = await Users.findUserId(id)

        if (!user) {
            res.writeHead(404, { "Content-type": "application/json" })
            res.end(JSON.stringify({ message: "User not found" }))
        } else {
            const body = await getPostData(req)
            //console.log(body)

            const { name, booksRented } = JSON.parse(body)//

            const userData = {
                name: name || user.name,
                booksRented: booksRented || user.booksRented
            }

            const updatedUser = await Users.update(id, userData)    //always await a promise if you want it to be displayed


            res.writeHead(200, { "Content-type": "application/json" })
            res.end(JSON.stringify(updatedUser))
            //
        }



    } catch (error) {
        console.log(error)
    }
}


async function deleteUser(req, res, id) {
    try {
        const user = await Users.findUserId(id)

        if (!user) {
            res.writeHead(404, { "Content-type": "application/json" })
            res.end(JSON.stringify({ message: "User not found" }))

        } else {
            await Users.remove(id)
            res.writeHead(200, { "Content-type": "application/json" })
            res.end(JSON.stringify({ message: `User ${id} has been deleted` }))
        }
    } catch (error) {
        console.log(error)
    }
}

















module.exports = {
    getBooks,
    getoneBook,
    createBook,
    updateBook,
    deleteBook,
    updateBookAvailability,
    returnBook,
    ///////
    getUsers,
    getOneUser,
    createUser,
    updateUser,
    deleteUser
}