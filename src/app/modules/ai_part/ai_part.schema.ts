import { Schema, model } from "mongoose";
import { T_AiPart } from "./ai_part.interface";

const ai_part_schema = new Schema<T_AiPart>({});

export const ai_part_model = model("ai_part", ai_part_schema);
