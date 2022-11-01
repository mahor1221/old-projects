#include <arduino-timer.h>
auto timer = timer_create_default();

const int total_secconds = 10800; // 3 hours
int secconds = 0;

void reset() {
  digitalWrite(13, 1);
  digitalWrite(2, 1);
  delay(2000);
  digitalWrite(13, 0);
  digitalWrite(2, 0);
}

bool interrupt(void *) {
  secconds++;
  if ( secconds >= total_secconds) {
    secconds = 0;
    reset();
  }
  return true; // keep timer active? true
}

void setup() {
  pinMode(13, OUTPUT);
  pinMode(2, OUTPUT);
  reset();
  timer.every(1000, interrupt);
}

void loop() {
  timer.tick();
}
