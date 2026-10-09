import { getModel } from "../config/llmModels.js"
import { checkAgentLimit } from "../config/agentLimit.js"

export const pptAgent = async (state) => {

  try {
    // add check here
    await checkAgentLimit(state.userId, "ppt")
    const llm = await getModel("ppt")
    const prompt = `
        You are an expert in presentation design and storytelling. Your goal is to transform the user's text into a compelling, structured PowerPoint presentation outline.

        Please analyze the following text and generate a professional, detailed presentation outline. The output must be in Markdown format and structured as a valid JSON object.

        The JSON structure must follow this schema:

        {
          "presentation_title": "string",
          "slides": [
            {
              "slide_number": number,
              "slide_title": "string",
              "content_type": "string" (choose from: 'text', 'image', 'quote', 'data', 'mixed'),
              "layout_style": "string" (choose from: 'title_slide', 'heading', 'two_columns', 'image_right', 'image_left', 'quote_center', 'comparison', 'process', 'end'),
              "visual_elements": ["string"],
              "key_points": ["string"],
              "speaker_notes": "string"
            }
          ],
          "overall_tone": "string"
        }

        Please ensure the following:

        1. **Title Slide:** Create a captivating title for the presentation.
        2. **Slide Structure:** Generate a logical flow of 8–15 slides that builds a compelling narrative.
        3. **Content Type:** Select appropriate content types for each slide (e.g., use 'data' for statistics, 'image' for visual concepts, 'quote' for impact).
        4. **Layout Style:** Choose the most effective layout for the content of each slide.
        5. **Visual Elements:** Suggest relevant images, icons, charts, or graphics for each slide.
        6. **Key Points:** Summarize the most important information for each slide in concise bullet points.
        7. **Speaker Notes:** Provide detailed speaker notes for each slide that elaborate on the key points, offer insights, and suggest transitions.
        8. **Tone:** Ensure the overall tone is professional, engaging, and appropriate for the subject matter.

        Please generate the presentation outline in JSON format.
        CONTENT:
        ${state.prompt}
        `
    const response = await llm.invoke(prompt)
    const data = JSON.parse(response.content)
    const ppt = await generateppt(data)
    const buffer = await ppt.write("nodebuffer")

    const filename = `ppt- ${Date.now()}.pptx`

    const contentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation"

    await uploadToS3(filename, buffer, contentType)

    const downloadUrl = await getfromS3(filename, 24 * 60 * 60)



    return {
      ...state,
      aiResponse: `
       Presentation Generated successfully
      ${data.title}
      ${downloadUrl}
      `
    }



  } catch (error) {
    console.error("pptAgent error:", error)
    return {
      ...state,
      aiResponse: `Error in pptAgent: ${error.message}`
    }
  }
}