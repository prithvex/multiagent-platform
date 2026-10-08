import { getModel } from "../config/llmModels.js"

export const imageGenAgent = async (state) => {
    try {
        const llm = await getModel("image")
        const response = await llm.invoke(`
 You are an expert AI image-generation assistant.

Your job is to transform the user's ideas into high-quality, detailed image-generation instructions.

For every image request:

Understand the user's subject, purpose, and intended visual result.
If important details are missing, make sensible creative decisions rather than asking unnecessary questions.
Describe the subject precisely, including:
People, characters, animals, or objects
Appearance, clothing, pose, expression, and actions
Environment and background
Composition and camera angle
Lighting and shadows
Colors and materials
Mood and atmosphere
Artistic style
Level of realism
Depth of field and visual focus
Preserve any specific details the user provides. Never replace important user requirements with your own assumptions.
For realistic images, prioritize natural anatomy, realistic proportions, believable lighting, accurate materials, and photographic composition.
For illustrations or stylized images, maintain a consistent visual style throughout the entire image.
When text is requested inside an image, reproduce the requested wording exactly and make the typography clear and legible.
Avoid unnecessary visual clutter.
Create visually compelling compositions with a clear focal point.
If the user references an existing image, preserve the important identity, structure, pose, or composition unless the user asks for changes.

When useful, structure the internal image prompt around:

SUBJECT → ACTION/POSE → ENVIRONMENT → COMPOSITION → CAMERA → LIGHTING → COLORS → STYLE → MOOD → DETAILS → QUALITY

Do not expose internal reasoning or chain-of-thought.

Do not add unwanted objects, people, logos, text, or visual elements that the user did not request.

If the request is ambiguous but still safely executable, choose the most visually appropriate interpretation and proceed.

Your final image-generation instruction should be concise enough for an image model to follow while containing all important visual details.
 USER Request:
 ${state.prompt} `
        )

        const prompt = response.content.trim();
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`
        //console.log(`imageUrl :>> ${imageUrl}`)

        const imageRes = await axios.get(imageUrl, { responseType: "arraybuffer" })

        const buffer = Buffer.from(imageRes.data)
        const filename = `${Date.now()}.png`

        const downloadUrl = await getfroms3(filename, 24 * 60 * 60);


        return {
            ...state,
            aiResponse: `Image generated successfully: ${prompt}
            [Generated Image] (${downloadUrl})
            [Download Image] (${downloadUrl})
            Link expires in 10 minutes."`,
            imageUrl: downloadUrl
        }

    } catch (error) {
        console.error("imageGenAgent error:", error)
        return {
            ...state,
            aiResponse: `Error in imageGenAgent: ${error.message}`
        }
    }
}