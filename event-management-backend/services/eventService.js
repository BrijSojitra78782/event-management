const { Sequelize, Op } = require("sequelize");
const { EventEntries } = require("../models");
const Logger = require("../utils/logger/logger");
const { sendMail } = require("./mailService");
const { QR_SIZE } = require("../constant");
const { default: puppeteer } = require("puppeteer");
const { createCanvas, loadImage } = require('canvas');
var QRCode = require("qrcode");
const os = require('node:os');

async function generateHtmlContent(entry) {
  let htmlContent = `<!DOCTYPE html>
  <style> 
  @media print {
    @page {
    margin-top: 10mm;
    }
    . {
      page-break-inside: avoid; 
    }
    img.qr {
      max-width: 100%; 
      height: auto;
    }
    .title {
      break-before: always; 
    }
  }
  
  .main {
   display: flex;
   flex-wrap: wrap;
   align-items: center;
   padding-left: 10mm;
   padding-right: 10mm; 
  }
  .container {
    border: 1px solid;
    margin: 4px;
    width: auto;
    max-width: 150px;
    text-align: center;
  }
  .title {
    padding-left: 14px;
  }
  </style>
  <body>`;

  htmlContent += `<h1 class= "title">${entry.email}</h1><br>
  <div class = "main">`;

  let QrBase64 = await getQrUri({
    email: entry.email,
    id: entry.id
  }, 'S', true);

  htmlContent += `<div class="container">
    ${QrBase64}
    </div>`;
  
  htmlContent += '</div><br>';
  htmlContent += `</body>
  </html>`;
  return htmlContent;
}

async function getQrUri(entry, size = 'S', isSvg = false) {
  const { qrSize, textHeight } = QR_SIZE[size];
  let url = (await QRCode.toDataURL(JSON.stringify(`${entry.email}|$${entry.id}`), { width: qrSize }));
  let qrImage = await loadImage(url);
  const canvas = createCanvas(qrSize, qrSize + textHeight, isSvg && "svg");
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(qrImage, 0, 0, qrSize, qrSize);
  ctx.fillStyle = '#000000';
  ctx.font = `${textHeight / 1.75}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText(entry.email, qrSize / 2, qrSize + 4); // Centered Text
  if (isSvg) {
    const svgData = canvas.toBuffer().toString();
    return svgData;
  }
  return canvas.toDataURL();
}

async function saveHTMLToPDFDirect(htmlString, outputPath) {
  let config = {
    headless: true,
  }

  if (os.platform == 'linux') {
    config['executablePath'] = '/usr/bin/chromium-browser'; // Use system Chromium
    config['args'] = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ];
  }

  const browser = await puppeteer.launch(config);
  const page = await browser.newPage();

  // Set HTML content directly
  await page.setContent(htmlString, { waitUntil: 'networkidle0' });

  // Generate PDF
  if (outputPath) {
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true
    });
    await browser.close();
    console.log(`PDF saved at: ${outputPath}`);
  } else {
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true
    });
    await browser.close();
    let base64 = Buffer.from(pdf).toString("base64");
    return base64;
  }
}

async function fetchAllEventEntries() {
  let data = await EventEntries.findAll({
    attributes: ["id", "name", "email", "passcount"],
    raw: true,
  });
  return data;
}

async function fetchUnsentEventEntries() {
  return await EventEntries.findAll({
    where: { email_send: false },
    attributes: ["id", "name", "email", "passcount", "email_send"],
    raw: true,
  });
}

async function generateAllEventEntriesQR(retry=false) {
  const htmlContentDict = {};
  try {
    let eventEntries = await fetchAllEventEntries();
    if(retry){
      eventEntries = await fetchUnsentEventEntries();
    }
    for (let i = 0; i < eventEntries.length; i++) {
      console.log(eventEntries[i].email);
      let htmlContent = await generateHtmlContent({"email": eventEntries[i].email, "id": eventEntries[i].id});
      if (!htmlContentDict[eventEntries[i].email]) {
        htmlContentDict[eventEntries[i].email] = [];
      }
      htmlContentDict[eventEntries[i].email].push(htmlContent);
    }
    console.log(htmlContentDict);
    const path = require('path');
    for (const email in htmlContentDict) {
      let combinedHtmlContent = htmlContentDict[email].join('<div style="page-break-after: always;"></div>');
      const uploadsDir = path.join(__dirname, '../uploads');
      const filename = `${email}_${Date.now()}.pdf`;
      const outputPath = path.join(uploadsDir, filename);
      await saveHTMLToPDFDirect(combinedHtmlContent, outputPath);
      // let pdfRaw = await saveHTMLToPDFDirect(combinedHtmlContent);
      // let attachments = [{
      //   filename: `${email}_${Date.now()}.pdf`,
      //   content: pdfRaw,
      //   encoding: 'base64'
      // }];
      // result = await sendMail(email,
      //   'Attached: QR Codes for Event Entries',
      //   'Attached is the initial PDF containing QR codes for all the event entries.',
      //   attachments
      // );
      // if(result && result.message && result.message.includes("Successful")){
      //   Logger.info(`Email containing QR Codes for Event Entries has been successfully sent to ${email}`);
      //   // Mark entry as email_send=true
      //   await EventEntries.update(
      //     { email_send: true },
      //     { where: { email } }
      //   );
      // }
      // else{
      //   Logger.error(`Email sending failed to ${email}`);
      // }
    }
    return "All email sends successfully";
  } catch (error) {
    Logger.error("Error while generating qr for all assets " + error.message, error);
    return "Email sends failed";
  }
}

module.exports = {
  generateAllEventEntriesQR,
};