import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        otp: {
            type: String,
            required: true
        },

        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

otpSchema.pre("save", async function () {
    if (!this.isModified("otp")) return;
    this.otp = await bcrypt.hash(this.otp, 10)
})

otpSchema.methods.isOTPCorrect = async function (otp) {
    return await bcrypt.compare(otp, this.otp)
}

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;