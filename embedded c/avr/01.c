#include <mega32.h>
#include <delay.h>
#include <alcd.h>
#include <stdio.h>
typedef unsigned char bool;
#define true 1
#define false 0

#define SET(p,b)		(p |=  (1<<b))	
#define CLR(p,b)		(p &= ~(1<<b))
#define GET(p,b)		((p & (1<<b))>>b)

#define BUZZER_PORT		PORTD
#define BUZZER_DDR		DDRD
#define BUZZER			6

#define HAND_BRAKE_PORT	PORTD
#define HAND_BRAKE_DDR	DDRD
#define HAND_BRAKE_PIN	PIND
#define HAND_BRAKE		3

#define ML_OCR			OCR1AL
#define MR_OCR			OCR1BL
#define MAX_OCR			0xFF
#define ML_EN_DDR		DDRD
#define ML_EN			4
#define MR_EN_DDR		DDRD
#define MR_EN			5

#define ML_IN1_PORT		PORTC
#define ML_IN1_DDR		DDRC
#define ML_IN1			4
#define ML_IN2_PORT		PORTC
#define ML_IN2_DDR		DDRC
#define ML_IN2			5
#define MR_IN1_PORT		PORTC
#define MR_IN1_DDR		DDRC
#define MR_IN1			6
#define MR_IN2_PORT		PORTC
#define MR_IN2_DDR		DDRC
#define MR_IN2			7

#define M1_SENS			5
#define M2_SENS			4
#define M3_SENS			7
#define M4_SENS			6
#define TEMP_SENS		3

#define BATTERY_VOLT	12
#define BATTERY_ENERGY	5000

// Sensor Resistor of Motors = 0.1 Ohm
// Conductance = 1 / 0.1 = 10 Mho 
#define MX_SENS_CON		10
// Gain = 1 + Rf/Ri = 1+ 150k/10k = 16
#define OPAMP_GAIN		16
#define ADC_VREF_TYPE	((0<<REFS1) | (0<<REFS0) | (0<<ADLAR))
#define ADC_VREF		1.5  // 1.5V
#define ADC_10BIT		1024 // 2^10
#define ADC_GET_VOLT(b)		(adc_read(b) * ADC_VREF / ADC_10BIT)
#define ADC_GET_TEMP(b)		(ADC_GET_VOLT(b) * 100)
#define ADC_GET_AMPERE(b)	(ADC_GET_VOLT(b) * MX_SENS_CON / OPAMP_GAIN)
unsigned int adc_read(unsigned char adc_input) {
	ADMUX=adc_input | ADC_VREF_TYPE;
	// Delay needed for the stabilization of the ADC input voltage
	delay_us(10);
	// Start the AD conversion
	ADCSRA|=(1<<ADSC);
	// Wait for the AD conversion to complete
	while ((ADCSRA & (1<<ADIF))==0);
	ADCSRA|=(1<<ADIF);
	return ADCW;
}

//-----------------------------------------------------------------------------
#define KP_R1_PORT		PORTB
#define KP_R1_DDR		DDRB
#define KP_R1_PIN		PINB
#define KP_R1			0
#define KP_R2_PORT		PORTB
#define KP_R2_DDR		DDRB
#define KP_R2_PIN		PINB
#define KP_R2			1
#define KP_C1_PORT		PORTB
#define KP_C1_DDR		DDRB
#define KP_C1_PIN		PINB
#define KP_C1			2
#define KP_C2_PORT		PORTB
#define KP_C2_DDR		DDRB
#define KP_C2_PIN		PINB
#define KP_C2			3
#define KP_C3_PORT		PORTB
#define KP_C3_DDR		DDRB
#define KP_C3_PIN		PINB
#define KP_C3			4

