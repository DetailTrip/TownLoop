'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TextInput from '@/components/ui/TextInput'; // Import TextInput
import Script from 'next/script';

import { Database } from '@/lib/database.types';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [hCaptchaLoaded, setHCaptchaLoaded] = useState(false);
  const router = useRouter();

  // Handle hCaptcha verification
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).onHCaptchaVerify = (token: string) => {
        console.log('hCaptcha verified:', token);
        setCaptchaToken(token);
      };
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setMessageType(null);

    // Check if captcha is completed
    if (!captchaToken) {
      setMessage('Please complete the captcha verification');
      setMessageType('error');
      setLoading(false);
      return;
    }

    // Get hCaptcha token from state instead of window object
    const currentCaptchaToken = captchaToken;

    try {
      let authResponse;
      if (isLogin) {
        authResponse = await supabase.auth.signInWithPassword({ 
          email, 
          password,
          options: {
            captchaToken: currentCaptchaToken || undefined
          }
        });
      } else {
        authResponse = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            captchaToken: currentCaptchaToken || undefined
          }
        });
      }

      const { data, error } = authResponse;

      if (error) {
        throw error;
      }

      if (data.user) {
        // Ensure a profile exists for the user
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            username: data.user.email?.split('@')[0], // Basic username from email
          }, { onConflict: 'id' });

        if (profileError) {
          console.error('Error upserting profile:', profileError);
          setMessage(`Authentication successful, but failed to create profile: ${profileError.message}`);
          setMessageType('error');
          setLoading(false);
          return;
        }
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
    <>
      <Script 
        src="https://js.hcaptcha.com/1/api.js" 
        onLoad={() => setHCaptchaLoaded(true)}
      />
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
          
          {/* hCaptcha Widget */}
          <div className="mb-6">
            <div 
              className="h-captcha" 
              data-sitekey="3e82a2ee-aa6c-4404-bcf0-ffb4111a0dc6"
              data-callback="onHCaptchaVerify"
            ></div>
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
    </>
  );
}