; ML9900_G31_AZ02.asm

.INCLUDE "M32DEF.INC"
.EQU LED_ARRAY_PORT = PORTB
.EQU LED_ARRAY_DDR = DDRB

.ORG 0x0 
	; Location for Reset
	; Bypass Interrupt Vector Table					
	JMP		MAIN
.ORG 0x12
	; ISR location for Timer1
	; Go to an address with more space 
	JMP		T1_OV_ISR


.ORG 0x40
MAIN:	
	; Stack initialization
	LDI		R20, HIGH(RAMEND)
	OUT		SPH, R20
	LDI		R20, LOW(RAMEND)
	OUT		SPL, R20
    
    ; counter
    LDI		R20, 0

	; Input/Output Ports initialization
	LDI		R20, 0b11111111
	OUT		LED_ARRAY_DDR, R20

	; Timer/Counter 1 initialization
	; Clock source: System Clock
	; Clock value: 31.250 kHz
	; Mode: Normal top=0xFFFF
	; OC1A output: Disconnected
	; OC1B output: Disconnected
	; Noise Canceler: Off
	; Input Capture on Falling Edge
	; Timer Period: 1 s
	; Timer1 Overflow Interrupt: On
	; Input Capture Interrupt: Off
	; Compare A Match Interrupt: Off
	; Compare B Match Interrupt: Off
	LDI		R20, (1 << CS12)
	OUT		TCCR1B, R20
	LDI		R20, 0x85
	OUT		TCNT1H, R20
	LDI		R20, 0xEE
	OUT		TCNT1L, R20

	; Timer(s)/Counter(s) Interrupt(s) initialization
	LDI		R20, (1 << TOIE1)
	OUT		TIMSK, R20
	; Global enable interrupts
	SEI

	WHILE:
		JMP		WHILE


.ORG 0x300
T1_OV_ISR:
	// Reinitialize Timer1 value
	LDI		R20, 0x85EE >> 8
	OUT		TCNT1H, R20
	LDI		R20, 0x85EE & 0xff
	OUT		TCNT1L, R20

	// count and display on LED Array
	OUT		LED_ARRAY_PORT, R18
	INC		R18

	RETI