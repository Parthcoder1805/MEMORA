package memora;

import memora.user.LoginRequest;
import memora.user.SignupRequest;
import memora.user.User;
import memora.user.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://127.0.0.1:5500", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // SIGNUP
    @PostMapping("/signup")
    public ResponseEntity<String> signup(
            @RequestBody SignupRequest request) {

        if (request.getName() == null
                || request.getName().isBlank()
                || request.getEmail() == null
                || request.getEmail().isBlank()
                || request.getPassword() == null
                || request.getPassword().length() < 8) {

            return ResponseEntity.badRequest()
                    .body("Enter a name, email, and password of at least 8 characters.");
        }

        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("An account with this email already exists.");
        }

        User user = new User(
                request.getName().trim(),
                email,
                passwordEncoder.encode(request.getPassword())
        );

        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("MEMORA account created successfully!");
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {

        if (request.getEmail() == null
                || request.getEmail().isBlank()
                || request.getPassword() == null
                || request.getPassword().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Email and password are required.");
        }

        String email = request.getEmail().trim().toLowerCase();

        Optional<User> optionalUser =
                userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password.");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(
                request.getPassword(), user.getPassword())) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password.");
        }

        // Prevent session fixation by replacing any existing session.
        HttpSession oldSession = httpRequest.getSession(false);

        if (oldSession != null) {
            oldSession.invalidate();
        }

        HttpSession session = httpRequest.getSession(true);

        // Never store the password or password hash in the session.
        session.setAttribute("userId", user.getId());

        return ResponseEntity.ok(Map.of(
                "message", "Login successful!",
                "name", user.getName()
        ));
    }

    // CHECK CURRENT LOGIN
    @GetMapping("/me")
    public ResponseEntity<?> currentUser(HttpSession session) {

        Object userId = session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("You are not logged in.");
        }

        Optional<User> optionalUser =
                userRepository.findById((Long) userId);

        if (optionalUser.isEmpty()) {
            session.invalidate();

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("User account not found.");
        }

        User user = optionalUser.get();

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail()
        ));
    }

    // LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {

        session.invalidate();

        return ResponseEntity.ok("Logged out successfully.");
    }
}