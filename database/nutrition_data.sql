-- Base de datos nutricional precisa basada en USDA Food Database y International GI Database
-- Todos los valores por 100g

INSERT INTO foods (name, carbohydrates, sugars, glycemic_index, fiber, calories, protein, fat) VALUES
-- Frutas
('Manzana', 14.0, 10.4, 36, 2.4, 52, 0.3, 0.2),
('Banana', 23.0, 12.2, 51, 2.6, 89, 1.1, 0.3),
('Naranja', 12.0, 9.4, 45, 2.4, 47, 0.9, 0.1),
('Uva', 16.0, 15.5, 46, 0.9, 62, 0.6, 0.2),
('Fresa', 8.0, 4.9, 40, 2.0, 32, 0.7, 0.3),
('Pera', 15.0, 9.8, 33, 3.1, 57, 0.4, 0.1),
('Durazno', 10.0, 8.4, 35, 1.5, 39, 0.9, 0.3),

-- Cereales y granos
('Pan Blanco', 49.0, 5.0, 75, 2.7, 265, 9.0, 3.2),
('Pan Integral', 41.0, 6.0, 51, 7.4, 247, 13.0, 4.2),
('Arroz Blanco', 28.0, 0.1, 73, 0.4, 130, 2.7, 0.3),
('Arroz Integral', 23.0, 0.4, 68, 1.8, 111, 2.6, 0.9),
('Avena', 66.0, 0.9, 55, 10.6, 389, 16.9, 6.9),
('Quinoa', 64.0, 4.6, 53, 7.0, 368, 14.1, 6.1),
('Pasta', 25.0, 0.6, 49, 1.8, 131, 5.0, 1.1),

-- Tubérculos
('Papa', 17.0, 0.8, 78, 2.2, 77, 2.0, 0.1),
('Batata', 20.0, 4.2, 70, 3.0, 86, 1.6, 0.1),
('Yuca', 38.0, 1.7, 46, 1.8, 160, 1.4, 0.3),

-- Legumbres
('Lentejas', 20.0, 1.8, 32, 7.9, 116, 9.0, 0.4),
('Garbanzos', 27.0, 4.8, 28, 8.0, 164, 8.9, 2.6),
('Frijoles Negros', 23.0, 0.3, 30, 8.7, 132, 8.9, 0.5),

-- Lácteos
('Leche Entera', 4.8, 4.8, 39, 0.0, 61, 3.2, 3.3),
('Yogur Natural', 4.7, 4.7, 36, 0.0, 61, 10.2, 0.4),
('Queso Cheddar', 1.3, 0.5, 0, 0.0, 403, 25.0, 33.0),

-- Verduras
('Brócoli', 7.0, 1.5, 10, 2.6, 34, 2.8, 0.4),
('Zanahoria', 10.0, 4.7, 47, 2.8, 41, 0.9, 0.2),
('Espinaca', 3.6, 0.4, 15, 2.2, 23, 2.9, 0.4),
('Tomate', 3.9, 2.6, 10, 1.2, 18, 0.9, 0.2),

-- Frutos secos
('Almendras', 22.0, 4.4, 0, 12.5, 579, 21.0, 49.9),
('Nueces', 14.0, 2.6, 0, 6.7, 654, 15.2, 65.2),

-- Bebidas
('Coca Cola', 10.6, 10.6, 63, 0.0, 42, 0.0, 0.0),
('Jugo de Naranja', 10.4, 8.1, 50, 0.2, 45, 0.7, 0.2);

-- Actualizar tabla para incluir nuevos campos
ALTER TABLE foods ADD COLUMN IF NOT EXISTS fiber DECIMAL(5,2);
ALTER TABLE foods ADD COLUMN IF NOT EXISTS calories INTEGER;
ALTER TABLE foods ADD COLUMN IF NOT EXISTS protein DECIMAL(5,2);
ALTER TABLE foods ADD COLUMN IF NOT EXISTS fat DECIMAL(5,2);
ALTER TABLE foods ADD COLUMN IF NOT EXISTS source VARCHAR(100) DEFAULT 'USDA + International GI Database';
