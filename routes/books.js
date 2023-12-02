const express = require("express")
const router = express.Router()
const { getBooks, createBook, getBook, updateBook, deleteBook } = require("../controllers/books")
const multer = require("multer")

const storage = multer.diskStorage({
    destination: "./assets/",
    filename: (req, file, cb) => {
        cb(
            null,
            file.originalname
        );
    },
})
const upload = multer({ storage })

router.get("/", getBooks)
router.get("/:id", getBook) 
router.post("/create", upload.single("bookImage"), createBook)
router.put("/edit/:id", upload.single("bookImage"), updateBook)
router.delete("/:id", deleteBook)

module.exports = router