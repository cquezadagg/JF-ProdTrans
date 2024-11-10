import admin = require("firebase-admin")

// Verificar si ya está inicializado para evitar duplicaciones
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // o admin.credential.cert(serviceAccount)
  });
}

// Exportar los servicios necesarios de admin para usarlos en otras partes de la app
export const authAdmin = admin.auth();
export const firestoreAdmin = admin.firestore();
export const storageAdmin = admin.storage();