typedef enum KPKey { // NL = NULL
	UP, DW, RT, LT, RV, BZ, NL,
} KPKey;
const KPKey KP_LAYOUT[2][3] = {
	{ BZ, UP, RV },
	{ LT, DW, RT },
};
KPKey kp_key, kp_last_key = NL;
KPKey kp_read() {
	KPKey key = NL;
	char row = 0;
	char col = 0;
	
	CLR(KP_R1_DDR, KP_R1);
    CLR(KP_R2_DDR, KP_R2);
	SET(KP_C1_DDR, KP_C1);
	SET(KP_C2_DDR, KP_C2);
	SET(KP_C3_DDR, KP_C3);
	SET(KP_R1_PORT, KP_R1);
	SET(KP_R2_PORT, KP_R2);
	CLR(KP_C1_PORT, KP_C1);
	CLR(KP_C2_PORT, KP_C2);
	CLR(KP_C3_PORT, KP_C3);
	#asm("NOP");
	row = (!GET(KP_R1_PIN, KP_R1)<<0) 
		| (!GET(KP_R2_PIN, KP_R2)<<1);
		
	SET(KP_R1_DDR, KP_R1);
	SET(KP_R2_DDR, KP_R2);
	CLR(KP_C1_DDR, KP_C1);
	CLR(KP_C2_DDR, KP_C2);
	CLR(KP_C3_DDR, KP_C3);
	CLR(KP_R1_PORT, KP_R1);
	CLR(KP_R2_PORT, KP_R2);
	SET(KP_C1_PORT, KP_C1);
	SET(KP_C2_PORT, KP_C2);
	SET(KP_C3_PORT, KP_C3);
	#asm("NOP");
	col = (!GET(KP_C1_PIN, KP_C1)<<0)
		| (!GET(KP_C2_PIN, KP_C2)<<1)
		| (!GET(KP_C3_PIN, KP_C3)<<2);
		
	switch (row) {
		case 0b00000001: row = 0; break;
		case 0b00000010: row = 1; break;
		default: return NL;
	}
	switch (col) {
		case 0b00000001: col = 0; break;
		case 0b00000010: col = 1; break;
		case 0b00000100: col = 2; break;
		default: return NL;
	}
	kp_last_key = kp_key;
	key = KP_LAYOUT[row][col];
	return key;
}

//-----------------------------------------------------------------------------
typedef enum CarStatus {
	IS_NEUTRAL,
	IS_BRAKING,
	IS_HAND_BRAKING,
	IS_MOVING_FORWARD, 
	IS_MOVING_BACKWARD, 
} CarStatus;
CarStatus car_status = IS_NEUTRAL;
float car_energy = BATTERY_ENERGY;
float car_temp = 0;
float car_m1_ampere = 0;
float car_m2_ampere = 0;
float car_m3_ampere = 0;
float car_m4_ampere = 0;

float power_pct = 0;
float direction_pct = 0;
void change_power_vector(
const float add_power_pct,
const float add_direction_pct
) {
	if(power_pct == 0) power_pct += add_power_pct;
	else power_pct += power_pct*add_power_pct;
	
	direction_pct += add_direction_pct;
	if(power_pct > 1) power_pct = 1;
	else if (power_pct < 0) power_pct = 0;
	if(direction_pct > 0.5) direction_pct = 0.5;
	else if (direction_pct < -0.5) direction_pct = -0.5;
	
	if(direction_pct >= 0) {
		ML_OCR = MAX_OCR * (power_pct) * (1 - direction_pct);
		MR_OCR = MAX_OCR * (power_pct);
		} else {
		ML_OCR = MAX_OCR * (power_pct);
		MR_OCR = MAX_OCR * (power_pct) * (1 + direction_pct);
	}
}

void car_move_forward() {
	car_status = IS_MOVING_FORWARD;
	SET(ML_IN1_PORT, ML_IN1);
	SET(MR_IN1_PORT, MR_IN1);
	CLR(ML_IN2_PORT, ML_IN2);
	CLR(MR_IN2_PORT, MR_IN2);
}
void car_move_backward() {
	car_status = IS_MOVING_BACKWARD;
	CLR(ML_IN1_PORT, ML_IN1);
	CLR(MR_IN1_PORT, MR_IN1);
	SET(ML_IN2_PORT, ML_IN2);
	SET(MR_IN2_PORT, MR_IN2);
}
void car_brake() {
	car_status = IS_BRAKING;
	power_pct = 100;
	change_power_vector(0, 0);
	SET(ML_IN1_PORT, ML_IN1);
	SET(MR_IN1_PORT, MR_IN1);
	SET(ML_IN2_PORT, ML_IN2);
	SET(MR_IN2_PORT, MR_IN2);
}
void car_be_neutral() {
	car_status = IS_NEUTRAL;
	power_pct = 0;
	change_power_vector(0, 0);
	CLR(ML_IN1_PORT, ML_IN1);
	CLR(MR_IN1_PORT, MR_IN1);
	CLR(ML_IN2_PORT, ML_IN2);
	CLR(MR_IN2_PORT, MR_IN2);
}

