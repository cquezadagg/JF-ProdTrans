import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

// Initialize Firebase Admin (only if not already initialized)
if (!admin.apps.length) {
  admin.initializeApp();
}

// Type definitions
interface CreateUserData {
  email: string;
  password: string;
  nombre: string;
  rol: string;
}
interface CreateUserResponse {
  success: boolean;
  uid: string;
}

// Cloud Function configuration
const functionConfig = {
  cors: [
    "http://localhost:5174",
    "http://localhost:5173",
    // Add your production domain when ready
    // "https://your-production-domain.com"
  ] as (string | RegExp)[], // Convert readonly array to mutable
  timeoutSeconds: 60,
  memory: "256MiB",
  region: "us-central1",
} as const;

// Helper function to validate input data
const validateInputData = (data: CreateUserData): void => {
  const { email, password, nombre, rol } = data;
  if (!email || !password || !nombre || !rol) {
    throw new HttpsError("invalid-argument", "Missing required fields");
  }
};

// Main Cloud Function
export const createUser = onCall(functionConfig, async (request) => {
  try {
    const { data } = request;
    validateInputData(data);
    // Create user in Authentication
    const userRecord = await admin.auth().createUser({
      email: data.email,
      password: data.password,
    });
    // Create document in Firestore
    await admin.firestore().collection("users").doc(userRecord.uid).set({
      nombre: data.nombre,
      rol: data.rol,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    // Set custom claims for role
    await admin.auth().setCustomUserClaims(userRecord.uid, {
      role: data.rol,
    });
    return {
      success: true,
      uid: userRecord.uid,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    if (error instanceof Error) {
      // Handle authentication errors
      if (error.message.includes("auth")) {
        throw new HttpsError(
          "already-exists",
          "User already exists or there is an authentication problem",
        );
      }
      // Handle Firestore errors
      if (error.message.includes("firestore")) {
        throw new HttpsError("internal", "Error saving user data");
      }
    }
    // Generic error handler
    throw new HttpsError(
      "internal",
      "An unexpected error occurred while creating the user",
    );
  }
});
