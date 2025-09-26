package com.carbocheck.controller;

import com.carbocheck.model.Food;
import com.carbocheck.service.FoodService;
import com.carbocheck.service.NutritionAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/food")
@CrossOrigin(origins = "*")
public class FoodController {

    @Autowired
    private FoodService foodService;
    
    @Autowired
    private NutritionAnalysisService nutritionAnalysisService;

    @PostMapping("/scan")
    public ResponseEntity<Map<String, Object>> scanFood(@RequestParam("image") MultipartFile image) {
        try {
            Map<String, Object> result = nutritionAnalysisService.analyzeFood(image);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error al procesar la imagen", "details", e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Food> searchFood(@RequestParam String name) {
        Food food = foodService.findByName(name);
        return food != null ? ResponseEntity.ok(food) : ResponseEntity.notFound().build();
    }
    
    @GetMapping("/nutrition/{foodName}")
    public ResponseEntity<Map<String, Object>> getNutritionInfo(@PathVariable String foodName) {
        try {
            // Simular búsqueda por nombre
            Map<String, Object> result = nutritionAnalysisService.analyzeFood(null);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Alimento no encontrado"));
        }
    }
}
