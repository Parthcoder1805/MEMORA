package memora.trip;

public class TripRequest {

    private String title;
    private String destination;
    private String description;

    public TripRequest() {
    }

    public String getTitle() {
        return title;
    }

    public String getDestination() {
        return destination;
    }

    public String getDescription() {
        return description;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}