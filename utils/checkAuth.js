//checkAuth функция проверки авторизации
import jwt from 'jsonwebtoken';

export default (req, res, next) => {
//спарсить токен и вдальнейщим расшифровать
//из headers вытаскиваем токен
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, ''); 
    
    if(token) {
     try{
        //расшифровка токена
      const decoded = jwt.verify(token, 'secret123'); 
      req.userId = decoded._id; 
      next();
     } catch (e) {
        return res.status(404).json({
            message: 'нет доступа',
        });
     }
    } else {
        return res.status(403).json({
            message: 'нет доступа',
        });
    }
};
//res.send(token) для вывода token в программе insomnia/postman
//next(); //в index.js переходит от checkAuth к (req, res)