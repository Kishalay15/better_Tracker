import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IIncome extends Document {
  userId: Types.ObjectId;
  icon?: string;
  source: string;
  amount: number;
  date?: Date;
}

const IncomeSchema: Schema<IIncome> = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    icon: { type: String },
    source: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Income: Model<IIncome> = mongoose.model<IIncome>("Income", IncomeSchema);
export default Income;
