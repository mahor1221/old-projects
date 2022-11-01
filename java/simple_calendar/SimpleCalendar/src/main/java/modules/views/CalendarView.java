package modules.views;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;

import java.time.*;
import java.util.*;
import java.util.Map.Entry;

import config.Config;

import modules.controllers.CalendarController;
import modules.models.*;

public class CalendarView extends JFrame implements ItemListener {
   private static final long serialVersionUID = 1L;
   private CalendarController controller;

   private Container pageEndContainer;
   private JButton button1;
   private JButton button2;
   private JLabel currentMonth;
   private JLabel currentYear;
   private JTextField startTime;
   private JTextField endTime;
   private JTextField description;
   private LocalTime eventLocalTime;

   public void create(CalendarController controller) {
      this.controller = controller;

      JPanel pageStartPanel = new JPanel(new GridLayout(1, 7));
      JLabel dayName = new JLabel("Sunday", SwingConstants.CENTER);
      pageStartPanel.add(dayName);
      dayName = new JLabel("Monday", SwingConstants.CENTER);
      pageStartPanel.add(dayName);
      dayName = new JLabel("Tuesday", SwingConstants.CENTER);
      pageStartPanel.add(dayName);
      dayName = new JLabel("Wednesday", SwingConstants.CENTER);
      pageStartPanel.add(dayName);
      dayName = new JLabel("Thursday", SwingConstants.CENTER);
      pageStartPanel.add(dayName);
      dayName = new JLabel("Friday", SwingConstants.CENTER);
      pageStartPanel.add(dayName);
      dayName = new JLabel("Sturday", SwingConstants.CENTER);
      pageStartPanel.add(dayName);
      pageStartPanel.setPreferredSize(new Dimension(0, 40));

      // Days of Month
      JPanel centerPanel = new JPanel(new GridLayout(6, 7));
      GregorianCalendar calendar = controller.getCalendar();
      JToggleButton toggleButton = new JToggleButton();
      ButtonGroup buttonGroup = new ButtonGroup();
      GregorianCalendar tempCal = new GregorianCalendar(calendar.get(GregorianCalendar.YEAR),
            calendar.get(GregorianCalendar.MONTH), 1);
      int firstDayOfWeek = tempCal.get(GregorianCalendar.DAY_OF_WEEK) - 1;
      int maximumDate = calendar.getActualMaximum(GregorianCalendar.DATE);
      boolean toggle = false;
      for (int i = 0, day = 1; i < 42; i++) {
         if (firstDayOfWeek <= 0 && day <= maximumDate) {

            if (day == calendar.get(GregorianCalendar.DATE))
               toggle = true;
            toggleButton = new JToggleButton(Integer.toString(day), toggle);
            toggle = false;
            centerPanel.add(toggleButton);
            buttonGroup.add(toggleButton);
            toggleButton.addItemListener(this);
            day++;
         } else {
            centerPanel.add(new JLabel(""));
            firstDayOfWeek--;
         }
      }

      // Navigation
      JButton previusMonth = new JButton("<");
      previusMonth.addActionListener((event) -> {
         controller.previousMonth();
         this.updateCalendar(controller);
         this.updateEvents(controller);
      });
      JButton nextMonth = new JButton(">");
      nextMonth.addActionListener((event) -> {
         controller.nextMonth();
         this.updateCalendar(controller);
         this.updateEvents(controller);
      });
      JButton previousYear = new JButton("<");
      previousYear.addActionListener((event) -> {
         controller.previousYear();
         this.updateCalendar(controller);
         this.updateEvents(controller);
      });
      JButton nextYear = new JButton(">");
      nextYear.addActionListener((event) -> {
         controller.nextYear();
         this.updateCalendar(controller);
         this.updateEvents(controller);
      });
      currentMonth = new JLabel(Config.monthToString(calendar.get(GregorianCalendar.MONTH)), SwingConstants.CENTER);
      currentYear = new JLabel(Integer.toString(calendar.get(GregorianCalendar.YEAR)), SwingConstants.CENTER);
      currentMonth.setPreferredSize(new Dimension(70, 0));

      // Events
      JPanel crudPanel = new JPanel(new GridLayout(2, 1));
      button1 = new JButton("New Event");
      button1.addActionListener((event) -> {
         if (button1.getText() == "New Event") {
            JPanel createPanel = new JPanel(new GridLayout(3, 2));

            JLabel label = new JLabel("Start Time");
            startTime = new JTextField();
            createPanel.add(label);
            createPanel.add(startTime);

            label = new JLabel("End Time");
            endTime = new JTextField();
            createPanel.add(label);
            createPanel.add(endTime);

            label = new JLabel("Description");
            description = new JTextField();
            createPanel.add(label);
            createPanel.add(description);

            pageEndContainer.remove(2);
            pageEndContainer.add(createPanel, BorderLayout.CENTER);
            button1.setText("Create");
            button2.setText("Cancel");
            setVisible(true);

         } else if (button1.getText() == "Create") {
            EventDetials eventDetails = new EventDetials();
            try {
               eventDetails.startTime = LocalTime.parse(startTime.getText());
               eventDetails.endTime = LocalTime.parse(endTime.getText());
               eventDetails.description = description.getText();
               controller.createEvent(calendar.getTime(), eventDetails);
               controller.saveEvents();
            } catch (Exception e) {
               // TODO: handle exception
               System.out.println("Can't parse TextField to LocalTime");
            }

            button1.setText("New Event");
            button2.setText("delete");
            updateEvents(controller);
         } else if (button1.getText() == "Ok") {
            EventDetials eventDetials = new EventDetials();
            eventDetials.startTime = eventLocalTime;
            controller.deleteEvent(calendar.getTime(), eventDetials);
            controller.saveEvents();
            button1.setText("New Event");
            button2.setText("delete");
            updateEvents(controller);
         }
      });
      button2 = new JButton("delete");
      button2.addActionListener((event) -> {
         if (button2.getText() == "delete") {
            JPanel deletePanel = new JPanel(new GridLayout(4, 1));
            Map<LocalTime, EventDetials> eventsOfDay = controller.readEventsOfDay();

            if (eventsOfDay != null) {
               String label = "";
               JToggleButton deleteButton = new JToggleButton();
               for (Map.Entry<LocalTime, EventDetials> deleteEvent : eventsOfDay.entrySet()) {
                  label = deleteEvent.getKey() + "-" + deleteEvent.getValue().endTime + ": "
                        + deleteEvent.getValue().description;
                  deleteButton = new JToggleButton(label);
                  deleteButton.addActionListener((arg0) -> {
                     AbstractButton button = (AbstractButton) arg0.getSource();
                     String[] split = button.getText().split("-", 0);
                     eventLocalTime = LocalTime.parse(split[0]);
                  });
                  deleteButton.setPreferredSize(new Dimension(0, 22));
                  deletePanel.add(deleteButton);
               }
            }
            pageEndContainer.remove(2);
            pageEndContainer.add(deletePanel, BorderLayout.CENTER);
            button1.setText("Ok");
            button2.setText("Cancel");
            setVisible(true);
         } else if (button2.getText() == "Cancel") {
            button1.setText("New Event");
            button2.setText("delete");
            updateEvents(controller);
         }
      });
      button1.setPreferredSize(new Dimension(115, 45));
      crudPanel.add(button1);
      crudPanel.add(button2);

      JPanel eventsPanel = new JPanel(new GridLayout(4, 1));
      Map<LocalTime, EventDetials> eventsOfDay = controller.readEventsOfDay();

      if (eventsOfDay != null) {
         String label = "";
         JLabel eventsOfDayLabel = new JLabel();
         for (Map.Entry<LocalTime, EventDetials> event : eventsOfDay.entrySet()) {
            label = event.getKey() + "-" + event.getValue().endTime + ": " + event.getValue().description;
            eventsOfDayLabel = new JLabel(label);
            eventsPanel.add(eventsOfDayLabel);
         }
      }

      JPanel navigationPanel = new JPanel(new GridLayout(2, 3, 15, 0));
      navigationPanel.add(previusMonth);
      navigationPanel.add(currentMonth);
      navigationPanel.add(nextMonth);
      navigationPanel.add(previousYear);
      navigationPanel.add(currentYear);
      navigationPanel.add(nextYear);

      pageEndContainer = new Container();

      pageEndContainer.setLayout(new BorderLayout(5, 0));
      pageEndContainer.add(navigationPanel, BorderLayout.LINE_END);
      pageEndContainer.add(crudPanel, BorderLayout.LINE_START);
      pageEndContainer.add(eventsPanel, BorderLayout.CENTER);

      Container container = getContentPane();
      container.setLayout(new BorderLayout(5, 5));
      container.add(pageStartPanel, BorderLayout.PAGE_START);
      container.add(pageEndContainer, BorderLayout.PAGE_END);
      container.add(centerPanel, BorderLayout.CENTER);

      setSize(Config.frame.width, Config.frame.height);
      setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

      String localDate = calendar.getTime().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().toString();
      setTitle(Config.weekToString(calendar.get(GregorianCalendar.DAY_OF_WEEK)) + " " + localDate);
      setVisible(true);
   }

