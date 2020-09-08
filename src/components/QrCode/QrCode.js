import React, { Component } from 'react';
import QRCode from 'qrcode';
import './QrCode.css';

class QrCode extends Component {

    constructor(props) {
        super(props);
        this.components = props.components;
        this.idQR = this.props.idQR;
    }

    componentDidMount() {
        QRCode.toCanvas(document.getElementById('canvas'), this.idQR, function (error) {
            if (error) console.error(error);
        });
    }

    render() {
        return (
            <canvas id="canvas"></canvas>
        )
    }
}
export default QrCode;
