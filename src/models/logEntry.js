const mongoose = require("mongoose");

const { Schema } = mongoose;

const logEntrySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    comments: String,
    image: String,
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    createdByUser: { type: Schema.Types.ObjectId, ref: "User" },
    location: {
      type: {
        type: String,
        enum: ["Point"], // means type has to be string
        required: true,
      },
      coordinates: {
        type: [Number], // will store long and latt
        required: true,
      },
    },
    visitDate: {
      required: true,
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const LogEntry = mongoose.model("LogEntry", logEntrySchema);

module.exports = LogEntry;
