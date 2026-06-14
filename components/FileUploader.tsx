"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
}

export default function FileUploader({ accept, multiple = false, onFiles, label }: FileUploaderProps) {
  const [dragging, setDragging] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setDragging(false);
      if (acceptedFiles.length > 0) onFiles(acceptedFiles);
    },
    [onFiles]
  );

  const acceptObj = accept.split(",").reduce((acc, ext) => {
    const mime = extToMime(ext.trim());
    if (mime) acc[mime] = [ext.trim()];
    return acc;
  }, {} as Record<string, string[]>);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptObj,
    multiple,
    onDragEnter: () => setDragging(true),
    onDragLeave: () => setDragging(false),
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
        isDragActive || dragging
          ? "border-[#e8394d] bg-red-50"
          : "border-gray-300 bg-white hover:border-[#e8394d] hover:bg-red-50"
      }`}
    >
      <input {...getInputProps()} />
      <div className="text-5xl mb-4">📂</div>
      <p className="text-lg font-semibold text-gray-700 mb-1">
        {label || "Drop your file here"}
      </p>
      <p className="text-sm text-gray-400 mb-4">or</p>
      <button
        type="button"
        className="bg-[#e8394d] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#d42a3e] transition-colors"
      >
        Select {multiple ? "Files" : "File"}
      </button>
      <p className="text-xs text-gray-400 mt-4">Accepted: {accept}</p>
    </div>
  );
}

function extToMime(ext: string): string {
  const map: Record<string, string> = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".html": "text/html",
    ".htm": "text/html",
  };
  return map[ext] || "application/octet-stream";
}
