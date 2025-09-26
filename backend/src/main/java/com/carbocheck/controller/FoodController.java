package com.carbocheck.controller;

import com.carbocheck.model.Food;
import com.carbocheck.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/food")
@CrossOrigin(origins = "*")
public class FoodController {

    @Autowired
    private FoodService foodService;

    @PostMapping("/scan")
    public ResponseEntity<Map<String, Object>> scanFood(@RequestParam("image") MultipartFile image) {
        try {
            Map<String, Object> result = foodService.analyzeFood(image);
            
            // Garantizar que siempre se devuelvan los 4 datos esenciales
            Map<String, Object> response = new HashMap<>();
            response.put("foodName", result.get("foodName"));
            response.put("carbohydrates", result.get("carbohydrates"));
            response.put("sugars", result.get("sugars"));
            response.put("calories", result.get("calories"));
            response.put("glycemicIndex", result.get("glycemicIndex"));
            response.put("glycemicClassification", getGlycemicClassification((Integer) result.get("glycemicIndex")));
            response.put("portion", "100g");
            response.put("confidence", result.get("confidence"));
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error al procesar la imagen");
            error.put("details", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    private Map<String, Object> getGlycemicClassification(Integer gi) {
        Map<String, Object> classification = new HashMap<>();
        
        if (gi <= 55) {
            classification.put("level", "Bajo");
            classification.put("color", "green");
            classification.put("emoji", "🟢");
            classification.put("recommendation", "Ideal para diabéticos");
        } else if (gi <= 70) {
            classification.put("level", "Medio");
            classification.put("color", "yellow");
            classification.put("emoji", "🟡");
            classification.put("recommendation", "Consumo moderado");
        } else {
            classification.put("level", "Alto");
            classification.put("color", "red");
            classification.put("emoji", "🔴");
            classification.put("recommendation", "Precaución");
        }
        
        return classification;
    }

    @GetMapping("/search")
    public ResponseEntity<Food> searchFood(@RequestParam String name) {
        Food food = foodService.findByName(name);
        return food != null ? ResponseEntity.ok(food) : ResponseEntity.notFound().build();
    }
}
