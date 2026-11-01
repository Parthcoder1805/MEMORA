package memora.photo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PhotoRepository extends JpaRepository<Photo, Long> {

    List<Photo> findByTripIdAndUserId(Long tripId, Long userId);

    Optional<Photo> findByIdAndUserId(Long id, Long userId);
}