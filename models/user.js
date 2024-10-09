const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    // username: {
    //     type: String,
    //     unique: true,
    //     required: true,
    // },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    hashedPassword:{
        type:String,
        // required:true

        // Make it optional for OAuth users
        required: function () {
            return !this.googleId;
        },
    },
    googleId: {
        type: String,
        unique: true, // Unique to distinguish OAuth users
    },
    displayName: String,
    
})

// not sure what this does below but need it based on Hoot app

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword;
    }
});

module.exports=mongoose.model('User',userSchema)