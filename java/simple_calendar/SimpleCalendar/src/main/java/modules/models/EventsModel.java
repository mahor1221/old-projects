package modules.models;

import java.time.*;
import java.util.*;

import config.Config;

public class EventsModel {
    private Events events = new Events();

    public void createEvent(Date date, EventDetials eventDetails) {

        LocalDate localDate = this.dateToLocalDate(date);
        Map<LocalTime, EventDetials> eventsOfDay = this.events.get(localDate);
        boolean error = false;
        if (eventDetails.startTime.compareTo(eventDetails.endTime) >= 0) // if startTime > endTime
            error = true;

        if (eventsOfDay != null)
            for (Map.Entry<LocalTime, EventDetials> event : this.events.get(localDate).entrySet())
                if (eventDetails.endTime.compareTo(event.getValue().startTime) <= 0
                        && eventDetails.endTime.compareTo(event.getValue().endTime) < 0)
                    continue;
                else if (eventDetails.startTime.compareTo(event.getValue().endTime) >= 0
                        && eventDetails.startTime.compareTo(event.getValue().startTime) > 0)
                    continue;
                else
                    error = true;

        if (!error)
            if (eventsOfDay != null) {
                eventsOfDay.put(eventDetails.startTime, eventDetails);
            } else {
                eventsOfDay = new HashMap<LocalTime, EventDetials>();
                eventsOfDay.put(eventDetails.startTime, eventDetails);
                this.events.put(localDate, eventsOfDay);
            }
        else
            System.out.println("Can't create event, time conflict");

    }

    public Map<LocalTime, EventDetials> readEventsOfDay(Date date) {
        LocalDate localDate = this.dateToLocalDate(date);
        return this.events.get(localDate);
    }

    // public void updateEvent(Date date, EventDetials OldEventDetails, EventDetials
    // newEventDetails) {
    // LocalDate localDate = this.dateToLocalDate(date);
    // Map<LocalTime, EventDetials> eventsOfDay = this.events.get(localDate);
    // if (eventsOfDay != null) {
    // EventDetials eventDetails = eventsOfDay.get(OldEventDetails.startTime);
    // if (eventDetails != null) {
    // eventsOfDay.remove(OldEventDetails.startTime);
    // eventsOfDay.put(newEventDetails.startTime, newEventDetails);
    // this.events.put(localDate, eventsOfDay);
    // }
    // }
    // }

    public void deleteEvent(Date date, EventDetials eventDetails) {
        LocalDate localDate = this.dateToLocalDate(date);
        Map<LocalTime, EventDetials> eventsOfDay = this.events.get(localDate);
        eventsOfDay.remove(eventDetails.startTime);

        boolean noEvents = true;
        for (Map.Entry<LocalTime, EventDetials> event : eventsOfDay.entrySet())
            noEvents = false;
        if (noEvents)
            this.events.remove(localDate);
    }

    public void saveEvents() {
        FileHandling.serialize(Config.path.events, this.events);
    }

    public void loadEvents() {
        this.events = (Events) FileHandling.deserialize(Config.path.events);
    }

    public void setEvents(Events events) {
        this.events = events;
    }

    public Events getEvents() {
        return this.events;
    }

    protected LocalDate dateToLocalDate(Date date) {
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }
}
