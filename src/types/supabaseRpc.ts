
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from "@/integrations/supabase/types";

// Define return types for our RPC functions
export type RpcReturnTypes = {
  // This is now empty as we've removed PIN-related functions
};

// Define parameter types for our RPC functions
export type RpcParamTypes = {
  // This is now empty as we've removed PIN-related functions
};

// Define a type for valid RPC function names
export type RpcFunctionName = keyof RpcReturnTypes;

// This helper function adds type safety to our RPC calls
export function typedRpc<T extends RpcFunctionName>(
  supabaseClient: SupabaseClient<Database>,
  name: T,
  params: RpcParamTypes[T] = {} as RpcParamTypes[T]
): Promise<RpcReturnTypes[T]> {
  return supabaseClient.rpc(name, params) as unknown as Promise<RpcReturnTypes[T]>;
}
