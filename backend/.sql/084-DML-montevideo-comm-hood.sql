/* Crear el Hood GTU */
insert into hoods (name, "createdAt", "updatedAt")
values ('GTU', current_date, current_date);

/* Crear el Hood/OrgCode GTU */
insert into "hoodOrgCodes" ("hoodId", "orgCode", "createdAt", "updatedAt")
VALUES ((select id from hoods where name = 'GTU'), 'GB/CD' ,current_date, current_date);

/* Crear el Hood Communications */
insert into hoods (name, "createdAt", "updatedAt")
values ('Communications', current_date, current_date);

/* Crear el Hood/OrgCode Communications */
insert into "hoodOrgCodes" ("hoodId", "orgCode", "createdAt", "updatedAt")
VALUES ((select id from hoods where name = 'Communications'), 'GB/H' ,current_date, current_date);

/* Updates Piso 24 - Communications */
update seats s
set "startDate" = current_date, "endDate" = null
where s.id in (select s1.id from seats s1
    inner join areas a on s1."areaId" = a.id
    inner join floors f on a."floorId" = f.id
    inner join buildings b on f."buildingId" = b.id
    full join "seatHoods" sH on s1.id = sH."seatId"
    full join hoods h on sH."hoodId" = h.id
where b.name = 'WTC Torre 4'
    and f.number = 24 and s1.code in (42, 44, 45, 46, 47, 49));


/* Crear el SeatHoods */

/* Piso 24 Asiento 42 */
insert into "seatHoods" ("seatId", "hoodId", "createdAt", "updatedAt")
values ((select s1.id from seats s1
    inner join areas a on s1."areaId" = a.id
    inner join floors f on a."floorId" = f.id
    inner join buildings b on f."buildingId" = b.id
where b.name = 'WTC Torre 4'
    and f.number = 24 and s1.code in (42)), (select id from hoods h
        where h.name = 'Communications'), current_date, current_date);

/* Piso 24 Asiento 44 */
insert into "seatHoods" ("seatId", "hoodId", "createdAt", "updatedAt")
values ((select s1.id from seats s1
    inner join areas a on s1."areaId" = a.id
    inner join floors f on a."floorId" = f.id
    inner join buildings b on f."buildingId" = b.id
    where b.name = 'WTC Torre 4'
and f.number = 24 and s1.code in (44)), (select id from hoods h
    where h.name = 'Communications'), current_date, current_date);

/* Piso 24 Asiento 45 */
insert into "seatHoods" ("seatId", "hoodId", "createdAt", "updatedAt")
values ((select s1.id from seats s1
    inner join areas a on s1."areaId" = a.id
    inner join floors f on a."floorId" = f.id
    inner join buildings b on f."buildingId" = b.id
where b.name = 'WTC Torre 4'
    and f.number = 24 and s1.code in (45)), (select id from hoods h
        where h.name = 'Communications'), current_date, current_date);

/* Piso 24 Asiento 46 */
insert into "seatHoods" ("seatId", "hoodId", "createdAt", "updatedAt")
values ((select s1.id from seats s1
    inner join areas a on s1."areaId" = a.id
    inner join floors f on a."floorId" = f.id
    inner join buildings b on f."buildingId" = b.id
where b.name = 'WTC Torre 4'
    and f.number = 24 and s1.code in (46)), (select id from hoods h
        where h.name = 'Communications'), current_date, current_date);

/* Piso 24 Asiento 47 */
insert into "seatHoods" ("seatId", "hoodId", "createdAt", "updatedAt")
values ((select s1.id from seats s1
    inner join areas a on s1."areaId" = a.id
    inner join floors f on a."floorId" = f.id
    inner join buildings b on f."buildingId" = b.id
where b.name = 'WTC Torre 4'
    and f.number = 24 and s1.code in (47)), (select id from hoods h
        where h.name = 'Communications'), current_date, current_date);

/* Piso 24 Asiento 49 */
insert into "seatHoods" ("seatId", "hoodId", "createdAt", "updatedAt")
values ((select s1.id from seats s1
    inner join areas a on s1."areaId" = a.id
    inner join floors f on a."floorId" = f.id
    inner join buildings b on f."buildingId" = b.id
where b.name = 'WTC Torre 4'
    and f.number = 24 and s1.code in (49)), (select id from hoods h
        where h.name = 'Communications'), current_date, current_date);
