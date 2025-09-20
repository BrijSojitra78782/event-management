
const { getAllAssets } = require("../services/assetService");
const { generateHtmlContent, saveHTMLToPDFDirect } = require("../utils/generateQrUtils");

async function generateAllQr() {
    let assets = await getAllAssets();
    let htmlContent = await generateHtmlContent(assets);
    saveHTMLToPDFDirect(htmlContent, './qrCode.pdf');
    return htmlContent;
}



generateAllQr().then((result) => {
    // fs.writeFileSync("./index.html", result);
});
