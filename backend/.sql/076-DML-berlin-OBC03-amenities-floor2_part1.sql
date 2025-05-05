WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '1')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '1'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '1'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '2')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '2'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '2'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '3')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '3'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '3'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '4')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '4'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '4'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '5')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '5'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '5'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '6')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '6'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '6'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '7')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '7'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '7'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '8')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '8'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '8'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '9')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '9'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '9'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '10')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '10'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '10'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '11')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '11'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '11'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '12')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '12'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '12'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '13')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '13'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '13'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '14')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '14'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '14'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '15')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '15'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '15'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '16')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '16'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '16'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '17')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '17'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '17'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '18')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '18'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '18'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '19')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '19'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '19'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '20')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '20'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '20'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '21')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '21'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '21'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '22')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '22'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '22'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '23')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '23'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '23'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '24')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '24'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '24'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '25')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '25'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '25'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '26')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '26'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '26'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '27')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '27'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '27'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '28')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '28'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '28'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '29')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '29'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '29'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '30')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '30'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '30'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '31')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '31'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '31'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '32')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '32'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '32'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '33')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '33'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '33'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '34')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '34'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '34'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '35')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '35'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '35'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '36')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '36'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '36'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '37')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '37'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '37'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '38')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '38'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '38'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '39')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '39'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '39'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '40')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '40'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '40'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '41')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '41'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '41'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '42')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '42'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '42'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '43')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '43'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '43'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '44')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '44'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '44'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '45')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '45'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '45'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '46')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '46'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '46'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '47')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '47'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '47'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '48')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '48'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '48'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '49')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '49'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '49'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '50')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '50'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '50'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '51')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '51'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '51'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '52')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '52'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '52'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '53')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '53'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '53'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '54')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '54'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '54'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '55')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '55'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '55'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '56')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '56'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '56'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '57')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '57'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '57'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '58')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '58'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '58'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '59')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '59'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '59'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '60')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '60'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '60'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '61')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '61'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '61'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '62')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '62'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'G-H' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '62'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '2')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '2'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '2'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '3')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '3'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '3'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '4')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '4'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '4'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '5')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '5'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '5'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '6')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '6'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '6'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '7')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '7'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '7'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '8')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '8'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '8'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '9')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '9'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '9'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '10')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '10'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '10'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '11')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '11'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '11'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '12')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '12'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '12'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '13')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '13'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '13'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '14')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '14'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '14'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '15')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '15'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '15'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '16')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '16'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '16'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '17')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '17'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '17'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '18')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '18'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '18'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '19')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '19'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '19'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '20')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '20'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '20'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '21')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '21'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '21'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '22')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '22'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '22'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '23')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '23'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '23'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '24')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '24'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '24'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '25')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '25'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '25'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '26')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '26'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '26'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '27')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '27'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '27'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '28')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '28'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '28'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '29')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '29'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '29'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '30')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '30'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '30'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '31')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '31'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '31'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '32')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '32'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '32'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '33')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '33'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '33'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '34')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '34'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'I' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '34'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '1')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '1'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '1'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '2')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '2'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '2'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '3')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '3'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '3'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '4')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '4'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '4'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '5')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '5'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '5'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '6')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '6'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '6'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '7')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '7'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '7'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '8')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '8'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '8'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '10')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '10'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '10'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '11')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '11'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '11'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '12')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '12'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '12'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '13')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '13'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '13'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '14')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '14'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '14'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '16')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '16'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '16'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '17')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '17'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '17'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '18')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '18'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '18'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '19')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '19'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '19'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '20')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '20'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'L' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '20'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '1')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '1'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '1'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '2')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '2'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '2'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '3')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '3'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '3'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '4')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '4'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '4'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '5')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '5'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '5'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '6')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '6'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '6'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '7')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '7'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '7'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '8')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '8'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '8'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '9')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '9'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '9'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '10')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '10'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '10'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '11')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '11'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '11'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '12')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '12'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '12'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '13')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '13'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '13'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '14')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '14'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '14'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '15')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '15'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '15'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '16')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '16'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '16'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '17')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '17'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '17'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '18')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '18'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '18'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '19')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '19'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '19'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '20')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '20'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '20'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '21')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '21'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '21'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '22')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '22'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '22'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '23')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '23'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '23'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '24')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '24'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '24'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '25')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '25'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '25'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '26')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '26'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '26'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '27')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '27'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '27'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '28')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '28'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '28'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '29')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '29'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '29'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '30')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '30'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '30'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '31')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '31'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '31'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '32')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '32'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'J' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '32'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '3')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '3'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '3'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '4')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '4'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '4'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '12')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '12'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '12'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '13')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '13'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '13'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '14')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '14'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '14'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '15')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '15'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '15'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '16')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '16'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '16'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '17')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '17'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '17'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '18')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '18'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '18'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '19')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '19'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '19'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '20')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '20'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '20'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), TRUE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), FALSE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '21')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '21'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '21'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);


WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '22')
INSERT INTO public."seatAmenities"("seatId", "amenityId", "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_id), (SELECT id FROM monitors), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM ergonomic), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM manual_adjustable), current_date, current_date),
       ((SELECT id FROM seat_id), (SELECT id FROM not_adjustable), current_date, current_date);

WITH monitors AS (SELECT id FROM amenities WHERE en_name = 'monitors'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f.number = 2 AND b.name = 'OBC03' AND s.code = '22'),
     seat_amenity_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM monitors))
INSERT INTO public."seatAmenityNumericValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_amenity_id), 1, current_date, current_date);

WITH ergonomic AS (SELECT id FROM amenities WHERE en_name = 'ergonomic'),
     manual_adjustable AS (SELECT id FROM amenities WHERE en_name = 'manual adjustable'),
     not_adjustable AS (SELECT id FROM amenities WHERE en_name = 'not adjustable'),
     seat_id AS (SELECT s.id FROM seats s
                INNER JOIN areas a ON s."areaId" = a.id
                INNER JOIN floors f ON a."floorId" = f.id
                INNER JOIN buildings b on b.id = f."buildingId"
                WHERE a.code = 'K' AND f."number" = 2 AND b.name = 'OBC03' AND s.code = '22'),
     seat_ergonomic_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM ergonomic)),
     seat_manual_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM manual_adjustable)),
     seat_not_adjustable_id AS (SELECT id FROM "seatAmenities"
						 WHERE "seatId" = (SELECT id FROM seat_id)
						 AND "amenityId" = (SELECT id FROM not_adjustable))
INSERT INTO public."seatAmenityBooleanValues"("seatAmenityId", value, "createdAt", "updatedAt")
VALUES ((SELECT id FROM seat_ergonomic_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_manual_adjustable_id), FALSE, current_date, current_date),
	   ((SELECT id FROM seat_not_adjustable_id), TRUE, current_date, current_date);

