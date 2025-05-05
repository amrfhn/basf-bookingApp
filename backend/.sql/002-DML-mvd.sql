/* INSERT Areas */
WITH floor_18 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 18 and buildings.name = 'WTC Torre 4'),
     floor_19 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 19 and buildings.name = 'WTC Torre 4'),
     floor_20 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 20 and buildings.name = 'WTC Torre 4'),
     floor_21 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 21 and buildings.name = 'WTC Torre 4'),
     floor_22 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 22 and buildings.name = 'WTC Torre 4'),
     floor_23 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 23 and buildings.name = 'WTC Torre 4'),
     floor_24 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 24 and buildings.name = 'WTC Torre 4'),
     floor_25 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 25 and buildings.name = 'WTC Torre 4')
INSERT INTO public.areas(code, map, "floorId", "startDate", "endDate", "createdAt", "updatedAt")
VALUES ('-', '', (select id from floor_18), '2021-01-01', NULL, current_date, current_date),
       ('-', '', (select id from floor_19), '2021-01-01', NULL, current_date, current_date),
       ('-', '', (select id from floor_20), '2021-01-01', NULL, current_date, current_date),
       ('-', '', (select id from floor_21), '2021-01-01', NULL, current_date, current_date),
       ('-', '', (select id from floor_22), '2021-01-01', NULL, current_date, current_date),
       ('-', '', (select id from floor_23), '2021-01-01', NULL, current_date, current_date),
       ('-', '', (select id from floor_24), '2021-01-01', NULL, current_date, current_date),
       ('-', '', (select id from floor_25), '2021-01-01', NULL, current_date, current_date);

/* INSERT All Seats */
WITH AUX AS (
    SELECT 18 AS floor_number, generate_series(1, 69) AS seat_code UNION ALL
    SELECT 19 AS floor_number, generate_series(1, 63) AS seat_code UNION ALL
    SELECT 20 AS floor_number, generate_series(1, 89) AS seat_code UNION ALL
    SELECT 21 AS floor_number, generate_series(1, 85) AS seat_code UNION ALL
    SELECT 22 AS floor_number, generate_series(1, 81) AS seat_code UNION ALL
    SELECT 23 AS floor_number, generate_series(1, 77) AS seat_code UNION ALL
    SELECT 24 AS floor_number, generate_series(1, 64) AS seat_code UNION ALL
    SELECT 25 AS floor_number, generate_series(1, 82) AS seat_code)
INSERT INTO public.seats(code, "areaId", "startDate", "endDate", "createdAt", "updatedAt")
SELECT seat_code AS code, a.id AS "areaId", '2021-01-01' AS "startDate",  '2021-01-01' AS "endDate",current_date AS "createdAt",current_date AS "updatedAt"
FROM AUX, areas a
              INNER JOIN floors f ON f.id = a."floorId"
              INNER JOIN buildings b ON b.id = f."buildingId"
WHERE f."number" = floor_number AND b.name = 'WTC Torre 4';


/* UPDATE Enable 70 Seats */
UPDATE public.seats s
SET "endDate" = null
WHERE EXISTS (
    SELECT * FROM ( VALUES
       (18,  2), (18,  6), (18, 10), (18, 14), (18, 18), (18, 29), (18, 46), (18, 52), (18, 58), (18, 64),
       (19,  2), (19, 16), (19, 22), (19, 31), (19, 32), (19, 42), (19, 48), (19, 50), (19, 56), (19, 60),
       (20,  5), (20, 13), (20, 23), (20, 29), (20, 35), (20, 41), (20, 68), (20, 74), (20, 80), (20, 86),
       (21,  1), (21,  9), (21, 17), (21, 23), (21, 29), (21, 34), (21, 39), (21, 68), (21, 73), (21, 79),
       (22,  1), (22,  9), (22, 13), (22, 28), (22, 34), (22, 40), (22, 55), (22, 61), (22, 67), (22, 78),
       (23,  5), (23, 13), (23, 19), (23, 24), (23, 29), (23, 49), (23, 55), (23, 61), (23, 67), (23, 73),
       (25,  5), (25, 13), (25, 25), (25, 31), (25, 40), (25, 46), (25, 56), (25, 62), (25, 68), (25, 74)
    )  AS eneables (floor_number, seat_code), areas a INNER JOIN floors f ON f.id = a."floorId" INNER JOIN buildings b ON b.id = f."buildingId"
    WHERE s.code = seat_code AND f.number=floor_number AND s."areaId"=a.id AND b."name"='WTC Torre 4'
);
