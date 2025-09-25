package com.carbocheck.controller;

import com.carbocheck.model.Food;
import com.carbocheck.service.FoodService;
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

    @PostMapping("/scan")
    public ResponseEntity<Map<String, Object>> scanFood(@RequestParam("image") MultipartFile image) {
        try {
            Map<String, Object> result = foodService.analyzeFood(image);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error al procesar la imagen"));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Food> searchFood(@RequestParam String name) {
        Food food = foodService.findByName(name);
        return food != null ? ResponseEntity.ok(food) : ResponseEntity.notFound().build();
    }
}
