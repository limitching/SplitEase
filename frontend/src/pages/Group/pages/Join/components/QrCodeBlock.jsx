import React from "react";
import { QRCodeCanvas } from "qrcode.react";

function QrCodeBlock({ url }) {
    return (
        <div>
            <QRCodeCanvas
                value={url}
                size={200}
                level="Q"
                bgColor="#ffffff"
                fgColor="#000000"
                imageSettings={{
                    src: "/assets/images/favicon-32x32.png",
                    excavate: true,
                    height: 40,
                    width: 40,
                }}
            />
        </div>
    );
}

export default QrCodeBlock;
