package ma.xproce.pfehub.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.xproce.pfehub.dao.entities.PFEStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectStatusCountDTO {
    private PFEStatus status;
    private long count;
}
