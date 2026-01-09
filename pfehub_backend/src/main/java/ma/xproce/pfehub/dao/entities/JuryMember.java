package ma.xproce.pfehub.dao.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "jury_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JuryMember {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column
    private String email;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JuryRole role;
    
    @ManyToOne
    @JoinColumn(name = "professor_id")
    private Encadrant professor;
    
    @ManyToOne
    @JoinColumn(name = "soutenance_id", nullable = false)
    private Soutenance soutenance;
}
