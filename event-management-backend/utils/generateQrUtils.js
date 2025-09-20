const { QR_SIZE } = require("../constant");
const { default: puppeteer } = require("puppeteer");
const { createCanvas, loadImage } = require('canvas');
var QRCode = require("qrcode");
const os = require('node:os');
const fs = require("fs");

async function generateHtmlContent(assets) {
  let htmlContent = `<!DOCTYPE html>
    <style> 
    @media print {
        @page {
        margin-top: 10mm;
        }
        .  {
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
  for (let asset in assets) {
    htmlContent += `<h1 class= "title">${asset}<h1/><br>
        <div class = "main">`;
    for (let tag of assets[asset].assetTags) {
      let QrBase64 = await getQrUri({
        tag : tag['uniqueId'],
        type : tag["type"]
      }, 'S', true);
      htmlContent += `<div class="container">
          ${QrBase64}
          </div>`;
    }
    htmlContent += '</div><br>';
  }
  htmlContent += `</body>
    </html>`;
  return htmlContent;
}

async function getQrUri(assetTag, size = 'S', isSvg = false) {
  const { qrSize, textHeight } = QR_SIZE[size];
  let url = (await QRCode.toDataURL(JSON.stringify(assetTag), { width: qrSize }));
  let qrImage = await loadImage(url);
  const canvas = createCanvas(qrSize, qrSize + textHeight, isSvg && "svg");
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(qrImage, 0, 0, qrSize, qrSize);
  ctx.fillStyle = '#000000';
  ctx.font = `${textHeight / 1.75}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText(assetTag.tag, qrSize / 2, qrSize + 4); // Centered Text
  if(isSvg){
    const svgData = canvas.toBuffer().toString(); 
    return svgData;
  }
  return canvas.toDataURL();
}

async function saveHTMLToPDFDirect(htmlString, outputPath) {
  let config = {
    headless : true,
  }
  
  if(os.platform == 'linux'){
    config['executablePath'] = '/usr/bin/chromium-browser'; // Use system Chromium
    config['args'] =  [
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

module.exports = {
  generateHtmlContent,
  getQrUri,
  saveHTMLToPDFDirect
}