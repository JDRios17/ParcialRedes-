CREATE DATABASE IF NOT EXISTS cursos_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cursos_db;

DROP TABLE IF EXISTS cursos;

CREATE TABLE cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  nombre VARCHAR(120) NOT NULL,
  creditos INT NOT NULL,
  cupo INT NOT NULL,
  semestre VARCHAR(6) NOT NULL,
  docente_id INT NOT NULL,
  CONSTRAINT chk_creditos CHECK (creditos BETWEEN 1 AND 6),
  CONSTRAINT chk_cupo CHECK (cupo > 0),
  CONSTRAINT chk_semestre CHECK (semestre REGEXP '^[0-9]{4}-(1|2)$'),
  CONSTRAINT chk_docente_id CHECK (docente_id > 0)
);

INSERT INTO cursos (codigo, nombre, creditos, cupo, semestre, docente_id) VALUES
  ('CUR-101', 'Redes y Servicios Multimedia', 4, 30, '2026-2', 1),
  ('CUR-102', 'Arquitectura de Microservicios', 3, 25, '2026-2', 2),
  ('CUR-103', 'Fundamentos de Redes', 3, 35, '2026-1', 4);