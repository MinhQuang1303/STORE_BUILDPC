const mongoose = require("mongoose");

const BenchmarkSchema = new mongoose.Schema(
  {
    idSanPham: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SanPham",
      required: true,
      unique: true,
    },
    // Cho CPU
    cinebenchR23: {
      single: Number,
      multi: Number,
    },
    geekbench6: {
      single: Number,
      multi: Number,
    },
    // Cho GPU
    fps1080p: {
      raytracing: Number,
      dlss: Number,
      normal: Number,
    },
    fps1440p: {
      raytracing: Number,
      dlss: Number,
      normal: Number,
    },
    fps4k: {
      raytracing: Number,
      dlss: Number,
      normal: Number,
    },
    tdp: Number, // Thermal Design Power (watts)
    
    // General
    score3dmark: {
      timespy: Number,
      timespyExtreme: Number,
      firStrike: Number,
    },
    memoryBandwidth: String, // GB/s
    powerConsumption: String, // Watts
    
    ghiChu: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Benchmark", BenchmarkSchema);
