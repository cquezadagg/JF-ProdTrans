import { ClientNav } from "@/components/ui/navs/ClientNav";
import { useAppContext } from "@/hooks/useAppContext";
import { format, isValid } from "date-fns"; // Importa isValid
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { useMemo } from "react";

export function ClientDashboard() {
  const { manifestsData, driversData } = useAppContext();

  const allFacturas = useMemo(() => {
    return manifestsData.flatMap((manifest) => {
      let parsedDate;
      if (
        typeof manifest.fechaCreacion === "object" &&
        "toDate" in manifest.fechaCreacion
      ) {
        parsedDate = manifest.fechaCreacion.toDate(); // Si es un Timestamp de Firestore
      } else if (manifest.fechaCreacion) {
        parsedDate = new Date(manifest.fechaCreacion); // Si es un string de fecha
      } else {
        parsedDate = new Date(); // Valor por defecto si no hay fecha
      }

      let formattedDate = "Fecha no disponible";
      if (isValid(parsedDate)) {
        try {
          formattedDate = format(parsedDate, "dd/MM/yyyy");
        } catch (error) {
          console.error("Error al formatear la fecha:", error);
        }
      }

      const driver = driversData.find((d) => d.uid === manifest.idDriver);

      return manifest.facturas.map((factura) => ({
        ...factura,
        fecha: formattedDate,
        conductor: driver ? driver.nombre : "Conductor desconocido",
      }));
    });
  }, [manifestsData, driversData]);

  return (
    <>
      <header>
        <ClientNav />
      </header>
      <main>
        <section>
          <h1 className="text-white fot-bold text-2xl mt-10 text-center mb-4">
            Dashboard cliente
          </h1>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Table>
              <TableCaption>Listado de todas las facturas</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Factura
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destino
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bultos
                  </TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conductor
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {allFacturas.map((facturas) => (
                  <TableRow key={facturas.numFactura}>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {facturas.numFactura}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {facturas.estado}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {facturas.fecha}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {facturas.nombreCliente}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {facturas.destino}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {facturas.cantBultos}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {facturas.conductor}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </main>
    </>
  );
}
