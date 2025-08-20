import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Load environment variables
load_dotenv()


class Settings(BaseSettings):
    # API Keys
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_model: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    openai_embedding_model: str = os.getenv(
        "OPENAI_EMBEDDING_MODEL", "text-embedding-3-small"
    )

    # R2/S3 Configuration
    r2_endpoint: str = os.getenv("R2_ENDPOINT", "")
    r2_bucket_name: str = os.getenv("R2_BUCKET_NAME", "")
    r2_bucket_endpoint: str = os.getenv("R2_BUCKET_ENDPOINT", "")

    aws_access_key_id: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    aws_secret_access_key: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")

    # ESG Query
    esg_query: str = """
Extract all ESG (Environmental, Social, and Governance) initiatives mentioned in the company report that are directly related to recognized regulations, industry organizations, tools, or frameworks.

Explicitly include matches for:
- SLCP (Social & Labor Convergence Program)
- Higg Index (Sustainable Apparel Coalition's Higg Index)
- GRI (Global Reporting Initiative)
- UN Global Compact (United Nations Global Compact)
- CDP (Carbon Disclosure Project)
- ISO standards (International Organization for Standardization)
- SA8000 (Social Accountability International SA8000 Standard)
- Sedex (Supplier Ethical Data Exchange)
- BSCI (Business Social Compliance Initiative)
- WRAP (Worldwide Responsible Accredited Production)
- Fair Trade (Fairtrade International certification/initiative)
- OECD Guidelines (Organisation for Economic Co-operation and Development Guidelines for Multinational Enterprises)
- Paris Agreement (United Nations Paris Climate Agreement)
- ILO Conventions (International Labour Organization Conventions)
- SBTi (Science Based Targets initiative)
- ACEC (Australian Constructors Association's Environmental Charter) [or relevant ACEC framework depending on document context]
- ...and any other clearly named ESG-related industry organization, framework, or tool.

For each valid match, provide:
1. **evidence_summary** – A single short sentence summarizing the evidence (e.g., "Nestlé is committed to reducing GHG emissions by 20% by 2030").
2. **evidence_statement_with_newlines** – Copy the exact text from the document where the initiative is mentioned.  
   - Preserve line breaks exactly as in the source using `\\n`.  
   - Do not paraphrase or alter the snippet in any way.  
3. **regulation_organization_or_framework** – Identify the specific regulation/organization/framework mentioned.  
4. **page_label** – The page label where the evidence was found.

### IMPORTANT RULES
- Return results **only if there is a direct mention** of one of the listed (or other verifiable ESG-related) frameworks/organizations.  
  - If you cannot confidently identify the framework/organization, do not include it.  
- If no relevant ESG initiatives are found, return an **empty list** (`[]`).  
- Return **all distinct ESG initiatives** from the document. There is no maximum limit.  
- Do not invent or hallucinate content that is not explicitly in the text.  
"""


settings = Settings()
