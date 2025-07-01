import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';

// Interface for Admin document (TypeScript)
interface IAdmin extends Document {
    email: string;
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface for Admin model (static methods)
interface IAdminModel extends Model<IAdmin> {
    // Add static methods here if needed (e.g., findByEmail)
}

// Schema definition
const AdminSchema: Schema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false, // Exclude password by default when querying
    },
}, { timestamps: true });

// Hash password before saving
AdminSchema.pre<IAdmin>('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err as Error);
    }
});

// Method to compare passwords
AdminSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Create and export the model
const Admin: IAdminModel = mongoose.model<IAdmin, IAdminModel>('Admin', AdminSchema);
export default Admin;