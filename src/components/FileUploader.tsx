import { useState, useEffect, useRef, useCallback } from "react";
import { useGetVendorPresignedUrlMutation } from "@/redux/api/vendorApi";
import { Upload, FileText } from "lucide-react";

interface FileUploaderProps {
  token: string;
  onUploadSuccess: (url: string, name: string) => void;
  onClear: () => void;
  onUploadingChange?: (isUploading: boolean) => void;
}

export default function FileUploader({
  token,
  onUploadSuccess,
  onClear,
  onUploadingChange,
}: FileUploaderProps) {
  const [getPresignedUrl] = useGetVendorPresignedUrlMutation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const dragCounter = useRef<number>(0);

  // Notify parent of uploading state changes
  useEffect(() => {
    onUploadingChange?.(isUploading);
  }, [isUploading, onUploadingChange]);

  const uploadFileToS3 = useCallback(async (file: File) => {
    if (!token) return;
    setIsUploading(true);
    setUploadProgress(10);
    setUploadError(null);

    try {
      const fileExt = file.name.split(".").pop() || "";
      const presigned = await getPresignedUrl({
        token,
        fileName: file.name,
        fileType: file.type || `application/${fileExt}`,
        folder: "vendor-uploads",
      }).unwrap();

      setUploadProgress(40);

      // Using XHR to track upload progress accurately
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", presigned.uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type || `application/${fileExt}`);

      // Track progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          // Progress scales from 40% to 95% during transmission
          const percentComplete = 40 + Math.round((event.loaded / event.total) * 55);
          setUploadProgress(percentComplete);
        }
      };

      const uploadPromise = new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error("Failed to upload file to storage server."));
          }
        };
        xhr.onerror = () => reject(new Error("Network error during upload."));
      })

      xhr.send(file);
      await uploadPromise;

      setUploadProgress(100);
      onUploadSuccess(presigned.fileUrl, file.name);
    } catch (err) {
      console.error(err);
      const errorResponse = err as { data?: { message?: string }; message?: string };
      setUploadError(errorResponse.data?.message || errorResponse.message || "Failed to upload file.");
      setSelectedFile(null);
      onClear();
    } finally {
      setIsUploading(false);
    }
  }, [token, getPresignedUrl, onUploadSuccess, onClear]);

  // Handle full screen drag and drop logic
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer && e.dataTransfer.types.includes("Files")) {
        dragCounter.current++;
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current--;
      if (dragCounter.current <= 0) {
        setIsDragging(false);
        dragCounter.current = 0;
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
          setUploadError("Only PDF files are allowed.");
          setSelectedFile(null);
          onClear();
          return;
        }
        if (file.size > 15 * 1024 * 1024) {
          setUploadError("File size exceeds 15MB limit.");
          setSelectedFile(null);
          onClear();
          return;
        }
        setSelectedFile(file);
        setUploadError(null);
        uploadFileToS3(file);
      }
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [uploadFileToS3, onClear]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        setUploadError("Only PDF files are allowed.");
        setSelectedFile(null);
        onClear();
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setUploadError("File size exceeds 15MB limit.");
        setSelectedFile(null);
        onClear();
        return;
      }
      setSelectedFile(file);
      setUploadError(null);
      uploadFileToS3(file);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadError(null);
    onClear();
  };

  return (
    <div>
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 transition-all duration-300 animate-in fade-in">
          <div className="bg-white/95 max-w-md w-full border-4 border-dashed border-blue-500 rounded-3xl p-10 text-center shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-95 duration-200">
            <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
              <Upload className="h-12 w-12 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Drop your PDF here</h3>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              Drop your proposal PDF document to upload it. Only PDF format is accepted.
            </p>
          </div>
        </div>
      )}

      <label className="block text-sm font-semibold text-slate-700 mb-2">
        Upload Proposal Document
      </label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-2xl hover:border-blue-400 transition-colors bg-slate-50/50">
        <div className="space-y-1 text-center">
          <Upload className="mx-auto h-12 w-12 text-slate-400" />
          <div className="flex text-sm text-slate-600 justify-center">
            <label className="relative cursor-pointer bg-transparent rounded-md font-semibold text-blue-600 hover:text-blue-500 focus-within:outline-none">
              <span>Upload a file</span>
              <input
                type="file"
                className="sr-only"
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-slate-400">PDF files up to 15MB</p>
        </div>
      </div>

      {selectedFile && (
        <div className="mt-3 flex items-center justify-between p-3 bg-blue-50/50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 overflow-hidden">
            <FileText className="h-5 w-5 text-blue-500 shrink-0" />
            <span className="text-sm font-semibold text-slate-700 truncate">
              {selectedFile.name}
            </span>
            <span className="text-xs text-slate-400 shrink-0">
              ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
            </span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs text-red-500 font-semibold hover:underline"
            disabled={isUploading}
          >
            Remove
          </button>
        </div>
      )}

      {isUploading && (
        <div className="mt-3 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-500">
            <span>Uploading document...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
    </div>
  );
}
