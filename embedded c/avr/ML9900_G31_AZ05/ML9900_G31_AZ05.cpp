/*
 * ML9900_G31_AZ05.c
 *
 * Atmega32
 * Microchip Studio 7.0.2542
 *
 * Created: 4/24/2021 3:00:03 PM
 * Author : Mahor Foruzesh 97242126
 */

#include <avr/io.h>
#include <avr/interrupt.h>
#include <stdbool.h>

 /****************************************************************************/
 /* Seven Segment                                                            */
 /****************************************************************************/

#define SEV_SEG_PORT PORTB
#define SEV_SEG_DDR DDRB
#define SEV_SEG_DIGIT_PORT PORTC
#define SEV_SEG_DIGIT_DDR DDRC
#define SEV_SEG_TOTAL_DIGITS 4
const uint8_t SEV_SEG_DIGIT_BIT[SEV_SEG_TOTAL_DIGITS] = { 4, 5, 6, 7 };

class SevenSegment {
public:
    SevenSegment() {
        this->_digit = 0;
        for (uint8_t digit = 0; digit < SEV_SEG_TOTAL_DIGITS; digit++) {
            this->_number[digit] = 0;
        }
    }

    static uint8_t decoder(uint8_t bcd_number) {
        if (bcd_number < 0 || bcd_number > 9) {
            return 1;
        }
        return SevenSegment::_bcd_to_seven_segemnt_codes[bcd_number];
    }
    // must be inside a loop to refresh and display all digits
    void display() {
        SEV_SEG_DIGIT_PORT = (1 << SEV_SEG_DIGIT_BIT[this->_digit]);
        SEV_SEG_PORT = SevenSegment::decoder(this->_number[this->_digit]);

        this->_digit++;
        if (this->_digit >= SEV_SEG_TOTAL_DIGITS) {
            this->_digit = 0;
        }
    }

