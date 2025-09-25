package com.carbocheck.model;

import jakarta.persistence.*;

@Entity
@Table(name = "foods")
public class Food {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double carbohydrates; // por 100g
    private Double sugars; // por 100g
    private Double glycemicIndex;

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getCarbohydrates() { return carbohydrates; }
    public void setCarbohydrates(Double carbohydrates) { this.carbohydrates = carbohydrates; }

    public Double getSugars() { return sugars; }
    public void setSugars(Double sugars) { this.sugars = sugars; }

    public Double getGlycemicIndex() { return glycemicIndex; }
    public void setGlycemicIndex(Double glycemicIndex) { this.glycemicIndex = glycemicIndex; }
}
