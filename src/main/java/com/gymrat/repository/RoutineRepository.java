package com.gymrat.repository;

import com.gymrat.model.Routine;
import com.gymrat.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoutineRepository extends JpaRepository<Routine, Long> {

    List<Routine> findByUser(User user);

    List<Routine> findByUserId(Long userId);

    Optional<Routine> findByIdAndUserId(Long id, Long userId);
}
