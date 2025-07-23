
-- Create table for admin PIN reset tokens
CREATE TABLE IF NOT EXISTS public.admin_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  token TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false
);

-- Enable row level security
ALTER TABLE public.admin_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own reset tokens
CREATE POLICY "Users can view their own reset tokens"
  ON public.admin_reset_tokens
  FOR SELECT
  USING (auth.uid() = admin_id);

-- Create RPC function to insert a reset token
CREATE OR REPLACE FUNCTION public.insert_admin_reset_token(
  p_admin_id UUID,
  p_token TEXT,
  p_expires_at TIMESTAMPTZ
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_reset_tokens (
    admin_id, token, expires_at
  ) VALUES (
    p_admin_id, p_token, p_expires_at
  );
END;
$$;

-- Create RPC function to validate a token
CREATE OR REPLACE FUNCTION public.validate_admin_reset_token(
  p_admin_id UUID,
  p_token TEXT
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  token_valid boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_reset_tokens
    WHERE admin_id = p_admin_id
    AND token = p_token
    AND expires_at > now()
    AND used = false
  ) INTO token_valid;
  
  RETURN token_valid;
END;
$$;

-- Create RPC function to mark a token as used
CREATE OR REPLACE FUNCTION public.mark_admin_reset_token_used(
  p_admin_id UUID
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.admin_reset_tokens
  SET used = true
  WHERE admin_id = p_admin_id
  AND used = false;
END;
$$;
