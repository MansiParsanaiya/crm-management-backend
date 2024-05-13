const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const studentSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    studentNumber: { type: Number, required: true, unique:true}, // Assuming 10 digit number
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    parentNumber: { type: Number, required: true,unique:true}, // Assuming 10 digit number
    college: { type: String, required: true },
    qualification: { type: String, required: true },
    aadharCard: { type: Number, required: true, unique:true}, // Assuming 12 digit Aadhar number
    feesPay: { type: Number,required:true},
    amountPay: { type: Number,required:true},
    remainingFees: { type: Number,required:true},
    modeOfPayment: {type : String,required:true},
    address: {type : String,required:true},
    courseName:{ type : String,required:true},
    branch: {type : String, required:true},
    date: { type: Date, default: Date.now },
});

studentSchema.plugin(mongoosePaginate);

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
