package ma.xproce.pfehub.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.xproce.pfehub.dao.entities.UserRole;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private UserRole role;
    private String department;
    private String specialization;
    private String token;
}
