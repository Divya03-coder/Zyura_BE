import fs from "fs";
import * as XLSX from "xlsx";

function parseFile(filePath: string) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });
    fs.unlinkSync(filePath);
    return data;
}

export const excelConverter = {
    parseFile
}