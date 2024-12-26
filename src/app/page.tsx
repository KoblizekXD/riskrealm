import { auth } from "@/lib/auth"


export default async function Home() {
  const a = await auth();

  return (
    <div>
      {JSON.stringify(a) || 'Not authenticated'}
    </div>
  )
}
