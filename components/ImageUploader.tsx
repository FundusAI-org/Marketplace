"use client";

import { FC, useCallback, useState } from "react";
import { Input } from "./ui/input";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { Edit2 } from "lucide-react";

interface ImageUploaderProps {
  type?: "add" | "edit";
  imageUrl?: string;
  setImageUrl: (url: string) => void;
  setImageBlob: (blob: File) => void;
  setError: (error: string) => void;
}

const ImageUploader: FC<ImageUploaderProps> = ({
  setImageUrl,
  imageUrl,
  type = "add",
  setError,
  setImageBlob,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        if (file.size > 10 * 1024 * 1024) {
          setError("Invalid file size. Maximum upload file size is 10MB.");
          return;
        }

        if (!file.type.startsWith("image/")) {
          setError("Invalid file type. Please upload an image file.");
          return;
        }

        const reader = new FileReader();
        const fileUrl = URL.createObjectURL(file);
        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          setImageUrl(fileUrl);
          setImageBlob(file);
        };
        reader.readAsArrayBuffer(file);
      });
    },
    [setImageUrl, setError],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  return (
    <div className="mx-auto max-w-7xl">
      <div
        {...getRootProps()}
        className={cn(
          "relative flex flex-col items-center rounded-md border-2 border-dashed px-6 py-12",
          isDragActive ? "border-primary" : "border-muted",
          imageUrl ? "h-64" : "h-auto",
        )}
      >
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt="uploaded image"
              fill
              className="rounded-md object-contain"
            />
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center bg-background/80 transition-opacity duration-200",
                imageUrl ? "opacity-100" : "opacity-0",
              )}
            >
              <Button variant="secondary" type="button" className="mb-2">
                <Edit2 className="mr-2 h-4 w-4" />
                Change Image
              </Button>
              <p className="text-sm text-muted-foreground">
                Drop a new image or click to select
              </p>
            </div>
          </>
        ) : (
          <>
            <svg
              className="h-12 w-12 text-muted-foreground"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            <p className="mt-4 text-xl text-muted-foreground">
              Drop Product image to upload
            </p>
            <p className="mb-4 text-sm text-muted-foreground">or</p>
            <Button variant="secondary" type="button">
              Select image
            </Button>
          </>
        )}
        <Input
          type="file"
          name="file"
          multiple={false}
          className="sr-only"
          accept="image/*"
          {...getInputProps()}
        />
        <p className="mt-4 text-xs text-muted-foreground">
          Maximum upload file size: 10MB
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;
