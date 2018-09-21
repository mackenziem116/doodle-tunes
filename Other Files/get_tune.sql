SELECT t.tune_id, 
			   n.playback_number,
			   n.note_name,
	           n.note_octave,
               tc.beat_number, 
               tc.duration, 
               tc.stem
FROM tunes t
NATURAL JOIN tune_components tc
NATURAL JOIN notes n
JOIN (
	SELECT CEIL(RAND() * MAX(tune_id)) as id
	FROM tunes
) max_id
WHERE t.tune_id = max_id.id;
