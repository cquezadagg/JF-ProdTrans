import { Clients, Drivers, Manifest } from "@/types/types";
import { User, signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, firestore } from "../firebase/client";
import { createContext, ReactNode, useEffect, useState } from "react";

interface AppContextProps {
  clientData: Clients[];
  driversData: Drivers[];
  manifestsData: Manifest[];
  updateFacturaData: Manifest["facturas"];
  updateFacturaState: (
    manifestNum: string,
    facturaNum: number,
    newEstado: string,
  ) => void;
  setClientData: React.Dispatch<React.SetStateAction<Clients[]>>;
  setDriversData: React.Dispatch<React.SetStateAction<Drivers[]>>;
  setManifestsData: React.Dispatch<React.SetStateAction<Manifest[]>>;
  error: string | null;
  logout: () => Promise<void>;
  loading: boolean;
  user: User | null; // Agregamos el estado de usuario autenticado
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [clientData, setClientData] = useState<Clients[]>([]);
  const [driversData, setDriversData] = useState<Drivers[]>([]);
  const [manifestsData, setManifestsData] = useState<Manifest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Estado de carga inicial
  const [user, setUser] = useState<User | null>(null); // Estado del usuario autenticado

  const updateFacturaState = async (
    manifestNum: string,
    facturaNum: number,
    newEstado: string,
  ) => {
    try {
      // Actualiza localmente el estado de las facturas
      setManifestsData((prevData) =>
        prevData.map((manifest) =>
          manifest.numManifiesto === manifestNum
            ? {
                ...manifest,
                facturas: manifest.facturas.map((factura) =>
                  factura.numFactura === facturaNum
                    ? { ...factura, estado: newEstado }
                    : factura,
                ),
              }
            : manifest,
        ),
      );

      // Encuentra el manifiesto en Firestore utilizando 'numManifiesto'
      const driver = driversData.find(() =>
        manifestsData.some(
          (manifest) => manifest.numManifiesto === manifestNum,
        ),
      );

      if (driver) {
        const manifestsCollectionRef = collection(
          firestore,
          `users/${driver.uid}/manifests`,
        );
        const q = query(
          manifestsCollectionRef,
          where("numManifiesto", "==", manifestNum),
        );

        const manifestsSnapshot = await getDocs(q);
        if (!manifestsSnapshot.empty) {
          const manifestDoc = manifestsSnapshot.docs[0];
          const updatedFacturas = manifestDoc
            .data()
            .facturas.map((factura: any) =>
              factura.numFactura === facturaNum
                ? { ...factura, estado: newEstado }
                : factura,
            );

          await updateDoc(manifestDoc.ref, { facturas: updatedFacturas });
        } else {
          console.error(
            "No se encontró el manifiesto con el número especificado.",
          );
        }
      }
    } catch (error) {
      console.error("Error al actualizar el estado de la factura:", error);
    }
  };

  const fetchData = async () => {
    try {
      // Datos clientes
      const clientSnapShot = await getDocs(collection(firestore, "client"));
      if (!clientSnapShot.empty) {
        setClientData(clientSnapShot.docs.map((doc) => doc.data() as Clients));
      }

      // Datos conductores
      const driversQuery = query(
        collection(firestore, "users"),
        where("rol", "==", "driver"), // Filtro por el campo "rol"
      );
      const driversSnapshot = await getDocs(driversQuery);
      if (!driversSnapshot.empty) {
        const drivers = driversSnapshot.docs.map((doc) => ({
          ...doc.data(),
          uid: doc.id,
        })) as Drivers[];
        setDriversData(drivers);
        // Datos manifiestos
        let allManifests: Manifest[] = [];
        for (const driver of drivers) {
          const manifestsCollectionRef = collection(
            firestore,
            `users/${driver.uid}/manifests`,
          );
          const manifestsSnapshot = await getDocs(manifestsCollectionRef);
          allManifests = [
            ...allManifests,
            ...manifestsSnapshot.docs.map((doc) => doc.data() as Manifest),
          ];
        }
        setManifestsData(allManifests);
      }
    } catch (e) {
      setError(`Error al cargar datos: ${e}`);
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setClientData([]);
      setDriversData([]);
      setManifestsData([]);
    } catch (e) {
      setError(`Error al cerrar sesión: ${e}`);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        await fetchData();
      } else {
        setUser(null);
        setClientData([]);
        setDriversData([]);
        setManifestsData([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider
      value={{
        clientData,
        driversData,
        manifestsData,
        setClientData,
        setDriversData,
        setManifestsData,
        updateFacturaData: manifestsData.flatMap(
          (manifest) => manifest.facturas,
        ),
        updateFacturaState,
        error,
        logout,
        loading,
        user,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
