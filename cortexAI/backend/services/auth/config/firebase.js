import { cert, initializeApp } from "firebase-admin/app";
import serviceAccount from "../cortexai-firebase-key.json" with { type: "json" };

const app = initializeApp({
  credential: cert(serviceAccount),
});

export default app;