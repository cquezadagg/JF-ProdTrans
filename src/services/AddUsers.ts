import { functions } from "@/firebase/client";
import { httpsCallable } from "firebase/functions";
import { FieldValues } from "react-hook-form";

export async function AddUsuarios(data: FieldValues) {
  try {
    const createUserFunction = httpsCallable<
      CreateUserData,
      { success: boolean; uid: string }
    >(functions, "createUser");

    const result = await createUserFunction({
      email: data.email,
      password: data.password,
      nombre: data.nombre,
      rol: data.rol,
    });

    console.log("Usuario creado:", result.data);
    return result.data;
  } catch (error) {
    console.error("Error creando usuario:", error);
    throw error;
  }
}
interface CreateUserData {
  email: string;
  password: string;
  nombre: string;
  rol: string;
}
