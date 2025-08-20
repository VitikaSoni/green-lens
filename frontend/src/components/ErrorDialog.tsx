import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";

const ErrorDialog = ({
  isErrorDialogOpen,
  handleCloseErrorDialog,
  error,
}: {
  isErrorDialogOpen: boolean;
  handleCloseErrorDialog: () => void;
  error: string | null;
}) => {
  const handleCopyError = async () => {
    const errorText =
      error || "An error occurred while uploading the PDF. Please try again.";
    try {
      await navigator.clipboard.writeText(errorText);
    } catch (err) {
      console.error("Failed to copy error message:", err);
    }
  };

  return (
    <Dialog open={isErrorDialogOpen} onOpenChange={handleCloseErrorDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-600">Error</DialogTitle>
          <DialogDescription className="flex items-center justify-between">
            <span className="flex-1">
              {error ||
                "An error occurred while uploading the PDF. Please try again."}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyError}
              className="ml-2 flex-shrink-0"
              title="Copy error message"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </DialogDescription>
          <p className="text-xs text-gray-500 mt-2">
            If this issue persists, please report to{" "}
            <a
              href="mailto:vitika.program@gmail.com"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              vitika.program@gmail.com
            </a>
          </p>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorDialog;
