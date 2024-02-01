const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: [true, 'Password is required'] },
  role: { type: String, enum: ['admin', 'author', 'retail'], required: true },
  fullName: {type: String, required: true}
},{
    timestamps: true
});

// Pre-save hook to handle duplicate key error
// userSchema.post('save', function (error, doc, next) {
//     if (error.name === 'MongoServerError' && error.code === 11000) {
//         const fieldName = Object.keys(error.keyPattern)[0];
//         return res.status(400).json({ message: `Duplicate ${fieldName}`, error: true });
//     } else {
//         next();
//     }
// });


// userSchema.pre("save", async function (next) {
//     if(!this.isModified("password")) return next();

//     this.password = await bcrypt.hash(this.password, 10)
//     next()
// }, {
//     timestamps: true
// })

// userSchema.methods.isPasswordCorrect = async function(password){
//     return await bcrypt.compare(password, this.password)
// }

// userSchema.methods.generateAccessToken = function(){
//     return jwt.sign(
//         {
//             _id: this._id,
//             email: this.email,
//             username: this.username,
//             fullName: this.fullName
//         },
//         process.env.ACCESS_TOKEN_SECRET,
//         {
//             expiresIn: process.env.ACCESS_TOKEN_EXPIRY
//         }
//     )
// }
// userSchema.methods.generateRefreshToken = function(){
//     return jwt.sign(
//         {
//             _id: this._id,
            
//         },
//         process.env.REFRESH_TOKEN_SECRET,
//         {
//             expiresIn: process.env.REFRESH_TOKEN_EXPIRY
//         }
//     )
// }

module.exports = mongoose.model('User', userSchema);
