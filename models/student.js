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

studentSchema.statics.getNextEnrollmentNumber = async function(companyName, courseName) {
    const currentYear = new Date().getFullYear().toString();
    
    // Find the highest enrollment number for the given company name and course name
    const highestStudent = await this.findOne({
        enrollmentNumber: { $regex: `^${companyName}-${currentYear}-${courseName}-\\d{4}$` }
    }, { enrollmentNumber: 1 }).sort({ "enrollmentNumber": -1 });
    
    let nextEnrollmentNumber;
    
    if (highestStudent) {   
        const lastNumber = parseInt(highestStudent.enrollmentNumber.split('-')[3]);
        
        const nextNumber = (lastNumber + 1).toString().padStart(4, '0');
        
        nextEnrollmentNumber = `${companyName}-${currentYear}-${courseName}-${nextNumber}`;
    } else {
        nextEnrollmentNumber = `${companyName}-${currentYear}-${courseName}-0001`;
    }
    return nextEnrollmentNumber;
};


studentSchema.pre('save', async function(next) {
    if (!this.enrollmentNumber) {
        this.enrollmentNumber = await this.constructor.getNextEnrollmentNumber();
    }
    next();
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
