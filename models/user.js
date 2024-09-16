const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    // username: {
    //     type: String,
    //     unique: true,
    //     required: true,
    // },
    email: {
        type: String,
        // required: true, <-- change this back to required later
        unique: true,
        lowercase: true,
        trim: true,
    },
    hashedPassword:{
        type:String,
        required:true
    },
    
})

// not sure what this does below but need it based on Hoot app

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword;
    }
});

module.exports=mongoose.model('User',userSchema)