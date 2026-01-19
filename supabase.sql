-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.daily_games (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  date date NOT NULL UNIQUE,
  make_id bigint,
  model_id bigint,
  year integer NOT NULL,
  image_url text NOT NULL,
  game_over_image_url text,
  transform_origin text DEFAULT 'center center'::text,
  max_zoom double precision DEFAULT 1.0,
  created_at timestamp with time zone DEFAULT now(),
  source text,
  country text,
  fun_facts text,
  CONSTRAINT daily_games_pkey PRIMARY KEY (id),
  CONSTRAINT daily_games_make_id_fkey FOREIGN KEY (make_id) REFERENCES public.makes(id),
  CONSTRAINT daily_games_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.models(id)
);
CREATE TABLE public.daily_wager_auctions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT now(),
  cover_image_url text NOT NULL,
  source_url text NOT NULL,
  auction_end_time timestamp with time zone NOT NULL,
  is_reserve boolean DEFAULT false,
  final_price numeric,
  winner_user_id uuid,
  status text DEFAULT 'active'::text,
  title text,
  reserve_met boolean DEFAULT true,
  CONSTRAINT daily_wager_auctions_pkey PRIMARY KEY (id),
  CONSTRAINT daily_wager_auctions_winner_user_id_fkey FOREIGN KEY (winner_user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.daily_wager_guesses (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  user_id uuid NOT NULL,
  auction_id uuid NOT NULL,
  bid_amount numeric NOT NULL,
  reserve_not_met boolean DEFAULT false,
  CONSTRAINT daily_wager_guesses_pkey PRIMARY KEY (id),
  CONSTRAINT daily_wager_guesses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT daily_wager_guesses_auction_id_fkey FOREIGN KEY (auction_id) REFERENCES public.daily_wager_auctions(id)
);
CREATE TABLE public.driving_blind (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  date date NOT NULL DEFAULT CURRENT_DATE UNIQUE,
  make_id bigint NOT NULL,
  model_id bigint NOT NULL,
  year integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT driving_blind_pkey PRIMARY KEY (id),
  CONSTRAINT driving_blind_make_id_fkey FOREIGN KEY (make_id) REFERENCES public.makes(id),
  CONSTRAINT driving_blind_model_id_fkey FOREIGN KEY (model_id) REFERENCES public.models(id)
);
CREATE TABLE public.game_progress (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  daily_game_id bigint,
  guesses jsonb DEFAULT '[]'::jsonb,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT game_progress_pkey PRIMARY KEY (id),
  CONSTRAINT game_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT game_progress_daily_game_id_fkey FOREIGN KEY (daily_game_id) REFERENCES public.daily_games(id)
);
CREATE TABLE public.makes (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL UNIQUE,
  CONSTRAINT makes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.models (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  make_id bigint,
  name text NOT NULL,
  CONSTRAINT models_pkey PRIMARY KEY (id),
  CONSTRAINT models_make_id_fkey FOREIGN KEY (make_id) REFERENCES public.makes(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  username text UNIQUE,
  last_login timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  is_admin boolean DEFAULT false,
  full_name text,
  avatar_url text,
  email text,
  grand_prix_wins integer DEFAULT 0,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_scores (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid,
  daily_game_id bigint,
  score integer NOT NULL,
  completed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_scores_pkey PRIMARY KEY (id),
  CONSTRAINT user_scores_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT user_scores_daily_game_id_fkey FOREIGN KEY (daily_game_id) REFERENCES public.daily_games(id)
);