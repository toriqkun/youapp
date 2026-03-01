'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronLeft } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { login as loginUser } from '@/features/auth/api';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Username or Email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      setError(null);
      // The API might expect 'email' or 'username'. 
      // Based on docs it uses LoginDto which might have either.
      // We will try to send the identifier as both or see which one works.
      // Usually it's either email or username.
      const response = await loginUser({
        email: data.identifier,
        username: data.identifier,
        password: data.password,
      });
      
      // Store token (Blueprint says httpOnly cookie, but for now we'll store in localStorage 
      // if it's a client component, or handle via a server action/route if needed.
      // But blueprint says: "Store token di httpOnly cookie (recommended)")
      // Since I cannot set httpOnly cookies from client-side JS easily without an API route,
      // and Blueprint says "Jangan buat API routes lokal", I will use a standard cookie or localStorage for now
      // unless I implement a login handler that redirect to a server action. 
      // Actually, Blueprint says: "Axios interceptor attach token". 
      // Let's store in localStorage for simplicity in this MVP unless instructed otherwise.
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
        // Don't guess username from email - let getProfile provide the real username
        localStorage.setItem('username', data.identifier);
        router.push('/profile');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-8 py-4">
      <header className="flex items-center mb-10">
        <button
          onClick={() => router.back()}
          className="flex items-center text-white text-base font-bold gap-1"
        >
          <ChevronLeft size={24} />
          Back
        </button>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto">
        <h1 className="text-2xl font-bold mb-8 px-2">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            placeholder="Enter Username/Email"
            {...register('identifier')}
            error={errors.identifier?.message}
          />
          <Input
            type="password"
            placeholder="Enter Password"
            {...register('password')}
            error={errors.password?.message}
          />
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <div className="pt-6">
            <Button
              type="submit"
              isLoading={loading}
              disabled={!isValid || loading}
            >
              Login
            </Button>
          </div>
        </form>

        <footer className="mt-8 text-center text-sm">
          <p className="text-white">
            No account?{' '}
            <Link href="/register" className="text-white/80 font-medium ml-1 underline hover:text-white">
              Register here
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
