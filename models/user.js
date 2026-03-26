const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'] },
  isActive: { type: String, enum: ['pending', 'approved'], default: 'pending' }
});

userSchema.plugin(mongoosePaginate);

// Pre-save hook to auto-approve admin users
userSchema.pre('save', function(next) {
  if (this.role === 'admin') {
    this.isActive = 'approved';
  }
  next();
});

const User = mongoose.model('user_users', userSchema);
module.exports = User;
