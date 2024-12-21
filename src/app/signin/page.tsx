import { providerMap, providers, signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignInPage(props: { searchParams: { callbackUrl: string | undefined }}) {
  const params = await props.searchParams;
  return (
    <main className={'flex bg-[#1e1e2e] justify-center items-center min-h-screen'}>
      <div className="lg:w-1/4 lg:bg-[#181825] lg:shadow-lg lg:flex-none flex-1 rounded-md flex flex-col p-4">
        <form className="flex flex-col">
          <h1 className={'font-extrabold text-2xl'}>Sign in to Risk Realm</h1>
          <label className={'mt-4'}>
            <span>Email</span>
            <input
              type={'email'}
              name={'email'}
              className={'block bg-[#11111b] rounded w-full p-2 mt-1 outline-none'}
            />
          </label>
          <label className={'mt-4'}>
            <span>Password</span>
            <input
              type={'password'}
              name={'password'}
              className={'block bg-[#11111b] rounded w-full p-2 mt-1 outline-none'}
            />
          </label>
          <button
            type={'submit'}
            className={'bg-blue-600 font-semibold text-white rounded flex items-center justify-center gap-x-2 p-2 mt-4'}>
              Continue
          </button>
        </form>
        <div className="flex my-2 text-center items-center">
          <hr className="flex-1 border-[#cdd6f4]" />
          <span className="px-2 text-[#cdd6f4]">Or use</span>
          <hr className="flex-1 border-[#cdd6f4]" />
        </div>
        <div className={'flex flex-col gap-y-2'}>
          {Object.values(providerMap).map((provider) => (
            <form className="text-center bg-[#11111b] flex rounded-md" key={provider.name}
              action={async () => {
                'use server'
                try {
                  await signIn(provider.id, {
                    redirectTo: params?.callbackUrl ?? "",
                  })
                } catch (error) {
                  if (error instanceof AuthError) {
                    return redirect(`/error?error=${error.type}`);
                  }
                  throw error
                }
              }}>
              <button
                type={'submit'}
                className={'flex-1 h-full p-2'}
              >Continue with {provider.name}</button>
            </form>
          ))}
        </div>
      </div>
    </main>
  );
}