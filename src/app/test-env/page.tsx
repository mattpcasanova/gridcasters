'use client';

export default function TestEnv() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Test</h1>
      
      <div className="space-y-2">
        <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set'}</p>
        <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</p>
        <p><strong>SUPABASE_SERVICE_ROLE_KEY:</strong> {process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set'}</p>
      </div>
      
      <div className="mt-4">
        <p><strong>URL Preview:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20)}...</p>
        <p><strong>Anon Key Preview:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</p>
      </div>
    </div>
  );
} 