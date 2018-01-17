//from js-demo
load('api_config.js');
load('api_gpio.js');
load('api_net.js');
load('api_sys.js');
load('api_timer.js');

let led = 2;//Cfg.get('pins.led');
let tz=6;//Cfg.get('clock.timezone');
tz=tz*60*60;//hr *m *s

let setBr = ffi('void setBrightness(int, bool)');
let showNum = ffi ('void showNumberDec(int, bool, int, int)');
let showNumEx = ffi ('void showNumberDecEx(int, int, bool, int, int)');
let setSeg = ffi ('void setSegments(void* , int, int)');
 
let getInfo = function() {
  return JSON.stringify({
    total_ram: Sys.total_ram(),
    free_ram: Sys.free_ram()
  });
};

setBr(2,true);
let colon=0;
// Blink built-in LED every second
GPIO.set_mode(led, GPIO.MODE_OUTPUT);
Timer.set(1000 /* 1 sec */, true /* repeat */, function() {
  let value = GPIO.toggle(led);
  showNumEx(timeHM(), colon^=0xFF ,true , 4, 0);
  //print(timeMS());
  //print(value ? 'Tick' : 'Tock', 'uptime:', Sys.uptime(), getInfo());
}, null);

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

