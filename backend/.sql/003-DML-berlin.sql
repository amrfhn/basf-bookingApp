/* INSERT Areas */
WITH floor_0 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 0 and buildings.name = 'OBC03'),
     floor_1 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 1 and buildings.name = 'OBC03'),
     floor_2 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 2 and buildings.name = 'OBC03'),
     floor_3 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 3 and buildings.name = 'OBC03'),
     floor_4 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 4 and buildings.name = 'OBC03'),
     floor_5 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 5 and buildings.name = 'OBC03'),
     floor_6 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 6 and buildings.name = 'OBC03'),
     floor_7 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 7 and buildings.name = 'OBC03'),
     floor_8 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 8 and buildings.name = 'OBC03'),
     floor_9 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 9 and buildings.name = 'OBC03'),
     floor_11 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 11 and buildings.name = 'OBC03'),
     floor_12 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 12 and buildings.name = 'OBC03'),
     floor_13 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 13 and buildings.name = 'OBC03'),
     floor_14 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 14 and buildings.name = 'OBC03')
INSERT INTO public.areas( code, map, "floorId", "startDate", "endDate", "createdAt", "updatedAt")
VALUES ('O', '', (select id from floor_0), '2021-01-01', NULL, current_date, current_date),

       ('J', '', (select id from floor_1), '2021-01-01', NULL, current_date, current_date),
       ('K', '', (select id from floor_1), '2021-01-01', NULL, current_date, current_date),
       ('L', '', (select id from floor_1), '2021-01-01', NULL, current_date, current_date),
       ('M', '', (select id from floor_1), '2021-01-01', NULL, current_date, current_date),
       ('N', '', (select id from floor_1), '2021-01-01', NULL, current_date, current_date),

       ('G-H', '', (select id from floor_2), '2021-01-01', NULL, current_date, current_date),
       ('I', '', (select id from floor_2), '2021-01-01', NULL, current_date, current_date),
       ('L', '', (select id from floor_2), '2021-01-01', NULL, current_date, current_date),
       ('J', '', (select id from floor_2), '2021-01-01', NULL, current_date, current_date),
       ('K', '', (select id from floor_2), '2021-01-01', NULL, current_date, current_date),
       ('O', '', (select id from floor_2), '2021-01-01', NULL, current_date, current_date),
       ('N', '', (select id from floor_2), '2021-01-01', NULL, current_date, current_date),
       ('M', '', (select id from floor_2), '2021-01-01', NULL, current_date, current_date),

       ('G-H', '', (select id from floor_3), '2021-01-01', NULL, current_date, current_date),
       ('I', '', (select id from floor_3), '2021-01-01', NULL, current_date, current_date),
       ('L', '', (select id from floor_3), '2021-01-01', NULL, current_date, current_date),
       ('J', '', (select id from floor_3), '2021-01-01', NULL, current_date, current_date),
       ('K', '', (select id from floor_3), '2021-01-01', NULL, current_date, current_date),
       ('O', '', (select id from floor_3), '2021-01-01', NULL, current_date, current_date),
       ('N', '', (select id from floor_3), '2021-01-01', NULL, current_date, current_date),
       ('M', '', (select id from floor_3), '2021-01-01', NULL, current_date, current_date),

       ('G-H', '', (select id from floor_4), '2021-01-01', NULL, current_date, current_date),
       ('I', '', (select id from floor_4), '2021-01-01', NULL, current_date, current_date),
       ('L', '', (select id from floor_4), '2021-01-01', NULL, current_date, current_date),
       ('J', '', (select id from floor_4), '2021-01-01', NULL, current_date, current_date),
       ('K', '', (select id from floor_4), '2021-01-01', NULL, current_date, current_date),
       ('O', '', (select id from floor_4), '2021-01-01', NULL, current_date, current_date),
       ('N', '', (select id from floor_4), '2021-01-01', NULL, current_date, current_date),
       ('M', '', (select id from floor_4), '2021-01-01', NULL, current_date, current_date),

       ('G-H', '', (select id from floor_5), '2021-01-01', NULL, current_date, current_date),
       ('L', '', (select id from floor_5), '2021-01-01', NULL, current_date, current_date),
       ('J', '', (select id from floor_5), '2021-01-01', NULL, current_date, current_date),
       ('K', '', (select id from floor_5), '2021-01-01', NULL, current_date, current_date),
       ('O', '', (select id from floor_5), '2021-01-01', NULL, current_date, current_date),
       ('N', '', (select id from floor_5), '2021-01-01', NULL, current_date, current_date),
       ('M', '', (select id from floor_5), '2021-01-01', NULL, current_date, current_date),

       ('-', '', (select id from floor_6), '2021-01-01', NULL, current_date, current_date),
       ('-', '', (select id from floor_7), '2021-01-01', NULL, current_date, current_date),
       ('-', '', (select id from floor_8), '2021-01-01', NULL, current_date, current_date),
       ('-', '', (select id from floor_9), '2021-01-01', NULL, current_date, current_date),
       ('-', '', (select id from floor_11), '2021-01-01', NULL, current_date, current_date),
       ('-', '', (select id from floor_12), '2021-01-01', NULL, current_date, current_date),
       ('-', '', (select id from floor_13), '2021-01-01', NULL, current_date, current_date),
       ('-', '', (select id from floor_14), '2021-01-01', NULL, current_date, current_date);