interrupt [TIM0_OVF] void timer0_ovf_isr(void) {	
	// Keypad Period = 32ms * 4 = 0.128s
	// Sensor Period = 32ms * 16 = 0.512s
	const char KP_TIM0_OVF_MULT = 4;
	//const char SENS_TIM0_OVF_MULT = 16;
	static char kp_timer0_ovfs = 0;
	//static char sens_timer0_ovfs = 0;
	char buffer[2][16];
	// Reinitialize Timer 0 value
	TCNT0=0x06;
    
	if( kp_timer0_ovfs < KP_TIM0_OVF_MULT) 
		kp_timer0_ovfs++;
	else {
		kp_timer0_ovfs = 0;
		if(car_energy < 500) {
			car_be_neutral();
			return;
		}
		if(car_temp > 100) {
			SET(BUZZER_PORT, BUZZER);
			car_be_neutral();
			return;
		} else CLR(BUZZER_PORT, BUZZER);
		
		
		
		
		
		
		kp_key = kp_read();
		switch(kp_key) {
		case UP: 
			if(car_status != IS_HAND_BRAKING){
				change_power_vector(0.1, 0); 
				if(car_status != IS_MOVING_BACKWARD)
					car_move_forward();
			}
			break;
		case DW: 
			if(car_status != IS_HAND_BRAKING  
			&& car_status != IS_BRAKING)
				car_brake(); break;
		case RT: change_power_vector(0, 0.03); break;
		case LT: change_power_vector(0, -0.03); break;
		case RV: 
			if(car_status != IS_HAND_BRAKING 
			&& kp_last_key != RV)
				if(car_status != IS_MOVING_BACKWARD) car_move_backward();
				else car_move_forward(); 
			break;
		case BZ: SET(BUZZER_PORT, BUZZER); break;
		default: 
			if(car_status != IS_HAND_BRAKING
			&& kp_last_key == DW) car_be_neutral();
			else if(kp_last_key == BZ) CLR(BUZZER_PORT, BUZZER);
		}
	}
		
	if( sens_timer0_ovfs < SENS_TIM0_OVF_MULT) 
		sens_timer0_ovfs++;
	else {
		sens_timer0_ovfs = 0;
		car_temp = ADC_GET_TEMP(TEMP_SENS);
		car_m1_ampere = ADC_GET_AMPERE(M1_SENS);
		car_m2_ampere = ADC_GET_AMPERE(M2_SENS);
		car_m3_ampere = ADC_GET_AMPERE(M3_SENS);
		car_m4_ampere = ADC_GET_AMPERE(M4_SENS);
		
		// E = P*t = V*I*t 
		// t = Timer0 Period * Sensor Period
		// t = 32ms * 16 = 0.512s
		car_energy -= 0.512 *(
			car_m1_ampere +
			car_m2_ampere +
			car_m3_ampere +
			car_m4_ampere)* 
			BATTERY_VOLT ;
 			
		sprintf(
			buffer[0], 
			"%.4fA %.4fA", 
			car_m1_ampere + car_m3_ampere, 
			car_m2_ampere + car_m4_ampere
		);
		sprintf(
			buffer[1], 
			"%5.1fC %6.2fJ", 
			car_temp, 
			car_energy
		);
		lcd_clear();
		lcd_gotoxy(0,0);
		lcd_puts(buffer[0]);
		lcd_gotoxy(0,1);
		lcd_puts(buffer[1]);
	}
}

interrupt [EXT_INT1] void ext_int1_isr(void) {
	if(GET(HAND_BRAKE_PIN, HAND_BRAKE)) {
		car_brake();
		car_status = IS_HAND_BRAKING;
	} else car_be_neutral();
}

