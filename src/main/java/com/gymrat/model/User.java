package com.gymrat.model;

import com.gymrat.exception.ResourceNotFoundException;
import jakarta.persistence.*;
import java.util.Objects;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(unique = true)
    private String username;
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    private int strength = 0;
    private int endurance = 0;
    private int flexibility = 0;
    private boolean accessoryPurchased = false;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TrainingSession> sessions = new ArrayList<>();

    public User() {}
    public User(String name, String username, String password) {
        this.name = name; this.username = username; this.password = password;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getStrength() { return strength; }
    public void setStrength(int strength) { this.strength = strength; }
    public int getEndurance() { return endurance; }
    public void setEndurance(int endurance) { this.endurance = endurance; }
    public int getFlexibility() { return flexibility; }
    public void setFlexibility(int flexibility) { this.flexibility = flexibility; }
    public boolean isAccessoryPurchased() { return accessoryPurchased; }
    public void setAccessoryPurchased(boolean accessoryPurchased) { this.accessoryPurchased = accessoryPurchased; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public List<TrainingSession> getSessions() { return sessions; }
    public void setSessions(List<TrainingSession> sessions) { this.sessions = sessions; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return Objects.equals(getId(), user.getId());
    }

    @Override
    public int hashCode() { return Objects.hash(getId()); }

    public static User validateExists(User user, Long id) {
        if (user == null) throw new ResourceNotFoundException("User not found with id " + id);
        return user;
    }
}
