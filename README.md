# SerLCD

Simple wrappers for communicating to the [SerLCD](https://www.sparkfun.com/products/9395).

Implemented using the [Datasheet](http://www.sparkfun.com/datasheets/LCD/SerLCD_V2_5.PDF)

This has been only tested using LCD-09395 but it should work in theory with other USB-to-UART enabled LCDs that use the same HD44780 command set.

In order to facilitate easier communication to the LCD and to ensure it receives all the write commands, calling `write` writes your string or buffer to a write queue that is polled on (and flushed to the serial port) once every 50 milliseconds.

## Usage

    var lcd = require('serlcd')("/dev/ttyUSB0");

    lcd.clearScreen();
    lcd.write("Hooray!");

## API Reference

* `write`:  Write to the screen.  You can use a string, or a Buffer. For example:
    ```
    lcd.write('Hooray');
    lcd.write(new Buffer([0xFE, 0x01]));
    ```

* `clearScreen`: Clears the screen.

* `clearAndWrite`: Clears the screen (resetting the cursor position to 0), then writes a string/buffer.

* 

## TODO/Not implemented

* Move cursor left
* Move cursor right
* Scroll left
* Scroll right
* Turn visual display on
* Turn visual display off
* Underline cursor on
* Underline cursor off
* Blinking box cursor on
* Blinking box cursor off
* Set arbitrary cursor position