   public void printCalendar(CalendarController controller) {
      GregorianCalendar calendar = controller.getCalendar();

      int[] week = new int[7];
      int[][] month = new int[6][7];
      GregorianCalendar tempCal = new GregorianCalendar(calendar.get(GregorianCalendar.YEAR),
            calendar.get(GregorianCalendar.MONTH), 1); // getting first day of month
      int dayOfWeek = tempCal.get(GregorianCalendar.DAY_OF_WEEK) - 1;
      int maximumDate = calendar.getActualMaximum(GregorianCalendar.DATE);
      int weekOfMonth = 0;

      for (int day = 1; day <= maximumDate; day++) {
         week[dayOfWeek] = day;
         dayOfWeek++;
         if (dayOfWeek == 7 || day == maximumDate) {
            month[weekOfMonth] = week;
            weekOfMonth++;
            dayOfWeek = 0;
            week = new int[7];
         }
      }

      int selectedDay = calendar.get(GregorianCalendar.DATE);
      String text = "";
      for (int[] w : month) {
         for (int day : w) {
            if (day == selectedDay)
               text += "[";
            else
               text += " ";

            if (day != 0)
               text += day;
            else
               text += " ";
            if (String.valueOf(day).length() == 1)
               text += " ";

            if (day == selectedDay)
               text += "]";
            else
               text += " ";

         }
         System.out.println(text);
         text = "";
      }
   }

