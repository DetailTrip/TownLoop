'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TextInput from '@/components/ui/TextInput'; // Import TextInput

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setMessageType(null);

    try {
      let authResponse;
      if (isLogin) {
        authResponse = await supabase.auth.signInWithPassword({ email, password });
      } else {
        authResponse = await supabase.auth.signUp({ email, password });
      }

      const { data, error } = authResponse;

      if (error) {
        throw error;
      }

      if (isLogin) {
        setMessage('Logged in successfully!');
        setMessageType('success');
        router.push('/'); // Redirect to homepage after login
      } else {
        setMessage('Sign-up successful! Please check your email to confirm your account.');
        setMessageType('success');
      }
    } catch (error: any) {
      setMessage(error.message);
      setMessageType('error');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-4">
          <Link href="/" className="text-blue-500 hover:text-blue-800 text-sm">&larr; Back to Home</Link>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>
        {message && (
          <div className={`p-3 mb-4 rounded-md text-sm ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleAuth}>
          <div className="mb-5">
            <TextInput 
              label="Email" 
              id="email" 
              name="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com" 
              required
            />
          </div>
          <div className="mb-6">
            <TextInput 
              label="Password" 
              id="password" 
              name="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********" 
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button 
              type="submit" 
              aria-label={isLogin ? 'Login' : 'Sign Up'} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
            {!isLogin && (
              <a href="#" aria-label="Forgot Password?" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                Forgot Password?
              </a>
            )}
          </div>
          <p className="text-center text-gray-600 text-xs mt-4">
            {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}{' '}
            <button 
              type="button" 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-blue-500 hover:text-blue-800 font-bold"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}