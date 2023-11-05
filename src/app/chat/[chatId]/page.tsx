import React from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import axiosInstance from "../../../../axiosConfig";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import ChatComponent from "@/components/ChatComponent";

type Props = {
  params: {
    chatId: string;
  };
};

type Chat = {
  id: number;
  pdfName: string;
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const response = await axiosInstance.get(
    `/api/v1/chats/?userId=${userId}`
  );
  const data = response.data;

  if (!data) {
    return redirect("/");
  }

  const currentChat = data.find((chat: Chat) => chat.id === parseInt(chatId));
  const parts = currentChat?.file.split("?");
  const urlWithoutQueryParams = parts[0];

  return (
    <div className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        {/* chat sidebar */}
        <div className="flex-[1] max-w-xs">
          <ChatSideBar chats={data} chatId={parseInt(chatId)} />
        </div>
        {/* pdf viewer */}
        <div className="max-h-screen p-4 oveflow-scroll flex-[5]">
          <PDFViewer pdf_url={urlWithoutQueryParams || ""} />
        </div>
        {/* chat component */}
        <div className="flex-[3] border-l-4 border-l-slate-200">
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
