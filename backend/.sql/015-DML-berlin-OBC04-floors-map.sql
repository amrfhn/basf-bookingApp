UPDATE public.floors
SET map = '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 450 200">
  <defs>
    <clipPath id="bounding-box">
      <rect x="537" y="403" width="420" height="206"/>
    </clipPath>
  </defs>
    <style type="text/css">
    .st0{fill:none;}
    .lShapes{fill:#4472C4;fill-rule:evenodd;}
    .text{font-family:"Arial"}
    .shapeText{fill:#FFFFFF;font-size:21px;font-weight:700;}
    .otherText{font-size:19px;font-weight:400;}
    .noClick{pointer-events: none;}
    </style>
    <g clip-path="url(#bounding-box)" transform="translate(-537 -403)">
        <g>
            <path id="area-13" class="lShapes area" d="M0 0 56.256 0 56.256 120.991 96 120.991 96 181 0 181Z" transform="matrix(6.12323e-17 1 1 -6.12323e-17 775 403)" />
            <path id="area-14" class="lShapes area" d="M775 608 775 551.744 895.99 551.744 895.99 512 956 512 956 608Z"/>
            <path id="area-15" class="lShapes area" d="M0 0 56.256 0 56.256 120.991 96 120.991 96 181 0 181Z" transform="matrix(-6.12323e-17 -1 -1 6.12323e-17 762 608)" />
            <path id="area-16" class="lShapes area" d="M762 403 762 459.256 641.009 459.256 641.009 499 581 499 581 403Z"/>
        </g>
        <g>
            <text class="noClick text shapeText" transform="translate(914.595 437)">13</text>
            <text class="noClick text shapeText" transform="translate(914.595 586)">14</text>
            <text class="noClick text shapeText" transform="translate(599.195 586)">15</text>
            <text class="noClick text shapeText" transform="translate(599.195 437)">16</text>
        </g>
        <text class="noClick text otherText" transform="matrix(-1.83697e-16 -1 1 -1.83697e-16 561.692 545)">Naglerstr.</text>
    </g>
</svg>'
WHERE id IN (
    SELECT f.id
    FROM floors AS f
             INNER JOIN buildings AS b ON b.id = f."buildingId"
    WHERE b.name = 'OBC04' AND f.number in (5)
);

UPDATE public.floors
SET map = '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 450 200">
  <defs>
    <clipPath id="bounding-box">
      <rect x="537" y="403" width="420" height="206"/>
    </clipPath>
  </defs>
    <style type="text/css">
    .st0{fill:none;}
    .lShapes{fill:#4472C4;fill-rule:evenodd;}
    .text{font-family:"Arial"}
    .shapeText{fill:#FFFFFF;font-size:21px;font-weight:700;}
    .otherText{font-size:19px;font-weight:400;}
    .noClick{pointer-events: none;}
    </style>
    <g clip-path="url(#bounding-box)" transform="translate(-537 -403)">
        <g>
            <path id="area-13" class="lShapes area" d="M0 0 56.256 0 56.256 120.991 96 120.991 96 181 0 181Z" transform="matrix(6.12323e-17 1 1 -6.12323e-17 775 403)" />
            <path id="area-14" class="lShapes area" d="M775 608 775 551.744 895.99 551.744 895.99 512 956 512 956 608Z"/>
            <path id="area-15" class="lShapes area" d="M0 0 56.256 0 56.256 120.991 96 120.991 96 181 0 181Z" transform="matrix(-6.12323e-17 -1 -1 6.12323e-17 762 608)" />
        </g>
        <g>
            <text class="noClick text shapeText" transform="translate(914.595 437)">13</text>
            <text class="noClick text shapeText" transform="translate(914.595 586)">14</text>
            <text class="noClick text shapeText" transform="translate(599.195 586)">15</text>
        </g>
        <text class="noClick text otherText" transform="matrix(-1.83697e-16 -1 1 -1.83697e-16 561.692 545)">Naglerstr.</text>
    </g>
</svg>
'
WHERE id IN (
    SELECT f.id
    FROM floors AS f
             INNER JOIN buildings AS b ON b.id = f."buildingId"
    WHERE b.name = 'OBC04' AND f.number in (1,4)
);
