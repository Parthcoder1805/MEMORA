
package memora.trip;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(
    origins = "http://127.0.0.1:5500",
    allowCredentials = "true"
)
public class TripController {

    private final TripRepository tripRepository;

    public TripController(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    // CREATE TRIP
    @PostMapping
    public ResponseEntity<?> createTrip(
            @RequestBody TripRequest request,
            HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Please log in first.");
        }

        if (request.getTitle() == null || request.getTitle().isBlank()
                || request.getDestination() == null
                || request.getDestination().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Trip title and destination are required.");
        }

        Trip trip = new Trip(
                userId,
                request.getTitle().trim(),
                request.getDestination().trim(),
                request.getDescription()
        );

        Trip savedTrip = tripRepository.save(trip);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedTrip);
    }

    // GET ALL MY TRIPS
    @GetMapping
    public ResponseEntity<?> getMyTrips(HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Please log in first.");
        }

        List<Trip> trips = tripRepository.findByUserId(userId);

        return ResponseEntity.ok(trips);
    }

    // EDIT TRIP
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTrip(
            @PathVariable Long id,
            @RequestBody TripRequest request,
            HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Please log in first.");
        }

        if (request.getTitle() == null || request.getTitle().isBlank()
                || request.getDestination() == null
                || request.getDestination().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Trip title and destination are required.");
        }

        Trip trip = tripRepository.findByIdAndUserId(id, userId)
                .orElse(null);

        if (trip == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Trip not found.");
        }

        trip.setTitle(request.getTitle().trim());
        trip.setDestination(request.getDestination().trim());
        trip.setDescription(request.getDescription());

        Trip updatedTrip = tripRepository.save(trip);

        return ResponseEntity.ok(updatedTrip);
    }

    // DELETE TRIP
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(
            @PathVariable Long id,
            HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Please log in first.");
        }

        Trip trip = tripRepository.findByIdAndUserId(id, userId)
                .orElse(null);

        if (trip == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Trip not found.");
        }

        tripRepository.delete(trip);

        return ResponseEntity.ok("Trip deleted successfully.");
    }
}
