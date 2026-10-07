import "dotenv/config";
import { TavilySearch } from "@langchain/tavily";

const tavilySearch = new TavilySearch({
    tavilyApiKey: process.env.TAVILY_API_KEY,
    maxResults: 5,
    topic: "general",
    // includeAnswer: false,
    // includeRawContent: false,
    includeImages: true,
    // includeImageDescriptions: false,
    // searchDepth: "basic",
    // timeRange: "day",
    // includeDomains: [],
    // excludeDomains: [],
});

export const searchTool = tavilySearch;
export default tavilySearch;
