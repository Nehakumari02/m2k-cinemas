const mongoose = require('mongoose');

const { Schema } = mongoose;

const corporateGroupInquirySchema = new Schema(
  {
    companyName: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    employeeCount: { type: Number, required: true, min: 1 },
    department: { type: String, trim: true, default: '' },
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

const CorporateGroupInquiry = mongoose.model('CorporateGroupInquiry', corporateGroupInquirySchema);

module.exports = CorporateGroupInquiry;
