import React, { Component } from 'react';
import QRCode from 'qrcode';
import './QR_code.css';
class Qr_code extends Component {
    constructor(props) {
        super(props);
        this.components = props.components;

        this.generateQR = this.generateQR.bind(this);
    }
    generateQR() {
        console.log('QR component');
        let str = 'My first QR!';
        QRCode.toCanvas(document.getElementById('canvas'), str, function (error) {
            if (error) console.error(error)
            //console.log('success!')
        });
        /* console.log('Entered the function');
        QRCode.toString('I am a pony!',{type:'terminal'}, function (err, url) {
            console.log(url)
        }) */


        /*<div align="center">
                <canvas id="canvas" />
                <button onClick={this.generateQr}>
                    Generate QR!
            </button>
            </div>
            
            <div>
            { this.generateQR() }
            </div>
            */
    }
    render() {
       
        return (
            <div align="center">
                <canvas id="canvas"></canvas>
                <button onClick={this.generateQR}>
                    Generate QR!
            </button>
            </div>
        )
    }
}
export default Qr_code;

// import React, { Component } from 'react';
// import './QR_code.css';

// class QR_code extends Component{

//     constructor(props) {
//         super(props);

//         this.components = props.components;
//     }

//     render() {
//         return(
//             <div>
//                 <ul>Component 1</ul>
//                 <ul>Component 2</ul>
//                 <ul>Component 3</ul>
//                 <ul>Component 4</ul>
//             </div>
//         );
//     }
// }
// export default QR_code;