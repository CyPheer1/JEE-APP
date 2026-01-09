package ma.xproce.pfehub.web.dto;

import lombok.Data;
import ma.xproce.pfehub.dao.entities.JuryRole;

@Data
public class JuryMemberDTO {
    private Long id;
    private String name;
    private String email;
    private JuryRole role;
    private Long professorId;
}
