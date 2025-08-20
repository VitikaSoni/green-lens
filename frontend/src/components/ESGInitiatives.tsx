import type { ResultType } from "../pages/Result";
import { Button } from "./ui/button";
import { BookOpenText } from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile";

const ESGInitiatives = ({
  result,
  jumpToPage,
}: {
  result: ResultType;
  jumpToPage: (pageNumber: number) => void;
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-y-auto">
        <div className={`${isMobile ? "p-4" : "p-6"}`}>
          {/* Header Section */}
          <div className={`${isMobile ? "mb-6" : "mb-8"}`}>
            <div
              className={`flex items-center gap-4 ${
                isMobile ? "mb-3" : "mb-4"
              }`}
            >
              <div
                className={`${
                  isMobile ? "w-12 h-12" : "w-16 h-16"
                } bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg`}
              >
                <span className="text-white font-bold text-2xl">AI</span>
              </div>
              <div>
                <h1
                  className={`${
                    isMobile ? "text-2xl" : "text-3xl"
                  } font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent`}
                >
                  ESG Analysis Results
                </h1>
                <p className="text-gray-600 mt-1">
                  {result.esg_initiatives.length} initiative
                  {result.esg_initiatives.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>
          </div>

          {/* Initiatives Grid */}
          <div className={`${isMobile ? "space-y-4" : "space-y-6"}`}>
            {result.esg_initiatives.map((initiative, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl border border-gray-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg overflow-hidden"
              >
                {/* Left accent bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-500"></div>

                <div className={`${isMobile ? "p-4" : "p-6"}`}>
                  {/* Initiative Header */}
                  <div
                    className={`flex items-start justify-between ${
                      isMobile ? "mb-3" : "mb-4"
                    } ${isMobile ? "flex-col gap-3" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`${
                          isMobile ? "w-8 h-8" : "w-10 h-10"
                        } bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h3
                          className={`${
                            isMobile ? "text-lg" : "text-xl"
                          } font-semibold text-gray-900 leading-tight`}
                        >
                          {initiative.regulation_organization_or_framework}
                        </h3>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        jumpToPage(parseInt(initiative.page_label) - 1)
                      }
                      className={`group/btn inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-700 text-sm font-medium rounded-lg border border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition-all duration-200 shadow-sm ${
                        isMobile ? "w-full justify-center" : ""
                      }`}
                    >
                      <BookOpenText className="w-4 h-4" />
                      Page {initiative.page_label}
                    </Button>
                  </div>

                  {/* Evidence Summary */}
                  <div className={`${isMobile ? "mb-3" : "mb-4"}`}>
                    <p className="text-gray-800 leading-relaxed text-base">
                      {initiative.evidence_summary}
                    </p>
                  </div>

                  {/* Evidence Statement */}
                  <div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 px-4 py-3 rounded-r-lg">
                      <p className="text-gray-800 italic leading-relaxed text-base">
                        "{initiative.evidence_statement_with_newlines}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {result.esg_initiatives.length === 0 && (
            <div className="text-center py-16">
              <div
                className={`${
                  isMobile ? "w-16 h-16" : "w-20 h-20"
                } bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6`}
              >
                <span className="text-3xl">📄</span>
              </div>
              <h3
                className={`${
                  isMobile ? "text-lg" : "text-xl"
                } font-semibold text-gray-700 mb-2`}
              >
                No ESG Initiatives Found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                The document analysis didn't identify any ESG initiatives. This
                could mean the document doesn't contain relevant ESG information
                or the analysis needs to be refined.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ESGInitiatives;
