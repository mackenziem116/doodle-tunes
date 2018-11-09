SELECT u.tune_id, 
			   u.playback_number,
			   u.note_name,
			   u.note_octave,
			   u.beat_number, 
			   u.duration,
			   u.stem
FROM (
	SELECT t.tune_id, 
				   n.playback_number,
				   n.note_name,
				   n.note_octave,
				   m.beat_number, 
				   m.duration,
				   0 as stem
	FROM tunes t
	NATURAL JOIN notes n
	NATURAL JOIN melody_notes m
UNION
	SELECT t.tune_id, 
				   n.playback_number,
				   n.note_name,
				   n.note_octave,
				   h.beat_number, 
				   h.duration,
				   1 as stem
	FROM tunes t
	NATURAL JOIN notes n
	NATURAL JOIN harmony_notes h
) AS u
JOIN (
	SELECT CEIL(RAND() * MAX(tune_id)) as id	
	FROM tunes
) max_id
WHERE u.tune_id = max_id.id;
















