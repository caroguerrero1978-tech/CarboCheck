package com.carbocheck.repository;

import com.carbocheck.model.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    Food findByNameContainingIgnoreCase(String name);
}
