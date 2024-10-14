import { auth } from '@/firebase/client';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FieldValues } from 'react-hook-form';

export async function AuthUser(data: FieldValues) {
  try {
    await signInWithEmailAndPassword(auth, data.email, data.password);
    const user = auth.currentUser;
    if (user) {
      try {
        const idToken = await user.getIdTokenResult();
        const claims = idToken.claims;
        if (claims.driver) {
          return 'driver';
        } else if (claims.admin) {
          return 'admin';
        } else if (claims.logsOps) {
          return 'logsOps';
        } else if (claims.client) {
          return 'client';
        } else {
          return 'no-role';
        }
      } catch (error) {
        console.error('Error obteniendo el token:', error);
        throw new Error('No se pudieron obtener los roles del usuario.');
      }
    }
  } catch (error) {
    console.error('Error iniciando sesión:', error);
    throw new Error(
      'Credenciales inválidas. Verifique su correo y contraseña.'
    );
  }
}
