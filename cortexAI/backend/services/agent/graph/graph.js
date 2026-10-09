import { agentState } from "./state.js";
import { StateGraph } from "@langchain/langgraph";
import { router } from "./router.js";
import { chatAgent } from "../agents/chat.agent.js";
import { imageGenAgent } from "../agents/image.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { pdfAgent } from "../agents/pdf.agent.js";
import { pptAgent } from "../agents/ppt.agent.js";
import { codeAgent } from "../agents/coding.agent.js";
import { pdfRAG } from "../agents/pdfRAG.agent.js";
import { imgAnalyser } from "../agents/imgAnalyser.agent.js";

const workflow = new StateGraph(agentState)

workflow.addNode("router", router);
workflow.addNode("chat", chatAgent);
workflow.addNode("image", imageGenAgent);
workflow.addNode("code", codeAgent);
workflow.addNode("search", searchAgent);
workflow.addNode("pdf", pdfAgent);
workflow.addNode("ppt", pptAgent);
workflow.addNode("pdfRAG", pdfRAG);
workflow.addNode("imgAnalyser", imgAnalyser);

// connecting to edges 

workflow.addEdge("__start__", "router");
workflow.addConditionalEdges("router", (state) => {
    const agent = (state.agent || "chat").toLowerCase().trim()
    switch (agent) {
        case "chat":
            return "chat"
        case "image":
            return "image"
        case "search":
            return "search"
        case "pdf":
            return "pdf"
        case "ppt":
            return "ppt"
        case "coding":
        case "code":
            return "code"
        case "imgAnalyser":
            return "imgAnalyser"
        case "pdfRAG":
            return "pdfRAG"
        default:
            return "chat"
    }
}, {
    chat: "chat",
    image: "image",
    search: "search",
    pdf: "pdf",
    ppt: "ppt",
    code: "code",
    imgAnalyser: "imgAnalyser",
    pdfRAG: "pdfRAG"
})

workflow.addEdge("chat", "__end__")
workflow.addEdge("image", "__end__")
workflow.addEdge("search", "chat")
workflow.addEdge("pdf", "__end__")
workflow.addEdge("ppt", "__end__")
workflow.addEdge("code", "__end__")
workflow.addEdge("imgAnalyser", "__end__")
workflow.addEdge("pdfRAG", "__end__")
//compile the workflow
export const graph = workflow.compile();
