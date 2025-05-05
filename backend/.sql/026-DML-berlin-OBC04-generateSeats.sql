WITH AUX AS (
    SELECT 1 AS floor_number, '13' AS area_code, generate_series(1, 30) AS seat_code UNION ALL
    SELECT 1 AS floor_number, '14' AS area_code, generate_series(3, 27) AS seat_code UNION ALL
    SELECT 1 AS floor_number, '15' AS area_code, generate_series(5, 30) AS seat_code UNION ALL
    SELECT 4 AS floor_number, '13' AS area_code, generate_series(1, 29) AS seat_code UNION ALL
    SELECT 4 AS floor_number, '14' AS area_code, generate_series(3, 31) AS seat_code UNION ALL
    SELECT 4 AS floor_number, '15' AS area_code, generate_series(1, 22) AS seat_code UNION ALL
    SELECT 5 AS floor_number, '13' AS area_code, generate_series(1, 23) AS seat_code UNION ALL
    SELECT 5 AS floor_number, '14' AS area_code, generate_series(1, 32) AS seat_code UNION ALL
    SELECT 5 AS floor_number, '15' AS area_code, generate_series(8, 10) AS seat_code UNION ALL
    SELECT 5 AS floor_number, '16' AS area_code, generate_series(1, 53) AS seat_code)
INSERT INTO public.seats(code, "areaId", "startDate", "endDate", "createdAt", "updatedAt")
SELECT seat_code AS code, a.id AS "areaId", '2021-01-01' AS "startDate",  '2021-01-01' AS "endDate",current_date AS "createdAt",current_date AS "updatedAt"
FROM AUX, areas a INNER JOIN floors f ON f.id = a."floorId" INNER JOIN buildings b ON b.id = f."buildingId"
WHERE f."number" = floor_number AND a.code = area_code AND b.name = 'OBC04';
