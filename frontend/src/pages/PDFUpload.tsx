import PDFUploadArea from "@/components/PDFUploadArea";
import { useState, useRef } from "react";

const PDFUpload = ({ onUpload }: { onUpload: (file: File) => void }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    onUpload(selectedFile);
  };

  return (
    <div className="pt-0">
      <div className="  py-8 px-6 ">
        <h1 className="text-4xl md:text-4xl text-gray-700 font-extrabold text-center  mb-2 tracking-tight">
          Sustainability Lens
        </h1>

        <p className="text-center mt-3 text-base text-gray-600 font-medium">
          Upload a Sustainability Report. Discover ESG Initiatives. Instantly.
        </p>
      </div>
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="max-w-md">
          {/* Upload Area */}

          <PDFUploadArea
            fileInputRef={fileInputRef}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />

          {/* Action Buttons */}
          {selectedFile && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Uploading...
                  </div>
                ) : (
                  "Upload PDF"
                )}
              </button>

              <button
                onClick={removeFile}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFUpload;
