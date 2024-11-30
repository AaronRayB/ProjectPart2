const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    displayName: {
        type: String,
        default: "",
        trim: true,
        required: 'DisplayName is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    update: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'user'
});

// Apply passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose, {
    missingPasswordError: 'Wrong/Missing Password'
});

// Export the User model
module.exports = mongoose.model('User', userSchema);
