# mjs-clock-tm1637
Advanced clock on esp8266+tm1637+MongooseOS+MJS

- use wemos v2 mini or compatible, and tm1637 led with a colon
- build and flash firmware (mos build --platform esp8266, mos flash)
- initially clock not configured, blue led flashing fast
- connect to wifi Clock_XXXXXX using password 12345678
- go to http://192.168.4.1
- enter your home network name (ssid)  and password
- enter your timezone and desired brightness for led
- press "Save... "
- clock goes to reboot 
- while not connecting to wifi, blue led blink slowly, wrong time displayed 
- when connected to internet, blue led turns off, correct time displayed
- in case of connection failure, time still counted, but blue led will blink slowly 
- when connection restored, blue led turns off
- you can reset controller to initial settings, by connecting pins D7 and D8. blue led turns on and clock goes to reboot
