import { TOKEN_KEY } from "@/lib/auth/token-key.constant";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Protected({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const store = cookies()
  const token = store.get(TOKEN_KEY)

  if (token === undefined) {
    redirect("/login")
  }

  return children;
}
