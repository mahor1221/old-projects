package app;

import java.time.LocalTime;
import java.util.GregorianCalendar;

// import com.formdev.flatlaf.intellijthemes.materialthemeuilite.FlatMaterialDeepOceanIJTheme;

import modules.controllers.CalendarController;
import modules.models.EventDetials;
import modules.views.CalendarView;

public class App {
    public static void main(String[] args) {
        // FlatMaterialDeepOceanIJTheme.install();

        CalendarView view = new CalendarView();
        GregorianCalendar model = new GregorianCalendar();
        CalendarController ctrlr = new CalendarController(view, model);
        ctrlr.loadEvents();
        ctrlr.createView();

        ctrlr.printEvents();
        // eventDetails.startTime.compareTo(eventDetails.endTime)
    }
}