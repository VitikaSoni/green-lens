import { useRef } from "react";
import React from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";

import PDFViewer from "../components/PDFViewer";
import type { PDFViewerRef } from "../components/PDFViewer";
import ESGInitiatives from "@/components/ESGInitiatives";
import { useIsMobile } from "@/hooks/use-mobile";
import { Eye, X } from "lucide-react";

export type ResultType = {
  esg_initiatives: {
    evidence_summary: string;
    evidence_statement_with_newlines: string;
    page_label: string;
    regulation_organization_or_framework: string;
  }[];
};

const Result = ({
  result,
  fileURL,
}: {
  result: ResultType;
  fileURL: string;
}) => {
  const pdfViewerRef = useRef<PDFViewerRef>(null);
  const isMobile = useIsMobile();

  // Function to jump to a specific page using PDFHighlight
  const jumpToPage = (pageNumber: number) => {
    if (pdfViewerRef.current) {
      pdfViewerRef.current.jumpToPage(pageNumber);
    }
  };

  const removeNewLinesAndSpaces = (text: string) => {
    return text.replace(/\s*\n\s*/g, "");
  };

  // Mobile layout - using full-screen dialog
  if (isMobile) {
    return (
      <MobileResult
        result={result}
        fileURL={fileURL}
        removeNewLinesAndSpaces={removeNewLinesAndSpaces}
        pdfViewerRef={pdfViewerRef}
      />
    );
  }

  // Desktop layout - resizable panels
  return (
    <div className="w-full h-screen flex">
      <ResizablePanelGroup
        direction="horizontal"
        className="w-full h-full rounded-lg border"
      >
        <ResizablePanel defaultSize={75} minSize={30}>
          <ESGInitiatives result={result} jumpToPage={jumpToPage} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={25}
          minSize={25}
          className="w-full h-full min-w-0"
        >
          <PDFViewer
            ref={pdfViewerRef}
            fileUrl={fileURL}
            highliedTexts={result.esg_initiatives.map((initiative) =>
              removeNewLinesAndSpaces(
                initiative.evidence_statement_with_newlines
              )
            )}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

// Mobile-specific component with full-screen dialog
const MobileResult = ({
  result,
  fileURL,
  removeNewLinesAndSpaces,
  pdfViewerRef,
}: {
  result: ResultType;
  fileURL: string;
  removeNewLinesAndSpaces: (text: string) => string;
  pdfViewerRef: React.RefObject<PDFViewerRef | null>;
}) => {
  const [isPdfOpen, setIsPdfOpen] = React.useState(false);

  // Enhanced jumpToPage function that also opens the PDF dialog
  const handleJumpToPage = (pageNumber: number) => {
    // First open the PDF viewer
    setIsPdfOpen(true);

    // Wait a bit for the PDF viewer to become visible, then jump to the page
    setTimeout(() => {
      if (pdfViewerRef.current) {
        pdfViewerRef.current.jumpToPage(pageNumber);
      }
    }, 100);
  };

  return (
    <div className="w-full h-screen bg-white">
      {/* Main Content - ESG Initiatives */}
      <div className="h-full overflow-y-auto">
        {/* Add trigger button at the top of main content */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-2 flex justify-between items-center">
          <div></div> {/* Empty div for left side spacing */}
          <button
            onClick={() => setIsPdfOpen(true)}
            className="h-8 px-3 flex items-center gap-2 justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700"
          >
            <Eye className="w-4 h-4" />
            View PDF
          </button>
        </div>
        <ESGInitiatives result={result} jumpToPage={handleJumpToPage} />
      </div>

      {/* Full-screen PDF Viewer - Always rendered but controlled by state */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
          isPdfOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 p-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">PDF Viewer</h2>
            <button
              onClick={() => setIsPdfOpen(false)}
              className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="h-full w-full pt-16 overflow-auto bg-white">
          <PDFViewer
            ref={pdfViewerRef}
            fileUrl={fileURL}
            highliedTexts={result.esg_initiatives.map((initiative) =>
              removeNewLinesAndSpaces(
                initiative.evidence_statement_with_newlines
              )
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Result;