WITH floor_1 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 1 and buildings.name = 'OBC04'),
     floor_4 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 4 and buildings.name = 'OBC04'),
     floor_5 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 5 and buildings.name = 'OBC04')
INSERT INTO public.areas(code, map, "floorId", "startDate", "endDate", "createdAt", "updatedAt")
VALUES ('13', '', (select id from floor_1), '2021-01-01', NULL, current_date, current_date),
       ('14', '', (select id from floor_1), '2021-01-01', NULL, current_date, current_date),
       ('15', '', (select id from floor_1), '2021-01-01', NULL, current_date, current_date),

       ('13', '', (select id from floor_4), '2021-01-01', NULL, current_date, current_date),
       ('14', '', (select id from floor_4), '2021-01-01', NULL, current_date, current_date),
       ('15', '', (select id from floor_4), '2021-01-01', NULL, current_date, current_date),

       ('13', '', (select id from floor_5), '2021-01-01', NULL, current_date, current_date),
       ('14', '', (select id from floor_5), '2021-01-01', NULL, current_date, current_date),
       ('15', '', (select id from floor_5), '2021-01-01', NULL, current_date, current_date),
       ('16', '', (select id from floor_5), '2021-01-01', NULL, current_date, current_date);


/* INSERT All Seats */
WITH AUX AS (
    SELECT 'OBC03' AS building_name, 0 AS floor_number, 'O' AS area_code, generate_series(1, 3) AS seat_code UNION ALL

    SELECT 'OBC03' AS building_name, 1 AS floor_number, 'J' AS area_code, generate_series(1, 36) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 1 AS floor_number, 'K' AS area_code, generate_series(1, 40) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 1 AS floor_number, 'L' AS area_code, generate_series(1, 21) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 1 AS floor_number, 'M' AS area_code, generate_series(1, 62) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 1 AS floor_number, 'N' AS area_code, generate_series(1, 36) AS seat_code UNION ALL

    SELECT 'OBC03' AS building_name, 2 AS floor_number, 'G-H' AS area_code, generate_series(1, 62) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 2 AS floor_number, 'I' AS area_code, generate_series(2, 34) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 2 AS floor_number, 'L' AS area_code, generate_series(1, 8) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 2 AS floor_number, 'L' AS area_code, generate_series(10, 14) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 2 AS floor_number, 'L' AS area_code, generate_series(16, 20) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 2 AS floor_number, 'J' AS area_code, generate_series(1, 32) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 2 AS floor_number, 'K' AS area_code, generate_series(3, 4) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 2 AS floor_number, 'K' AS area_code, generate_series(12, 47) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 2 AS floor_number, 'O' AS area_code, generate_series(1, 47) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 2 AS floor_number, 'N' AS area_code, generate_series(1, 40) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 2 AS floor_number, 'M' AS area_code, generate_series(1, 56) AS seat_code UNION ALL

    SELECT 'OBC03' AS building_name, 3 AS floor_number, 'G-H' AS area_code, generate_series(1, 11) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 3 AS floor_number, 'G-H' AS area_code, generate_series(13, 24) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 3 AS floor_number, 'G-H' AS area_code, generate_series(37, 40) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 3 AS floor_number, 'I' AS area_code, generate_series(7, 8) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 3 AS floor_number, 'I' AS area_code, generate_series(10, 10) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 3 AS floor_number, 'I' AS area_code, generate_series(18, 18) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 3 AS floor_number, 'I' AS area_code, generate_series(20, 20) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 3 AS floor_number, 'I' AS area_code, generate_series(22, 22) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 3 AS floor_number, 'I' AS area_code, generate_series(25, 32) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 3 AS floor_number, 'J' AS area_code, generate_series(1, 36) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 3 AS floor_number, 'K' AS area_code, generate_series(1, 52) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 3 AS floor_number, 'O' AS area_code, generate_series(1, 4) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 3 AS floor_number, 'O' AS area_code, generate_series(6, 8) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 3 AS floor_number, 'O' AS area_code, generate_series(11, 38) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 3 AS floor_number, 'O' AS area_code, generate_series(41, 50) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 3 AS floor_number, 'N' AS area_code, generate_series(1, 36) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 3 AS floor_number, 'M' AS area_code, generate_series(1, 53) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 3 AS floor_number, 'L' AS area_code, generate_series(1, 9) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 3 AS floor_number, 'L' AS area_code, generate_series(11, 20) AS seat_code UNION ALL

    SELECT 'OBC03' AS building_name, 4 AS floor_number, 'G-H' AS area_code, generate_series(1, 62) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 4 AS floor_number, 'I' AS area_code, generate_series(1, 28) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 4 AS floor_number, 'I' AS area_code, generate_series(31, 34) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 4 AS floor_number, 'J' AS area_code, generate_series(1, 12) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 4 AS floor_number, 'J' AS area_code, generate_series(26, 34) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 4 AS floor_number, 'K' AS area_code, generate_series(1, 23) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 4 AS floor_number, 'K' AS area_code, generate_series(25, 50) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 4 AS floor_number, 'O' AS area_code, generate_series(1, 14) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 4 AS floor_number, 'O' AS area_code, generate_series(25, 42) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 4 AS floor_number, 'N' AS area_code, generate_series(1, 36) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 4 AS floor_number, 'M' AS area_code, generate_series(1, 26) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 4 AS floor_number, 'M' AS area_code, generate_series(37, 59) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 4 AS floor_number, 'L' AS area_code, generate_series(1, 17) AS seat_code UNION ALL

    SELECT 'OBC03' AS building_name, 5 AS floor_number, 'G-H' AS area_code, generate_series(1, 55) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 5 AS floor_number, 'J' AS area_code, generate_series(1, 38) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 5 AS floor_number, 'K' AS area_code, generate_series(1, 68) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 5 AS floor_number, 'O' AS area_code, generate_series(1, 41) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 5 AS floor_number, 'N' AS area_code, generate_series(1, 28) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 5 AS floor_number, 'M' AS area_code, generate_series(1, 46) AS seat_code UNION ALL
    SELECT 'OBC03' AS building_name, 5 AS floor_number, 'L' AS area_code, generate_series(1, 22) AS seat_code UNION ALL

    SELECT 'OBC03' AS building_name, 6 AS floor_number, '-' AS area_code, generate_series(1, 54) AS seat_code UNION ALL

    SELECT 'OBC03' AS building_name, 7 AS floor_number, '-' AS area_code, generate_series(1, 61) AS seat_code UNION ALL

    SELECT 'OBC03' AS building_name, 8 AS floor_number, '-' AS area_code, generate_series(1, 59) AS seat_code UNION ALL

    SELECT 'OBC03' AS building_name, 9 AS floor_number, '-' AS area_code, generate_series(1, 39) AS seat_code UNION ALL

    SELECT 'OBC03' AS building_name, 11 AS floor_number, '-' AS area_code, generate_series(1, 68) AS seat_code UNION ALL

    SELECT 'OBC03' AS building_name, 12 AS floor_number, '-' AS area_code, generate_series(1, 69) AS seat_code UNION ALL

    SELECT 'OBC03' AS building_name, 13 AS floor_number, '-' AS area_code, generate_series(1, 60) AS seat_code UNION ALL

    SELECT 'OBC03' AS building_name, 14 AS floor_number, '-' AS area_code, generate_series(1, 61) AS seat_code UNION ALL

    SELECT 'OBC04' AS building_name, 1 AS floor_number, '13' AS area_code, generate_series(1, 30) AS seat_code UNION ALL
    SELECT 'OBC04' AS building_name, 1 AS floor_number, '14' AS area_code, generate_series(1, 30) AS seat_code UNION ALL
    SELECT 'OBC04' AS building_name, 1 AS floor_number, '15' AS area_code, generate_series(1, 30) AS seat_code UNION ALL

    SELECT 'OBC04' AS building_name, 4 AS floor_number, '13' AS area_code, generate_series(1, 29) AS seat_code UNION ALL
    SELECT 'OBC04' AS building_name, 4 AS floor_number, '14' AS area_code, generate_series(1, 33) AS seat_code UNION ALL
    SELECT 'OBC04' AS building_name, 4 AS floor_number, '15' AS area_code, generate_series(1, 26) AS seat_code UNION ALL

    SELECT 'OBC04' AS building_name, 5 AS floor_number, '13' AS area_code, generate_series(1, 23) AS seat_code UNION ALL
    SELECT 'OBC04' AS building_name, 5 AS floor_number, '14' AS area_code, generate_series(1, 34) AS seat_code UNION ALL
    SELECT 'OBC04' AS building_name, 5 AS floor_number, '15' AS area_code, generate_series(1, 15) AS seat_code UNION ALL
    SELECT 'OBC04' AS building_name, 5 AS floor_number, '16' AS area_code, generate_series(1, 56) AS seat_code)
