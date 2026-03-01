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
import { register as registerUser } from '@/features/auth/api';

const registerSchema = z.object({
  email: z.string().email('Enter valid email'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);
      setError(null);
      await registerUser({
        email: data.email,
        username: data.username,
        password: data.password,
      });
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
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
        <h1 className="text-2xl font-bold mb-8 px-2">Register</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            placeholder="Enter Email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            placeholder="Create Username"
            {...register('username')}
            error={errors.username?.message}
          />
          <Input
            type="password"
            placeholder="Create Password"
            {...register('password')}
            error={errors.password?.message}
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
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
              Register
            </Button>
          </div>
        </form>

        <footer className="mt-8 text-center text-sm">
          <p className="text-white">
            Have an account?{' '}
            <Link href="/login" className="text-white/80 font-medium ml-1 underline hover:text-white">
              Login here
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
