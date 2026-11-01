
package memora.trip;

import jakarta.persistence.*;

@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String destination;

    @Column(length = 1000)
    private String description;

    public Trip() {
    }

    public Trip(Long userId, String title, String destination, String description) {
        this.userId = userId;
        this.title = title;
        this.destination = destination;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
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

    // Setters for editing trips

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
