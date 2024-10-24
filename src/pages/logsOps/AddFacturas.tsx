import { Button } from "@/components/ui/Button";
import { useAppContext } from "@/hooks/useAppContext";
import { Drivers, Manifest } from "@/types/types";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import TableFacturas from "./TableFacturas2";
import { LineMdLoadingTwotoneLoop } from "@/components/ui/Loading";
import { addManifestData } from "@/services/AddManifests";
import { PopupState } from "@/components/ui/ErrorMessage";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase/client";

interface AddFacturasProps {
  selectedDriver: Drivers | null;
  onReset: () => void;
}

export function AddFacturas({ selectedDriver, onReset }: AddFacturasProps) {
  const { clientData } = useAppContext();
  const [facturasData, setFacturasData] = useState<FieldValues[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isGood, setIsGood] = useState(false);
  const [bgColor, txtColor] = isGood
    ? ["bg-green-200", "text-green-800"]
    : ["bg-red-200", "text-red-800"];
  const [selectedOption, setSelectedOption] = useState("manual");
  const [image, setImage] = useState<File | null>(null);

  // Función modificada para procesar el texto OCR y extraer campos específicos
  const processOCRData = (text: string) => {
    try {
      console.log("Texto recibido:", text);
      const lines = text.split("\n").map((line) => line.trim());
      const facturas: FieldValues[] = [];

      // Variables para almacenar datos temporales
      let currentFactura: FieldValues | null = null;

      for (const line of lines) {
        // Buscar número de pedido (PV seguido de números)
        const pvMatch = line.match(/PV\d+/);

        if (pvMatch) {
          // Si ya hay una factura en proceso, guardarla
          if (currentFactura) {
            facturas.push(currentFactura);
          }

          // Extraer otros datos de la línea
          const rowData = line.split(/\s+/);
          const tipoOrden =
            rowData.find((item) =>
              ["Tiendas Propias", "Grandes Tiendas", "Especialistas"].includes(
                item,
              ),
            ) || "";

          currentFactura = {
            numero_factura: pvMatch[0],
            tipo_orden: tipoOrden,
            cliente: "",
            avisar_a: "",
            ciudad: "",
            direccion: "",
            bultos: "",
            unidades: "",
          };

          // Procesar el resto de la línea
          const lineText = line.substring(pvMatch[0].length).trim();

          // Buscar cliente y destino
          if (lineText.includes("COMERCIAL ETCETERA S.A.")) {
            currentFactura.cliente = "COMERCIAL ETCETERA S.A.";
          } else if (lineText.includes("CENCOSUD")) {
            currentFactura.cliente = "CENCOSUD RETAIL S.A.";
          }

          // Extraer ciudad (Santiago o Rancagua)
          if (lineText.includes("SANTIAGO")) {
            currentFactura.ciudad = "SANTIAGO";
          } else if (lineText.includes("RANCAGUA")) {
            currentFactura.ciudad = "RANCAGUA";
          }

          // Extraer números para bultos y unidades
          const numbers = lineText.match(/\b\d+\b/g);
          if (numbers && numbers.length >= 2) {
            currentFactura.bultos = numbers[numbers.length - 2];
            currentFactura.unidades = numbers[numbers.length - 1];
          }

          // Extraer dirección
          const direccionMatch = lineText.match(
            /(?:AV\.|AVENIDA|PRADO)\s+[^,]+/,
          );
          if (direccionMatch) {
            currentFactura.direccion = direccionMatch[0];
          }

          // Extraer "avisar a" (códigos tipo T seguidos de números o nombres de plaza)
          const avisarMatch = lineText.match(/T\d+|PLAZA\s+[^,]+/);
          if (avisarMatch) {
            currentFactura.avisar_a = avisarMatch[0];
          }
        }
      }

      // No olvidar agregar la última factura
      if (currentFactura) {
        facturas.push(currentFactura);
      }

      if (facturas.length > 0) {
        setFacturasData(facturas);
        setError("");
      } else {
        setError("No se pudieron extraer datos de facturas del texto.");
      }
    } catch (error) {
      console.error("Error al procesar el texto OCR:", error);
      setError("Error al procesar el texto extraído.");
    }
  };

  // Manejador de subida de imagen
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setLoading(true);

      const storage = getStorage();
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          setError("Error al subir la imagen.");
          setLoading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await processImageWithVision(downloadURL);
          });
        },
      );
    }
  };

  // Procesar imagen con Vision
  const processImageWithVision = async (imageUrl: string) => {
    try {
      setLoading(true);
      const extractedTextCollection = collection(firestore, "extractedText");
      const querySnapshot = await getDocs(extractedTextCollection);

      const docs = querySnapshot.docs;
      if (docs.length > 0) {
        const lastDoc = docs[docs.length - 1];
        const data = lastDoc.data();

        if (data && data.text) {
          processOCRData(data.text);
        } else {
          setError("El documento no contiene texto.");
        }
      } else {
        setError("No se encontraron documentos en la colección.");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error al procesar la imagen:", err);
      setError("Error al obtener los datos procesados.");
      setLoading(false);
    }
  };

  // Manejar el envío de facturas
  const handleSubmitFacturas = async () => {
    setLoading(true);
    if (facturasData.length > 0) {
      if (selectedDriver) {
        const manifestData: Manifest["facturas"] = facturasData.map(
          (factura) => ({
            numFactura: factura.numero_factura,
            nombreCliente: factura.nombre_cliente,
            destino: factura.avisar_a,
            cantBultos: factura.bultos,
            estado: "Asignado",
          }),
        );

        try {
          const response = await addManifestData(manifestData, selectedDriver);
          setLoading(false);

          if (response.success) {
            setIsGood(true);
            setError(response.message.toString());

            setTimeout(() => {
              setError("");
              onReset();
              setFacturasData([]);
              setIsGood(false);
            }, 3000);
          } else {
            setIsGood(false);
            setError(response.message.toString());
          }
        } catch (err) {
          setLoading(false);
          setIsGood(false);
          setError("Error al procesar las facturas");
        }
      }
    } else {
      setLoading(false);
      setIsGood(false);
      setError("No hay facturas para enviar.");
    }
  };

  return (
    <div className="space-y-4">
      <section className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-white text-xl font-bold mb-4">Ingresar Facturas</h2>

        <div className="mb-4">
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="w-full rounded-lg p-2 bg-white"
          >
            <option value="manual">Ingreso Manual</option>
            <option value="imagen">Subir Imagen</option>
          </select>
        </div>

        {selectedOption === "imagen" && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <label className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg cursor-pointer">
                Seleccionar Imagen
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {image && (
                <span className="text-white">
                  Imagen seleccionada: {image.name}
                </span>
              )}
            </div>
          </div>
        )}

        {loading && <LineMdLoadingTwotoneLoop msg="Procesando..." />}

        {facturasData.length > 0 && (
          <div className="space-y-4">
            <TableFacturas
              facturasNuevas={facturasData}
              setFacturasNuevas={setFacturasData}
            />

            <div className="flex justify-end">
              <Button
                onClick={handleSubmitFacturas}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Guardar Facturas
              </Button>
            </div>
          </div>
        )}

        {error && (
          <PopupState
            mensajeAlertSuc={error}
            isGood={isGood}
            txtColor={txtColor}
            bgColor={bgColor}
          />
        )}
      </section>
    </div>
  );
}
