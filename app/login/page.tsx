import { LoginForm } from "@/components";
import Link from "next/link";

export default function Login() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <LoginForm />

        <p className="mt-10 text-center text-sm text-gray-400">
          Don't have an account yet?{' '}
          <Link href="/signup" className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  )
}
