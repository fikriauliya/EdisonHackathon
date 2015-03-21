/*jslint node:true,vars:true,bitwise:true,unparam:true */

/*jshint unused:true */

/*
The Local Temperature Node.js sample application distributed within Intel® XDK IoT Edition under the IoT with Node.js Projects project creation option showcases how to read analog data from a Grover Starter Kit Plus – IoT Intel® Edition Temperature Sensor, start a web server and communicate wirelessly using WebSockets.

MRAA - Low Level Skeleton Library for Communication on GNU/Linux platforms
Library in C/C++ to interface with Galileo & other Intel platforms, in a structured and sane API with port nanmes/numbering that match boards & with bindings to javascript & python.

Steps for installing MRAA & UPM Library on Intel IoT Platform with IoTDevKit Linux* image
Using a ssh client: 
1. echo "src maa-upm http://iotdk.intel.com/repos/1.1/intelgalactic" > /etc/opkg/intel-iotdk.conf
2. opkg update
3. opkg upgrade

Article: https://software.intel.com/en-us/html5/articles/iot-local-temperature-nodejs-and-html5-samples
*/

var B = 3975;
var mraa = require("mraa");
var moment = require("moment");

//GROVE Kit A0 Connector --> Aio(0) --> temperature
var temperaturePin = new mraa.Aio(0);
//GROVE KIT A1 Connector --> Aio(1) --> sound
var soundPin = new mraa.Aio(1);
//GROVE KIT A2 Connector --> Aio(2) --> light
var lightPin = new mraa.Aio(2);

var button = new mraa.Gpio(3);
var buttonState = 0;
var clearString = "                "; // Will be called when we want to clear a line on the LCD

var Screen = require('jsupm_i2clcd'); // A new object of class "jsupm_i2clcd" (lcd class)
var Lcd = new Screen.Jhd1313m1 (0, 0x3E, 0x62); //Initialize Jhd1313m1 at 0x62 (RGB_ADDRESS) and 0x3E (LCD_ADDRESS)

// These are the 2 methods of Lcd.  setCursor(row,column) and write(string)
Lcd.setCursor(0,0);
Lcd.write("Temperature:");

/*
Function: startSensorWatch(socket)
Parameters: socket - client communication channel
Description: Read Temperature Sensor and send temperature in degrees of Fahrenheit every 4 seconds
*/

function tempDisplay()
{
  // If the button is not being pressed, display the temperature...
  if(buttonState == 0)
  {
    var celsius_temperature = getTemp();  // ask for the temperature
    Lcd.setCursor(1,0);
    Lcd.write(clearString);  // clear the "HOLD" string, in case it was there
    Lcd.setCursor(1,0);
    Lcd.write("C: " + parseInt(celsius_temperature*100,10)/100);  // This shows the temperature to 2 decimal places
  }
  setTimeout(tempDisplay,1000);  // ... every second
}

function getTemp()
{
  var a = temperaturePin.read();

  var resistance = (1023 - a) * 10000 / a; // get the resistance of the sensor;
  var celsius_temperature = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15; // convert to temperature, based on Grove's datasheet
  var fahrenheit_temperature = (celsius_temperature * (9 / 5)) + 32; // convert to fahrenheit
  
  return celsius_temperature; // return the temperature
}

function checkButton()
{
  buttonState = button.read();
  
  // Let the user know the temperature display is being HELD
  if(buttonState == 1)
  {
    Lcd.setCursor(1,10);
    Lcd.write("HOLD");
  }
  
  setTimeout(checkButton,10); // call this function every 10 milliseconds
}

function startSensorWatch() {
    'use strict';
    //Temperature
    setInterval(function () {
        var a = temperaturePin.read();
        console.log("Analog Pin (A0) Output: " + a);
        //console.log("Checking....");
        
        var resistance = (1023 - a) * 10000 / a; //get the resistance of the sensor;
        //console.log("Resistance: "+resistance);
        var celsius_temperature = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15;//convert to temperature via datasheet ;
        //console.log("Celsius Temperature "+celsius_temperature); 
        var fahrenheit_temperature = (celsius_temperature * (9 / 5)) + 32;
        console.log("Celcius Temperature: " + celsius_temperature);
        
        var curDate = moment().format("YYYY-MM-DD");
        var curTime = moment().format("HH:mm:ss");
        myRootRef.child(0).child("temperature").child(curDate).child(curTime).set(celsius_temperature);
    }, 4000);
    
    
    //Sound
    var totalSound = 0;
    var count = 0;
    setInterval(function () {
        var a = soundPin.read();
        //console.log("Checking....");
        
        if (count == 4) {
            var sound = totalSound/4;
            console.log("Average sound last 4 seconds: " + sound);
            var curDate = moment().format("YYYY-MM-DD");
            var curTime = moment().format("HH:mm:ss");
            myRootRef.child(0).child("noise").child(curDate).child(curTime).set(sound);
            count = 0;
            totalSound = 0;
        }
        totalSound += a;
        //myRootRef.child("test").set({"temperature": celsius_temperature});
        count++;
    }, 1000);
    
    //Light
    setInterval(function () {
        var a = lightPin.read();
        var sensor_resistance = (1023-a)*10/a;
        //console.log("Checking....");
        
        console.log("Light sensor : " + a);
        console.log("sensor resistance : " + sensor_resistance);
        var curDate = moment().format("YYYY-MM-DD");
        var curTime = moment().format("HH:mm:ss");
        myRootRef.child(0).child("light").child(curDate).child(curTime).set(a);
    }, 4000);
    
}

console.log("Server created");

var Firebase = require('firebase');
var myRootRef = new Firebase('https://edison-hackathon.firebaseio.com/');
myRootRef.child("test").set({"k": "hello world!"});

console.log("Firebase created");
//Start watching Sensors connected to Galileo board

startSensorWatch();
checkButton();
tempDisplay();