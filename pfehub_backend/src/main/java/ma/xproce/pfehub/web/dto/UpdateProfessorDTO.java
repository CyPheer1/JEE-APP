package ma.xproce.pfehub.web.dto;

import lombok.Data;

@Data
public class UpdateProfessorDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String expertise;
    private Integer maxProjectCapacity;
    private Long departementId;
    private Long specialiteId;
}
