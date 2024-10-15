import { ClientNav } from "@/components/ui/navs/ClientNav";
import { useAppContext } from "@/hooks/useAppContext";
import { format } from "date-fns";
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
      const parsedDate =
        typeof manifest.fechaCreacion === "object" &&
        "toDate" in manifest.fechaCreacion
          ? manifest.fechaCreacion // Si es un Timestamp de Firestore
          : new Date(manifest.fechaCreacion); // Si es un string de fecha
      const formattedDate = format(parsedDate, "dd/MM/yyyy");

      // Busca el conductor en driversData comparando por el idDriver
      const driver = driversData.find((d) => d.uid === manifest.idDriver);

      return manifest.facturas.map((factura) => ({
        ...factura,
        fecha: formattedDate,
        conductor: driver ? driver.nombre : "Conductor desconocido", // Aquí colocamos el nombre del conductor
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
