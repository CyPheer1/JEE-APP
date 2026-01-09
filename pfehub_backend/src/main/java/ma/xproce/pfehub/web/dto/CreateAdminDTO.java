package ma.xproce.pfehub.web.dto;

import lombok.Data;

@Data
public class CreateAdminDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String permissions;
}
