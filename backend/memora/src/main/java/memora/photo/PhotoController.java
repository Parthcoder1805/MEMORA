
package memora.photo;

import memora.trip.Trip;
import memora.trip.TripRepository;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/photos")
@CrossOrigin(
    origins = "http://127.0.0.1:5500",
    allowCredentials = "true"
)
public class PhotoController {

    private final PhotoRepository photoRepository;
    private final TripRepository tripRepository;

    private final Path uploadDirectory =
            Paths.get("uploads", "photos").toAbsolutePath().normalize();

    public PhotoController(
            PhotoRepository photoRepository,
            TripRepository tripRepository) {

        this.photoRepository = photoRepository;
        this.tripRepository = tripRepository;
    }

    // UPLOAD PHOTOS
    @PostMapping("/upload/{tripId}")
    public ResponseEntity<?> uploadPhotos(
            @PathVariable Long tripId,
            @RequestParam("files") List<MultipartFile> files,
            HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Please log in first.");
        }

        Trip trip = tripRepository.findByIdAndUserId(tripId, userId)
                .orElse(null);

        if (trip == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Trip not found.");
        }

        if (files == null || files.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Please select photos.");
        }

        try {
            Files.createDirectories(uploadDirectory);

            for (MultipartFile file : files) {

                if (file.isEmpty()) {
                    continue;
                }

                if (file.getContentType() == null ||
                        !file.getContentType().startsWith("image/")) {
                    return ResponseEntity.badRequest()
                            .body("Only image files are allowed.");
                }

                String originalName = Paths.get(
                        file.getOriginalFilename() == null
                                ? "photo"
                                : file.getOriginalFilename()
                ).getFileName().toString();

                String storedName = UUID.randomUUID() + "_" + originalName;

                Path targetPath = uploadDirectory.resolve(storedName)
                        .normalize();

                if (!targetPath.startsWith(uploadDirectory)) {
                    return ResponseEntity.badRequest()
                            .body("Invalid file name.");
                }

                Files.copy(file.getInputStream(), targetPath);

                Photo photo = new Photo(
                        userId,
                        tripId,
                        originalName,
                        targetPath.toString()
                );

                photoRepository.save(photo);
            }

            return ResponseEntity.ok("Photos uploaded successfully!");

        } catch (IOException error) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Photo upload failed.");
        }
    }

    // GET PHOTOS OF A TRIP
    @GetMapping("/{tripId}")
    public ResponseEntity<?> getTripPhotos(
            @PathVariable Long tripId,
            HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Please log in first.");
        }

        Trip trip = tripRepository.findByIdAndUserId(tripId, userId)
                .orElse(null);

        if (trip == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Trip not found.");
        }

        List<Photo> photos =
                photoRepository.findByTripIdAndUserId(tripId, userId);

        return ResponseEntity.ok(photos);
    }

    // DELETE A PHOTO
    @DeleteMapping("/{photoId}")
    public ResponseEntity<?> deletePhoto(
            @PathVariable Long photoId,
            HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Please log in first.");
        }

        Photo photo = photoRepository.findByIdAndUserId(photoId, userId)
                .orElse(null);

        if (photo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Photo not found.");
        }

        try {
            Path photoPath = Paths.get(photo.getFilePath())
                    .toAbsolutePath().normalize();

            if (photoPath.startsWith(uploadDirectory)) {
                Files.deleteIfExists(photoPath);
            }

            photoRepository.delete(photo);

            return ResponseEntity.ok("Photo deleted successfully.");

        } catch (IOException error) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not delete photo.");
        }
    }

    // VIEW A PHOTO
    @GetMapping("/view/{photoId}")
    public ResponseEntity<?> viewPhoto(
            @PathVariable Long photoId,
            HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Please log in first.");
        }

        Photo photo = photoRepository.findByIdAndUserId(photoId, userId)
                .orElse(null);

        if (photo == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Photo not found.");
        }

        try {
            Path photoPath = Paths.get(photo.getFilePath())
                    .toAbsolutePath().normalize();

            if (!photoPath.startsWith(uploadDirectory)
                    || !Files.isRegularFile(photoPath)) {
                return ResponseEntity.notFound().build();
            }

            byte[] imageBytes = Files.readAllBytes(photoPath);

            String contentType = Files.probeContentType(photoPath);

            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().build();
            }

            return ResponseEntity.ok()
                    .header("Content-Type", contentType)
                    .header("X-Content-Type-Options", "nosniff")
                    .body(imageBytes);

        } catch (IOException error) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not load photo.");
        }
    }
}
