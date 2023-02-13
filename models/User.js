//npm install pg-promise
//npm install --save pg 

import mongoose from "mongoose";

const UserSchema = new  mongoose.Schema({
    fullName: {
        type: String,
        required: true, //объект считается обязательным
        },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: String,
},
{
    timestamps: true, //даты создания и обновления, автоматически
    }
);
export default  mongoose.model('User', UserSchema);