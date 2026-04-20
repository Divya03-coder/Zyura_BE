import { Schema, model } from "mongoose";
import { T_Traking } from "./tracking.interface";

const traking_schema = new Schema<T_Traking>({});

export const traking_model = model("traking", traking_schema);
