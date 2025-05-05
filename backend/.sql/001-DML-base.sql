/*Update Sequences*/
-- ALTER SEQUENCE amenities_id_seq RESTART WITH 100000;
-- ALTER SEQUENCE areas_id_seq RESTART WITH 100000;
-- ALTER SEQUENCE bookings_id_seq RESTART WITH 100000;
-- ALTER SEQUENCE "bookingStatuses_id_seq" RESTART WITH 100000;
-- ALTER SEQUENCE brigadiers_id_seq RESTART WITH 100000;
-- ALTER SEQUENCE buildings_id_seq RESTART WITH 100000;
-- ALTER SEQUENCE calendars_id_seq RESTART WITH 100000;
-- ALTER SEQUENCE "externalUsers_id_seq" RESTART WITH 100000;
-- ALTER SEQUENCE floors_id_seq RESTART WITH 100000;
-- ALTER SEQUENCE "hoodOrgCodes_id_seq" RESTART WITH 100000;
-- ALTER SEQUENCE hoods_id_seq RESTART WITH 100000;
-- ALTER SEQUENCE "seatAmenities_id_seq" RESTART WITH 100000;
-- ALTER SEQUENCE "seatHoods_id_seq" RESTART WITH 100000;
-- ALTER SEQUENCE "seatOwners_id_seq" RESTART WITH 100000;
-- ALTER SEQUENCE seats_id_seq RESTART WITH 100000;
-- ALTER SEQUENCE sites_id_seq RESTART WITH 100000;

/* DELETIONS */
DELETE FROM public."bookings";
DELETE FROM public."calendars";
DELETE FROM public."seats";
DELETE FROM public."areas";
DELETE FROM public."floors";
DELETE FROM public."buildings";
DELETE FROM public."sites";
DELETE FROM public."bookingStatuses";
DELETE FROM public."seatAmenityNumericValues";
DELETE FROM public."seatAmenityBooleanValues";
DELETE FROM public."seatAmenities";
DELETE FROM public."amenities";

/* INSERT BookingStatus */
INSERT INTO public."bookingStatuses" (id, status, "createdAt", "updatedAt")
VALUES (1, 'Available', current_date, current_date),
       (2, 'Booked', current_date, current_date),
       (3, 'Reserved', current_date, current_date);

/* INSERT Sites */
INSERT INTO public.sites(id, name, country, city, "startDate", "endDate", "createdAt", "updatedAt")
VALUES (1, 'HUB Montevideo', 'Uruguay', 'Montevideo', '2021-01-01', NULL, current_date, current_date),
       (2, 'HUB Berlin', 'Germany', 'Berlin', '2021-01-01', NULL, current_date, current_date);

/* INSERT Buildings */
INSERT INTO public.buildings(id, name, address, image, "reservationDays", "managerReservationDays", "cancellationHours",
                             "reservationCancelationDays", "siteId", "startDate", "endDate", "timeDifference", "createdAt", "updatedAt")
VALUES (1, 'WTC Torre 4', 'Dr. Luis Bonavita 1266', null, 14, 30, 1, 1, 1, '2021-01-01', NULL, -5, current_date, current_date),
       (2, 'OBC03', 'Rotherstraße 11', '/future_of_work/img/OBC03.png',  14, 30, 1, 1, 2, '2021-01-01', NULL, 0, current_date, current_date),
       (3, 'OBC04', 'Rotherstraße 11','/future_of_work/img/OBC04.png', 14, 30, 1, 1, 2, '2021-01-01', NULL, 0, current_date, current_date);

/* INSERT Floors */
INSERT INTO public.floors(id, number, map, "buildingId", "startDate", "endDate", "createdAt", "updatedAt")
VALUES (1, 18, '', 1, '2021-01-01', NULL, current_date, current_date),
       (2, 19, '', 1, '2021-01-01', NULL, current_date, current_date),
       (3, 20, '', 1, '2021-01-01', NULL, current_date, current_date),
       (4, 21, '', 1, '2021-01-01', NULL, current_date, current_date),
       (5, 22, '', 1, '2021-01-01', NULL, current_date, current_date),
       (6, 23, '', 1, '2021-01-01', NULL, current_date, current_date),
       (7, 24, '', 1, '2021-01-01', NULL, current_date, current_date),
       (8, 25, '', 1, '2021-01-01', NULL, current_date, current_date),
       (9, 26, '', 1, '2021-01-01', '2021-02-01', current_date, current_date),

       (10, 0, '', 2, '2021-06-12', NULL, current_date, current_date),
       (11, 1, '-', 2, '2021-06-12', NULL, current_date, current_date),
       (12, 2, '-', 2, '2021-06-12', NULL, current_date, current_date),
       (13, 3, '-', 2, '2021-06-12', NULL, current_date, current_date),
       (14, 4, '-', 2, '2021-06-12', NULL, current_date, current_date),
       (15, 5, '-', 2, '2021-06-12', NULL, current_date, current_date),
       (16, 6, '', 2, '2021-06-12', NULL, current_date, current_date),
       (17, 7, '', 2, '2021-06-12', NULL, current_date, current_date),
       (18, 8, '', 2, '2021-06-12', NULL, current_date, current_date),
       (19, 9, '', 2, '2021-06-12', NULL, current_date, current_date),
       (20, 10, '', 2, '2021-06-12', NULL, current_date, current_date),
       (21, 11, '', 2, '2021-06-12', NULL, current_date, current_date),
       (22, 12, '', 2, '2021-06-12', NULL, current_date, current_date),
       (23, 13, '', 2, '2021-06-12', NULL, current_date, current_date),
       (24, 14, '', 2, '2021-06-12', NULL, current_date, current_date),
       (25, 15, '-', 2, '2021-06-12', NULL, current_date, current_date),

       (26, 1, '-', 3, '2021-01-01', NULL, current_date, current_date),
       (27, 4, '-', 3, '2021-01-01', NULL, current_date, current_date),
       (28, 5, '-', 3, '2021-01-01', NULL, current_date, current_date);

/* INSERT Amenities */
INSERT INTO public."amenities" (en_name, es_name, de_name, type, "createdAt", "updatedAt")
VALUES ('monitors',          'monitores',             'monitore',     'NUMERIC', current_date, current_date),
       ('ergonomic',         'ergonómico',            'ergonomisch',  'BOOLEAN', current_date, current_date),
       ('manual adjustable', 'ajustable manualmente', 'kurbeltisch',  'BOOLEAN', current_date, current_date),
       ('not adjustable',    'no ajustable',          'standardtisch','BOOLEAN', current_date, current_date);
