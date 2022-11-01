package modules.models;

import java.io.Serializable;
import java.time.LocalTime;

public class EventDetials implements Serializable {
    private static final long serialVersionUID = -4866690258179481162L;
    public LocalTime startTime;
    public LocalTime endTime;
    public String description;
}