   public void printEvents(CalendarController controller) {
      Events events = controller.getEvents();
      boolean noEvents = true;

      for (Entry<LocalDate, Map<LocalTime, EventDetials>> eventsOfDay : events.entrySet()) {
         System.out.println(eventsOfDay.getKey());
         for (Map.Entry<LocalTime, EventDetials> event : eventsOfDay.getValue().entrySet()) {
            noEvents = false;
            System.out
                  .println(event.getKey() + " - " + event.getValue().endTime + " : " + event.getValue().description);
         }
      }
      if (noEvents)
         System.out.println("no Events");
   }

   public void updateCalendar(CalendarController controller) {
      JPanel centerPanel = new JPanel(new GridLayout(6, 7));
      GregorianCalendar calendar = controller.getCalendar();
      JToggleButton toggleButton = new JToggleButton();
      ButtonGroup buttonGroup = new ButtonGroup();
      GregorianCalendar tempCal = new GregorianCalendar(calendar.get(GregorianCalendar.YEAR),
            calendar.get(GregorianCalendar.MONTH), 1);
      int firstDayOfWeek = tempCal.get(GregorianCalendar.DAY_OF_WEEK) - 1;
      int maximumDate = calendar.getActualMaximum(GregorianCalendar.DATE);
      boolean toggle = false;
      for (int i = 0, day = 1; i < 42; i++) {
         if (firstDayOfWeek <= 0 && day <= maximumDate) {

            if (day == calendar.get(GregorianCalendar.DATE))
               toggle = true;
            toggleButton = new JToggleButton(Integer.toString(day), toggle);
            toggle = false;
            centerPanel.add(toggleButton);
            buttonGroup.add(toggleButton);
            toggleButton.addItemListener(this);
            day++;
         } else {
            centerPanel.add(new JLabel(""));
            firstDayOfWeek--;
         }
      }

      Container container = getContentPane();
      container.remove(2);
      container.add(centerPanel, BorderLayout.CENTER);
      currentMonth.setText(Config.monthToString(calendar.get(GregorianCalendar.MONTH)));
      currentYear.setText(Integer.toString(calendar.get(GregorianCalendar.YEAR)));
      button1.setText("New Event");
      button2.setText("delete");
   }

   public void updateEvents(CalendarController controller) {

      JPanel eventsPanel = new JPanel(new GridLayout(4, 1));
      Map<LocalTime, EventDetials> eventsOfDay = controller.readEventsOfDay();

      if (eventsOfDay != null) {
         String label = "";
         JLabel eventsOfDayLabel = new JLabel();
         for (Map.Entry<LocalTime, EventDetials> event : eventsOfDay.entrySet()) {
            label = event.getKey() + "-" + event.getValue().endTime + ": " + event.getValue().description;
            eventsOfDayLabel = new JLabel(label);
            eventsPanel.add(eventsOfDayLabel);
         }
      }

      pageEndContainer.remove(2);
      pageEndContainer.add(eventsPanel, BorderLayout.CENTER);
      setVisible(true);
   }

   @Override
   public void itemStateChanged(ItemEvent arg0) {
      // TODO Auto-generated method stub

      int state = arg0.getStateChange();

      if (state == ItemEvent.SELECTED) {
         AbstractButton button = (AbstractButton) arg0.getSource();
         int day = Integer.parseInt(button.getText());
         this.controller.selectDay(day);
         updateEvents(controller);
      }

   }
}