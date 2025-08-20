import { useEffect, useState } from "react";
import PDFUpload from "./pages/PDFUpload";
import PDFProcessing from "./pages/PDFProcessing";
import type { ResultType } from "./pages/Result";
import Result from "./pages/Result";
import ErrorDialog from "./components/ErrorDialog";

const State = {
  PDF_UPLOAD: "pdf-upload",
  PDF_PROCESSING: "pdf-processing",
  SHOW_RESULT: "show-result",
} as const;

type StateType = (typeof State)[keyof typeof State];

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [state, setState] = useState<StateType>(State.PDF_UPLOAD);

  const [fileKey, setFileKey] = useState<string | null>(null);

  const [fileURL, setFileURL] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const [result, setResult] = useState<ResultType | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  useEffect(() => {
    if (result) {
      setState(State.SHOW_RESULT);
    }
  }, [result]);

  useEffect(() => {
    // Only create EventSource when we have a valid fileKey
    if (!fileURL) return;

    const evtSource = new EventSource(`${BACKEND_URL}/process/${fileKey}`);

    const handleEventMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "progress") {
          setCurrentStep(data.step);
          setProgress(data.progress);
        } else if (data.type === "error") {
          setError(data.error);
          setIsErrorDialogOpen(true);
        }
        if (data.response) {
          setResult(data.response);
        }
      } catch (err) {
        console.error("Error parsing SSE data", err);
      }
    };

    const handleError = (err: Event) => {
      console.error("SSE error:", err);
      evtSource.close();
    };

    evtSource.onmessage = handleEventMessage;
    evtSource.onerror = handleError;

    return () => {
      evtSource.close();
    };
  }, [fileKey]);

  function uploadPDF(file: File) {
    (async () => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${BACKEND_URL}/upload-pdf`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ detail: "Upload failed" }));
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      return response.json();
    })()
      .then((response) => {
        setFileKey(response.file_key);
        setFileURL(response.file_url);
        setError(null); // Clear any previous errors
      })
      .catch((err) => {
        console.error("Error uploading PDF:", err);
        const errorMessage =
          err.message || "Failed to upload PDF. Please try again.";
        setError(errorMessage);
        setIsErrorDialogOpen(true);
        // Reset to start state on error
        setState(State.PDF_UPLOAD);
        setFileKey(null);
        setFileURL(null);
        setCurrentStep(null);
        setProgress(0);
        setResult(null);
      });
  }

  const handleUpload = (file: File) => {
    setState(State.PDF_PROCESSING);
    setCurrentStep(
      "Uploading PDF (Can take extra 50s if the server was inactive)"
    );
    setProgress(0);
    uploadPDF(file);
  };

  const handleCloseErrorDialog = () => {
    setIsErrorDialogOpen(false);
    setError(null);
    setState(State.PDF_UPLOAD);
    setFileKey(null);
    setFileURL(null);
    setCurrentStep(null);
    setProgress(0);
    setResult(null);
  };

  return (
    <>
      {state === State.PDF_UPLOAD && <PDFUpload onUpload={handleUpload} />}
      {state === State.PDF_PROCESSING && (
        <PDFProcessing currentStep={currentStep} progress={progress} />
      )}
      {state === State.SHOW_RESULT && result && fileURL && (
        <Result result={result} fileURL={fileURL} />
      )}
      <ErrorDialog
        isErrorDialogOpen={isErrorDialogOpen}
        handleCloseErrorDialog={handleCloseErrorDialog}
        error={error}
      />
    </>
  );
}

export default App;
