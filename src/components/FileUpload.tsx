"use client";

import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import axiosInstance from "../../axiosConfig"
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);

  const { mutate: createChat } = useMutation({
    mutationFn: async ({
      pdfName,
      file,
      userId,
    }: {
      pdfName: string;
      file: File;
      userId: string;
    }) => {
      const formData = new FormData();
      formData.append("pdfName", pdfName);
      formData.append("file", file);
      formData.append("userId", userId);

      const response = await axiosInstance.post(
        "/api/v1/chats/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
  });

  const { mutate: addDataToPineConeDB } = useMutation({
    mutationFn: async ({ chat_id }: { chat_id: number }) => {
      const response = await axiosInstance.post(
        "/api/v1/pinecone/",
        { chat_id }
      );
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      const pdfName = file.name;

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File is too large (>3MB)");
        return;
      }

      try {
        setUploading(true);
        const response = await axiosInstance.get("api/user");
        const userId = response.data.userId;

        createChat(
          { pdfName, file, userId },
          {
            onSuccess: (data) => {
              console.log(data);
              const chat_id = data.id
              console.log(chat_id);
              addDataToPineConeDB(
                { chat_id },
                {
                  onSuccess: (data) => {
                    setUploading(false);
                    toast.success("Document uploaded and chat created");
                    router.push(`/chat/${chat_id}`);
                  },
                  onError: (err) => {
                    toast.error("Error creating chat");
                    console.error(err);
                    setUploading(false);
                  },
                }
              );
            },
            onError: (err) => {
              setUploading(false);
              toast.error("Error creating chat");
              console.error(err);
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex jutify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <>
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400 ">Uploading ...</p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop PDF here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
