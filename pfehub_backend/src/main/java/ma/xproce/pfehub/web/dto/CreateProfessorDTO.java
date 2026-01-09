package ma.xproce.pfehub.web.dto;

import lombok.Data;

@Data
public class CreateProfessorDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String expertise;
    private Integer maxProjectCapacity;
    private Long departementId;
    private Long specialiteId;
}
