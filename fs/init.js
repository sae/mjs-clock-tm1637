//from js-demo
load('api_config.js');
load('api_gpio.js');
load('api_net.js');
load('api_sys.js');
load('api_timer.js');
load('api_mqtt.js'); //for internet testing )

//tm1637 functions, defined in main.c
let setBr = ffi('void setBrightness(int, bool)');
let showNum = ffi ('void showNumberDec(int, bool, int, int)');
let showNumEx = ffi ('void showNumberDecEx(int, int, bool, int, int)');
let setSeg = ffi ('void setSegments(void* , int, int)');


let led = 2;//Cfg.get('pins.led'); //LED pin
GPIO.set_mode(led, GPIO.MODE_OUTPUT);
let br=Cfg.get('clock.brightness');  //display brightness
let tz=Cfg.get('clock.timezone');//Timezone
tz=tz*60*60;//hr *m *s
let colon=0;//colon flag for colon blink
let wifi_sta=false;// true only if sta configured
let wifi_connected=false;// true only if ip obtained
let internet_ok=false;

//reset configuration, if short between pin D7 (13) and D8 (15)
GPIO.set_mode(13, GPIO.MODE_OUTPUT);//13->0
GPIO.write(13,0); 
GPIO.set_button_handler(15, GPIO.PULL_UP, GPIO.INT_EDGE_NEG, 200, function() {
    GPIO.write(led,0); //turns led on
    Cfg.set({wifi: {ap: {enable: true}}}); 
    Cfg.set({wifi: {sta: {enable: false}}}); 
    Cfg.set({wifi: {sta: {password: ""}}}); 
    Sys.reboot(100);
}, null);

setBr(br,true);//set brightness to 2 and turns led on (will effect after writing)


//fast blink - is wifi client is not configured 
if (!Cfg.get('wifi.sta.enable')) {
  Timer.set(150 /* 0.3 sec */, true /* repeat */, function() {
    GPIO.toggle(led);
  }, null);
} else {  
  wifi_sta=true;
}
  
//main cycle - show info and blink colon
//slow blink if wifi problem
Timer.set(1000 /* 1 sec */, true /* repeat */, function() {
  if (wifi_sta)
    if(!internet_ok) 
      GPIO.toggle(led); 
  Display();
  }, null);

function Display() {
  if (!wifi_sta) {
    //TODO: displsy "AP" ?
    showNumEx(0, 0 ,true , 4, 0);
    return;
  }
  showNumEx(timeHM(), colon^=0xFF ,true , 4, 0);
}

//returns digits for display, "09:01" will be 901 etc
function timeHM() {
  let t=0;
  let ts=Timer.fmt("-%H%M", Timer.now()+tz);
  for (let i=0;i<4;i++) {
    t=t*10+ts.at(i+1)-0x30;
  }
  return t;
}

function timeMS() {
  let t=0;
  let ts=Timer.fmt("-%M%S", Timer.now()+tz); //without a char format doesn't work
  for (let i=0;i<4;i++) {
    t=t*10+ts.at(i+1)-0x30;
  }
  return t;
}

MQTT.setEventHandler(function(conn, ev, edata) {
  if (ev !== 0) {
    internet_ok=false;
    print('*MQTT ev: ', ev);
  }
  if (ev === MQTT.EV_CONNACK) {
    internet_ok=true;
    GPIO.write(led,1); //turns led off
  }}, null);


// Monitor network connectivity.
Event.addGroupHandler(Net.EVENT_GRP, function(ev, evdata, arg) {
  if (ev!==0) wifi_connected=false;
  if (ev === Net.STATUS_GOT_IP) {
    wifi_connected=true;
  }
}, null);


