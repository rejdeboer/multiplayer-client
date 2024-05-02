import { SignupForm } from "@/components";
import Link from "next/link";

export default function Signup() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Sign up for an account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <SignupForm />

        <p className="mt-10 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}
