"use client";

import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";

type Chat = {
  id: number;
  pdfName: string;
};

type Props = {
  chats: Chat[];
  chatId: number;
};

const ChatSideBar = ({ chats, chatId }: Props) => {

  return (
    <div className="w-full h-screen overflow-scroll soff p-4 text-gray-200 bg-gray-900">
      <Link href="/">
        <Button className="w-full border-dashed border-white border">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </Link>

      <div className="flex h-screen overflow-scroll pb-20 flex-col gap-2 mt-4">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
                "bg-blue-600 text-white": chat.id === chatId,
                "hover:text-white": chat.id !== chatId,
              })}
            >
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                {chat.pdfName}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="absolute bottom-4 pl-4">
        <div className="flex items-center gap-4 text-xl font-semibold text-slate-400">
          <Link href="/">
            <Button className="bg-slate-800 hover:bg-slate-500 px-8">Home</Button>
          </Link>
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default ChatSideBar;
