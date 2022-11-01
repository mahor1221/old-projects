#include <mega32.h>
#include <alcd.h>
#include <stdio.h>

typedef struct Time {
	char seccond;
	char minute;
	int hour;
	
} Time;
char str[16];
Time time = {
	.seccond = 0,
	.minute = 0,
	.hour = 0,
};

interrupt [TIM1_OVF] void timer1_ovf_isr(void)
{
	TCNT1H=0x85EE >> 8;
	TCNT1L=0x85EE & 0xff;
	
	time.seccond += 1;
	if(time.seccond == 60) {
		time.seccond = 0;
		time.minute += 1;
	}
	if(time.minute == 60) {
		time.minute = 0;
		time.hour += 1;
	}
	if(time.hour == 24) {
		time.hour = 0;
	}       
    
    sprintf(str, "    %02d:%02d:%02d", time.hour, time.minute, time.seccond);
	lcd_clear();
    lcd_puts(str);
}

void main(void)
{
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
	TCCR1A=(0<<COM1A1) | (0<<COM1A0) | (0<<COM1B1) | (0<<COM1B0) | (0<<WGM11) | (0<<WGM10);
	TCCR1B=(0<<ICNC1) | (0<<ICES1) | (0<<WGM13) | (0<<WGM12) | (1<<CS12) | (0<<CS11) | (0<<CS10);
	TCNT1H=0x85;
	TCNT1L=0xEE;
	ICR1H=0x00;
	ICR1L=0x00;
	OCR1AH=0x00;
	OCR1AL=0x00;
	OCR1BH=0x00;
	OCR1BL=0x00;

	// Timer(s)/Counter(s) Interrupt(s) initialization
	TIMSK=(0<<OCIE2) | (0<<TOIE2) | (0<<TICIE1) | (0<<OCIE1A) | (0<<OCIE1B) | (1<<TOIE1) | (0<<OCIE0) | (0<<TOIE0);

	// Alphanumeric LCD initialization
	// Connections are specified in the
	// Project|Configure|C Compiler|Libraries|Alphanumeric LCD menu:
	// RS - PORTC Bit 3
	// RD - PORTD Bit 7
	// EN - PORTD Bit 6
	// D4 - PORTB Bit 4
	// D5 - PORTB Bit 5
	// D6 - PORTB Bit 6
	// D7 - PORTB Bit 7
	// Characters/line: 16
	lcd_init(16);
    
    sprintf(str, "    %02d:%02d:%02d", time.hour, time.minute, time.seccond);
	lcd_clear();
    lcd_puts(str);
    
	// Global enable interrupts
	#asm("sei")
    
	while (1){}
}
