package com.carbocheck.service;

import com.carbocheck.model.Food;
import com.carbocheck.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@Service
public class FoodService {

    @Autowired
    private FoodRepository foodRepository;

    public Map<String, Object> analyzeFood(MultipartFile image) {
        String detectedFood = simulateRecognition();
        return getNutritionData(detectedFood);
    }

    private String simulateRecognition() {
        String[] foods = {"banana", "manzana", "pan", "arroz", "pasta", "papa"};
        return foods[(int) (Math.random() * foods.length)];
    }

    private Map<String, Object> getNutritionData(String foodName) {
        Map<String, Object> result = new HashMap<>();
        
        switch (foodName.toLowerCase()) {
            case "banana":
                result.put("foodName", "Banana");
                result.put("carbohydrates", 23.0);
                result.put("sugars", 12.2);
                result.put("calories", 89);
                result.put("glycemicIndex", 51);
                break;
            case "manzana":
                result.put("foodName", "Manzana");
                result.put("carbohydrates", 14.0);
                result.put("sugars", 10.4);
                result.put("calories", 52);
                result.put("glycemicIndex", 36);
                break;
            default:
                result.put("foodName", "Banana");
                result.put("carbohydrates", 23.0);
                result.put("sugars", 12.2);
                result.put("calories", 89);
                result.put("glycemicIndex", 51);
        }
        
        result.put("portion", "100g");
        result.put("confidence", 0.92);
        result.put("source", "USDA + International GI Database");
        
        return result;
    }

    public Food findByName(String name) {
        return foodRepository.findByNameContainingIgnoreCase(name);
    }
}