//-----------------------------------------------------------------------------
void main(void) {
	SET(ML_EN_DDR, ML_EN);
	SET(MR_EN_DDR, MR_EN);

	SET(ML_IN1_DDR, ML_IN1);
	SET(ML_IN2_DDR, ML_IN2);
	SET(MR_IN1_DDR, MR_IN1);
	SET(MR_IN2_DDR, MR_IN2);
	
	SET(BUZZER_DDR, BUZZER);
	SET(HAND_BRAKE_PORT, HAND_BRAKE);
	
	// External Interrupt(s) initialization
	// INT0: Off
	// INT1: On
	// INT1 Mode: Any change
	// INT2: Off
	GICR|=(1<<INT1) | (0<<INT0) | (0<<INT2);
	MCUCR=(0<<ISC11) | (1<<ISC10) | (0<<ISC01) | (0<<ISC00);
	MCUCSR=(0<<ISC2);
	GIFR=(1<<INTF1) | (0<<INTF0) | (0<<INTF2);
			
	// Timer/Counter 0 initialization
	// Clock source: System Clock
	// Clock value: 7.813 kHz
	// Mode: Normal top=0xFF
	// OC0 output: Disconnected
	// Timer Period: 32 ms
	TCCR0=(0<<WGM00) | (0<<COM01) | (0<<COM00) | (0<<WGM01) | (1<<CS02) | (0<<CS01) | (1<<CS00);
	TCNT0=0x06;
	OCR0=0x00;

	// Timer/Counter 1 initialization
	// Clock source: System Clock
	// Clock value: 125.000 kHz
	// Mode: Ph. correct PWM top=0x00FF
	// OC1A output: Non-Inverted PWM
	// OC1B output: Non-Inverted PWM
	// Noise Canceler: Off
	// Input Capture on Falling Edge
	// Timer Period: 4.08 ms
	// Output Pulse(s):
	// OC1A Period: 4.08 ms Width: 2.048 ms
	// OC1B Period: 4.08 ms Width: 2.048 ms
	// Timer1 Overflow Interrupt: Off
	// Input Capture Interrupt: Off
	// Compare A Match Interrupt: Off
	// Compare B Match Interrupt: Off
	TCCR1A=(1<<COM1A1) | (0<<COM1A0) | (1<<COM1B1) | (0<<COM1B0) | (0<<WGM11) | (1<<WGM10);
	TCCR1B=(0<<ICNC1) | (0<<ICES1) | (0<<WGM13) | (0<<WGM12) | (0<<CS12) | (1<<CS11) | (1<<CS10);
	TCNT1H=0x00;
	TCNT1L=0x00;
	ICR1H=0x00;
	ICR1L=0x00;
	OCR1AH=0x00;
	OCR1AL=0x00;
	OCR1BH=0x00;
	OCR1BL=0x00;

	// Timer(s)/Counter(s) Interrupt(s) initialization
	TIMSK=(0<<OCIE2) | (0<<TOIE2) | (0<<TICIE1) | (0<<OCIE1A) | (0<<OCIE1B) | (0<<TOIE1) | (0<<OCIE0) | (1<<TOIE0);
	
	// ADC initialization
	// ADC Clock frequency: 1000.000 kHz
	// ADC Voltage Reference: AREF pin
	// ADC Auto Trigger Source: ADC Stopped
	ADMUX=ADC_VREF_TYPE;
	ADCSRA=(1<<ADEN) | (0<<ADSC) | (0<<ADATE) | (0<<ADIF) | (0<<ADIE) | (0<<ADPS2) | (1<<ADPS1) | (1<<ADPS0);
	SFIOR=(0<<ADTS2) | (0<<ADTS1) | (0<<ADTS0);

	// Alphanumeric LCD initialization
	// Connections are specified in the
	// Project|Configure|C Compiler|Libraries|Alphanumeric LCD menu:
	// RS - PORTA Bit 2
	// RD - PORTA Bit 1
	// EN - PORTA Bit 0
	// D4 - PORTC Bit 0
	// D5 - PORTC Bit 1
	// D6 - PORTC Bit 2
	// D7 - PORTC Bit 3
	// Characters/line: 16
	lcd_init(16);
	
	// Global enable interrupts
	#asm("sei")
	
	while (1)
	{

	}
}
