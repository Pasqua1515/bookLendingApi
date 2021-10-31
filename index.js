const http = require("http")
const { getBooks,
    getoneBook,
    getUsers,
    getOneUser,
    createBook,
    createUser,
    updateUser,
    updateBook,
    deleteBook,
    deleteUser,
    updateBookAvailability,
    returnBook } = require("./controllers/controller")
const helper = require("./helper")


//const users = require("./data/users.json")


const server = http.createServer((req, res) => {
    if (req.url === "/books" && req.method === "GET") {
        getBooks(req, res)
    } else if (req.url.match(/\/books\/\w+/) && req.method === "GET") {  // puts the url between /url/ so if you have other slashes you need to cancel them with backword slashes
        // if you want /books/id  it will be /\/books\/id/
        const id = helper.findIdinUrl(req)
        //const id = req.url.split("/")[2];
        getoneBook(req, res, id)
    } else if (req.url === "/users" && req.method === "GET") {
        // to display ALL in url
        getUsers(req, res)
    } else if (req.url.match(/\/users\/\w+/) && req.method === "GET") {
        // to find 1 user with their id
        const id = helper.findIdinUrl(req)
        getOneUser(req, res, id)
    } else if (req.url.match(/\/users\/\w+\/books/) && req.method === "POST") {
        // POST allows you to edit and/or create a new json
        const userId = req.url.split("/")[2]
        createBook(req, res, userId)
    }
    else if (req.url === "/users" && req.method === "POST") {
        // POST allows you to edit and/or create a new json
        createUser(req, res)
    } else if (req.url.match(/\/books\/\w+\/\w+/) && req.method === "PUT") { // put is for editing /////////add only admin can do that
        const id = helper.findIdinUrl(req)
        const userId = helper.findsecondId(req)
        console.log(userId)


        updateBook(req, res, id, userId)

    } else if (req.url.match(/\/users\/\w+\/\w+/) && req.method === "PATCH") {// creates and updates
        const id = helper.findIdinUrl(req)
        const bookid = helper.findsecondId(req)

        updateBookAvailability(req, res, id, bookid)
        updateUser(req, res, id)
        //also update the book availability



    } else if (req.url.match(/\/books\/\w+\/\w+/) && req.method === "DELETE") {
        const id = helper.findIdinUrl(req)
        const userID = helper.findsecondId(req)
        //console.log(userID)
        deleteBook(req, res, id, userID)
    } else if (req.url.match(/\/users\/\w+\/\w+/) && req.method === "DELETE") {
        const userID = helper.findIdinUrl(req)
        const bookid = helper.findsecondId(req)

        console.log(bookid)

        returnBook(req, res, userID, bookid)
    } else if (req.url.match(/\/users\/\w+/) && req.method === "DELETE") {
        const id = helper.findIdinUrl(req)
        deleteUser(req, res, id)
    } //else if (req.url.match(/\/users\/([0-9+])\/([0-9+])/) && req.method === "DELETE") {
    // if /users/iduser/add/idbook

    //} 
    else {
        res.writeHead(404, { "Content-Type": "application-json" })
        res.end(JSON.stringify({ message: "Route Not Found" }))
    }
})


const port = process.env.port || 8080;
server.listen(port, () => console.log(`Server running on port ${port}`))