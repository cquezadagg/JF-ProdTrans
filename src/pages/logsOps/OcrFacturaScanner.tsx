import { useState } from "react";
import { Upload } from "lucide-react";
import { Alert } from "@/components/ui/Alert";

interface OcrFacturaScannerProps {
  onScanComplete: (data: any) => void;
  setScanning: (scanning: boolean) => void;
}

export function OcrFacturaScanner({
  onScanComplete,
  setScanning,
}: OcrFacturaScannerProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("El archivo es demasiado grande. Máximo 5MB permitido.");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Por favor, suba solo archivos de imagen.");
        return;
      }

      setError("");
      setScanning(true);
      setPreviewUrl(URL.createObjectURL(file));

      try {
        // Aquí iría la integración real con el servicio OCR
        // Este es un ejemplo simulado
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Datos simulados del OCR
        const mockOcrResult = {
          numero_factura: "1234-5",
          nombre_cliente: "Cliente Ejemplo",
          bultos: "10",
          destino: "Destino Ejemplo",
        };

        onScanComplete(mockOcrResult);
      } catch (error) {
        setError("Error al procesar la imagen. Por favor, intente nuevamente.");
      } finally {
        setScanning(false);
      }
    }
  };

  return (
    <section className="mt-4">
      <h2 className="text-xl font-bold mb-2 text-white">
        Escanear imagen de factura
      </h2>
      {error && <Alert message={error} txtColor="text-red-500" />}
      <div className="w-full p-6 border-2 border-dashed border-gray-400 rounded-lg text-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center gap-4"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full h-48 object-contain mb-4"
            />
          ) : (
            <Upload className="w-12 h-12 text-gray-400" />
          )}
          <span className="text-white">Subir imagen de factura</span>
          <span className="text-gray-400 text-sm">
            Formatos soportados: JPG, PNG, PDF
          </span>
        </label>
      </div>
    </section>
  );
}
