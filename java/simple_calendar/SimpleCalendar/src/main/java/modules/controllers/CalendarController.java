package modules.controllers;

import java.time.LocalTime;
import java.util.*;

import modules.models.EventDetials;
import modules.models.EventsModel;
import modules.views.CalendarView;

public class CalendarController extends EventsModel {
   private CalendarView view;
   private GregorianCalendar calendar;

   public CalendarController(CalendarView view, GregorianCalendar calendar) {
      super();
      this.view = view;
      this.calendar = calendar;
   }

   public void setView(CalendarView view) {
      this.view = view;
   }

   public CalendarView getView() {
      return this.view;
   }

   public void setCalendar(GregorianCalendar calendar) {
      this.calendar = calendar;
   }

   public GregorianCalendar getCalendar() {
      return this.calendar;
   }

   // Calendar
   public void nextDay() {
      this.calendar.add(GregorianCalendar.DATE, 1);
   }

   public void previousDay() {
      this.calendar.add(GregorianCalendar.DATE, -1);
   }

   public void nextMonth() {
      this.calendar.add(GregorianCalendar.MONTH, 1);
   }

   public void previousMonth() {
      this.calendar.add(GregorianCalendar.MONTH, -1);
   }

   public void nextYear() {
      this.calendar.add(GregorianCalendar.YEAR, 1);
   }

   public void previousYear() {
      this.calendar.add(GregorianCalendar.YEAR, -1);
   }

   public void selectDay(int date) {
      int currentDate = this.calendar.get(GregorianCalendar.DATE);
      this.calendar.add(GregorianCalendar.DATE, date - currentDate);
   }

   // Events
   public void createEvent(EventDetials eventDetails) {
      this.createEvent(this.calendar.getTime(), eventDetails);
   }

   public Map<LocalTime, EventDetials> readEventsOfDay() {
      return this.readEventsOfDay(this.calendar.getTime());
   }

   // public void updateEvent(EventDetials OldEventDetails, EventDetials newEventDetails) {
   //    this.updateEvent(this.calendar.getTime(), OldEventDetails, newEventDetails);
   // }

   public void deleteEvent(EventDetials eventDetails) {
      this.deleteEvent(this.calendar.getTime(), eventDetails);
   }

   // Console
   public void printCalendar() {
      this.view.printCalendar(this);
   }

   public void printCalendar(GregorianCalendar calendar) {
      this.view.printCalendar(new CalendarController(this.view, calendar));
   }

   public void printEvents() {
      this.view.printEvents(this);
   }

   // Gui
   public void createView() {
      this.view.create(this);
   }
}