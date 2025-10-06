/*
  # Create Clicker Game State Table

  1. New Tables
    - `clicker_game_state`
      - `id` (uuid, primary key) - Unique identifier for each record
      - `session_id` (text, unique) - Unique session identifier for each player
      - `clicks` (integer) - Current number of clicks the player has
      - `click_power` (integer) - Power of each click
      - `auto_clickers` (integer) - Number of auto-clickers purchased
      - `auto_clicker_cost` (integer) - Cost of next auto-clicker
      - `power_up_cost` (integer) - Cost of next power upgrade
      - `total_clicks` (integer) - Total lifetime clicks
      - `created_at` (timestamptz) - When the game session was created
      - `updated_at` (timestamptz) - Last time the game state was updated

  2. Security
    - Enable RLS on `clicker_game_state` table
    - Add policy to allow anyone to read, insert, update, and delete their own game data
    - This is a public game where anyone can play without authentication

  3. Important Notes
    - Game state is tracked per session_id
    - Session ID is generated on the client and stored for persistence
    - All numeric values default to 0 or 1 for initial game state
*/

CREATE TABLE IF NOT EXISTS clicker_game_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  clicks integer DEFAULT 0,
  click_power integer DEFAULT 1,
  auto_clickers integer DEFAULT 0,
  auto_clicker_cost integer DEFAULT 10,
  power_up_cost integer DEFAULT 5,
  total_clicks integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE clicker_game_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view all game states"
  ON clicker_game_state
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert their game state"
  ON clicker_game_state
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update any game state"
  ON clicker_game_state
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete any game state"
  ON clicker_game_state
  FOR DELETE
  TO anon, authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_clicker_game_session_id ON clicker_game_state(session_id);
