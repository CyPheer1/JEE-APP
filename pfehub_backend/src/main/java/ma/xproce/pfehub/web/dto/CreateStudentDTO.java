package ma.xproce.pfehub.web.dto;

import lombok.Data;

@Data
public class CreateStudentDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String numeroEtudiant;
    private String promotion;
    private Long departementId;
    private Long specialiteId;
}
