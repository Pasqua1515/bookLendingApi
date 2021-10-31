// THIS IS FOR USEFUL REPETITIVE FUNCTIONS
const { v4: uuidv4 } = require("uuid")
var helper = {
}


helper.findIdinUrl = (req) => {
    const id = req.url.split("/")[2];
    // this will get the / books / id and turn it into an array where the parameters are from the string divided by array == url/books/id [localhost...,books, id]
    return id
}

helper.findsecondId = (req) => {
    const id = req.url.split("/")[3]
    return id
}

helper.createId = () => {
    const id = uuidv4()
    return id
}

module.exports = helper