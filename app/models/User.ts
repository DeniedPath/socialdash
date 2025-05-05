import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IUser extends Document {
    email: string;
    username: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
        index: true,
    },
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        index: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false, // Won't be included in query results by default
    },
}, { 
    timestamps: true 
});

// Add pre-save hook to validate fields (if needed)
UserSchema.pre('save', function(next) {
    console.log(`Saving user with email: ${this.email}`);
    
    // Add custom validation if needed
    if (this.isModified('password')) {
        console.log('Password field has been modified');
        // Password will already be hashed in the controller
    }
    
    next();
});

// Create a helper method (not used now but could be useful)
UserSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

// Avoid recompiling model
const User: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;