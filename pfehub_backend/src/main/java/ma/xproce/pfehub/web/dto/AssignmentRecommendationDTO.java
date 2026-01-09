package ma.xproce.pfehub.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentRecommendationDTO {
    private Long projectId;
    private Long professorId;
    private String professorName;
    private String professorEmail;
    private int matchPercentage;
    private int currentWorkload;
    private int maxCapacity;
    private List<String> expertise;
    private String reason;
}
