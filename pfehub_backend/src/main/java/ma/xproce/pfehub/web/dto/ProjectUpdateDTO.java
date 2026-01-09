package ma.xproce.pfehub.web.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProjectUpdateDTO {
    private String title;
    private String description;
    private String objectives;
    private String context;
    private String methodology;
    private String expectedResults;
    private List<String> keywords;
}
