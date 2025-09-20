var QRCode = require("qrcode");
const { QR_SIZE } = require("../../constant");
const { loadImage, createCanvas } = require("canvas");

async function createQrSvg(eventId, email, size = 'XL') {
    const { qrSize } = QR_SIZE[size];
    let url = (await QRCode.toDataURL(JSON.stringify({eventId, email}), { width: qrSize }));
    let qrImage = await loadImage(url);
    const canvas = createCanvas(qrSize, qrSize, isSvg && "svg");
    const svgData = canvas.toBuffer().toString(); 
    return svgData;
}

module.exports = {
    createQrSvg
}