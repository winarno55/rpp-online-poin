const Blob = require('buffer').Blob;
const metadata = { name: "test", mimeType: "application/vnd.google-apps.document" };
const styledHtml = "<html></html>";
const boundary = 'rpp_generator_google_docs_boundary';

const body = new Blob([
  `--${boundary}\r\n`,
  'Content-Type: application/json; charset=UTF-8\r\n\r\n',
  JSON.stringify(metadata),
  `\r\n--${boundary}\r\n`,
  'Content-Type: text/html; charset=UTF-8\r\n\r\n',
  styledHtml,
  `\r\n--${boundary}--\r\n`
], { type: `multipart/related; boundary=${boundary}` });

console.log(body.type);
console.log(body.size);
body.arrayBuffer().then(buf => console.log(Buffer.from(buf).toString()));
