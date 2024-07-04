var html_to_pdf = require('html-pdf-node');

let options = { format: 'A4' };
// Example of options with args //
// let options = { format: 'A4', args: ['--no-sandbox', '--disable-setuid-sandbox'] };

let file = { content: "<h1>Welcome to html-pdf-node</h1>" };
// or //
let file = { url: "https://example.com" };
html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
  console.log("PDF Buffer:-", pdfBuffer);
});