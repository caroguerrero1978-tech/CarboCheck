package com.carbocheck.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class NutritionAnalysisService {

    private final Map<String, FoodData> nutritionDatabase;
    
    public NutritionAnalysisService() {
        this.nutritionDatabase = loadNutritionDatabase();
    }

    public Map<String, Object> analyzeFood(MultipartFile image) {
        // Simular reconocimiento de imagen - aquí iría integración con Google Vision API
        String detectedFood = simulateImageRecognition(image);
        
        FoodData foodData = nutritionDatabase.get(detectedFood.toLowerCase());
        if (foodData == null) {
            foodData = nutritionDatabase.get("manzana"); // Default fallback
        }

        Map<String, Object> result = new HashMap<>();
        result.put("foodName", foodData.name);
        result.put("carbohydrates", foodData.carbohydrates);
        result.put("sugars", foodData.sugars);
        result.put("glycemicIndex", foodData.glycemicIndex);
        result.put("fiber", foodData.fiber);
        result.put("calories", foodData.calories);
        result.put("protein", foodData.protein);
        result.put("fat", foodData.fat);
        result.put("portion", "100g");
        result.put("confidence", 0.92);
        result.put("source", "USDA + International GI Database");
        
        return result;
    }

    private String simulateImageRecognition(MultipartFile image) {
        // Simulación - en producción usaría Google Vision API o similar
        String[] commonFoods = {"manzana", "banana", "pan", "arroz", "pasta", "papa", "naranja"};
        return commonFoods[(int) (Math.random() * commonFoods.length)];
    }

    private Map<String, FoodData> loadNutritionDatabase() {
        Map<String, FoodData> db = new HashMap<>();
        
        // Datos basados en USDA Food Database y International GI Database
        db.put("manzana", new FoodData("Manzana", 14.0, 10.4, 36, 2.4, 52, 0.3, 0.2));
        db.put("banana", new FoodData("Banana", 23.0, 12.2, 51, 2.6, 89, 1.1, 0.3));
        db.put("pan", new FoodData("Pan Blanco", 49.0, 5.0, 75, 2.7, 265, 9.0, 3.2));
        db.put("arroz", new FoodData("Arroz Blanco", 28.0, 0.1, 73, 0.4, 130, 2.7, 0.3));
        db.put("pasta", new FoodData("Pasta", 25.0, 0.6, 49, 1.8, 131, 5.0, 1.1));
        db.put("papa", new FoodData("Papa", 17.0, 0.8, 78, 2.2, 77, 2.0, 0.1));
        db.put("naranja", new FoodData("Naranja", 12.0, 9.4, 45, 2.4, 47, 0.9, 0.1));
        db.put("avena", new FoodData("Avena", 66.0, 0.9, 55, 10.6, 389, 16.9, 6.9));
        db.put("quinoa", new FoodData("Quinoa", 64.0, 4.6, 53, 7.0, 368, 14.1, 6.1));
        db.put("batata", new FoodData("Batata", 20.0, 4.2, 70, 3.0, 86, 1.6, 0.1));
        
        return db;
    }

    private static class FoodData {
        String name;
        double carbohydrates;
        double sugars;
        int glycemicIndex;
        double fiber;
        int calories;
        double protein;
        double fat;

        FoodData(String name, double carbs, double sugars, int gi, double fiber, int calories, double protein, double fat) {
            this.name = name;
            this.carbohydrates = carbs;
            this.sugars = sugars;
            this.glycemicIndex = gi;
            this.fiber = fiber;
            this.calories = calories;
            this.protein = protein;
            this.fat = fat;
        }
    }
}
