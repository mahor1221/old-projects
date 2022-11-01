/*
 * ML9900_G31_AZ09.c
 *
 * Atmega32
 * Microchip Studio 7.0.2542
 *
 * Created: 5/4/2021 2:18:28 PM
 * Author : Mahor Foruzesh 97242126
 */

#define F_CPU 8000000UL // 8MHz

#define LCD_COL_COUNT		16
#define LCD_ROW_COUNT		2
#define V_LCD_COL_COUNT		16
#define V_LCD_ROW_COUNT		4
#define V_LCD_PAGE_COUNT	3

#define FLOAT_PRECISION		3

#include <stdlib.h> // dtostrf(...)
#include <avr/io.h>
#include <avr/interrupt.h>
#include "avrlib/port.hpp"
using namespace avrlib;
#include "keypad4x4.hpp"
#include "lcd_hd44780.hpp"
#include "lcd_virtual.hpp"
using namespace LcdVirtual;
#include "expression_parser.hpp"

ExpressionParser math_exp[V_LCD_PAGE_COUNT];
LCD<V_LCD_COL_COUNT, V_LCD_ROW_COUNT, V_LCD_PAGE_COUNT> v_lcd;
LcdHD44780<LCD_COL_COUNT, LCD_ROW_COUNT, portc, 3, portd, 7, portd, 6, portb, 4, 5, 6, 7> lcd;
Keypad4x4<porta, 0, 1, 2, 3, 4, 5, 6, 7> keypad({ {
    {'7', '8', '9', '*'},
    {'4', '5', '6', '+'},
    {'1', '2', '3', 'u'},		// r,l = right, left
    {'b', '0', '.', 'd'}} },	// b = backspace
    { {
    {'7', '8', '9', '/'},
    {'4', '5', '6', '-'},
    {'1', '2', '3', 'r'},		// u,d = up, down
    {'c', '0', '=', 'l'}} });	// c = clear


// Timer0 overflow interrupt service routine
ISR(TIMER0_OVF_vect) {
    // Reinitialize Timer 0 value
    TCNT0 = 0xB2;

    if (keypad.is_pressed()) {
        uint8_t c_page = v_lcd.get_current_page();
        static bool result_is_displaying[V_LCD_PAGE_COUNT] = { false };

        switch (keypad.get_pressed_key_char()) {
        case 'u': break;
        case 'd': break;
        case 'r': { v_lcd.next_page(1); break; }
        case 'l': { v_lcd.next_page(-1); break; }
        case 'b': { math_exp[c_page].pop(); v_lcd.pop(); break; }
        case 'c': { math_exp[c_page].clear(); v_lcd.clear(); break; }
        case '=': {
            long double number = math_exp[c_page].parse();

            char result[64], buffer[64];
            // check if number is integer
            if (floorf(number) == number)
                dtostrf(number, 60, 0, buffer);
            else
                dtostrf(number, 60, FLOAT_PRECISION, buffer);
            // trim white-spaces
            sscanf(buffer, "%s", result);

            math_exp[c_page].clear();
            v_lcd.clear();
            v_lcd.puts("R= ");
            v_lcd.puts(result);

            result_is_displaying[c_page] = true;
            break;
        }
        default: {
            if (result_is_displaying[c_page]) {
                v_lcd.clear();
                result_is_displaying[c_page] = false;
            }
            if (math_exp[c_page].push(keypad.get_pressed_key_char()))
                v_lcd.push(keypad.get_pressed_key_char());
        }
        }

        // set window
        char window[lcd.COL_COUNT * lcd.ROW_COUNT];
        switch (keypad.get_pressed_key_char()) {
        case 'u': { v_lcd.move_window_ver(lcd.COL_COUNT, lcd.ROW_COUNT, -1, window); break; }
        case 'd': { v_lcd.move_window_ver(lcd.COL_COUNT, lcd.ROW_COUNT, 1, window); break; }
        default: v_lcd.set_window_to_last_char(lcd.COL_COUNT, lcd.ROW_COUNT, window);
        }
        lcd.clear_puts(window);
    }
}


ISR(TIMER1_OVF_vect) {
    // Reinitialize Timer1 value
    TCNT1H = 0x0B;
    TCNT1L = 0xDC;

    // blinking arrows to navigate easier
    v_lcd.toggle_arrows();
    Arrow* arrow = v_lcd.get_arrows(lcd.COL_COUNT, lcd.ROW_COUNT);
    lcd.set_cursor(arrow[UP].x, arrow[UP].y);
    lcd.write(arrow[UP].character);
    lcd.set_cursor(arrow[DOWN].x, arrow[DOWN].y);
    lcd.write(arrow[DOWN].character);
}

int main(void) {
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
    // Clock value: 125.000 kHz
    // Mode: Normal top=0xFFFF
    // OC1A output: Disconnected
    // OC1B output: Disconnected
    // Noise Canceler: Off
    // Input Capture on Falling Edge
    // Timer Period: 0.5 s
    // Timer1 Overflow Interrupt: On
    // Input Capture Interrupt: Off
    // Compare A Match Interrupt: Off
    // Compare B Match Interrupt: Off
    TCCR1A = (0 << COM1A1) | (0 << COM1A0) | (0 << COM1B1) | (0 << COM1B0) | (0 << WGM11) | (0 << WGM10);
    TCCR1B = (0 << ICNC1) | (0 << ICES1) | (0 << WGM13) | (0 << WGM12) | (0 << CS12) | (1 << CS11) | (1 << CS10);
    TCNT1H = 0x0B;
    TCNT1L = 0xDC;

    // Timer(s)/Counter(s) Interrupt(s) initialization
    TIMSK = (1 << TOIE1) | (1 << TOIE0);
    // Global enable interrupts
    sei();

    lcd.on();
    char string[] = "AAAABBBBCCCCDDDDEEEEFFFFGGGGHHHHIIIIJJJJKKKKLLLLMMMM";
    char window[lcd.COL_COUNT * lcd.ROW_COUNT];
    v_lcd.puts(string);
    v_lcd.set_window_to_last_char(lcd.COL_COUNT, lcd.ROW_COUNT, window);
    lcd.clear_puts(window);

    while (1) {
    }
}