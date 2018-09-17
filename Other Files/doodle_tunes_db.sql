DROP DATABASE IF EXISTS doodle_tunes;

CREATE DATABASE doodle_tunes;
USE doodle_tunes;


CREATE TABLE tunes (
	tune_id VARCHAR(20) PRIMARY KEY,
    tune_key TINYINT,
    tonality TINYINT
);

CREATE TABLE notes (
	note_id INT AUTO_INCREMENT PRIMARY KEY,
    note_name VARCHAR(2),
    frequency INT
);

CREATE TABLE tune_components (
	component_id INT AUTO_INCREMENT PRIMARY KEY,
	tune_id VARCHAR(20),
    sequence_number INT,
    note_id INT,
    functon TINYINT
);

CREATE TABLE sessions (
	session_id VARCHAR(20) NOT NULL PRIMARY KEY,
    session_start TIMESTAMP,
    session_end TIMESTAMP
);

CREATE TABLE doodles (
    doodle_id VARCHAR(20) PRIMARY KEY,
    session_id VARCHAR(20),
    drawing_time TIMESTAMP,
    tune_id VARCHAR(12),
	CONSTRAINT fk_session_id_doodles_sessions
		FOREIGN KEY (session_id)
        REFERENCES sessions (session_id)
);

CREATE TABLE path_characteristics (
	doodle_id VARCHAR(20) NOT NULL,
    path_number INT NOT NULL,
    color_r INT,
    color_g INT,
    color_b INT,
    stroke_weight INT,
    CONSTRAINT fk_doodle_id_path_characteristics_doodles
		FOREIGN KEY (doodle_id)
        REFERENCES doodles (doodle_id),
	PRIMARY KEY(doodle_id, path_number)
);

CREATE TABLE path_verticies (
	doodle_id VARCHAR(20) NOT NULL,
    path_number INT NOT NULL,
    vertex_number INT NOT NULL, 
    vertex_x DOUBLE,
    vertex_y DOUBLE,
    CONSTRAINT fk_doodle_id_path_verticies_doodles
		FOREIGN KEY (doodle_id)
        REFERENCES doodles (doodle_id),
	PRIMARY KEY(doodle_id, path_number, vertex_number)
);




