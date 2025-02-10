import mongoose from "mongoose";

const calculationSchema = mongoose.Schema(
  {
    expression: { type: String, required: true },
    result: { type: Number, required: true },
  },
  { timestamps: true }
);

const Calculation = mongoose.model("Calculation", calculationSchema);
export default Calculation;
