import asyncio
from typing import AsyncGenerator, Dict, Any
from rag_service import RAGService
from settings import settings


class Pipeline:
    def __init__(self):
        self.rag_service = RAGService()

    async def run_pipeline(
        self, file_key: str, queue: asyncio.Queue, query: str
    ) -> None:
        """Run the complete RAG pipeline"""
        current_step = None
        file_key = file_key.replace(".pdf", "")

        try:
            # Step 1: Load and split documents
            current_step = "Loading and chunking documents"
            await self._update_progress(queue, current_step, 20)

            nodes = await asyncio.to_thread(
                self.rag_service.load_and_split_documents, f"temp/{file_key}"
            )

            # Step 2: Create vector index
            current_step = "Creating vector index"
            await self._update_progress(queue, current_step, 30)

            index = await asyncio.to_thread(self.rag_service.create_vector_index, nodes)

            # Step 3: Retrieve relevant nodes
            current_step = "Retrieving relevant nodes"
            await self._update_progress(queue, current_step, 65)

            retrieved_nodes = await asyncio.to_thread(
                self.rag_service.retrieve_relevant_nodes, index, nodes, query
            )

            # Step 4: Query LLM
            current_step = "Querying LLM"
            await self._update_progress(queue, current_step, 80)

            response_data = await asyncio.to_thread(
                self.rag_service.query_llm, query, retrieved_nodes
            )

            # Final step
            await self._update_progress(queue, "Done", 100, response=response_data)

        except Exception as e:
            await self._handle_error(queue, current_step, str(e), file_key)

    async def _update_progress(
        self, queue: asyncio.Queue, step: str, progress: int, response: Any = None
    ):
        event = {"step": step, "progress": progress, "type": "progress"}
        if response:
            event["response"] = response
        await queue.put(event)

    async def _handle_error(
        self, queue: asyncio.Queue, step: str, error: str, file_key: str
    ):
        import traceback

        print("An error occurred:", str(error))
        traceback.print_exc()
        error_msg = (
            f"Error while {step}: {error}. Doc ID: {file_key}"
            if step
            else f"Error: {error}"
        )
        await queue.put({"type": "error", "error": error_msg})
