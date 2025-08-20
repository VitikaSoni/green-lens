import {
  CheckIcon,
  UploadIcon,
  WavesIcon,
  AlertCircleIcon,
} from "lucide-react";
import { useState, useRef, type RefObject, useEffect } from "react";
import type { DragEvent } from "react";
import ErrorDialog from "./ErrorDialog";

const PDFUploadArea = ({
  fileInputRef,
  selectedFile,
  setSelectedFile,
}: {
  fileInputRef: RefObject<HTMLInputElement | null>;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const MAX_FILE_SIZE_MB = 50;
  const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024; // 1MB in bytes

  const validateFile = (file: File): boolean => {
    if (file.type !== "application/pdf") {
      const errorMsg = "Please select a PDF file";
      setError(errorMsg);
      setValidationError(errorMsg);
      setIsErrorDialogOpen(true);
      // Reset the file input value so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      const errorMsg = `File size must be less than ${MAX_FILE_SIZE_MB}MB`;
      setError(errorMsg);
      setValidationError(errorMsg);
      setIsErrorDialogOpen(true);
      // Reset the file input value so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return false;
    }

    setError(null);
    setValidationError(null);
    return true;
  };

  const handleCloseErrorDialog = () => {
    setIsErrorDialogOpen(false);
    setError(null);
    setValidationError(null);
    setSelectedFile(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
    // Reset the input value after processing to allow the same file to be selected again
    event.target.value = "";
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`relative w-72 sm:w-80 md:w-96 lg:w-[28rem] mx-auto p-8 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer group flex items-center justify-center bg-gradient-to-br from-blue-400/5 to-purple-500/5 overflow-hidden ${
          isDragOver
            ? "border-blue-500 bg-blue-50"
            : selectedFile
            ? "border-green-500 bg-green-50"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        {/* Content */}
        <div className="z-10 text-center w-full max-w-full">
          {!selectedFile ? (
            <>
              <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-lg">
                <UploadIcon />
              </div>

              {/* Upload Text */}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Upload PDF Document
              </h2>
              <p className="text-sm text-gray-500 mb-3">
                (Scanned copies supported)
              </p>
              <p className="text-base text-gray-700 mb-4">
                Drag and drop your PDF here, or click to browse
              </p>
              <p className="text-xs text-gray-500">
                Max file size:{" "}
                <span className="whitespace-nowrap">{MAX_FILE_SIZE_MB}MB</span>
              </p>

              {/* Spacer to match selected state height */}
              <div className="h-4"></div>
            </>
          ) : (
            <>
              <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
                <CheckIcon />
              </div>

              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                File Selected
              </h3>
              <p className="text-sm text-gray-500 mb-4 break-all px-4 min-h-[3rem] flex items-center justify-center max-w-full">
                {selectedFile.name}
              </p>

              {/* File Size */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-lg text-green-700">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      <ErrorDialog
        isErrorDialogOpen={isErrorDialogOpen}
        handleCloseErrorDialog={handleCloseErrorDialog}
        error={error}
      />
    </div>
  );
};

export default PDFUploadArea;
