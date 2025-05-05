INSERT INTO public.sites(name, country, city, "startDate", "endDate", "createdAt", "updatedAt")
VALUES ('Argentina', 'Argentina', 'Buenos Aires', '2021-09-16', NULL, current_date, current_date);


INSERT INTO public.buildings(name, address, "reservationDays", "managerReservationDays", "cancellationHours",
                             "reservationCancelationDays", "siteId", "startDate", "endDate", "timeDifference",
                             "createdAt", "updatedAt")
VALUES ('República', '', 14, 30, 1, 1, (select id from sites where name = 'Argentina'), '2021-09-16', NULL, -5,
        current_date, current_date);


INSERT INTO public.floors(number, map, "buildingId", "startDate", "endDate", "createdAt", "updatedAt")
VALUES (18, '', (select id from buildings where name = 'República'), '2021-09-16', NULL, current_date, current_date);



WITH floor_18 AS (select floors.id from floors inner join buildings on buildings.id = floors."buildingId" where floors."number" = 18 and buildings.name = 'República')
INSERT INTO public.areas( code, map, "floorId", "startDate", "endDate", "createdAt", "updatedAt")
VALUES ('Zona1', '', (select id from floor_18), '2021-09-16', NULL, current_date, current_date),
       ('Zona2', '', (select id from floor_18), '2021-09-16', NULL, current_date, current_date),
       ('Zona3', '', (select id from floor_18), '2021-09-16', NULL, current_date, current_date);


WITH AUX AS (
    SELECT 'República' AS building_name, 18 AS floor_number, 'Zona1' AS area_code, generate_series(1, 36) AS seat_code UNION ALL
    SELECT 'República' AS building_name, 18 AS floor_number, 'Zona2' AS area_code, generate_series(37, 75) AS seat_code UNION ALL
    SELECT 'República' AS building_name, 18 AS floor_number, 'Zona3' AS area_code, generate_series(76, 121) AS seat_code)
INSERT INTO public.seats(code, "areaId", "startDate", "endDate", "createdAt", "updatedAt")
SELECT seat_code AS code, a.id AS "areaId", '2021-01-01' AS "startDate", '2021-01-01' AS "endDate", current_date AS "createdAt", current_date AS "updatedAt"
FROM AUX, areas a
              INNER JOIN floors f ON f.id = a."floorId"
              INNER JOIN buildings b ON b.id = f."buildingId"
WHERE a.code = area_code AND f."number" = floor_number AND b.name = building_name;


UPDATE public.seats s
SET "endDate" = null
WHERE EXISTS (
              SELECT * FROM ( VALUES
                                  (18,  3), (18,  5), (18,  9), (18, 10), (18, 14), (18, 20), (18,  21), (18,  26), (18,  28),
                                  (18, 41), (18, 43), (18, 47), (18, 48), (18, 54), (18, 60), (18,  61), (18,  65), (18,  67), (18, 68), (18, 72), (18, 73),
                                  (18, 78), (18, 80), (18, 85), (18, 91), (18, 93), (18, 97), (18, 107), (18, 108), (18, 111)
                            )  AS eneables (floor_number, seat_code),
                            areas a INNER JOIN floors f ON f.id = a."floorId" INNER JOIN buildings b ON b.id = f."buildingId"
              WHERE s.code = seat_code AND f.number=floor_number AND s."areaId"=a.id AND b."name"='República'
          );
