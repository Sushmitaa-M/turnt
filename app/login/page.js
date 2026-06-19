import { Suspense } from 'react';
import AuthForm from '../components/AuthForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center">
      <Suspense fallback={
        <div className="text-[#F26A0A] font-bold tracking-widest uppercase animate-pulse">
          Loading...
        </div>
      }>
        <AuthForm />
      </Suspense>
    </main>
  );
}