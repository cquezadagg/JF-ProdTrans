import { LogsOpsNav } from "@ui/navs/LogsOpsNav";
import { useAppContext } from "@/hooks/useAppContext";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { LineMdLoadingTwotoneLoop } from "@/components/ui/Loading";

type FacturasStatus = "Asignado" | "En camino" | "Entregado";

const facturaStatuses: FacturasStatus[] = [
  "Asignado",
  "En camino",
  "Entregado",
];

export function LogsOpsDashboard() {
  const { manifestsData, driversData } = useAppContext();
  const [isLoading, setIsLoading] = useState(true); // Estado para manejar la carga

  // Simulación de la carga de datos
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Mostrar loading al comenzar
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simula un tiempo de carga
      setIsLoading(false); // Ocultar loading cuando se termine la carga
    };

    fetchData();
  }, []);

  const statusColor: Record<FacturasStatus, string> = {
    Asignado: "bg-blue-200 text-blue-800",
    "En camino": "bg-yellow-200 text-yellow-800",
    Entregado: "bg-green-200 text-green-800",
  };

  if (isLoading) {
    return (
      <LineMdLoadingTwotoneLoop msg="Cargando datos, por favor espera..." />
    );
  }

  return (
    <>
      <header>
        <LogsOpsNav />
      </header>
      <main className="min-h-screen">
        <h1 className="text-white font-bold text-2xl mt-10 text-center">
          Dashboard Logístico
        </h1>
        <section className="mt-10 grid rounded-lg p-4 bg-white ">
          <p className="text-black font-semibold">Todas las facturas</p>
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Facturas</CardTitle>
              <CardDescription className="text-center">
                Listado completo de facturas
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {/* Vista para móviles */}
              <div className="block sm:hidden">
                {manifestsData.flatMap((manifest) =>
                  manifest.facturas.map((factura) => (
                    <div
                      key={factura.numFactura}
                      className="mb-4 p-4 border-2 rounded-lg "
                    >
                      <div className="mb-2 grid border-b-2">
                        <strong>Num. de manifiesto</strong>{" "}
                        {manifest.numManifiesto}
                      </div>
                      <div className="mb-2 grid border-b-2">
                        <strong>Num. de factura</strong> {factura.numFactura}
                      </div>
                      <div className="mb-2 grid border-b-2">
                        <strong>Destino</strong> {factura.destino}
                      </div>
                      <div className="grid">
                        <strong>Conductor</strong>{" "}
                        {
                          driversData.find(
                            (driver) => driver.uid === manifest.idDriver,
                          )?.nombre
                        }
                      </div>
                    </div>
                  )),
                )}
                {manifestsData.flatMap((manifest) => manifest.facturas)
                  .length === 0 && (
                  <div className="mb-4 p-4 border rounded-lg text-center">
                    No hay facturas disponibles
                  </div>
                )}
              </div>
              {/* Vista para escritorio */}
              <div className="hidden sm:block">
                <Table className="min-w-auto">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número de manifiesto</TableHead>
                      <TableHead>Número de factura</TableHead>
                      <TableHead>Destino</TableHead>
                      <TableHead>Conductor</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {manifestsData.flatMap((manifest) =>
                      manifest.facturas.map((factura) => (
                        <TableRow key={factura.numFactura} className="w-full">
                          <TableCell>{manifest.numManifiesto}</TableCell>
                          <TableCell>{factura.numFactura}</TableCell>
                          <TableCell>{factura.destino}</TableCell>
                          <TableCell>
                            {
                              driversData.find(
                                (driver) => driver.uid === manifest.idDriver,
                              )?.nombre
                            }
                          </TableCell>
                          <TableCell>
                            <span
                              className={`p-2 rounded ${
                                statusColor[factura.estado as FacturasStatus] ||
                                "bg-gray-200 text-gray-800"
                              }`}
                            >
                              {factura.estado}
                            </span>
                          </TableCell>
                        </TableRow>
                      )),
                    )}
                    {manifestsData.flatMap((manifest) => manifest.facturas)
                      .length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No hay facturas disponibles
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
