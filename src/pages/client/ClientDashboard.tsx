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
  const { manifestsData } = useAppContext();
  const allFacturas = useMemo(() => {
    return manifestsData.flatMap((manifest) => {
      const parsedDate =
        typeof manifest.fechaCreacion === "object" &&
        "toDate" in manifest.fechaCreacion
          ? manifest.fechaCreacion
          : new Date(manifest.fechaCreacion);
      const formattedDate = format(parsedDate, "dd/MM/yyyy");

      return manifest.facturas.map((factura) => ({
        ...factura,
        fecha: formattedDate,
        conductor: manifest.idDriver,
      }));
    });
  }, [manifestsData]);

  const getStateColor = (estado: string) => {
    switch (estado) {
      case "Entregado":
        return "bg-green-200 text-green-800";
      case "En camino":
        return "bg-yellow-200 text-yellow-800";
      default:
        return "bg-zinc-200 text-zinc-800";
    }
  };
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
                      {facturas.idDriver}
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
