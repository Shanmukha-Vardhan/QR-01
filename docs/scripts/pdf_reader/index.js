const fs = require('fs');
const { PDFParse } = require('pdf-parse');

const buffer = fs.readFileSync('../Premium QR Generator SRS.pdf');

const parser = new PDFParse({ data: buffer });

parser.getText().then(result => {
    fs.writeFileSync('../SRS.md', result.text);
    console.log("Successfully wrote to ../SRS.md");
    parser.destroy();
}).catch(err => {
    console.error('Error parsing PDF:', err);
});
