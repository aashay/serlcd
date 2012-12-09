/*
* Communicate to SerLCD via serialport.
* Datasheet - Hex codes etc from http://www.sparkfun.com/datasheets/LCD/SerLCD_V2_5.PDF
*/

var SerialPort = require("serialport").SerialPort;

function SerLCD(serialport, flushInterval){
    this.serialPort = new SerialPort(serialport || "/dev/ttyUSB0");
    this.writeQueue = []; //A pipeline for commands so we don't overwhelm the thing
    this.flushInterval = parseInt(flushInterval) || 10;
    
    this._maybeWrite();
}

//Write a string or a buffer to the writeQueue
SerLCD.prototype.write = function(msg){
    this.writeQueue.push(msg);
}

//Sets up a poller on the writeQueue
SerLCD.prototype._maybeWrite = function(){
    setInterval(function(){
        if(this.writeQueue.length > 0){
            var toWrite = this.writeQueue.shift();
            this.serialPort.write(toWrite);
        }
    }.bind(this), this.flushInterval);    
}

//Flush the screen.
SerLCD.prototype.clearScreen = function(){
    var b = new Buffer([0xFE, 0x01]);
    this.write(b);
}

//Flush the screen and write something.
SerLCD.prototype.clearAndWrite = function(msg){
    this.clearScreen();
    this.write(msg);
}

//Write a line to the top of the display (without clearing the bottom).
//Truncate it to N characters, 16 by default.
SerLCD.prototype.writeTopLine = function(line, truncateTo){    
    line = line.substring(0, (truncateTo || 16));  //Truncate    
    this.write(new Buffer([0xFE, 0x80])); //0x80 sets cursor to first position of first line
    this.write(line);
}

//Write a line to the bottom of the display (without clearing the top).
//Truncate it to N characters, 16 by default.
SerLCD.prototype.writeBottomLine = function(line){
    line = line.substring(0,16);  //Truncate
    this.write(new Buffer([0xFE, 0xC0])); //0xC0 sets cursor to first position of second line
    this.write(line);
}

//Turn off the backlight.
SerLCD.prototype.backlightOff = function(){
     var b = new Buffer([0x7C, 0x80]);
     this.write(b);
}

//Set backlight to 40%
SerLCD.prototype.backlight40 = function(){
    var b = new Buffer([0x7C, 0x8C]); //0x8C is 140
    this.write(b);
}

//Set backlight to 73%
SerLCD.prototype.backlight73 = function(){
    var b = new Buffer([0x7C, 0x96]); //0x96 is 150
    this.write(b);
}

//Set backlight to 100%
SerLCD.prototype.backlight100 = function(){
    var b = new Buffer([0x7C, 0x9D]); //0x9D is 157
    this.write(b);
}

module.exports = SerLCD;
