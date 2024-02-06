const express = require("express")
const router = express.Router()
const { getAudioFiles, getAudioFile, createAudioFile, updateAudioFile, deleteAudioFile } = require("../controllers/audiofiles")
const multer = require("multer")
const path = require("path")
const storage = multer.diskStorage({
    destination: "./assets/",
    filename: (req, file, cb) => {
        cb(
            null,
            file.originalname          
        )
    },
})
const upload = multer({ storage })

router.get("/", getAudioFiles);
router.get("/onefile/:id", getAudioFile)

router.post("/create", upload.single("audioFile"), createAudioFile)
router.put("/edit/:id", upload.single("audioFile"), updateAudioFile)
router.delete("/delete/:id", deleteAudioFile)
module.exports = router
