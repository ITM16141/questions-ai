import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export function createPdf(content: string, filename: string): Promise<string> {
    return new Promise((resolve) => {
        const filePath = path.join(__dirname, filename);
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);
        doc.font("Helvetica").fontSize(12).text(content, { align: "left" });
        doc.end();
        stream.on("finish", () => resolve(filePath));
    });
}