-- Crear base de datos CarboCheck
CREATE DATABASE carbocheck;

-- Crear usuario para la aplicación
CREATE USER carbocheck_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE carbocheck TO carbocheck_user;

-- Conectar a la base de datos carbocheck
\c carbocheck;

-- Tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    diabetes_type VARCHAR(10) CHECK (diabetes_type IN ('TYPE_1', 'TYPE_2')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de alimentos
CREATE TABLE foods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    carbohydrates DECIMAL(5,2), -- por 100g
    sugars DECIMAL(5,2), -- por 100g
    glycemic_index DECIMAL(4,1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de registros de comidas
CREATE TABLE meal_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    food_id INTEGER REFERENCES foods(id),
    portion_size DECIMAL(6,2), -- en gramos
    carbs_consumed DECIMAL(6,2),
    sugars_consumed DECIMAL(6,2),
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar algunos alimentos básicos
INSERT INTO foods (name, carbohydrates, sugars, glycemic_index) VALUES
('Manzana', 14.0, 10.4, 36.0),
('Pan blanco', 49.0, 5.0, 75.0),
('Arroz blanco', 28.0, 0.1, 73.0),
('Banana', 23.0, 12.2, 51.0),
('Pasta', 25.0, 0.6, 49.0);

-- Otorgar permisos al usuario
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO carbocheck_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO carbocheck_user;
