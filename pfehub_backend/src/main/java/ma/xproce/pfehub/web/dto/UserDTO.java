package ma.xproce.pfehub.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String role;
    private Boolean isActive;
    
    // Département
    private Long departementId;
    private String departementNom;
    
    // Spécialité
    private Long specialiteId;
    private String specialiteNom;
    
    // Pour Etudiant
    private String numeroEtudiant;
    private String promotion;
    
    // Pour Encadrant
    private String expertise;
    private Integer maxProjectCapacity;
}
