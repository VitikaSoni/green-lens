from llama_index.core.node_parser import TokenTextSplitter

from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.retrievers.bm25 import BM25Retriever
from pydantic import BaseModel
from typing import List
from llama_index.core import get_response_synthesizer
from llama_index.core.response_synthesizers import ResponseMode
from llama_index.core.retrievers import QueryFusionRetriever
from settings import settings
from llama_index.embeddings.openai import OpenAIEmbedding


class ESGInitiative(BaseModel):
    """Data model for the ESG initiative."""

    evidence_summary: str
    evidence_statement_with_newlines: str
    page_label: str
    regulation_organization_or_framework: str


class ESGResponse(BaseModel):
    """Data model for the response."""

    esg_initiatives: List[ESGInitiative]


class RAGService:
    def __init__(self):
        self.embed_model = OpenAIEmbedding(
            model=settings.openai_embedding_model,
            api_key=settings.openai_api_key,
        )
        self.splitter = TokenTextSplitter(
            chunk_size=250,
            chunk_overlap=25,
            separator=" ",
        )

    def load_and_split_documents(self, directory: str):
        """Load and split documents in one operation"""
        reader = SimpleDirectoryReader(input_dir=directory)
        documents = reader.load_data()
        return self.splitter.get_nodes_from_documents(documents)

    def create_vector_index(self, nodes):
        return VectorStoreIndex(
            nodes=nodes,
            embed_model=self.embed_model,
        )

    def retrieve_relevant_nodes(self, index, nodes, query):
        bm25_retriever = BM25Retriever.from_defaults(nodes=nodes, similarity_top_k=30)
        vector_retriever = index.as_retriever(similarity_top_k=20)

        fusion_retriever = QueryFusionRetriever(
            [vector_retriever, bm25_retriever],
            num_queries=1,
            use_async=True,
            similarity_top_k=40,
        )

        return fusion_retriever.retrieve(query)

    def query_llm(self, query: str, retrieved_nodes) -> ESGResponse:
        response_synthesizer = get_response_synthesizer(
            response_mode=ResponseMode.COMPACT, output_cls=ESGResponse
        )

        response = response_synthesizer.synthesize(query, nodes=retrieved_nodes)

        if response and hasattr(response, "response"):
            # Convert the Pydantic model to a dictionary
            if hasattr(response.response, "model_dump"):
                response_data = response.response.model_dump()
            elif hasattr(response.response, "dict"):
                response_data = response.response.dict()
            else:
                response_data = response.response
        elif (
            response
            and hasattr(response, "dict")
            and callable(getattr(response, "dict"))
        ):
            response_data = response.dict()
        elif (
            response
            and hasattr(response, "model_dump")
            and callable(getattr(response, "model_dump"))
        ):
            response_data = response.model_dump()
        elif response:
            response_data = response
        else:
            response_data = None

        return response_data
