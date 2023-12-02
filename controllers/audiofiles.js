const Audio = require("../models/audiofile");
const fs = require('fs');

const getAudioFiles = async (req, res) => {
    try {
        const audioFiles = await Audio.find();
        res.status(200).json(audioFiles);
      } catch (error) {
        res.status(500).json({
          message: "Не удалось получить список",
        });
      }
    };

const getAudioFile = async (req, res) => {
    try {
      const audioFile = await Audio.findOne({ bookId: req.body.bookId })
        res.json(audioFile)
      //  res.status(200).json(audioFile);
      } catch  (error) {
          res.status(404).json({
            message: "Объект не найден",
          });
      }
    };

const createAudioFile = async (req, res) => {
  const stats = fs.statSync(`./assets/${req.file.filename}`)
  const fileSizeInBytes = stats.size
  const errors = {};
 
        if (!req.body.bookId) {
          errors.authorization = { message: "Пожалуйста, войдите или зарегистрируйтесь. (Нужен bookId)" }
        }
        if (fileSizeInBytes > 500000000) {
          errors.tooBigSize = { message: "Слишком большой аудио файл. Файл не должен быть больше 100 МБ" }
        }
        if (Object.keys(errors).length > 0) {
          fs.unlinkSync(`./assets/${req.file.filename}`)
          console.log('AudioFile removed / ' + req.file.filename)
          return res.json(errors)
        }
        try {
          const { bookId } = req.body

          const audio = await Audio.create({
            audioFile: `http://localhost:${process.env.PORT}/static/${req.file.filename}`,
            bookId
          });
          res.json({
            audio,
            success: 'Аудио файл успешно добавлен',
        })
        } catch (err) {
          res.status(500).json({
            message: "Не удалось создать объект, повторите попытку познее",
          });
        }
      };

const updateAudioFile = async (req, res) => {
        const errors = {};

        if (!req.body.title) {
          errors.title = { message: "Пожалуйста, укажите название книги" };
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

const deleteAudioFile = async (req, res) => {
  try {
    const audioObject = await Audio.findOneAndDelete({ _id: req.params.id })
    const path = audioObject.audioFile.split('http://localhost:8000/static/')[1]
    fs.unlinkSync(`./assets/${path}`)
    console.log('Audio(book-'+audioObject.bookId +') removed / ' + audioObject._id)
    res.json({
      audioObject
    })
  } catch {
    res.status(404).json({
      message: "Объект не найден",
    });
  }
};
module.exports = {
    getAudioFiles,
    getAudioFile,
    createAudioFile,
    updateAudioFile,
    deleteAudioFile
  };

// const getAudioFile = async (req, res) => {
//     try {
//         const audioFile = await Audio.find({ _id: req.params.id })
//         res.json(audioFile)
//       //  res.status(200).json(audioFile);
//       } catch  (error) {
//           res.status(404).json({
//             message: "Объект не найден",
//           });
//       }
//     };
  // const getAudioFile = async (req, res) => {
  //   console.log(req.body)
  //    for(let [key, value] of req.body) {
  //     console.log(`${key} - ${value}`)
  //     }
  
  //       try {
  //         console.log(req.body.bookId)
  //           const audioObject = await Audio.find({ bookId: req.body.bookId });
  //           res.json(audioObject);
  //         } catch  (error) {
  //             res.status(404).json({
  //               message: "Объект не найден",
  //             });
  //         }
  //       };