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

const uint8_t MAX_DIGITS = 4;
const int DELAY = 2;
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
uint8_t numbers[] = {0, 0};
uint8_t number_i = 0;
uint8_t start = 0; 

ISR(INT0_vect) {
	number_i = 1;
	start = 1;
}

ISR(INT1_vect) {
	number_i = 0;
	start = 1;
}

ISR(TIMER1_OVF_vect) {
	TCNT1H = 0x85EE >> 8;
	TCNT1L = 0x85EE & 0xff;
	if (start) {
		if (numbers[number_i] < MAX_NUMBER) {
			numbers[number_i] += 1;
		} else {
			numbers[number_i] = 0;
		}
	}
}

uint8_t get_init_val(const uint8_t bits[]) {
	uint8_t length = sizeof(bits) / sizeof(bits[0]);
	uint8_t value = 0;
	for (uint8_t i = 0; i < length; i++) {
		value |= (1 << bits[i]);
	}
	return value;
}

int main() {
	// Input/Output Ports initialization
	// SEV_SEG_DDR |= get_init_val(SEV_SEG_DDR_BITS);
	SEV_SEG_DDR = 0b11111111;
	// DIGIT_DDR |= get_init_val(DIGIT_DDR_BITS);
	DIGIT_DDR = 0b11110000;
	PORTD = 0b00001100;
	
	// External Interrupt(s) initialization
	// INT0: On
	// INT0 Mode: Falling Edge
	// INT1: On
	// INT1 Mode: Falling Edge
	// INT2: Off
	GICR|=(1<<INT1) | (1<<INT0) | (0<<INT2);
	MCUCR=(1<<ISC11) | (0<<ISC10) | (1<<ISC01) | (0<<ISC00);
	MCUCSR=(0<<ISC2);
	GIFR=(1<<INTF1) | (1<<INTF0) | (0<<INTF2);

	// Timer/Counter 1 initialization
	// Clock source: System Clock
	// Clock value: 31.250 kHz
	// Mode: Normal top=0xFFFF
	// OC1A output: Disconnected
	// OC1B output: Disconnected
	// Noise Canceler: Off
	// Input Capture on Falling Edge
	// Timer Period: 1 s
	// Timer1 Overflow Interrupt: On
	// Input Capture Interrupt: Off
	// Compare A Match Interrupt: Off
	// Compare B Match Interrupt: Off
	TCCR1A = (0 << COM1A1) | (0 << COM1A0) | (0 << COM1B1) | (0 << COM1B0) | (0 << WGM11) | (0 << WGM10);
	TCCR1B = (0 << ICNC1) | (0 << ICES1) | (0 << WGM13) | (0 << WGM12) | (1 << CS12) | (0 << CS11) | (0 << CS10);
	TCNT1H = 0x85;
	TCNT1L = 0xEE;
	ICR1H = 0x00;
	ICR1L = 0x00;
	OCR1AH = 0x00;
	OCR1AL = 0x00;
	OCR1BH = 0x00;
	OCR1BL = 0x00;
	
	// Timer(s)/Counter(s) Interrupt(s) initialization
	TIMSK = (0 << OCIE2) | (0 << TOIE2) | (0 << TICIE1) | (0 << OCIE1A) | (0 << OCIE1B) | (1 << TOIE1) | (0 << OCIE0) | (1 << TOIE0);
	// Global enable interrupts
	sei();
	
	while (1) {
		DIGIT_PORT = ~(1 << DIGIT_DDR_BITS[0]);
		SEV_SEG_PORT = NUM_TO_7SEG_CA[get_nth_digit(numbers[0], 0)];
		_delay_ms(DELAY);
		DIGIT_PORT = ~(1 << DIGIT_DDR_BITS[1]);
		SEV_SEG_PORT = NUM_TO_7SEG_CA[get_nth_digit(numbers[0], 1)];
		_delay_ms(DELAY);
		DIGIT_PORT = ~(1 << DIGIT_DDR_BITS[2]);
		SEV_SEG_PORT = NUM_TO_7SEG_CA[get_nth_digit(numbers[1], 0)];
		_delay_ms(DELAY);
		DIGIT_PORT = ~(1 << DIGIT_DDR_BITS[3]);
		SEV_SEG_PORT = NUM_TO_7SEG_CA[get_nth_digit(numbers[1], 1)];
		_delay_ms(DELAY);
	}
}