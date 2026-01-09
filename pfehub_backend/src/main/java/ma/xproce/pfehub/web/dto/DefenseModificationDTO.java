package ma.xproce.pfehub.web.dto;

import lombok.Data;
import java.util.List;

@Data
public class DefenseModificationDTO {
    private Long defenseId;
    private String finalDate;
    private String finalTime;
    private String finalRoom;
    private String modificationReason;
    private List<JuryMemberDTO> juryMembers;
}
