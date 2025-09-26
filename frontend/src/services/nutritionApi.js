// Integración con APIs nutricionales externas para datos precisos

const NUTRITION_APIS = {
  USDA: 'https://api.nal.usda.gov/fdc/v1/',
  EDAMAM: 'https://api.edamam.com/api/nutrition-data',
  SPOONACULAR: 'https://api.spoonacular.com/food/'
};

export class NutritionApiService {
  
  constructor() {
    this.usdaApiKey = process.env.REACT_APP_USDA_API_KEY;
    this.edamamApiKey = process.env.REACT_APP_EDAMAM_API_KEY;
    this.spoonacularApiKey = process.env.REACT_APP_SPOONACULAR_API_KEY;
  }

  async searchFoodUSDA(foodName) {
    try {
      const response = await fetch(
        `${NUTRITION_APIS.USDA}foods/search?query=${encodeURIComponent(foodName)}&api_key=${this.usdaApiKey}`
      );
      const data = await response.json();
      
      if (data.foods && data.foods.length > 0) {
        return this.parseUSDAFood(data.foods[0]);
      }
      return null;
    } catch (error) {
      console.error('Error fetching USDA data:', error);
      return null;
    }
  }

  async getNutritionEdamam(foodText) {
    try {
      const response = await fetch(
        `${NUTRITION_APIS.EDAMAM}?app_id=${this.edamamApiKey}&app_key=${this.edamamApiKey}&ingr=${encodeURIComponent(foodText)}`
      );
      const data = await response.json();
      
      return this.parseEdamamNutrition(data);
    } catch (error) {
      console.error('Error fetching Edamam data:', error);
      return null;
    }
  }

  parseUSDAFood(food) {
    const nutrients = {};
    
    food.foodNutrients?.forEach(nutrient => {
      switch(nutrient.nutrientId) {
        case 1005: // Carbohydrates
          nutrients.carbohydrates = nutrient.value;
          break;
        case 2000: // Sugars
          nutrients.sugars = nutrient.value;
          break;
        case 1079: // Fiber
          nutrients.fiber = nutrient.value;
          break;
        case 1008: // Energy (calories)
          nutrients.calories = nutrient.value;
          break;
        case 1003: // Protein
          nutrients.protein = nutrient.value;
          break;
        case 1004: // Fat
          nutrients.fat = nutrient.value;
          break;
      }
    });

    return {
      name: food.description,
      ...nutrients,
      source: 'USDA Food Database'
    };
  }

  parseEdamamNutrition(data) {
    if (!data.totalNutrients) return null;

    return {
      calories: data.calories,
      carbohydrates: data.totalNutrients.CHOCDF?.quantity || 0,
      sugars: data.totalNutrients.SUGAR?.quantity || 0,
      fiber: data.totalNutrients.FIBTG?.quantity || 0,
      protein: data.totalNutrients.PROCNT?.quantity || 0,
      fat: data.totalNutrients.FAT?.quantity || 0,
      source: 'Edamam Nutrition API'
    };
  }

  // Base de datos local de índices glucémicos
  getGlycemicIndex(foodName) {
    const glycemicDatabase = {
      'manzana': 36,
      'banana': 51,
      'pan blanco': 75,
      'pan integral': 51,
      'arroz blanco': 73,
      'arroz integral': 68,
      'avena': 55,
      'pasta': 49,
      'papa': 78,
      'batata': 70,
      'lentejas': 32,
      'garbanzos': 28,
      'quinoa': 53,
      'naranja': 45,
      'uva': 46,
      'fresa': 40,
      'zanahoria': 47,
      'brócoli': 10,
      'coca cola': 63,
      'jugo de naranja': 50
    };

    return glycemicDatabase[foodName.toLowerCase()] || null;
  }

  async getCompleteNutritionData(foodName) {
    // Intentar múltiples fuentes para datos más precisos
    let nutritionData = await this.searchFoodUSDA(foodName);
    
    if (!nutritionData) {
      nutritionData = await this.getNutritionEdamam(`100g ${foodName}`);
    }

    if (nutritionData) {
      // Agregar índice glucémico de base local
      nutritionData.glycemicIndex = this.getGlycemicIndex(foodName);
      nutritionData.portion = '100g';
    }

    return nutritionData;
  }
}
