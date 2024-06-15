const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,

    },
    hashedPassword:{
        type:String,
        required:true
    }
})

// not sure what this does below but need it based on Hoot app

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword;
    }
});

module.exports=mongoose.model('User',userSchema)