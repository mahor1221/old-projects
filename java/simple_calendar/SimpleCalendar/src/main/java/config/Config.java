package config;

public class Config {

    public static class path {
        public static String events = "data/events.txt";
    }

    public static class frame {
        public static int width = 650;
        public static int height = 450;
    }

    public static String monthToString(int monthNumber) {
        String monthString = "Error";

        switch (monthNumber) {
            case 0:
                monthString = "January";
                break;
            case 1:
                monthString = "February";
                break;
            case 2:
                monthString = "March";
                break;
            case 3:
                monthString = "Abril";
                break;
            case 4:
                monthString = "May";
                break;
            case 5:
                monthString = "June";
                break;
            case 6:
                monthString = "July";
                break;
            case 7:
                monthString = "August";
                break;
            case 8:
                monthString = "September";
                break;
            case 9:
                monthString = "October";
                break;
            case 10:
                monthString = "November";
                break;
            case 11:
                monthString = "December";
                break;
        }

        return monthString;
    }

    public static String weekToString(int weekNumber) {
        String weekString = "Error";
        weekNumber--;
        switch (weekNumber) {
            case 0:
                weekString = "Sunday";
                break;
            case 1:
                weekString = "Monday";
                break;
            case 2:
                weekString = "Tuesday";
                break;
            case 3:
                weekString = "Wednesday";
                break;
            case 4:
                weekString = "Thursday";
                break;
            case 5:
                weekString = "Friday";
                break;
            case 6:
                weekString = "Saturday";
                break;
        }

        return weekString;
    }
}
