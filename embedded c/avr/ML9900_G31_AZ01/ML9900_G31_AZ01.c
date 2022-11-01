/*
 * ML9900_G31_AZ01.c
 * Microchip Studio 7.0.2542
 * Created: 3/13/2021 6:26:07 PM
 * Author : Mahor Foruzesh - Farhan Karimi
 */ 

#define F_CPU 8000000UL // CPU Frequency 8MHz
#include <avr/io.h>
#include <avr/interrupt.h>

#define LED_ARRAY_PORT PORTB
#define LED_ARRAY_DDR DDRB

int8_t number = 0;

// Timer1 overflow interrupt service routine
// Timer1 counts the time
ISR(TIMER1_OVF_vect)
{
	// Reinitialize Timer1 value
	TCNT1H = 0x85EE >> 8;
	TCNT1L = 0x85EE & 0xff;
	
	LED_ARRAY_PORT = number;
	number++;
}

int main(void)
{
	// Input/Output Ports initialization
	LED_ARRAY_DDR = (1 << 7) | (1 << 6) | (1 << 5) | (1 << 4) | (1 << 3) | (1 << 2) | (1 << 1) | (1 << 0);

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
	TIMSK = (0 << OCIE2) | (0 << TOIE2) | (0 << TICIE1) | (0 << OCIE1A) | (0 << OCIE1B) | (1 << TOIE1) | (0 << OCIE0) | (0 << TOIE0);
	// Global enable interrupts
	sei();

	while (1)
	{
	}
}