INSERT INTO public.seats(code, "areaId", "startDate", "endDate", "createdAt", "updatedAt")
SELECT seat_code AS code, a.id AS "areaId", '2021-01-01' AS "startDate",  NULL AS "endDate",current_date AS "createdAt",current_date AS "updatedAt"
FROM AUX, areas a
              INNER JOIN floors f ON f.id = a."floorId"
              INNER JOIN buildings b ON b.id = f."buildingId"
WHERE a.code = area_code AND f."number" = floor_number AND b.name = building_name;

/* UPDATE Disable some Seats */
UPDATE public.seats s
SET "endDate" = '2021-01-01'
WHERE s.id IN (
    SELECT s_aux.id FROM (VALUES
                          ('OBC04', 1, '13', 9),	('OBC04', 1, '13', 11),	('OBC04', 1, '13', 12),	('OBC04', 1, '14', 1),	('OBC04', 1, '14', 2),	('OBC04', 1, '14', 28),	('OBC04', 1, '14', 29),	('OBC04', 1, '14', 30),	('OBC04', 1, '15', 1),	('OBC04', 1, '15', 2),	('OBC04', 1, '15', 3),	('OBC04', 1, '15', 4),	('OBC04', 1, '15', 25),	('OBC04', 1, '15', 26),	('OBC04', 1, '15', 27),	('OBC04', 1, '15', 28),	('OBC04', 4, '13', 2),	('OBC04', 4, '14', 1),	('OBC04', 4, '14', 2),	('OBC04', 4, '14', 32),	('OBC04', 4, '14', 33),	('OBC04', 4, '15', 4),	('OBC04', 4, '15', 23),	('OBC04', 4, '15', 24),	('OBC04', 4, '15', 25),	('OBC04', 4, '15', 26),	('OBC04', 5, '13', 5),	('OBC04', 5, '13', 6),	('OBC04', 5, '13', 9),	('OBC04', 5, '13', 10),	('OBC04', 5, '13', 21),	('OBC04', 5, '15', 1),	('OBC04', 5, '15', 2),	('OBC04', 5, '15', 3),	('OBC04', 5, '15', 4),	('OBC04', 5, '15', 5),	('OBC04', 5, '15', 6),	('OBC04', 5, '15', 7),	('OBC04', 5, '15', 11),	('OBC04', 5, '15', 12),	('OBC04', 5, '15', 13),	('OBC04', 5, '15', 14),	('OBC04', 5, '15', 15),	('OBC04', 5, '16', 55),	('OBC04', 5, '16', 56),
                          ('OBC03', 1, 'J', 27),
                          ('OBC03', 2, 'I', 1),	('OBC03', 2, 'L', 9),	('OBC03', 2, 'L', 15),	('OBC03', 2, 'K', 1),	('OBC03', 2, 'K', 2),	('OBC03', 2, 'K', 5),	('OBC03', 2, 'K', 6),	('OBC03', 2, 'K', 7),	('OBC03', 2, 'K', 8),	('OBC03', 2, 'K', 9),	('OBC03', 2, 'K', 10),	('OBC03', 2, 'K', 11),
                          ('OBC03', 3, 'G-H', 25),	('OBC03', 3, 'G-H', 26),	('OBC03', 3, 'G-H', 27),	('OBC03', 3, 'G-H', 28),	('OBC03', 3, 'G-H', 29),	('OBC03', 3, 'G-H', 30),	('OBC03', 3, 'G-H', 31),	('OBC03', 3, 'G-H', 32),	('OBC03', 3, 'G-H', 33),	('OBC03', 3, 'G-H', 34),	('OBC03', 3, 'G-H', 35),	('OBC03', 3, 'G-H', 36),	('OBC03', 3, 'I', 1),	('OBC03', 3, 'I', 2),	('OBC03', 3, 'I', 3),	('OBC03', 3, 'I', 4),	('OBC03', 3, 'I', 5),	('OBC03', 3, 'I', 6),	('OBC03', 3, 'I', 9),	('OBC03', 3, 'I', 11),	('OBC03', 3, 'I', 12),	('OBC03', 3, 'I', 13),	('OBC03', 3, 'I', 14),	('OBC03', 3, 'I', 15),	('OBC03', 3, 'I', 16),	('OBC03', 3, 'I', 17),	('OBC03', 3, 'I', 19),	('OBC03', 3, 'I', 21),	('OBC03', 3, 'I', 23),	('OBC03', 3, 'I', 24),	('OBC03', 3, 'O', 5),	('OBC03', 3, 'O', 9),	('OBC03', 3, 'O', 10),	('OBC03', 3, 'O', 39),	('OBC03', 3, 'O', 40),	('OBC03', 3, 'L', 10),	('OBC03', 3, 'L', 21),
                          ('OBC03', 4, 'I', 29),	('OBC03', 4, 'I', 30),	('OBC03', 4, 'J', 13),	('OBC03', 4, 'J', 14),	('OBC03', 4, 'J', 15),	('OBC03', 4, 'J', 16),	('OBC03', 4, 'J', 17),	('OBC03', 4, 'J', 18),	('OBC03', 4, 'J', 19),	('OBC03', 4, 'J', 20),	('OBC03', 4, 'J', 21),	('OBC03', 4, 'J', 22),	('OBC03', 4, 'J', 23),	('OBC03', 4, 'J', 24),	('OBC03', 4, 'J', 25),	('OBC03', 4, 'K', 24),	('OBC03', 4, 'O', 15),	('OBC03', 4, 'O', 16),	('OBC03', 4, 'O', 17),	('OBC03', 4, 'O', 18),	('OBC03', 4, 'O', 19),	('OBC03', 4, 'O', 20),	('OBC03', 4, 'O', 21),	('OBC03', 4, 'O', 22),	('OBC03', 4, 'O', 23),	('OBC03', 4, 'O', 24),	('OBC03', 4, 'M', 27),	('OBC03', 4, 'M', 28),	('OBC03', 4, 'M', 29),	('OBC03', 4, 'M', 30),	('OBC03', 4, 'M', 31),	('OBC03', 4, 'M', 32),	('OBC03', 4, 'M', 33),	('OBC03', 4, 'M', 34),	('OBC03', 4, 'M', 35),	('OBC03', 4, 'M', 36)
                         )  AS eneables (building_name, floor_number, area_code, seat_code),
                         public.seats s_aux
                             INNER JOIN areas a ON s_aux."areaId" = a.id
                             INNER JOIN floors f ON a."floorId" = f.id
                             INNER JOIN buildings b on b.id = f."buildingId"
    WHERE b.name = building_name AND f.number = floor_number AND a.code = area_code AND s_aux.code = seat_code
);
