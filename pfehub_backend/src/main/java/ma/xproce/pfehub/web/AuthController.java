package ma.xproce.pfehub.web;

import lombok.RequiredArgsConstructor;
import ma.xproce.pfehub.dao.entities.*;
import ma.xproce.pfehub.service.IUserService;
import ma.xproce.pfehub.web.dto.LoginRequest;
import ma.xproce.pfehub.web.dto.LoginResponse;
import ma.xproce.pfehub.web.dto.UserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"}, allowCredentials = "true")
public class AuthController {

    private final IUserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Optional<AppUser> userOpt = userService.authenticate(request.getEmail(), request.getPassword());
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of(
                    "error", "Identifiants incorrects",
                    "message", "Email ou mot de passe invalide"
                ));
            }

            AppUser user = userOpt.get();
            UserDTO userDTO = mapToDTO(user);
            
            // Pour l'instant, pas de JWT - juste retourner l'utilisateur
            LoginResponse response = LoginResponse.builder()
                    .user(userDTO)
                    .token("demo-token-" + user.getId()) // Token temporaire pour démo
                    .message("Connexion réussie")
                    .build();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of(
                "error", "Échec de l'authentification",
                "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "Déconnexion réussie"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        // Simplified - in production, decode JWT token
        if (authHeader == null || !authHeader.startsWith("Bearer demo-token-")) {
            return ResponseEntity.status(401).body(Map.of("error", "Non authentifié"));
        }
        
        try {
            String tokenPart = authHeader.replace("Bearer demo-token-", "");
            Long userId = Long.parseLong(tokenPart);
            Optional<AppUser> userOpt = userService.getUserById(userId);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of("error", "Utilisateur non trouvé"));
            }
            
            return ResponseEntity.ok(mapToDTO(userOpt.get()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Token invalide"));
        }
    }

    private UserDTO mapToDTO(AppUser user) {
        UserDTO.UserDTOBuilder builder = UserDTO.builder()
                .id(user.getId())
                .nom(user.getLastName())
                .prenom(user.getFirstName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .isActive(user.getIsActive());

        if (user.getDepartement() != null) {
            builder.departementId(user.getDepartement().getId())
                   .departementNom(user.getDepartement().getName());
        }

        if (user.getSpecialite() != null) {
            builder.specialiteId(user.getSpecialite().getId())
                   .specialiteNom(user.getSpecialite().getName());
        }

        // Informations spécifiques selon le type
        if (user instanceof Etudiant) {
            Etudiant etudiant = (Etudiant) user;
            builder.numeroEtudiant(etudiant.getNumeroEtudiant())
                   .promotion(etudiant.getPromotion());
        } else if (user instanceof Encadrant) {
            Encadrant encadrant = (Encadrant) user;
            builder.expertise(encadrant.getExpertise())
                   .maxProjectCapacity(encadrant.getMaxProjectCapacity());
        }

        return builder.build();
    }
}
