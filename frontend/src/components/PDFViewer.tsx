import { SpecialZoomLevel, Viewer, Worker } from "@react-pdf-viewer/core";
import { highlightPlugin } from "@react-pdf-viewer/highlight";
import { searchPlugin } from "@react-pdf-viewer/search";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";
import "@react-pdf-viewer/search/lib/styles/index.css";
import { forwardRef, useEffect, useState, useImperativeHandle } from "react";

import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";

import "@react-pdf-viewer/page-navigation/lib/styles/index.css";

export interface PDFViewerRef {
  jumpToPage: (pageNumber: number) => void;
}

const PDFViewer = forwardRef<
  PDFViewerRef,
  {
    fileUrl: string;
    highliedTexts: string[];
  }
>(({ fileUrl, highliedTexts }, ref) => {
  const highlightPluginInstance = highlightPlugin();
  const searchPluginInstance = searchPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();

  const [documentLoaded, setDocumentLoaded] = useState(false);

  const { highlight } = searchPluginInstance; // Destructure the highlight method

  const jumpToPage = (pageNumber: number) => {
    pageNavigationPluginInstance.jumpToPage(pageNumber);
  };

  useImperativeHandle(ref, () => ({
    jumpToPage,
  }));

  useEffect(() => {
    if (documentLoaded) {
      highlight(highliedTexts);
    }
  }, [highliedTexts, documentLoaded]);

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
      <Viewer
        defaultScale={SpecialZoomLevel.PageFit}
        fileUrl={fileUrl}
        plugins={[
          highlightPluginInstance,
          searchPluginInstance,
          pageNavigationPluginInstance,
        ]}
        onDocumentLoad={() => setDocumentLoaded(true)}
      />
    </Worker>
  );
});

PDFViewer.displayName = "PDFViewer";

export default PDFViewer;
