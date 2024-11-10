"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin (only if not already initialized)
if (!admin.apps.length) {
    admin.initializeApp();
}
// Cloud Function configuration
const functionConfig = {
    cors: [
        "http://localhost:5174",
        "http://localhost:5173",
        // Add your production domain when ready
        // "https://your-production-domain.com"
    ],
    timeoutSeconds: 60,
    memory: "256MiB",
    region: "us-central1",
};
// Helper function to validate input data
const validateInputData = (data) => {
    const { email, password, nombre, rol } = data;
    if (!email || !password || !nombre || !rol) {
        throw new https_1.HttpsError("invalid-argument", "Missing required fields");
    }
};
// Main Cloud Function
exports.createUser = (0, https_1.onCall)(functionConfig, (request) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = request;
        validateInputData(data);
        // Create user in Authentication
        const userRecord = yield admin.auth().createUser({
            email: data.email,
            password: data.password,
        });
        // Create document in Firestore
        yield admin.firestore().collection("users").doc(userRecord.uid).set({
            nombre: data.nombre,
            rol: data.rol,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        // Set custom claims for role
        yield admin.auth().setCustomUserClaims(userRecord.uid, {
            role: data.rol,
        });
        return {
            success: true,
            uid: userRecord.uid,
        };
    }
    catch (error) {
        console.error("Error creating user:", error);
        if (error instanceof Error) {
            // Handle authentication errors
            if (error.message.includes("auth")) {
                throw new https_1.HttpsError("already-exists", "User already exists or there is an authentication problem");
            }
            // Handle Firestore errors
            if (error.message.includes("firestore")) {
                throw new https_1.HttpsError("internal", "Error saving user data");
            }
        }
        // Generic error handler
        throw new https_1.HttpsError("internal", "An unexpected error occurred while creating the user");
    }
}));
