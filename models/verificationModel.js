import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true });

// حذف خودکار رکوردهای منقضی شده
verificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Verification = mongoose.models.Verification || mongoose.model("Verification", verificationSchema);

export default Verification