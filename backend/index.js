import express from "express"; //подключение 
import jwt from "jsonwebtoken";
//npm install express-validator //для проверки данных
import bcrypt from "bcrypt" //npm install bcrypt
import {registerValidation} from './validation/auth.js';
import {body, validationResult} from 'express-validator';

import UserModel from "./models/User.js"
import checkAuth from "./utils/checkAuth.js"

import mongoose from "mongoose";

mongoose
   .connect('mongodb://127.0.0.1:27017/test') //users
   .then(() => console.log('DB ok'))
   .catch((err) => console.log('DB error', err))

const app = express(); //создали экпресс приложение
app.use(express.json()); //позволит читать json

//пишем главный путь app.get
app.get('/', (req, res)=>{
    res.send('Hello User!'); 
}); 

//авторизация

app.post('/auth/login',  async (req, res) => {
    try{
      const user = await UserModel.findOne({ email: req.body.email });
      
      if(!user){
        return req.status(400).json({
            /*в полноценном проекте лучше не писать почему не удалось*/
            message: 'Пользователя в базе нет', 
        });
      }
      //проверяем сходятся ли пароль и hash
      const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
      if (!isValidPass) {
        return res.status(400).json({
            message: "Неверный логин или пароль",
        });
}
     //новый токен
     const token = jwt.sign({
     _id: user._id, //шифруем user, _id так в mongodb id пишется
     },
         'secret123', //вторым параметром указываем ключ
    {
           expiresIn: "30d", //token перестанет быть валидным через 30 дней
    },
    );
    
    const { passwordHash, ...userData} = user._doc;

    res.json({
        ...userData, //просто ...user дает полную информацию по базе
        token,
    });
    } catch (err) {
        console.log(err);
        res.status(500).json({
        message: 'не удалось авторизоваться',
         });
    }
    });


app.post('/auth/register', registerValidation, async (req, res)=>{
try{ 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json(errors.array()); //возвращается все ошибки
    }
    const password = req.body.password;
    //алгоритм шифрования 
    const salt = await bcrypt.genSalt(5);
    const hash = await bcrypt.hash(password, salt); //переменная хранения зашифрованного пароля

    //документ на создание пользователя
    const doc = new UserModel({
       email: req.body.email,
       fullName: req.body.fullName,
       avatarUrl: req.body.avatarUrl,
       passwordHash: hash, //бэкенд шифрует пароль 

    });
    //записываем пользователя в базу, выше данные для записи
    const user = await doc.save();

    // после создания документа, мы создаем токен
    const token = jwt.sign({
        _id: user._id, //шифруем user, _id так в mongodb id пишется
    },
    'secret123', //вторым параметром указываем ключ
    {
     expiresIn: "30d", //token перестанет быть валидным через 30 дней
    },
    );
    //не выводим hash
    const { passwordHash, ...userData} = user._doc;

    res.json({
        ...userData, //просто ...user дает полную информацию по базе
        token,
    });//1 ответ
}   catch (err) {
    console.log(err);
    res.status(500).json({
    message: 'не удалось зарегистрироваться'
    });
  }
});

/*запрос информации о нас. для этого создаем доп функцию 
(промежуточная) utils*/
app.get('/auth/about', checkAuth, (req, res) => {
    try{
        res.json({
            success: true,
        }); 

    } catch (err) {}   
});


//запуск приложения
app.listen(4444, (err)=>{
    if(err) {
        return console.log(err);
    }
    console.log('Server OK');
}) //может быть любой порт 4444 //Server OK