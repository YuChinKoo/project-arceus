const { mongoose } = require('mongoose');
const { userSchema } = require('./schema/userSchema');
const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let db = mongoose.connection;
// db.on('error', () => {
//     console.error("Error while connecting to DB");
// });
db.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

const Users = mongoose.model('Users', userSchema);

export { Users };