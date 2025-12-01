/*
  # Create use_cases table

  1. New Tables
    - `use_cases`
      - `id` (uuid, primary key) - Unique identifier for each use case
      - `title` (varchar) - Use case title
      - `short_description` (text) - Brief description
      - `full_description` (text) - Detailed description
      - `department` (varchar) - Department name
      - `status` (varchar) - Current status
      - `owner_name` (varchar) - Owner's name
      - `owner_email` (varchar) - Owner's email
      - `image_url` (text) - Image URL
      - `business_impact` (text) - Business impact description
      - `technology_stack` (jsonb) - Array of technologies
      - `internal_links` (jsonb) - Links object
      - `tags` (jsonb) - Array of tags
      - `related_use_case_ids` (jsonb) - Array of related use case IDs
      - `application_url` (text) - Application URL
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Update timestamp

  2. Security
    - Enable RLS on `use_cases` table
    - Add policy for public read access
    - Add policy for authenticated users to create use cases
    - Add policy for authenticated users to update use cases
    - Add policy for authenticated users to delete use cases

  3. Important Notes
    - Includes indexes for better query performance
    - Includes check constraints for department and status validation
    - Email validation constraint
*/

CREATE TABLE IF NOT EXISTS use_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar(255) NOT NULL,
  short_description text NOT NULL,
  full_description text NOT NULL,
  department varchar(50) NOT NULL,
  status varchar(50) NOT NULL,
  owner_name varchar(255) NOT NULL,
  owner_email varchar(255) NOT NULL,
  image_url text,
  business_impact text,
  technology_stack jsonb DEFAULT '[]'::jsonb,
  internal_links jsonb DEFAULT '{}'::jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  related_use_case_ids jsonb DEFAULT '[]'::jsonb,
  application_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE use_cases ENABLE ROW LEVEL SECURITY;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_use_cases_department ON use_cases(department);
CREATE INDEX IF NOT EXISTS idx_use_cases_status ON use_cases(status);
CREATE INDEX IF NOT EXISTS idx_use_cases_created_at ON use_cases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_use_cases_tags ON use_cases USING GIN(tags);

-- Add check constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_department'
  ) THEN
    ALTER TABLE use_cases
      ADD CONSTRAINT check_department CHECK (
        department IN ('Marketing', 'R&D', 'Procurement', 'IT', 'HR', 'Operations')
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_status'
  ) THEN
    ALTER TABLE use_cases
      ADD CONSTRAINT check_status CHECK (
        status IN ('Ideation', 'Pre-Evaluation', 'Evaluation', 'PoC', 'MVP', 'Live', 'Archived')
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_email_format'
  ) THEN
    ALTER TABLE use_cases
      ADD CONSTRAINT check_email_format CHECK (
        owner_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
      );
  END IF;
END $$;

-- RLS Policies
CREATE POLICY "Anyone can read use cases"
  ON use_cases
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create use cases"
  ON use_cases
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update use cases"
  ON use_cases
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete use cases"
  ON use_cases
  FOR DELETE
  TO authenticated
  USING (true);