    void set(uint16_t number) {
        for (uint8_t digit = 0; digit < SEV_SEG_TOTAL_DIGITS; digit++) {
            this->_number[digit] = number / SevenSegment::_power(10, digit) % 10;
        }
    }

private:
    static uint16_t _power(const uint8_t x, const uint8_t y) {
        if (y == 0) return 1;
        if (y == 1) return x;

        uint16_t number = x;
        for (uint8_t i = 1; i < y; i++) {
            number *= x;
        }
        return number;
    }
    static const uint8_t _bcd_to_seven_segemnt_codes[10];
    uint8_t _digit;
    uint8_t _number[SEV_SEG_TOTAL_DIGITS];
};
const uint8_t SevenSegment::_bcd_to_seven_segemnt_codes[10] = {
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

/****************************************************************************/
/* Keypad                                                                   */
/****************************************************************************/

#define KEYPAD_PORT PORTA
#define KEYPAD_DDR DDRA
#define KEYPAD_PIN PINA
#define KEYPAD_COL_0 0
#define KEYPAD_COL_1 1
#define KEYPAD_COL_2 2
#define KEYPAD_COL_3 3
#define KEYPAD_ROW_0 4
#define KEYPAD_ROW_1 5
#define KEYPAD_ROW_2 6
#define KEYPAD_ROW_3 7

class Keypad4x4 {
public:
    uint8_t reading_period_scalar;
    Keypad4x4() {
        this->reading_period_scalar = 0;
    }
    Keypad4x4(uint8_t reading_period_scalar) {
        this->reading_period_scalar = reading_period_scalar;
    }

    enum Status { Nochange, Pressed };
    struct PressedKey {
        uint8_t row;
        uint8_t col;
        uint8_t number;
    };

    Keypad4x4::Status get_status() {
        if (this->_delay_count_down > 0) {
            this->_delay_count_down--;
            return Keypad4x4::Nochange;
        }

        // read row
        KEYPAD_PORT = (1 << KEYPAD_ROW_3) | (1 << KEYPAD_ROW_2) | (1 << KEYPAD_ROW_1) | (1 << KEYPAD_ROW_0);
        KEYPAD_DDR = ~KEYPAD_PORT;
        switch (~KEYPAD_PIN & KEYPAD_PORT) {
        case (1 << KEYPAD_ROW_0): {this->_pressed_key.row = 0; break;}
        case (1 << KEYPAD_ROW_1): {this->_pressed_key.row = 1; break;}
        case (1 << KEYPAD_ROW_2): {this->_pressed_key.row = 2; break;}
        case (1 << KEYPAD_ROW_3): {this->_pressed_key.row = 3; break;}
        default: return Keypad4x4::Nochange;
        }

        // read col
        KEYPAD_PORT = (1 << KEYPAD_COL_3) | (1 << KEYPAD_COL_2) | (1 << KEYPAD_COL_1) | (1 << KEYPAD_COL_0);
        KEYPAD_DDR = ~KEYPAD_PORT;
        switch (~KEYPAD_PIN & KEYPAD_PORT) {
        case (1 << KEYPAD_COL_0): {this->_pressed_key.col = 0; break;}
        case (1 << KEYPAD_COL_1): {this->_pressed_key.col = 1; break;}
        case (1 << KEYPAD_COL_2): {this->_pressed_key.col = 2; break;}
        case (1 << KEYPAD_COL_3): {this->_pressed_key.col = 3; break;}
        default: return Keypad4x4::Nochange;
        }

        this->_pressed_key.number = Keypad4x4::_key_matrix_number[this->_pressed_key.row][this->_pressed_key.col];
        return Keypad4x4::Pressed;
    }

    Keypad4x4::PressedKey get_pressed_key() {
        this->_delay_count_down = this->reading_period_scalar;
        return this->_pressed_key;
    }
private:
    static const uint8_t _key_matrix_number[4][4];
    Keypad4x4::PressedKey _pressed_key;
    uint8_t _delay_count_down;
};
const uint8_t Keypad4x4::_key_matrix_number[4][4] = {
    {7, 8, 9, 0},
    {4, 5, 6, 0},
    {1, 2, 3, 0},
    {0, 0, 0, 0}
};


/****************************************************************************/
/* MAIN                                                                     */
/****************************************************************************/

SevenSegment seven_segment;
Keypad4x4 keypad;

// Timer0 overflow interrupt service routine
// Timer0 reads keypad input and displays it on seven segment's first digit
ISR(TIMER0_OVF_vect) {
    // Reinitialize Timer 0 value
    TCNT0 = 0xB2;

    if (keypad.get_status() == Keypad4x4::Pressed) {
        seven_segment.set(keypad.get_pressed_key().number);
    }
    seven_segment.display();
}

int main(void) {
    // Input/Output Ports initialization
    SEV_SEG_DDR = (1 << 7) | (1 << 6) | (1 << 5) | (1 << 4) | (1 << 3) | (1 << 2) | (1 << 1) | (1 << 0);
    SEV_SEG_DIGIT_DDR = (1 << SEV_SEG_DIGIT_BIT[3]) | (1 << SEV_SEG_DIGIT_BIT[2]) | (1 << SEV_SEG_DIGIT_BIT[1]) | (1 << SEV_SEG_DIGIT_BIT[0]);

    // Timer/Counter 0 initialization
    // Clock source: System Clock
    // Clock value: 7.813 kHz
    // Mode: Normal top=0xFF
    // OC0 output: Disconnected
    // Timer Period: 9.984 ms
    TCCR0 = (0 << WGM00) | (0 << COM01) | (0 << COM00) | (0 << WGM01) | (1 << CS02) | (0 << CS01) | (1 << CS00);
    TCNT0 = 0xB2;
    // ( 5 x Timer Period: 9.984 ms ) = 49.92 ms delay for next keypad.get_status() 
    keypad.reading_period_scalar = 5;

    // Timer(s)/Counter(s) Interrupt(s) initialization
    TIMSK = (1 << TOIE0);
    // Global enable interrupts
    sei();

    while (1) {
    }
}