import jsPDF from 'jspdf';

export const generateReport = (data) => {
    const doc = new jsPDF();
    doc.text("AI Healthcare Report", 10, 10);
    doc.text(JSON.stringify(data), 10, 20);
    doc.save("report.pdf");
};
