const mongoose = require('mongoose')

const DeviceSchema = new mongoose.Schema({
  device: Object,
  time: { type: Date, default: new Date() },
  trusted: { type: Boolean, default: false },
  count: { default: 1, type: Number },
  user: { type: mongoose.Schema.Types.ObjectId, required: true }
})

module.exports = mongoose.model('Device', DeviceSchema)
