-- DROP DATABASE IF EXISTS doodle_tunes;

-- CREATE DATABASE doodle_tunes;
USE doodletunes;

SET SQL_MODE='ALLOW_INVALID_DATES';

CREATE TABLE notes (
	note_id INT AUTO_INCREMENT PRIMARY KEY,
    note_name VARCHAR(2),
    note_octave TINYINT,
    playback_number INT,
    frequency INT
);

CREATE TABLE tunes (
	tune_id INT PRIMARY KEY,
    tune_key VARCHAR(2),
    tonality VARCHAR(20)
);

CREATE TABLE tune_fails (
	tune_id INT PRIMARY KEY,
    error_message TEXT,
    CONSTRAINT fk_tune_id_tune_fails_tunes
		FOREIGN KEY (tune_id)
		REFERENCES tunes (tune_id)
);

CREATE TABLE melody_notes (
	melody_note_id INT AUTO_INCREMENT PRIMARY KEY,
	tune_id INT,
	note_id INT,
	beat_number INT,
	duration INT,
	CONSTRAINT fk_tune_id_melody_notes_tunes
		FOREIGN KEY (tune_id)
		REFERENCES tunes (tune_id),
	CONSTRAINT fk_note_id_melody_notes_notes
		FOREIGN KEY (note_id)
		REFERENCES notes (note_id)
);

CREATE TABLE harmony_notes (
	harmony_note_id INT AUTO_INCREMENT PRIMARY KEY,
	tune_id INT,
	note_id INT,
    beat_number INT,
	duration INT,
	CONSTRAINT fk_tune_id_harmony_notes_tunes
		FOREIGN KEY (tune_id)
		REFERENCES tunes (tune_id),
	CONSTRAINT fk_note_id_harmony_notes_notes
		FOREIGN KEY (note_id)
		REFERENCES notes (note_id)
);

CREATE TABLE harmony_details (
	harmony_detail_id INT AUTO_INCREMENT PRIMARY KEY,
	tune_id INT,
    beat_number INT,
    tonality VARCHAR(10),
	CONSTRAINT fk_tune_id_harmony_details_tunes
		FOREIGN KEY (tune_id)
		REFERENCES tunes (tune_id)
);

CREATE TABLE sessions (
	session_id VARCHAR(20) PRIMARY KEY,
    session_start TIMESTAMP,
    session_end TIMESTAMP
);

CREATE TABLE doodles (
    doodle_id VARCHAR(20) PRIMARY KEY,
    session_id VARCHAR(20),
    drawing_time TIMESTAMP,
    tune_id INT,
	CONSTRAINT fk_session_id_doodles_sessions
		FOREIGN KEY (session_id)
        REFERENCES sessions (session_id),
	CONSTRAINT fk_tune_id_doodles_tunes
		FOREIGN KEY (tune_id)
        REFERENCES tunes (tune_id)
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

 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('Bb',3,38,233.08);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('B',3,39,246.94);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('Cb',4,39,246.94);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('C',4,40,261.63);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('C#',4,41,277.18);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('Db',4,41,277.18);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('D',4,42,293.66);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('D#',4,43,311.13);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('Eb',4,43,311.13);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('E',4,44,329.63);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('E#',4,45,349.23);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('Fb',4,44,329.63);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('F',4,45,349.23);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('F#',4,46,369.99);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('Gb',4,46,369.99);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('G',4,47,392);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('G#',4,48,415.3);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('Ab',4,48,415.3);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('A',4,49,440);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('A#',4,50,466.16);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('Bb',4,50,466.16);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('B',4,51,493.88);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('Cb',5,51,493.88);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('C',5,52,523.25);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('C#',5,53,554.37);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('Db',5,53,554.37);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('D',5,54,587.33);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('D#',5,55,622.25);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('Eb',5,55,622.25);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('E',5,56,659.25);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('E#',5,57,698.46);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('Fb',5,56,659.25);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('F',5,57,698.46);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('F#',5,58,739.99);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('Gb',5,58,739.99);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('G',5,59,783.99);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('G#',5,60,830.61);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('Ab',5,60,830.61);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('A',5,61,880);
 INSERT INTO notes(note_name,note_octave,playback_number,frequency) VALUES ('A#',5,62,932.33);

 INSERT INTO tunes(tune_id, tune_key, tonality) VALUES (1, 'C', 'major');

 INSERT INTO melody_notes(tune_id, note_id, beat_number, duration) VALUES (1, 24, 1, 1);
 INSERT INTO melody_notes(tune_id, note_id, beat_number, duration) VALUES (1, 16, 2, 1);
 INSERT INTO melody_notes(tune_id, note_id, beat_number, duration) VALUES (1, 27, 3, 1);
 INSERT INTO melody_notes(tune_id, note_id, beat_number, duration) VALUES (1, 24, 4, 1);

 INSERT INTO harmony_notes(tune_id, note_id, beat_number, duration) VALUES (1, 4, 1, 2);
 INSERT INTO harmony_notes(tune_id, note_id, beat_number, duration) VALUES (1, 10, 1, 2);

 INSERT INTO harmony_notes(tune_id, note_id, beat_number, duration) VALUES (1, 13, 3, 1);
 INSERT INTO harmony_notes(tune_id, note_id, beat_number, duration) VALUES (1, 16, 3, 1);

 INSERT INTO harmony_notes(tune_id, note_id, beat_number, duration) VALUES (1, 10, 4, 1);
 INSERT INTO harmony_notes(tune_id, note_id, beat_number, duration) VALUES (1, 16, 4, 1);

 INSERT INTO harmony_details(tune_id, beat_number, tonality) VALUES (1, 1, 'major')