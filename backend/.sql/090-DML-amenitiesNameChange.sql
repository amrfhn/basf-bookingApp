UPDATE public.amenities
SET en_name = 'Electric desk'
WHERE en_name = 'ergonomic'

UPDATE public.amenities
SET en_name = 'Adjustable desk'
WHERE en_name = 'manual adjustable'

UPDATE public.amenities
SET en_name = 'Standard desk'
WHERE en_name = 'not adjustable'

UPDATE public.amenities
SET de_name = 'Elektrischer Tisch'
WHERE de_name = 'ergonomisch'

UPDATE public.amenities
SET de_name = 'Kurbeltisch'
WHERE de_name = 'manuell einstellbar'

UPDATE public.amenities
SET de_name = 'Standardtisch'
WHERE de_name = 'nicht einstellbar';
