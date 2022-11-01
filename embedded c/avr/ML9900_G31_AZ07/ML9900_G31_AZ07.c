/*
 * ML9900_G31_AZ07.c
 * Microchip Studio 7.0.2542
 * Created: 4/23/2021 1:41:55 PM
 * Author : Mahor Foruzesh
 */

#define F_CPU 8000000UL // CPU Frequency 8MHz
#include <avr/io.h>
#include <avr/interrupt.h>
#include <stdbool.h>

#define SEV_SEG_PORT PORTB
#define SEV_SEG_DDR DDRB
#define SEV_SEG_DIGIT_PORT PORTC
#define SEV_SEG_DIGIT_DDR DDRC
#define SEV_SEG_DIGIT_1 4
#define SEV_SEG_DIGIT_2 5
#define SEV_SEG_DIGIT_3 6
#define SEV_SEG_DIGIT_4 7

#define KEYPAD_PORT PORTA
#define KEYPAD_DDR DDRA
#define KEYPAD_PIN PINA
#define KEYPAD_COL_1 0
#define KEYPAD_COL_2 1
#define KEYPAD_COL_3 2
#define KEYPAD_COL_4 3
#define KEYPAD_ROW_1 4
#define KEYPAD_ROW_2 5
#define KEYPAD_ROW_3 6
#define KEYPAD_ROW_4 7

uint8_t duty_cycle = 0;
const uint8_t NUMBER_TO_7SEG[10] = {
    0b11000000,
    0b11111001,
    0b10100100,
    0b10110000,
    0b10011001,
    0b10010010,
    0b10000010,
    0b11111000,
    0b10000000,
    0b10010000 };

const uint8_t KEY_MATRIX[4][4] = {
    {7, 8, 9, 0},
    {4, 5, 6, 0},
    {1, 2, 3, 0},
    {0, 0, 0, 0} };

struct KEY
{
    uint8_t row;
    uint8_t col;
    bool pressed;
};

struct KEY read_keypad()
{
    struct KEY key;

    // read row
    KEYPAD_PORT = (1 << KEYPAD_ROW_4) | (1 << KEYPAD_ROW_3) | (1 << KEYPAD_ROW_2) | (1 << KEYPAD_ROW_1);
    KEYPAD_DDR = ~KEYPAD_PORT;
    switch (~KEYPAD_PIN & KEYPAD_PORT)
    {
    case (1 << KEYPAD_ROW_1): {key.row = 0; break;}
    case (1 << KEYPAD_ROW_2): {key.row = 1; break;}
    case (1 << KEYPAD_ROW_3): {key.row = 2; break;}
    case (1 << KEYPAD_ROW_4): {key.row = 3; break;}
    default: { key.pressed = false; return key;}
    }

    // read col
    KEYPAD_PORT = (1 << KEYPAD_COL_4) | (1 << KEYPAD_COL_3) | (1 << KEYPAD_COL_2) | (1 << KEYPAD_COL_1);
    KEYPAD_DDR = ~KEYPAD_PORT;
    switch (~KEYPAD_PIN & KEYPAD_PORT)
    {
    case (1 << KEYPAD_COL_1): {key.col = 0; break;}
    case (1 << KEYPAD_COL_2): {key.col = 1; break;}
    case (1 << KEYPAD_COL_3): {key.col = 2; break;}
    case (1 << KEYPAD_COL_4): {key.col = 3; break;}
    default: { key.pressed = false; return key;}
    }

    key.pressed = true;
    return key;
}

uint16_t calculate_OCR(uint16_t top, uint8_t duty_cycle)
{
    return top / 100 * duty_cycle;
}

// Timer0 overflow interrupt service routine
// Timer0 reads keypad input and displays it on seven segment's first digit
ISR(TIMER0_OVF_vect)
{
    // Reinitialize Timer 0 value
    TCNT0 = 0xB2;

    struct KEY key = read_keypad();
    if (key.pressed)
    {
        uint8_t number = KEY_MATRIX[key.row][key.col];
        SEV_SEG_PORT = NUMBER_TO_7SEG[number];
        // ICR1 = 0x4E1F 
        uint16_t ocr1 = calculate_OCR(0x4E1F, number * 10 / 100);
        OCR1AL = ocr1 & 0xFF;
        OCR1AH = ocr1 >> 8;
        OCR1BL = ocr1 & 0xFF;
        OCR1BH = ocr1 >> 8;
    }
}

int main()
{
    // Input/Output Ports initialization
    SEV_SEG_DDR = (1 << 7) | (1 << 6) | (1 << 5) | (1 << 4) | (1 << 3) | (1 << 2) | (1 << 1) | (1 << 0);
    SEV_SEG_DIGIT_DDR = (1 << SEV_SEG_DIGIT_1);
    SEV_SEG_DIGIT_PORT = (1 << SEV_SEG_DIGIT_1);
    SEV_SEG_PORT = NUMBER_TO_7SEG[0];

    // OCR1A, OCR1B 
    DDRD = (1 << DDD5) | (1 << DDD4);

    // Timer/Counter 0 initialization
    // Clock source: System Clock
    // Clock value: 7.813 kHz
    // Mode: Normal top=0xFF
    // OC0 output: Disconnected
    // Timer Period: 9.984 ms
    TCCR0 = (0 << WGM00) | (0 << COM01) | (0 << COM00) | (0 << WGM01) | (1 << CS02) | (0 << CS01) | (1 << CS00);
    TCNT0 = 0xB2;

    // Timer/Counter 1 initialization
    // Clock source: System Clock
    // Clock value: 1000.000 kHz
    // Mode: Fast PWM top=ICR1
    // OC1A output: Inverted PWM
    // OC1B output: Non-Inverted PWM
    // Noise Canceler: Off
    // Input Capture on Falling Edge
    // Timer Period: 20 ms
    // Output Pulse(s):
    // OC1A Period: 20 ms Width: 2.0001 ms
    // OC1B Period: 20 ms Width: 2.0001 ms
    // Timer1 Overflow Interrupt: Off
    // Input Capture Interrupt: Off
    // Compare A Match Interrupt: Off
    // Compare B Match Interrupt: Off
    TCCR1A = (1 << COM1A1) | (1 << COM1A0) | (1 << COM1B1) | (0 << COM1B0) | (1 << WGM11) | (0 << WGM10);
    TCCR1B = (0 << ICNC1) | (0 << ICES1) | (1 << WGM13) | (1 << WGM12) | (0 << CS12) | (1 << CS11) | (0 << CS10);
    TCNT1H = 0x00;
    TCNT1L = 0x00;
    ICR1H = 0x4E;
    ICR1L = 0x1F;

    // Timer(s)/Counter(s) Interrupt(s) initialization
    TIMSK = (1 << TOIE0);
    // Global enable interrupts
    sei();

    while (1)
    {
    }
}