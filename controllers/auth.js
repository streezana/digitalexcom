const User = require("../models/user")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registration = async (req, res) => {
    const req_email = req.body.email
    const req_password = req.body.password

    if (!req_email.trim()) {
        return res.json({
            email_message: "Пожалуйста, укажите email" 
        })
    }
        let noDog=false;
        let noPoint=false;
        let noPointNoDog=false;
        req.body.email.indexOf("@") == -1 ? noDog=true : noDog=false;
        req.body.email.indexOf(".") == -1 ? noPoint=true : noPoint=false;
        noDog && noPoint ? noPointNoDog=true : noPointNoDog=false;
        if (noDog || noPoint || noPointNoDog) {
            return res.json({
                email_message: "Поле email должно содержать определенные символы, например: xxxx@gmail.com" 
            })
        }
    
    if (!req_password.trim()) {
        return res.json({
           password_message: "Пожалуйста, укажите пароль" 
        })
    }
    if (req_password.trim().length < 8) {
        return res.json({
            password_message: "Пароль должен содержать 8 или более символов и состоять из цифр, и букв на латинице" 
          
        })
    }
    let pattern = /^(?=\d*[a-zA-Z])(?=\D*\d)[a-zA-Z0-9]+$/
        if (req_password.match(pattern)===null) {
        return res.json({
            password_message: "Пароль должен содержать 8 или более символов и состоять из цифр, и букв на латинице" 
        })
    }
    
    try {
        const { email, password } = req.body

        const isUsed = await User.findOne({ email })

        if (isUsed) {
            return res.json({
                email_message: 'Данный email уже занят',
            })
        }

        const salt = bcrypt.genSaltSync(5)
        const hash = bcrypt.hashSync(password.trim(), salt)

        const newUser = new User({
            email: email.trim(),
            password: hash,
        })

        const token = jwt.sign(
            {
                id: newUser._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '2d' },
        )

        await newUser.save()

        res.json({
            newUser,
            token,
            message: 'Регистрация прошла успешно',
        })
    } catch (error) {
        res.status(500).json({ message: "Не удалось зарегистрироваться, попробуйте еще раз" })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            return res.json({
                email_message: 'Пользователя с таким email не существует',
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.json({
                password_message: 'Неверный пароль',
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '2d' },
        )

        res.json({
            token,
            user,
            message: 'Вы вошли в систему',
        })
    } catch (error) {
        res.json({ message: 'Ошибка при авторизации' })
    }
}

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            return res.json({
                user_message: 'Такого пользователя не существует',
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '2d' },
        )

        res.json({
            user,
            token,
        })
    } catch (error) {
        res.json({ message: 'Нет доступа' })
    }
}
module.exports = {
    registration,
    login,
    getMe
  }
