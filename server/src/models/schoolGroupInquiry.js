const mongoose = require('mongoose');

const { Schema } = mongoose;

const schoolGroupInquirySchema = new Schema(
  {
    schoolName: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    studentCount: { type: Number, required: true, min: 1 },
    gradeOrClass: { type: String, trim: true, default: '' },
    preferredDate: { type: Date },
    preferredMovie: { type: String, trim: true, default: '' },
    preferredCinema: { type: String, trim: true, default: '' },
    offerCode: { type: String, trim: true, uppercase: true, default: '' },
    message: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'confirmed', 'closed'],
      default: 'new',
    },
  },
  { timestamps: true }
);

const SchoolGroupInquiry = mongoose.model('SchoolGroupInquiry', schoolGroupInquirySchema);

module.exports = SchoolGroupInquiry;
