DROP DATABASE IF EXISTS doodle_tunes;

CREATE DATABASE doodle_tunes;
USE doodle_tunes;

CREATE TABLE sessions (
	session_id VARCHAR(12) NOT NULL PRIMARY KEY,
    session_start TIMESTAMP,
    session_end TIMESTAMP
);

CREATE TABLE drawings (
    drawing_id VARCHAR(12) PRIMARY KEY,
    session_id VARCHAR(12),
    drawing_time TIMESTAMP,
    playback_id VARCHAR(12),
	CONSTRAINT fk_drawings_sessions
		FOREIGN KEY (session_id)
        REFERENCES sessions (session_id)
);

CREATE TABLE path_characteristics (
	drawing_id VARCHAR(12) NOT NULL,
    path_number TINYINT NOT NULL,
    color_r TINYINT,
    color_g TINYINT,
    color_b TINYINT,
    stroke_weight TINYINT,
    CONSTRAINT fk_path_characteristics_drawings
		FOREIGN KEY (drawing_id)
        REFERENCES drawings (drawing_id),
	PRIMARY KEY(drawing_id, path_number)
);

CREATE TABLE path_verticies (
	drawing_id VARCHAR(12) NOT NULL,
    path_number TINYINT NOT NULL,
    vertex_number TINYINT NOT NULL, 
    vertex_x DOUBLE,
    vertex_y DOUBLE,
    CONSTRAINT fk_path_verticies_drawings
		FOREIGN KEY (drawing_id)
        REFERENCES drawings (drawing_id),
	PRIMARY KEY(drawing_id, path_number, vertex_number)
);



