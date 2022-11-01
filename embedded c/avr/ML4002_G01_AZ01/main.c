#include <avr/io.h>
#define F_CPU 8000000UL
#include <util/delay.h>

int main(void)
{
	int count=0;
	DDRB=0b11111111;
	while (1) {
		PORTB=count;
		count+=1;
		_delay_ms(1000);
	}
}

