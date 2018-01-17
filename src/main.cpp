#include "mgos.h"
#include "TM1637Display.h"

TM1637Display* tm1637; //don't init here

extern "C" {
	
  void showNumberDec(int num, bool leading_zero, uint8_t length, uint8_t pos) {
    tm1637->showNumberDec(num, leading_zero, length, pos);
  }
  
  void showNumberDecEx(int num, uint8_t dots, bool leading_zero, uint8_t length, uint8_t pos) {
    tm1637->showNumberDecEx(num, dots, leading_zero, length, pos);
  }

  void setBrightness(uint8_t b, bool on) {
    tm1637->setBrightness(b, on);
  }
  
  void setSegments(const uint8_t segments[], uint8_t length, uint8_t pos) {
	tm1637->setSegments(segments, length, pos);
  }

}

enum mgos_app_init_result mgos_app_init(void) {
    //init here, else - coredump
    tm1637 = new TM1637Display(14,12); //clk,data

  return MGOS_APP_INIT_SUCCESS;
}
