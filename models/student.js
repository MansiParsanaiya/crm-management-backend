const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const studentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentNumber: { type: Number, required: true, unique: true },
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  parentNumber: { type: Number, required: true, unique: true },
  college: { type: String, required: true },
  qualification: { type: String, required: true },
  aadharCard: { type: Number, required: true, unique: true },
  feesPay: { type: Number, required: true },
  amountPay: { type: Number, required: true },
  remainingFees: { type: Number, required: true },
  modeOfPayment: { type: String, required: true },
  address: { type: String, required: true },
  courseName: { type: String, required: true },
  branch: { type: String, required: true },
  enrollmentNumber: { type: String, unique: true },
  date: { type: Date, default: Date.now },
});

studentSchema.plugin(mongoosePaginate);

// Define a static method to generate the next enrollment number
studentSchema.statics.getNextEnrollmentNumber = async function() {
    // Find the highest enrollment number
    const highestStudent = await this.findOne({}, { enrollmentNumber: 1 }).sort({ "enrollmentNumber": -1 });
    
    let nextEnrollmentNumber;
    
    if (highestStudent) {
        // Extract the numeric part of the enrollment number
        const lastNumber = parseInt(highestStudent.enrollmentNumber.split('-')[1]);
        
        // Increment the numeric part by 1 and pad with zeros
        const nextNumber = (lastNumber + 1).toString().padStart(4, '0');
        
        // Construct the next enrollment number
        nextEnrollmentNumber = `ENROLL-${nextNumber}`;
    } else {
        // If no students exist yet, start with ENROLL-0001
        nextEnrollmentNumber = 'ENROLL-0001';
    }
    return nextEnrollmentNumber;
};

// Pre-save hook to set the enrollment number before saving
studentSchema.pre('save', async function(next) {
    if (!this.enrollmentNumber) {
        this.enrollmentNumber = await this.constructor.getNextEnrollmentNumber();
    }
    next();
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;

// studentSchema.plugin(mongoosePaginate);

// const Student = mongoose.model('Student', studentSchema);
// module.exports = Student;
