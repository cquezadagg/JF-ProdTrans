import { ClientNav } from "@/components/ui/navs/ClientNav";
import { useAppContext } from "@/hooks/useAppContext";
import { format } from "date-fns"; // Importa isValid
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
import FilterManifest from "@/components/ui/filters/FilterManifest";
type FacturasStatus = "Asignado" | "En camino" | "Entregado";

export function ClientDashboard() {
  const { manifestsData, driversData } = useAppContext();

  const statusColor: Record<FacturasStatus, string> = {
    Asignado: "bg-blue-200 text-blue-800",
    "En camino": "bg-yellow-200 text-yellow-800",
    Entregado: "bg-green-200 text-green-800",
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
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">Facturas</CardTitle>
              <CardDescription className="text-center">
                Listado completo de facturas
              </CardDescription>
            </CardHeader>
            <FilterManifest />
            <CardContent className="overflow-x-auto border-2">
              {manifestsData.flatMap((manifest) =>
                manifest.facturas.map((factura) => (
                  <Card
                    key={factura.numFactura}
                    className=" mb-3 border-2 border-zinc-800"
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
                                  className={`p-2 rounded ${
                                    statusColor[
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
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
