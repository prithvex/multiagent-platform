import {cert, initializeApp} from firebase-admin;

import serviceAccount from "../cortexai-firebase-key.json" with {type:"json"};

const app= admin.initializeApp({
  credential: cert(serviceAccount)
});

export default app 