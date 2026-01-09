package ma.xproce.pfehub.web.dto;

import lombok.Data;
import java.util.List;

@Data
public class DefenseValidationDTO {
    private Long defenseId;
    private String finalDate;
    private String finalTime;
    private String finalRoom;
    private List<JuryMemberDTO> juryMembers;
    private String notes;
}
