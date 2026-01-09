package ma.xproce.pfehub.web.dto;

import lombok.Data;
import java.util.List;

@Data
public class DefenseProposalDTO {
    private Long projectId;
    private String proposedDate; // Format: YYYY-MM-DD
    private String proposedTime; // Format: HH:mm
    private String proposedRoom;
    private List<JuryMemberDTO> juryMembers;
    private String notes;
}
