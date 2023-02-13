import express from "express"; //подключение 

const app = express(); //создали экпресс приложение

//пишем главный путь app.get
app.get('/', (req, res)=>{
    res.send('Hello User!'); 
}); 

//запуск приложения
app.listen(4444, (err)=>{
    if(err) {
        return console.log(err);
    }
    console.log('Server OK');
}) //может быть любой порт 4444 //Server OK