package ma.xproce.pfehub.web.dto;

import lombok.Data;
import ma.xproce.pfehub.dao.entities.LivrableType;

@Data
public class DeliverableSubmissionDTO {
    private Long projectId;
    private String title;
    private String description;
    private LivrableType type;
    private String notes;
}
