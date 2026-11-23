-- db/schema.sql — base de datos de ms-docentes
SET NAMES utf8mb4;

CREATE TABLE docentes (
  id                   INT AUTO_INCREMENT PRIMARY KEY,
  nombre_completo      VARCHAR(100) NOT NULL,
  email                VARCHAR(120) NOT NULL,
  activo               BOOLEAN NOT NULL
);

INSERT INTO docentes (nombre_completo, email, activo) VALUES
  ('Marta Lucía Gil', 'mgil@uni.edu.co', TRUE),
  ('Jorge Andrés Rey', 'jrey@uni.edu.co', TRUE),
  ('Paula Viveros', 'pviveros@uni.edu.co', FALSE),
  ('Hernán Cárdenas', 'hcardenas@uni.edu.co', TRUE);
