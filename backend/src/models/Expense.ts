import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IExpense extends Document {
  userId: Types.ObjectId;
  icon?: string;
  category: string;
  amount: number;
  date?: Date;
}

const ExpenseSchema: Schema<IExpense> = new mongoose.Schema(
  {
    userId: {
    type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    icon: { type: String },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Expense: Model<IExpense> = mongoose.model<IExpense>(
  "Expense",
  ExpenseSchema
);
export default Expense;
