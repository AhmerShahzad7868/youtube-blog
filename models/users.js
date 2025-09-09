const { createHmac, randomBytes } = require("crypto");
const mongoose = require("mongoose");
const { model } = mongoose;
const Schema = mongoose.Schema;
const { createTokenForUser } = require("../services/authentication");


const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profileImageURL: {
        type: String,
        default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    userRole : {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    }

});
userSchema.pre("save", function(next) {
    const user = this;
    if (!user.isModified("password")) return next();
    
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

        user.salt = salt;
        user.password = hashedPassword;
        next();

});

userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
    const user = await this.findOne({ email });
    if(!user) {
        throw new Error("User not found");
    }
    console.log(user);
    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
    if (hashedPassword !== userProvidedHash) {
        throw new Error("Invalid password");
    }

    const token = createTokenForUser(user);
    return token;
});



const User = model("User", userSchema);
module.exports = User;