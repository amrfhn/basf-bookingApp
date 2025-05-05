UPDATE public.floors
SET map = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" viewBox="0 0 1300 700" >
  <defs>
    <clipPath id="clip0">
      <rect x="-1" y="11" width="1278" height="698" />
    </clipPath>
  </defs>
  <style type="text/css">
    .st0{fill:none;}
    .shapes{fill-rule="evenodd";}
    .kShape{fill:#00793A;}
    .iShape{fill:#014a97;}
    .jShape{fill:#65AC1E;}
    .lShape{fill:#21A0D2;}
    .mShape{fill:#00793A;}
    .nShape{fill:#65AC1E;}
    .ghShape{fill:#00793A;}
    .oShape{fill:#014a97;}
    .disabledShape{fill:#B3B3B3; opacity:0.3}
    .text{font-family:"Arial"}
    .shapeText{fill:#FFFFFF;font-size:32px;font-weight:700;}
    .noClick{pointer-events: none;}
  </style>
  <g clip-path="url(#clip0)" transform="translate(1 -11)">
    <g>
      <!-- Area K -->
      <g>
        <rect x="1044" y="41" width="232" height="67" class="shapes disabledShape" />
        <path d="M1276 364 1090.42 364 1090.42 281.434 964 281.434 964 94 1276 94Z" class="shapes disabledShape"/>
      </g>
      <!-- Area I -->
      <path d="M337.5 94.5001 650.5 94.5001 650.5 281.5 337.5 281.5Z" class="shapes disabledShape" />
      <!-- Area J -->
      <path d="M650.5 94.5001 964.5 94.5001 964.5 281.5 650.5 281.5Z" class="shapes disabledShape" />
      <!-- Area L -->
      <path d="M744.5 281.5 744.5 520.5 557.5 520.5 557.5 281.5Z" class="shapes disabledShape" />
      <!-- Area M -->
      <path d="M202.5 520.5 650.5 520.5 650.5 707.5 202.5 707.5Z" class="shapes disabledShape" />
      <!-- Area N -->
      <path d="M650.5 520.5 964.5 520.5 964.5 707.5 650.5 707.5Z" class="shapes disabledShape" />
      <!-- Area G-H -->
      <path d="M0.500053 12.5001 338.5 12.5001 338.5 348.5 0.500053 348.5Z" class="shapes disabledShape" />
      <!-- Area O -->
      <path d="M964 708 964 519.618 1090.6 519.618 1090.6 363 1277 363 1277 708Z" class="area shapes oShape" id="area-O" />
    </g>
    <g>
      <text class="noClick text shapeText" transform="translate(797.06 194)">J</text>
      <text class="noClick text shapeText" transform="translate(642.693 410.50)">L</text>
      <text class="noClick text shapeText" transform="translate(488.325 194)">I</text>
      <text class="noClick text shapeText" transform="translate(410.585 627)">M</text>
      <text class="noClick text shapeText" transform="translate(793.977 627)">N</text>
      <text class="noClick text shapeText" transform="translate(1145.74 627)">O</text>
      <text class="noClick text shapeText" transform="translate(1146.74 194)">K</text>
      <text class="noClick text shapeText" transform="translate(136.063 194)">G-H</text>
    </g>
  </g>
</svg>'
WHERE id IN (
    SELECT f.id
    FROM floors AS f
             INNER JOIN buildings AS b ON b.id = f."buildingId"
    WHERE b.name = 'OBC03' AND f.number in (0)
);

UPDATE public.floors
SET map = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" viewBox="0 0 1300 700" >
  <defs>
    <clipPath id="clip0">
      <rect x="-1" y="11" width="1278" height="698" />
    </clipPath>
  </defs>
  <style type="text/css">
    .st0{fill:none;}
    .shapes{fill-rule="evenodd";}
    .kShape{fill:#00793A;}
    .iShape{fill:#014a97;}
    .jShape{fill:#65AC1E;}
    .lShape{fill:#21A0D2;}
    .mShape{fill:#00793A;}
    .nShape{fill:#65AC1E;}
    .ghShape{fill:#00793A;}
    .oShape{fill:#014a97;}
    .disabledShape{fill:#B3B3B3; opacity:0.3}
    .text{font-family:"Arial"}
    .shapeText{fill:#FFFFFF;font-size:32px;font-weight:700;}
    .noClick{pointer-events: none;}
  </style>
  <g clip-path="url(#clip0)" transform="translate(1 -11)">
    <g>
      <!-- Area K -->
      <g class="area" id="area-K">
        <rect x="1044" y="41" width="232" height="67" class="shapes kShape" />
        <path d="M1276 364 1090.42 364 1090.42 281.434 964 281.434 964 94 1276 94Z" class="shapes kShape"/>
      </g>
      <!-- Area I -->
      <path d="M337.5 94.5001 650.5 94.5001 650.5 281.5 337.5 281.5Z" class="shapes disabledShape" />
      <!-- Area J -->
      <path d="M650.5 94.5001 964.5 94.5001 964.5 281.5 650.5 281.5Z" class="area shapes jShape" id="area-J" />
      <!-- Area L -->
      <path d="M744.5 281.5 744.5 520.5 557.5 520.5 557.5 281.5Z" class="area shapes lShape" id="area-L" />
      <!-- Area M -->
      <path d="M202.5 520.5 650.5 520.5 650.5 707.5 202.5 707.5Z" class="area shapes mShape" id="area-M" />
      <!-- Area N -->
      <path d="M650.5 520.5 964.5 520.5 964.5 707.5 650.5 707.5Z" class="area shapes nShape" id="area-N" />
      <!-- Area G-H -->
      <path d="M0.500053 12.5001 338.5 12.5001 338.5 348.5 0.500053 348.5Z" class="shapes disabledShape" />
      <!-- Area O -->
      <path d="M964 708 964 519.618 1090.6 519.618 1090.6 363 1277 363 1277 708Z" class="shapes disabledShape" />
    </g>
    <g>
      <text class="noClick text shapeText" transform="translate(797.06 194)">J</text>
      <text class="noClick text shapeText" transform="translate(642.693 410.50)">L</text>
      <text class="noClick text shapeText" transform="translate(488.325 194)">I</text>
      <text class="noClick text shapeText" transform="translate(410.585 627)">M</text>
      <text class="noClick text shapeText" transform="translate(793.977 627)">N</text>
      <text class="noClick text shapeText" transform="translate(1145.74 627)">O</text>
      <text class="noClick text shapeText" transform="translate(1146.74 194)">K</text>
      <text class="noClick text shapeText" transform="translate(136.063 194)">G-H</text>
    </g>
  </g>
</svg>'
WHERE id IN (
    SELECT f.id
    FROM floors AS f
             INNER JOIN buildings AS b ON b.id = f."buildingId"
    WHERE b.name = 'OBC03' AND f.number in (1)
);

UPDATE public.floors
SET map = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" viewBox="0 0 1300 700" >
  <defs>
    <clipPath id="clip0">
      <rect x="-1" y="11" width="1278" height="698" />
    </clipPath>
  </defs>
  <style type="text/css">
    .st0{fill:none;}
    .shapes{fill-rule="evenodd";}
    .kShape{fill:#00793A;}
    .iShape{fill:#014a97;}
    .jShape{fill:#65AC1E;}
    .lShape{fill:#21A0D2;}
    .mShape{fill:#00793A;}
    .nShape{fill:#65AC1E;}
    .ghShape{fill:#00793A;}
    .oShape{fill:#014a97;}
    .disabledShape{fill:#B3B3B3; opacity:0.3}
    .text{font-family:"Arial"}
    .shapeText{fill:#FFFFFF;font-size:32px;font-weight:700;}
    .noClick{pointer-events: none;}
  </style>
  <g clip-path="url(#clip0)" transform="translate(1 -11)">
    <g>
      <!-- Area K -->
      <g class="area" id="area-K">
        <rect x="1044" y="41" width="232" height="67" class="shapes kShape" />
        <path d="M1276 364 1090.42 364 1090.42 281.434 964 281.434 964 94 1276 94Z" class="shapes kShape" />
      </g>
      <!-- Area I -->
      <path d="M337.5 94.5001 650.5 94.5001 650.5 281.5 337.5 281.5Z" class="area shapes iShape" id="area-I" />
      <!-- Area J -->
      <path d="M650.5 94.5001 964.5 94.5001 964.5 281.5 650.5 281.5Z" class="area shapes jShape" id="area-J" />
      <!-- Area L -->
      <path d="M744.5 281.5 744.5 520.5 557.5 520.5 557.5 281.5Z" class="area shapes lShape" id="area-L" />
      <!-- Area M -->
      <path d="M202.5 520.5 650.5 520.5 650.5 707.5 202.5 707.5Z" class="area shapes mShape" id="area-M" />
      <!-- Area N -->
      <path d="M650.5 520.5 964.5 520.5 964.5 707.5 650.5 707.5Z" class="area shapes nShape" id="area-N" />
      <!-- Area G-H -->
      <path d="M0.500053 12.5001 338.5 12.5001 338.5 348.5 0.500053 348.5Z" class="area shapes ghShape" id="area-G-H" />
      <!-- Area O -->
      <path d="M964 708 964 519.618 1090.6 519.618 1090.6 363 1277 363 1277 708Z" class="area shapes oShape" id="area-O" />
    </g>
    <g>
      <text class="noClick text shapeText" transform="translate(797.06 194)">J</text>
      <text class="noClick text shapeText" transform="translate(642.693 410.50)">L</text>
      <text class="noClick text shapeText" transform="translate(488.325 194)">I</text>
      <text class="noClick text shapeText" transform="translate(410.585 627)">M</text>
      <text class="noClick text shapeText" transform="translate(793.977 627)">N</text>
      <text class="noClick text shapeText" transform="translate(1145.74 627)">O</text>
      <text class="noClick text shapeText" transform="translate(1146.74 194)">K</text>
      <text class="noClick text shapeText" transform="translate(136.063 194)">G-H</text>
    </g>
  </g>
</svg>'
WHERE id IN (
    SELECT f.id
    FROM floors AS f
             INNER JOIN buildings AS b ON b.id = f."buildingId"
    WHERE b.name = 'OBC03' AND f.number in (2,3,4)
);

UPDATE public.floors
SET map = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" viewBox="0 0 1300 700" >
  <defs>
    <clipPath id="clip0">
      <rect x="-1" y="11" width="1278" height="698" />
    </clipPath>
  </defs>
  <style type="text/css">
    .st0{fill:none;}
    .shapes{fill-rule="evenodd";}
    .kShape{fill:#00793A;}
    .iShape{fill:#014a97;}
    .jShape{fill:#65AC1E;}
    .lShape{fill:#21A0D2;}
    .mShape{fill:#00793A;}
    .nShape{fill:#65AC1E;}
    .ghShape{fill:#00793A;}
    .oShape{fill:#014a97;}
    .disabledShape{fill:#B3B3B3; opacity:0.3}
    .text{font-family:"Arial"}
    .shapeText{fill:#FFFFFF;font-size:32px;font-weight:700;}
    .noClick{pointer-events: none;}
  </style>
  <g clip-path="url(#clip0)" transform="translate(1 -11)">
    <g>
      <!-- Area K -->
      <g class="area" id="area-K">
        <rect x="1044" y="41" width="232" height="67" class="shapes kShape" />
        <path d="M1276 364 1090.42 364 1090.42 281.434 964 281.434 964 94 1276 94Z" class="shapes kShape" />
      </g>
      <!-- Area I -->
      <path d="M337.5 94.5001 650.5 94.5001 650.5 281.5 337.5 281.5Z" class="shapes disabledShape" />
      <!-- Area J -->
      <path d="M650.5 94.5001 964.5 94.5001 964.5 281.5 650.5 281.5Z" class="area shapes jShape" id="area-J" />
      <!-- Area L -->
      <path d="M744.5 281.5 744.5 520.5 557.5 520.5 557.5 281.5Z" class="area shapes lShape" id="area-L" />
      <!-- Area M -->
      <path d="M202.5 520.5 650.5 520.5 650.5 707.5 202.5 707.5Z" class="area shapes mShape" id="area-M" />
      <!-- Area N -->
      <path d="M650.5 520.5 964.5 520.5 964.5 707.5 650.5 707.5Z" class="area shapes nShape" id="area-N" />
      <!-- Area G-H -->
      <path d="M0.500053 12.5001 338.5 12.5001 338.5 348.5 0.500053 348.5Z" class="area shapes ghShape" id="area-G-H" />
      <!-- Area O -->
      <path d="M964 708 964 519.618 1090.6 519.618 1090.6 363 1277 363 1277 708Z" class="area shapes oShape" id="area-O" />
    </g>
    <g>
      <text class="noClick text shapeText" transform="translate(797.06 194)">J</text>
      <text class="noClick text shapeText" transform="translate(642.693 410.50)">L</text>
      <text class="noClick text shapeText" transform="translate(488.325 194)">I</text>
      <text class="noClick text shapeText" transform="translate(410.585 627)">M</text>
      <text class="noClick text shapeText" transform="translate(793.977 627)">N</text>
      <text class="noClick text shapeText" transform="translate(1145.74 627)">O</text>
      <text class="noClick text shapeText" transform="translate(1146.74 194)">K</text>
      <text class="noClick text shapeText" transform="translate(136.063 194)">G-H</text>
    </g>
  </g>
</svg>'
WHERE id IN (
    SELECT f.id
    FROM floors AS f
             INNER JOIN buildings AS b ON b.id = f."buildingId"
    WHERE b.name = 'OBC03' AND f.number in (5)
);
