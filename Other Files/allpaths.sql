SELECT s.session_id,
			   d.doodle_id,
               t.tune_id,
               p.path_number,
			   pv.vertex_count,
			   p.color_r, 
               p.color_g, 
               p.color_b,
               p.stroke_weight
FROM sessions s
NATURAL JOIN doodles d
NATURAL JOIN tunes t
NATURAL JOIN path_characteristics p
JOIN ( 
		SELECT doodle_id, path_number, COUNT(vertex_number) AS vertex_count
		FROM path_verticies
		GROUP BY doodle_id, path_number 
        ) pv
	ON p.doodle_id = pv.doodle_id 
			AND p.path_number = pv.path_number 
ORDER BY s.session_start, d.doodle_id, p.path_number