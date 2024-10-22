const mongoose = require('mongoose')
const UserRank = require('../models/userRank.js'); // Import the UserRank model


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

// Create a UserRank document after a new user is created
userSchema.post('save', async function (doc, next) {
    try {
        await UserRank.create({ user: doc._id }); // Create rank document
        console.log(`Rank document created for user: ${doc._id}`);
        next();
    } catch (err) {
        console.error('Error creating rank document:', err);
        next(err); // Pass the error along
    }
});

module.exports=mongoose.model('User',userSchema)