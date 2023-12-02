const Book = require("../models/book")
const fs = require('fs')

const getBooks = async (req, res) => {
    try {
        const books = await Book.find()
        res.status(200).json(books)
      } catch (error) {
        res.status(500).json({
          message: "Не удалось получить список",
        });
      }
    }
const getBook = async (req, res) => {
    try {
        const book = await Book.find({ _id: req.params.id });
        res.status(200).json(book);
      } catch  (error) {
          res.status(404).json({
            message: "Объект не найден",
          });
      }
    }
    const createBook = async (req, res) => {
        const errors = {};

        if (!req.body.title) {
          console.log('Image !!!!')
          errors.title = { message: "Пожалуйста, укажите название книги" };
        }
        if (req.body.title.length > 300) {
          errors.title = { message: "Слишком длинное название" };
        }
        if (req.body.description.length > 3000) {
          errors.description = { message: "Слишком длинное описание" };
        }
        if (!req.body.content) {
          errors.content = { message: "Пожалуйста, введите текст книги" };
        }
        if (Object.keys(errors).length > 0) {
          fs.unlinkSync(`./assets/${req.file.filename}`)
          console.log('img removed / ' + req.file.filename)
          return res.json(errors)
        }
        try {
          const { title, description, content, userId, notes } = req.body;
          const isBookUnique = await Book.findOne({ title })

          if (isBookUnique) {
            fs.unlinkSync(`./assets/${req.file.filename}`)
            console.log('img removed / ' + req.file.filename)
              return res.json({
                bookUnique: 'Книга с таким названием уже есть. Дайте другое название книге. Например: "Гензель и Гретель. Авторы: Братья Гримм. Перевод П.Н.Полевой"',
              })
          }
          const book = await Book.create({
            title,
            description,
            content,
            bookImage: `http://localhost:${process.env.PORT}/static/${req.file.filename}`,
            userId,
            notes
          })
          res.json({
            book,
            success: 'Книга успешно добавлена',
        })
        } catch (err) {
          res.status(500).json({
            message: "Не удалось создать объект, повторите попытку познее",
          });
        }
      }

const updateBook = async (req, res) => {
        const errors = {};

        if (!req.body.title) {
          errors.title = { message: "Пожалуйста, укажите название книги" };
        }
        if (req.body.title.length > 300) {
          errors.title = { message: "Слишком длинное название" };
        }
        if (req.body.description.length > 3000) {
          errors.description = { message: "Слишком длинное описание" };
        }
        if (!req.body.content) {
          errors.content = { message: "Пожалуйста, введите текст книги" };
        } 
        if (Object.keys(errors).length > 0) {
          return res.json(errors);
        }
      
        try {
          const { title, description, content, userId, notes } = req.body;
          const uniqueBook = await Book.findOne({ title })

          if (uniqueBook && uniqueBook._id ==! req.params.id) {
            return res.json({
              uniqueBook
            })
          }
    
          const book = await Book.findOneAndUpdate({ _id: req.params.id },{
            title,
            description,
            content,
            bookImage: `http://localhost:${process.env.PORT}/static/${req.file.filename}`,
            userId,
            notes,
          });
          res.json({
            book,
            success: 'Книга успешно изменена',
        })
        } catch (err) {
          res.status(500).json({
            message: "Не удалось обновить объект, повторите попытку познее",
          });
        }
      };

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ _id: req.params.id })
    const imagePath = book.bookImage.split('http://localhost:8000/static/')[1]
    fs.unlinkSync(`./assets/${imagePath}`)
    console.log('title book removed / ' + book.title)
    res.json({
      book
    })
  } catch {
    res.status(404).json({
      message: "Объект не найден",
    });
  }
};
module.exports = {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook
  }
