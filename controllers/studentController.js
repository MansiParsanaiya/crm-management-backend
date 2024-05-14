const Student = require('../models/student'); 
const ArchiveStudent = require("../models/archiveStudent")
const Fees = require('../models/fees'); 
const Income = require("../models/income")


module.exports.addStudent = async (req, res) => {
   
    const { studentName, studentNumber, fatherName, motherName, parentNumber, college, qualification, aadharCard, feesPay, amountPay, remainingFees,  modeOfPayment,address,courseName, branch } = req.body;

    Student.create({ studentName, studentNumber, fatherName, motherName, parentNumber, college, qualification, aadharCard, feesPay,  amountPay, remainingFees, modeOfPayment,address,courseName,branch })
        .then((data) => {
            console.log("Saved successfully");
            const feeDetails = new Fees({
                studentName,
                studentNumber,
                feesPay, 
                amountPay,
                amountPaid:feesPay-remainingFees,
                remainingFees,
                modeOfPayment,
                installIncomeId:"1"
            });
    
            feeDetails.save();

            res.status(201).send(data);
        }).catch((err) => {
            console.log(err);
            res.send({ error: err, msg: "Something went wrong" })
        })

};

module.exports.getAllStudents = async (req, res) => {

    try {
        const { page, limit, search } = req.query;

        const query={};
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
        };


    
        console.log(search,"i m calling from getapi search value")
        if (search !== undefined && search !== null && search!=="") {
            if (!isNaN(search)) { 
                query.$or = [
                    { feesPay: parseFloat(search) },
                    { amountPay: parseFloat(search) },
                    { remainingFees: parseFloat(search) },
                    { studentNumber: parseFloat(search) },
                    { parentNumber: parseFloat(search) },
                    { aadharCard: parseFloat(search) },
                ];
            } else {
                query.$or = [
                    { studentName: { $regex: new RegExp(search, 'i') } },
                    { fatherName: { $regex: new RegExp(search, 'i') } },
                    { motherName: { $regex: new RegExp(search, 'i') } },
                    { college: { $regex: new RegExp(search, 'i') } },
                    { qualification: { $regex: new RegExp(search, 'i') } },
                    { courseName: { $regex: new RegExp(search, 'i') } },
                ];
            }
        }


        const students = await Student.paginate(query,options);
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching incomes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.updateStudent = async (req, res) => {

    const { id } = req.params;
    const { studentName, studentNumber, fatherName, motherName, parentNumber, college, qualification, aadharCard, feesPay,  amountPay, remainingFees, modeOfPayment,address,courseName ,branch} = req.body;

    try {
        // const student = await Student.findById(id);

        // if (!student) {
        //     return res.status(404).send({ error: "Student not found" });
        // }

        // let firstEntry = await Fees.findOne({ studentName: studentName, aadharCard: aadharCard }).sort({ date: 1 });

        // if (!firstEntry) {
        //     return res.status(404).send({ error: "Fees data not found for the student" });
        // }

        // firstEntry.feesPay = feesPay;
        // firstEntry.amountPay = amountPay;
        // firstEntry.remainingFees = remainingFees;
        // firstEntry.modeOfPayment = modeOfPayment;

        // await firstEntry.save();

        const updatedStudent = await Student.findByIdAndUpdate(id, { studentName, studentNumber, fatherName, motherName, parentNumber, college, qualification, aadharCard, feesPay,  amountPay, remainingFees, modeOfPayment,address,courseName, branch }, { new: true });

        console.log("Update successfully");
        res.status(201).send({ data: updatedStudent });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: err, msg: "Something went wrong" });
    }

};

module.exports.deletedStudent = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedStudent = await Student.findById(id);

        if (deletedStudent) {
            const archiveStudent = new ArchiveStudent(deletedStudent.toObject());
            await archiveStudent.save();
        }

        await Student.findByIdAndDelete(id);

        console.log("Deleted successfully");
        res.status(201).send({ data: deletedStudent });
    } catch (err) {
        console.log(err);
        res.send({ error: err, msg: "Something went wrong" });
    }

};

module.exports.getoneStudent = async (req, res) => {
    const studentNumber = req.params.id;

    try {
        const student = await Student.findOne({ studentNumber: studentNumber });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.status(200).json({ success: true, data: student });
    } catch (error) {
        console.error('Error fetching student by Aadhar card:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};