const express = require('express');
const cors = require('cors');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline')

const port = new SerialPort({
    path: 'COM4',
    baudRate: 9600,
    parity: 'none',
    dataBits: 8,
    stopBits: 1
})

const parser = port.pipe(new ReadlineParser({delimiter: '\r\n'}))

class TempData {
    updateInfo(Tamb, T) {
        this.Tamb = Tamb;
        this.T = T;
        this.date = new Date();
    }
}

const tempData = new TempData();

parser.on('data', (data) => {
    const [Tamb, T] = data.split(' ');
    tempData.updateInfo(Tamb, T);
    console.log(tempData)
})

const app = express();

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/tempValue', (req, res) => {
    res.status(200).json(tempData)
})

app.listen(4001);
