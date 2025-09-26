import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export function createMockExamPdf(content: string, filename: string, title: string): Promise<string> {
    return new Promise((resolve) => {
        const filePath = path.join(__dirname, filename);
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        doc.fontSize(20).text(title, { align: "center" });
        doc.moveDown();
        doc.fontSize(12).text(`作成日：${new Date().toLocaleDateString()}`, { align: "right" });
        doc.moveDown();
        doc.fontSize(10).text("【注意事項】", { underline: true });
        doc.text("・試験時間：60分\n・配点：100点\n・電卓使用不可\n・問題はすべて日本語で解答すること");
        doc.moveDown();
        doc.fontSize(12).text(content, { align: "left" });

        doc.end();
        stream.on("finish", () => resolve(filePath));
    });
}