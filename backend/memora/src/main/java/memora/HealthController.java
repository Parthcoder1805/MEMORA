package memora;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.CrossOrigin;
@CrossOrigin(origins = "*")
@RestController
public class HealthController {

    @GetMapping("/api/health")
    public String healthCheck() {
        return "MEMORA backend is running successfully!";
    }
}