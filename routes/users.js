const express = require("express")
const router = express.Router()
const { registration, login, getMe } = require("../controllers/auth")
const { checkAuth } = require("../utils/checkAuth")

router.post("/registration", registration)
router.post("/login", login)
router.get("/getme", checkAuth, getMe)

module.exports = router