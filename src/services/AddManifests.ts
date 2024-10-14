import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { Drivers, Manifest } from '@/types/types';
import { auth, firestore } from '@/firebase/client';

export async function addManifestData(
  manifest: Manifest['facturas'],
  selectedDriver: Drivers
): Promise<{ success: boolean; message: string }> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    if (!selectedDriver || !selectedDriver.uid) {
      throw new Error('Conductor seleccionado no válido o sin UID');
    }

    // Colección de manifiestos para el conductor seleccionado
    const manifestCollection = collection(
      firestore,
      'users',
      selectedDriver.uid,
      'manifests'
    );

    // Función para generar un número aleatorio entre 100 y 999
    const generateRandomManifestNumber = () => {
      return Math.floor(Math.random() * 900) + 100; // Genera un número entre 100 y 999
    };

    const numFacturasNuevas = manifest.map((factura) => factura.numFactura);
    let nextNumManifiesto = '';
    let isUniqueManifest = false;

    // Bucle para garantizar que el número de manifiesto generado sea único
    while (!isUniqueManifest) {
      const randomNum = generateRandomManifestNumber();
      nextNumManifiesto = `MFT-${randomNum}`;

      // Verifica si el manifiesto con este número ya existe
      const q = query(
        manifestCollection,
        where('numManifiesto', '==', nextNumManifiesto)
      );
      const snapShot = await getDocs(q);

      if (snapShot.empty) {
        isUniqueManifest = true; // Si no existe, el número es único
      }
    }

    // Verificar si alguna de las nuevas facturas ya existe en los manifiestos
    const snapShotFact = await getDocs(manifestCollection);
    if (!snapShotFact.empty) {
      // Si hay facturas ya existentes, obtenemos los números de factura duplicados
      const facturasDuplicadas = snapShotFact.docs
        .flatMap((doc) =>
          doc.data().facturas.map((factura) => factura.numFactura)
        )
        .filter((numFactura) => numFacturasNuevas.includes(numFactura));

      if (facturasDuplicadas.length > 0) {
        return {
          success: false,
          message: `Las siguientes facturas ya existen en la base de datos: ${facturasDuplicadas.join(', ')}`,
        };
      }
    }

    // Guardar el manifiesto con todas sus facturas
    const dataToSave = {
      idDriver: selectedDriver.uid,
      numManifiesto: nextNumManifiesto,
      fechaCreacion: Timestamp.now(),
      facturas: manifest.map((factura) => ({
        ...factura,
        idDriver: selectedDriver.uid,
      })),
    };

    await addDoc(manifestCollection, dataToSave);

    return {
      success: true,
      message: `Manifiesto agregado exitosamente con número: ${nextNumManifiesto}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error.message}`,
    };
  }
}
