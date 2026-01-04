/*
  # Create Download History Table

  1. New Tables
    - `download_history`
      - `id` (uuid, primary key) - Unique identifier for each download
      - `video_url` (text) - Original video URL
      - `video_title` (text) - Title of the video
      - `platform` (text) - Platform name (youtube, instagram, facebook)
      - `quality` (text) - Selected quality (360p, 480p, 720p, 1080p)
      - `thumbnail_url` (text) - Thumbnail image URL
      - `duration` (text) - Video duration
      - `file_name` (text) - Simulated file name
      - `download_date` (timestamptz) - Timestamp of download
      - `created_at` (timestamptz) - Record creation timestamp
  
  2. Security
    - Enable RLS on `download_history` table
    - Add policy for users to manage their own download history
    
  3. Notes
    - This is for educational purposes to demonstrate download workflow
    - No actual video files are stored, only metadata
    - All downloads are simulated for demo purposes
*/

CREATE TABLE IF NOT EXISTS download_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  video_url text NOT NULL,
  video_title text NOT NULL,
  platform text NOT NULL,
  quality text NOT NULL,
  thumbnail_url text,
  duration text,
  file_name text NOT NULL,
  download_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE download_history ENABLE ROW LEVEL SECURITY;

-- Policy to allow all operations for demo purposes
-- In production, this would check auth.uid() for user-specific access
CREATE POLICY "Allow all operations for demo"
  ON download_history
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);