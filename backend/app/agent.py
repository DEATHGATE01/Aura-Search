from typing import AsyncIterator, TypedDict, Annotated
from langgraph.graph import StateGraph
from langgraph.graph.message import add_messages
import asyncio
from app.pdf_processor import pdf_processor
import logging

logger = logging.getLogger(__name__)

class ChatState(TypedDict):
    messages: Annotated[list, add_messages]
    user_query: str
    retrieved_docs: list[dict]
    citations: list[dict]

class AISearchAgent:
    def __init__(self):
        self.graph = self._build_graph()
    
    def _build_graph(self):
        """Build multi-step chat agent"""
        graph = StateGraph(ChatState)
        
        graph.add_node("analyze_query", self.analyze_query)
        graph.add_node("search_documents", self.search_documents)
        graph.add_node("extract_citations", self.extract_citations)
        graph.add_node("generate_response", self.generate_response)
        
        graph.add_edge("analyze_query", "search_documents")
        graph.add_edge("search_documents", "extract_citations")
        graph.add_edge("extract_citations", "generate_response")
        
        graph.set_entry_point("analyze_query")
        graph.set_finish_point("generate_response")
        
        return graph.compile()
    
    async def analyze_query(self, state: ChatState):
        return state
    
    async def search_documents(self, state: ChatState):
        query = state["user_query"]
        docs = [
            {"id": "doc1", "title": "Q4 Financial Report", "content": "Revenue increased"},
            {"id": "doc2", "title": "Market Analysis", "content": "Market growth expected"}
        ]
        state["retrieved_docs"] = docs
        return state
    
    async def extract_citations(self, state: ChatState):
        citations = []
        for i, doc in enumerate(state.get("retrieved_docs", []), 1):
            citations.append({
                "ref": i,
                "docId": doc["id"],
                "title": doc["title"],
                "page": 1,
                "highlight": ""
            })
        state["citations"] = citations
        return state
    
    async def generate_response(self, state: ChatState):
        return state

ai_search_agent = AISearchAgent()

async def chat_handler(job) -> AsyncIterator[dict]:
    """Stream events for a chat job"""
    try:
        # Event 1: Analyzing
        yield {
            "type": "tool_call",
            "tool": "analyze_query",
            "message": "🔍 Understanding your question..."
        }
        await asyncio.sleep(0.5)
        
        # Event 1.5: Analysis complete
        yield {
            "type": "tool_result",
            "tool": "analyze_query",
            "result": "Query analyzed"
        }
        
        # Event 2: Searching
        yield {
            "type": "tool_call",
            "tool": "search_documents",
            "message": "📚 Searching documents..."
        }
        await asyncio.sleep(1)
        
        # Event 3: Tool result
        yield {
            "type": "tool_result",
            "tool": "search_documents",
            "result": "Found 2 relevant documents"
        }
        
        # Event 4+: Stream text
        response = "Based on the documents, I found that revenue increased by 15% in Q4[1]. The market analysis[2] suggests continued growth in 2024. This is a comprehensive response with citations."
        
        for chunk in response.split():
            yield {
                "type": "text",
                "content": chunk + " "
            }
            await asyncio.sleep(0.05)
        
        # Citations
        yield {
            "type": "citation",
            "ref": 1,
            "docId": "doc1.pdf",
            "title": "Q4 Financial Report",
            "page": 3,
            "highlight": "revenue increased by 15%"
        }
        
        yield {
            "type": "citation",
            "ref": 2,
            "docId": "doc2.pdf",
            "title": "Market Analysis",
            "page": 1,
            "highlight": "continued growth in 2024"
        }
        
    except Exception as e:
        logger.error(f"Chat handler error: {e}")
        yield {
            "type": "error",
            "message": str(e)
        }
