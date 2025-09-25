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
        // Simulación de análisis de imagen - aquí iría la integración con IA
        Map<String, Object> result = new HashMap<>();
        result.put("foodName", "Manzana");
        result.put("carbohydrates", 14.0);
        result.put("sugars", 10.4);
        result.put("portion", "100g");
        result.put("confidence", 0.85);
        
        return result;
    }

    public Food findByName(String name) {
        return foodRepository.findByNameContainingIgnoreCase(name);
    }
}
