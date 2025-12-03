-- Add slug column to tailor_profiles
ALTER TABLE tailor_profiles 
ADD COLUMN slug TEXT UNIQUE;

-- Create extension for slug generation if not exists
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Function to generate slug
CREATE OR REPLACE FUNCTION generate_slug(name text) RETURNS text AS $$
DECLARE
  new_slug text;
BEGIN
  -- Convert to lowercase, remove accents, replace non-alphanumeric with hyphens
  new_slug := lower(
    regexp_replace(
      regexp_replace(
        unaccent(name), 
        '[^a-zA-Z0-9\s-]', '', 'g'
      ),
      '\s+', '-', 'g'
    )
  );
  
  -- Remove leading/trailing hyphens
  new_slug := trim(both '-' from new_slug);
  
  RETURN new_slug;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to set slug on insert/update
CREATE OR REPLACE FUNCTION set_tailor_slug() RETURNS TRIGGER AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 1;
BEGIN
  -- Only generate if business_name is present and (slug is null or business_name changed)
  IF NEW.business_name IS NOT NULL AND (NEW.slug IS NULL OR NEW.business_name <> OLD.business_name) THEN
    base_slug := generate_slug(NEW.business_name);
    final_slug := base_slug;
    
    -- Handle collisions by appending a number
    WHILE EXISTS (SELECT 1 FROM tailor_profiles WHERE slug = final_slug AND id <> NEW.id) LOOP
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    END LOOP;
    
    NEW.slug := final_slug;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_set_tailor_slug ON tailor_profiles;
CREATE TRIGGER trigger_set_tailor_slug
  BEFORE INSERT OR UPDATE ON tailor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_tailor_slug();

-- Backfill existing records
UPDATE tailor_profiles SET business_name = business_name WHERE business_name IS NOT NULL;
