SELECT tune_id, 
			   COUNT(*) as num_doodles 
FROM doodletunes.doodles
GROUP BY tune_id 
HAVING num_doodles > 1;

SELECT * FROM doodletunes.doodles
where tune_id = 742;
