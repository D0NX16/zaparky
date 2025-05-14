/*
  # Create parking spots schema

  1. New Tables
    - `parking_spots`
      - `id` (uuid, primary key)
      - `owner_id` (uuid, references auth.users)
      - `title` (text)
      - `description` (text)
      - `address` (text)
      - `lat` (double precision)
      - `lng` (double precision)
      - `hourly_rate` (numeric)
      - `daily_rate` (numeric)
      - `amenities` (text[])
      - `images` (text[])
      - `rating` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `availability_periods`
      - `id` (uuid, primary key)
      - `spot_id` (uuid, references parking_spots)
      - `day_of_week` (integer)
      - `start_time` (time)
      - `end_time` (time)
      - `is_recurring` (boolean)

    - `reviews`
      - `id` (uuid, primary key)
      - `spot_id` (uuid, references parking_spots)
      - `user_id` (uuid, references auth.users)
      - `rating` (integer)
      - `comment` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read all spots
    - Add policies for spot owners to manage their spots
    - Add policies for users to create reviews
*/

-- Create parking_spots table
CREATE TABLE IF NOT EXISTS parking_spots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text,
  address text NOT NULL,
  lat double precision,
  lng double precision,
  hourly_rate numeric NOT NULL,
  daily_rate numeric NOT NULL,
  amenities text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  rating numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create availability_periods table
CREATE TABLE IF NOT EXISTS availability_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id uuid REFERENCES parking_spots ON DELETE CASCADE NOT NULL,
  day_of_week integer,
  start_time time,
  end_time time,
  is_recurring boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id uuid REFERENCES parking_spots ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE parking_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies for parking_spots
CREATE POLICY "Anyone can view parking spots"
  ON parking_spots
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create their own parking spots"
  ON parking_spots
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own parking spots"
  ON parking_spots
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own parking spots"
  ON parking_spots
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Policies for availability_periods
CREATE POLICY "Anyone can view availability periods"
  ON availability_periods
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Spot owners can manage availability periods"
  ON availability_periods
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parking_spots
      WHERE id = spot_id AND owner_id = auth.uid()
    )
  );

-- Policies for reviews
CREATE POLICY "Anyone can view reviews"
  ON reviews
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create function to update spot rating
CREATE OR REPLACE FUNCTION update_spot_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE parking_spots
  SET rating = (
    SELECT ROUND(AVG(rating)::numeric, 1)
    FROM reviews
    WHERE spot_id = NEW.spot_id
  )
  WHERE id = NEW.spot_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update rating on review changes
CREATE TRIGGER update_spot_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_spot_rating();

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_parking_spots_address ON parking_spots USING GIN (to_tsvector('english', address));
CREATE INDEX IF NOT EXISTS idx_parking_spots_title ON parking_spots USING GIN (to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_parking_spots_location ON parking_spots USING GIST (point(lat, lng));