import { providers } from "@/lib/auth";

export default async function SignInPage() {
  return (
    <main className={'lg:flex bg-[#1e1e2e] lg:justify-center lg:items-center min-h-screen'}>
      <div className="lg:w-1/4 bg-[#181825] shadow-lg rounded-md flex flex-col p-4">
        <form className="flex flex-col">
          <h1 className={'font-extrabold text-2xl'}>Sign in to Risk Realm</h1>
          <label className={'mt-4'}>
            <span>Email</span>
            <input
              type={'email'}
              name={'email'}
              className={'block bg-[#11111b] bg-transparent rounded w-full p-1 mt-1 outline-none'}
            />
          </label>
          <label className={'mt-4'}>
            <span>Password</span>
            <input
              type={'password'}
              name={'email'}
              className={'block bg-transparent bg-[#11111b] rounded w-full p-1 mt-1 outline-none'}
            />
          </label>
          <button
            type={'submit'}
            className={'bg-blue-600 text-white rounded p-2 mt-4'}
          >Continue</button>
        </form>
        <div className="flex my-2 text-center items-center">
          <hr className="flex-1 border-[#cdd6f4]" />
          <span className="px-2 text-[#cdd6f4]">Or use</span>
          <hr className="flex-1 border-[#cdd6f4]" />
        </div>
        <div className={'flex flex-col gap-y-2'}>
          {Object.values(providers).filter(provider => provider.name !== 'Credentials').map((provider) => (
            <form className="text-center bg-[#11111b] p-2 rounded-md" key={provider.name}>
              <button
                type={'button'}
              >Continue with {provider.name}</button>
            </form>
          ))}
        </div>
      </div>
    </main>
  );
}