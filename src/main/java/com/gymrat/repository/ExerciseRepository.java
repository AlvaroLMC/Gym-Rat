package com.gymrat.repository;

import com.gymrat.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    List<Exercise> findByCategory(String category);

    List<Exercise> findByDifficulty(String difficulty);

    boolean existsByNameIgnoreCase(String name);
}
