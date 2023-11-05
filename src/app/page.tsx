import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import { ArrowRight, LogIn } from "lucide-react";
import Link from "next/link";
import FileUpload from "@/components/FileUpload";
import axios from "axios";

export default async function Home() {
  const { userId } = await auth();

  const isAuth = !!userId;
  let firstChat;
  if (userId) {
    firstChat = await axios.get(
      `http://localhost:8000/api/v1/chats/?userId=${userId}`
    );
    if (firstChat) {
      firstChat = firstChat.data[0];
    }

  }
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-white text-5xl font-semibold">
              Chat with any PDF
            </h1>
            <UserButton afterSignOutUrl="/" />
          </div>

          <div className="flex mt-2">
            {isAuth && (
              <Link href={`/chat/${firstChat.id}`}>
              <Button className="flex mt-3 bg-white text-gray-800 font-semibold hover:bg-slate-300 cursor-pointer">
                Go to Chats <ArrowRight className="ml-2" />
              </Button>
            </Link>
            )}
          </div>
          
          <p className="max-w-xl mt-2 text-lg text-slate-400">
            Unlock the knowledge within your documents with AI-powered Q&A.
          </p>

          <div className="w-full mt-4">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href="/sign-in">
                <Button className="bg-white hover:bg-slate-300 font-semibold text-gray-800 cursor-pointer">
                  Login to get Started!
                  <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
