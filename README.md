# READ ME FOR POSTMAN REQUESTS




1. /books                    ----GET  This will return the full list of books available in this library.
2. /users                    ----GET  This will return the full list of users registered (with a valid ID).
3. /books/bookID             ----GET  This returns the book with the ID added.
4. /users/userID             ----GET  This returns the user with the ID added.
5. /users/001/books          ----POST This allows the admin (001) and ONLY the admin to create a new book.
6. /users                    ----POST This allows a new user to register. A new ID will be assigned.
7. /books/bookID/001         ----PUT  This allows the admin (001) and ONLY the admin to update, edit or change a book.
8. /users/userID/bookID      ----PATCH This allows a particular user (chosen through ID) to borrow a book. the book is automatically removed from its availability list.
9. /books/bookID/001         ----DELETE This allows the admin (001) and ONLY the admin to delete a book.
10. /users/userID            ----DELETE This allows a users to be deleted.
11. /users/userID/bookID     ----DELETE This allows a user to delete a bookthey borrowed

### How to run the app

1. clone the repository
2. cd into the project repository
3. Open your terminal while in the project repository and type `npm init` to install all depencies
4. To run the app, use `npm run dev` to start the nodemon server