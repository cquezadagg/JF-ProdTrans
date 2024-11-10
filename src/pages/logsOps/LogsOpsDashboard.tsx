import { LogsOpsNav } from "@ui/navs/LogsOpsNav";
import { useAppContext } from "@/hooks/useAppContext";
import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
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
import FilterManifest from "@/components/ui/filters/FilterManifest";
import { getFunctions, httpsCallable } from "firebase/functions"; // Asegúrate de tener estas importaciones correctas
import { functions } from "@/firebase/client";

type FacturasStatus = "Asignado" | "En camino" | "Entregado";

interface Filters {
  status: string | null;
  date: string | null;
  search: string | null;
}

export function LogsOpsDashboard() {
  const { manifestsData, driversData } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    status: null,
    date: null,
    search: null,
  });


  // const assignRoleFunction = httpsCallable(functions, "assignUserRole");
  //
  // // Asignar rol 'logsOps' y 'client' al usuario
  // assignRoleFunction({ uid: "Oujy8pOWV6Rznf28KUcPWT5ogq32", driver: true })
  //   .then((result) => {
  //     console.log("Roles asignados:", result.data);
  //   })
  //   .catch((error) => {
  //     console.error("Error al asignar roles:", error);
  //   });
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const statusColor: Record<FacturasStatus, string> = {
    Asignado: "bg-blue-200 text-blue-800",
    "En camino": "bg-yellow-200 text-yellow-800",
    Entregado: "bg-green-200 text-green-800",
  };

  const filteredManifests = useMemo(() => {
    return manifestsData.filter((manifest) => {
      if (filters.date) {
        const manifestDate = format(
          new Date(manifest.fechaCreacion.toDate()),
          "yyyy-MM-dd",
        );
        if (manifestDate !== filters.date) {
          return false;
        }
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const hasMatchingManifest = manifest.numManifiesto
          .toLowerCase()
          .includes(searchLower);
        const hasMatchingFactura = manifest.facturas.some((factura) =>
          factura.numFactura.toString().includes(searchLower),
        );
        if (!hasMatchingManifest && !hasMatchingFactura) {
          return false;
        }
      }

      if (filters.status) {
        const hasMatchingStatus = manifest.facturas.some(
          (factura) => factura.estado === filters.status,
        );
        if (!hasMatchingStatus) {
          return false;
        }
      }

      return true;
    });
  }, [manifestsData, filters]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
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
      <main>
        <section>
          <h1 className="text-white font-bold text-2xl mt-10 text-center mb-4">
            Dashboard Logístico
          </h1>
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">Facturas</CardTitle>
              <CardDescription className="text-center">
                Listado completo de facturas
              </CardDescription>
            </CardHeader>
            <FilterManifest onFilterChange={handleFilterChange} />
            <CardContent className="overflow-x-auto border-2">
              {filteredManifests.flatMap((manifest) =>
                manifest.facturas.map((factura) => (
                  <Card
                    key={factura.numFactura}
                    className="mb-3 border-2 border-zinc-800"
                  >
                    <CardTitle className="p-5 text-center text-xl">
                      {manifest.numManifiesto}
                    </CardTitle>
                    <div className="font-bold text-sm grid grid-cols-2 gap-2 justify-items-stretch pl-6">
                      <span className="font-extralight text-sm mt-2 text-zinc-700 gap-2 flex flex-col">
                        <span className="font-bold">Fecha de asignación</span>
                        {format(
                          new Date(manifest.fechaCreacion.toDate()),
                          "dd/MM/yyyy",
                        )}
                      </span>
                      <span className="font-extralight text-sm mt-2 text-zinc-700 gap-2 flex flex-col">
                        <span className="font-bold">Conductor</span>
                        {
                          driversData.find(
                            (driver) => driver.uid === manifest.idDriver,
                          )?.nombre
                        }
                      </span>
                    </div>
                    <CardContent>
                      <div className="font-extralight text-sm mt-2 text-zinc-700">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Factura</TableHead>
                              <TableHead>Destino</TableHead>
                              <TableHead>Bultos</TableHead>
                              <TableHead>Estado</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>{factura.numFactura}</TableCell>
                              <TableCell>{factura.destino}</TableCell>
                              <TableCell>{factura.cantBultos}</TableCell>
                              <TableCell>
                                <span
                                  className={`p-2 rounded ${statusColor[
                                    factura.estado as FacturasStatus
                                  ] || "bg-gray-200 text-gray-800"
                                    }`}
                                >
                                  {factura.estado}
                                </span>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                )),
              )}
              {filteredManifests.flatMap((manifest) => manifest.facturas)
                .length === 0 && (
                  <div className="text-center p-4">
                    No hay facturas disponibles
                  </div>
                )}
            </CardContent>
          </Card>
        </section>
      </main>
      <script>
      </script>
    </>
  );
}
