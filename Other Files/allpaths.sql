SELECT s.session_id, 
			   s.session_start,
			   d.drawing_id,
               p.path_number,
			   p.color_r, p.color_g, p.color_b,
               p.stroke_weight,
               pv.vertex_count
FROM sessions s
NATURAL JOIN drawings d
NATURAL JOIN path_characteristics p
JOIN (
		SELECT drawing_id, path_number, COUNT(vertex_number) AS vertex_count
        FROM path_verticies
        GROUP BY drawing_id, path_number
        ) pv
		ON p.drawing_id = pv.drawing_id 
			AND p.path_number = pv.path_number 
ORDER BY s.session_start, d.drawing_id, p.path_number