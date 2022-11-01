#include <avr/io.h>
#include <avr/interrupt.h>
#define F_CPU 8000000UL
#include <util/delay.h>

#define SEV_SEG_PORT PORTB
#define SEV_SEG_DDR DDRB
const uint8_t SEV_SEG_DDR_BITS[] = {0, 1, 2, 3, 4, 5, 6, 7};
#define DIGIT_PORT PORTC
#define DIGIT_DDR DDRC
const uint8_t DIGIT_DDR_BITS[] = {7, 6, 5, 4};
	
const uint8_t MAX_DIGITS = 2;
const uint8_t DELAY = 4; // must be 4
const uint8_t MAX_NUMBER = 99;
const uint8_t NUM_TO_7SEG_CA[10] = {
	0b11000000,
	0b11111001,
	0b10100100,
	0b10110000,
	0b10011001,
	0b10010010,
	0b10000010,
	0b11111000,
	0b10000000,
	0b10010000
};
uint8_t get_nth_digit(int x, int n) {
	static int powersof10[] = {1, 10, 100, 1000};
	return ((x / powersof10[n]) % 10);
}
uint8_t number = 0;

ISR(TIMER0_OVF_vect) {
	TCNT0=0xB2;
	for (uint8_t digit = 0; digit < MAX_DIGITS; digit++) {
		DIGIT_PORT = ~(1 << DIGIT_DDR_BITS[digit]);
		SEV_SEG_PORT = NUM_TO_7SEG_CA[get_nth_digit(number, digit)];
		_delay_ms(DELAY);
	}
}

ISR(TIMER1_OVF_vect) {
	TCNT1H = 0x85EE >> 8;
	TCNT1L = 0x85EE & 0xff;
	
	if (number < MAX_NUMBER) {
		number += 1;
	} else {
		number = 0;
	}
}

int main() {
	// Input/Output Ports initialization
	SEV_SEG_DDR = 0b11111111;
	DIGIT_DDR = 0b11110000;


	
	// Timer(s)/Counter(s) Interrupt(s) initialization
	TIMSK = (0 << OCIE2) | (0 << TOIE2) | (0 << TICIE1) | (0 << OCIE1A) | (0 << OCIE1B) | (1 << TOIE1) | (0 << OCIE0) | (1 << TOIE0);
	// Global enable interrupts
	sei();
	
	while (1) {
		
	}
}