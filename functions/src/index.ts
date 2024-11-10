import * as functions from "firebase-functions";
import { authAdmin } from "./firebase-admin";

// Definir los tipos para `data`
interface AssignRoleData {
  uid: string;
  driver?: boolean;
  admin?: boolean;
  logsOps?: boolean;
  client?: boolean;
}

// Función para asignar roles
export const assignUserRole = functions.https.onCall(
  async (request: functions.https.CallableRequest<AssignRoleData>) => {
    const { data } = request;
    const { auth } = request;

    // Verificar si el usuario está autenticado
    if (!auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }

    const { uid, driver, admin, logsOps, client } = data;

    // Validar los datos
    if (!uid) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with a uid."
      );
    }

    // Asignar los roles según los valores recibidos en los datos
    const customClaims: { [key: string]: boolean } = {};

    if (driver) customClaims.driver = true;
    if (admin) customClaims.admin = true;
    if (logsOps) customClaims.logsOps = true;
    if (client) customClaims.client = true;

    // Verificar que al menos un rol sea `true`
    if (Object.keys(customClaims).length === 0) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "At least one role must be assigned as true."
      );
    }

    // Asignar los roles al usuario
    try {
      await authAdmin.setCustomUserClaims(uid, customClaims);
      return { message: `Roles assigned to user ${uid}`, claims: customClaims };
    } catch (error) {
      if (error instanceof Error) {
        throw new functions.https.HttpsError(
          "internal",
          `Error assigning roles: ${error.message}`
        );
      } else {
        throw new functions.https.HttpsError(
          "internal",
          "Unknown error occurred while assigning roles."
        );
      }
    }
  }
);
