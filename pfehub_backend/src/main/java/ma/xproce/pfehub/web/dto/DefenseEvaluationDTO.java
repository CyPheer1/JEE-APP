package ma.xproce.pfehub.web.dto;

import lombok.Data;

@Data
public class DefenseEvaluationDTO {
    private Long defenseId;
    private Double presentationQuality;
    private Double subjectMastery;
    private Double questionAnswers;
    private Double timeRespect;
    private Double finalGrade;
    private String comments;
    private String strengths;
    private String improvements;
}
