-- Fix the last remaining function with search path issue
CREATE OR REPLACE FUNCTION public.validate_cell_constraints()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Start et End ne doivent pas avoir d'images ou d'audio
  IF NEW.cell_type IN ('start', 'end') THEN
    IF NEW.image_url IS NOT NULL OR NEW.audio_url IS NOT NULL THEN
      RAISE EXCEPTION 'Start and end cells cannot have images or audio';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;