SELECT tune_key, 
			   tonality,
			   COUNT(tune_id) as tune_count
FROM tunes
GROUP BY tune_key, tonality
ORDER BY tune_key, tonality;

