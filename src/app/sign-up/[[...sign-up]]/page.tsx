import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <SignUp />
      </div>
    </div>
  );
}
