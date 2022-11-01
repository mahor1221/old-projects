/*
 * ML9900_G31_AZ03.c
 * Microchip Studio 7.0.2542
 * Created: 3/11/2021 8:01:35 PM
 * Author : Mahor Foruzesh - Farhan Karimi
 */

#define F_CPU 8000000UL // CPU Frequency 8MHz
#include <avr/io.h>
#include <avr/interrupt.h>

#define SEV_SEG_PORT PORTB
#define SEV_SEG_DDR DDRB
#define DIGIT_PORT PORTC
#define DIGIT_DDR DDRC
#define MAX_DIGITS 2
const int8_t DIGIT_BIT[4] = {4, 5, 6, 7};
const int8_t BCD_TO_7SEG[10] = {
	0b11000000,
	0b11111001,
	0b10100100,
	0b10110000,
	0b10011001,
	0b10010010,
	0b10000010,
	0b11111000,
	0b10000000,
	0b10010000};

int8_t bcd_number[MAX_DIGITS] = {0};
int8_t digit_selector = 0;

void count(int8_t bcd_number[MAX_DIGITS])
{
	bcd_number[0]++;
	for (int8_t i = 0; i < MAX_DIGITS; i++)
	{
		if (bcd_number[i] > 9)
		{
			bcd_number[i] = 0;
			if (i + 1 < MAX_DIGITS)
				bcd_number[i + 1]++;
		}
	}
}


// Timer0 overflow interrupt service routine
// Timer0 displays number on seven segment
ISR(TIMER0_OVF_vect)
{
	// Reinitialize Timer 0 value
	TCNT0 = 0xB2;

	DIGIT_PORT = (1 << DIGIT_BIT[digit_selector]);
	SEV_SEG_PORT = BCD_TO_7SEG[bcd_number[digit_selector]];
	digit_selector++;
	if (digit_selector >= MAX_DIGITS)
		digit_selector = 0;
}

// Timer1 overflow interrupt service routine
// Timer1 counts the time
ISR(TIMER1_OVF_vect)
{
	// Reinitialize Timer1 value
	TCNT1H = 0x85EE >> 8;
	TCNT1L = 0x85EE & 0xff;

	count(bcd_number);

	// LED
	PORTD ^= (1 << 7);
}

int main(void)
{
	// Input/Output Ports initialization
	SEV_SEG_DDR = (1 << 7) | (1 << 6) | (1 << 5) | (1 << 4) | (1 << 3) | (1 << 2) | (1 << 1) | (1 << 0);
	DIGIT_DDR = (1 << 7) | (1 << 6) | (1 << 5) | (1 << 4) | (0 << 3) | (0 << 2) | (0 << 1) | (0 << 0);

	// LED
	DDRD = (1 << 7);

	// Timer/Counter 0 initialization
	// Clock source: System Clock
	// Clock value: 7.813 kHz
	// Mode: Normal top=0xFF
	// OC0 output: Disconnected
	// Timer Period: 9.984 ms
	TCCR0 = (0 << WGM00) | (0 << COM01) | (0 << COM00) | (0 << WGM01) | (1 << CS02) | (0 << CS01) | (1 << CS00);
	TCNT0 = 0xB2;
	OCR0 = 0x00;

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

	while (1)
	{
	}
}
