#include <avr/io.h>
#include <avr/interrupt.h>

//-----------------------------------------------------------------------------
// Seven Segment x4
#define SS_PORT			PORTB
#define SS_DDR			DDRB
#define SS_TOTAL_DIGS   4
#define SS_DIG0_PORT	PORTC
#define SS_DIG0_DDR		DDRC
#define SS_DIG0			4
#define SS_DIG1_PORT	PORTC
#define SS_DIG1_DDR		DDRC
#define SS_DIG1			5
#define SS_DIG2_PORT	PORTC
#define SS_DIG2_DDR		DDRC
#define SS_DIG2			6
#define SS_DIG3_PORT	PORTC
#define SS_DIG3_DDR		DDRC
#define SS_DIG3			7

void ss_init() {
	SS_DDR = 0b11111111;
	SS_DIG0_DDR |= (1 << SS_DIG0);
	SS_DIG1_DDR |= (1 << SS_DIG1);
	SS_DIG2_DDR |= (1 << SS_DIG2);
	SS_DIG3_DDR |= (1 << SS_DIG3);
}
void ss_set(uint8_t digit, uint8_t byte) {
	switch (digit) {
		case 0: 
		SS_DIG1_PORT |= (1 << SS_DIG1);
		SS_DIG2_PORT |= (1 << SS_DIG2);
		SS_DIG3_PORT |= (1 << SS_DIG3);
		SS_DIG0_PORT &= ~(1 << SS_DIG0);
		SS_PORT = byte;
		break;
		case 1: 
		SS_DIG0_PORT |= (1 << SS_DIG0);
		SS_DIG2_PORT |= (1 << SS_DIG2);
		SS_DIG3_PORT |= (1 << SS_DIG3);
		SS_DIG1_PORT &= ~(1 << SS_DIG1);
		SS_PORT = byte;
		break;
		case 2: 
		SS_DIG0_PORT |= (1 << SS_DIG0);
		SS_DIG1_PORT |= (1 << SS_DIG1);
		SS_DIG3_PORT |= (1 << SS_DIG3);
		SS_DIG2_PORT &= ~(1 << SS_DIG2);
		SS_PORT = byte;
		break;
		case 3: 
		SS_DIG0_PORT |= (1 << SS_DIG0);
		SS_DIG1_PORT |= (1 << SS_DIG1);
		SS_DIG2_PORT |= (1 << SS_DIG2);
		SS_DIG3_PORT &= ~(1 << SS_DIG3);
		SS_PORT = byte;
		break;
	}
	
}

const uint8_t SS_CA[10] = {
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
struct SevenSegment {
	uint8_t number[SS_TOTAL_DIGS];
	uint8_t active_digit;
} ss = {
	.number = {0, 0, 0, 0},
	.active_digit = 0,
};


//-----------------------------------------------------------------------------
// Keypad 4x4
#define KP_PORT		PORTA
#define KP_DDR		DDRA
#define KP_PIN		PINA
typedef enum KP_Key {
	N0, N1, N2, N3, N4, N5, N6, N7, N8, N9,
	UP, DOWN, MODE, MENU, SET, ENTER, NULL,
} KP_Key;
const uint8_t KP_LAYOUT[16] = {
	  N1, N2, N3,  UP,
	  N4, N5, N6,  DOWN,
	  N7, N8, N9,  MODE,
	MENU, N0, SET, ENTER,
};
KP_Key kp_read() {
	uint8_t key = 0;
	KP_DDR  = 0b11110000;
	KP_PORT = 0b00001111;
	asm("NOP");
	switch (KP_PIN) {
		case 0b00001110: key = 0b0000; break;
		case 0b00001101: key = 0b0001; break;
		case 0b00001011: key = 0b0010; break;
		case 0b00000111: key = 0b0011; break;
		default: return NULL;
	}
	KP_DDR  = 0b00001111;
	KP_PORT = 0b11110000;
	asm("NOP");
	switch (KP_PIN) {
		case 0b11100000: key |= 0b0000; break;
		case 0b11010000: key |= 0b0100; break;
		case 0b10110000: key |= 0b1000; break;
		case 0b01110000: key |= 0b1100; break;
		default: return NULL;
	}
	return KP_LAYOUT[key];
}

//-----------------------------------------------------------------------------
// Timer
ISR(TIMER0_OVF_vect) {
	TCNT0=0x83;
	ss.active_digit += 1;
	if(ss.active_digit == SS_TOTAL_DIGS) {
		ss.active_digit = 0;
	}
	ss_set(ss.active_digit, SS_CA[ss.number[ss.active_digit]]);
}

ISR(TIMER1_OVF_vect) {
	TCNT1H=0xC180 >> 8;
	TCNT1L=0xC180 & 0xff;
	KP_Key key = kp_read();
	if ( key < 10 ) {
		ss.number[SS_TOTAL_DIGS - 1] = key;
	}
}

//-----------------------------------------------------------------------------
// Initialize
int main() {
	ss_init();
	
	// Timer/Counter 0 initialization
	// Clock source: System Clock
	// Clock value: 31.250 kHz
	// Mode: Normal top=0xFF
	// OC0 output: Disconnected
	// Timer Period: 4 ms
	TCCR0=(0<<WGM00) | (0<<COM01) | (0<<COM00) | (0<<WGM01) | (1<<CS02) | (0<<CS01) | (0<<CS00);
	TCNT0=0x83;
	OCR0=0x00;

	// Timer/Counter 1 initialization
	// Clock source: System Clock
	// Clock value: 125.000 kHz
	// Mode: Normal top=0xFFFF
	// OC1A output: Disconnected
	// OC1B output: Disconnected
	// Noise Canceler: Off
	// Input Capture on Falling Edge
	// Timer Period: 0.128 s
	// Timer1 Overflow Interrupt: On
	// Input Capture Interrupt: Off
	// Compare A Match Interrupt: Off
	// Compare B Match Interrupt: Off
	TCCR1A=(0<<COM1A1) | (0<<COM1A0) | (0<<COM1B1) | (0<<COM1B0) | (0<<WGM11) | (0<<WGM10);
	TCCR1B=(0<<ICNC1) | (0<<ICES1) | (0<<WGM13) | (0<<WGM12) | (0<<CS12) | (1<<CS11) | (1<<CS10);
	TCNT1H=0xC1;
	TCNT1L=0x80;
	ICR1H=0x00;
	ICR1L=0x00;
	OCR1AH=0x00;
	OCR1AL=0x00;
	OCR1BH=0x00;
	OCR1BL=0x00;

	// Timer(s)/Counter(s) Interrupt(s) initialization
	TIMSK = (0 << OCIE2) | (0 << TOIE2) | (0 << TICIE1) | (0 << OCIE1A) | (0 << OCIE1B) | (1 << TOIE1) | (0 << OCIE0) | (1 << TOIE0);
	// Global enable interrupts
	sei();
	
	while(1) {}
}