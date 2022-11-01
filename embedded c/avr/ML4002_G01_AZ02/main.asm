; initialize stack
	ldi	r16,LOW(RAMEND)	
	out	SPL,r16
	ldi	r16,HIGH(RAMEND)
	out	SPH,r16

main:
	ldi	r16,0b11111111
    out	DDRB,r16
	ldi	r16,0b00000000
	loop:
		out	PORTB,r16
		inc r16
		rcall delay
		rjmp loop

delay:
	ldi r20,32
	loop1:
		ldi r21,200
		loop2:
			ldi r22,250
			loop3:
				nop
				nop
				dec r22
				brne loop3
			dec r21
			brne loop2
		dec r20
		brne loop1
	ret