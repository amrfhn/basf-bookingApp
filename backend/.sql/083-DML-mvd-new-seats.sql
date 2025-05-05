/* Updates Piso 18 */
update seats s
set "startDate" = current_date, "endDate" = null
where s.id in (select s1.id from seats s1
    inner join areas a on s1."areaId" = a.id
    inner join floors f on a."floorId" = f.id
    inner join buildings b on f."buildingId" = b.id
where b.name = 'WTC Torre 4'
    and f.number = 18 and s1.code in (3, 7, 11, 15, 19, 27, 35, 39, 42, 48, 54, 60));

/* Updates Piso 19 */
update seats s
set "startDate" = current_date, "endDate" = null
where s.id in (select s1.id from seats s1
    inner join areas a on s1."areaId" = a.id
    inner join floors f on a."floorId" = f.id
    inner join buildings b on f."buildingId" = b.id
where b.name = 'WTC Torre 4'
    and f.number = 19 and s1.code in (9, 13, 19, 25, 26, 36, 38, 44, 55));

/* Updates Piso 20 */
update seats s
set "startDate" = current_date, "endDate" = null
where s.id in (select s1.id from seats s1
    inner join areas a on s1."areaId" = a.id
    inner join floors f on a."floorId" = f.id
    inner join buildings b on f."buildingId" = b.id
where b.name = 'WTC Torre 4'
    and f.number = 20 and s1.code in (1, 9, 19, 21, 27, 33, 39, 47, 53, 57, 58, 62, 64, 70, 76, 78, 84))

/* Updates Piso 21 */
update seats s
set "startDate" = current_date, "endDate" = null
where s.id in (select s1.id from seats s1
    inner join areas a on s1."areaId" = a.id
    inner join floors f on a."floorId" = f.id
    inner join buildings b on f."buildingId" = b.id
where b.name = 'WTC Torre 4'
    and f.number = 21 and s1.code in (5, 13, 21, 27, 35, 37, 46, 50, 54, 58, 59, 61, 69, 75, 83));

/* Updates Piso 22 */
update seats s
set "startDate" = current_date, "endDate" = null
where s.id in (select s1.id from seats s1
    inner join areas a on s1."areaId" = a.id
    inner join floors f on a."floorId" = f.id
    inner join buildings b on f."buildingId" = b.id
where b.name = 'WTC Torre 4'
    and f.number = 22 and s1.code in (5, 18, 22, 26, 32, 38, 44, 48, 52, 57, 63, 69, 73, 75));

/* Updates Piso 23 */
update seats s
set "startDate" = current_date, "endDate" = null
where s.id in (select s1.id from seats s1
    inner join areas a on s1."areaId" = a.id
    inner join floors f on a."floorId" = f.id
    inner join buildings b on f."buildingId" = b.id
where b.name = 'WTC Torre 4'
    and f.number = 23 and s1.code in (1, 9, 17, 27, 31, 36, 40, 44, 45, 51, 57, 63, 72));

/* Updates Piso 24 */
update seats s
set "startDate" = current_date, "endDate" = null
where s.id in (select s1.id from seats s1
    inner join areas a on s1."areaId" = a.id
    inner join floors f on a."floorId" = f.id
    inner join buildings b on f."buildingId" = b.id
where b.name = 'WTC Torre 4'
    and f.number = 24 and s1.code in (1, 5, 9, 13, 37, 53, 55, 59, 62));

/* Updates Piso 25 */
update seats s
set "startDate" = current_date, "endDate" = null
where s.id in (select s1.id from seats s1
    inner join areas a on s1."areaId" = a.id
    inner join floors f on a."floorId" = f.id
    inner join buildings b on f."buildingId" = b.id
where b.name = 'WTC Torre 4'
    and f.number = 25 and s1.code in (1, 9, 17, 23, 29, 38, 44, 50, 54, 58, 64, 70, 76));
