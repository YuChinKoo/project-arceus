const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    firstname: {
        type: String, 
        required: true
    },
    lastname: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true,
        unique: true
    },
    requestedTaskBoards: {
        type: [ mongoose.Types.ObjectId ],
        default: []
    },
    sharedTaskBoards: {
        type: [ mongoose.Types.ObjectId ],
        default: []
    },
    hashedPassword: {
        type: String, 
        required: true
    }
});

const User = mongoose.model('user', UserSchema);

module.exports = User;