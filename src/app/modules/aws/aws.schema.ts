import { Schema, model } from "mongoose";
import { T_Aws } from "./aws.interface";

const aws_schema = new Schema<T_Aws>({});

export const aws_model = model("aws", aws_schema);
