package com.gymrat.repository;

import com.gymrat.model.Role;
import com.gymrat.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsernameIgnoreCase(String username);

    boolean existsByRole(Role role);
    boolean existsByUsernameIgnoreCase(String username);

}

