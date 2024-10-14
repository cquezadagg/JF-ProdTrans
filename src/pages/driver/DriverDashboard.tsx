import { DriverNav } from "@/components/ui/navs/DriverNav";
import { useAppContext } from "@/hooks/useAppContext";
import { auth } from "@/firebase/client";
import { format } from "date-fns";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DriverDashboard() {
  const { manifestsData, updateFacturaState } = useAppContext();

  const getAvailableStates = (currentEstado: string) => {
    const allStates = ["Asignado", "En camino", "Entregado"];
    const currentIndex = allStates.indexOf(currentEstado);
    return allStates.slice(currentIndex);
  };

  const getStateColor = (estado: string) => {
    switch (estado) {
      case "Entregado":
        return "bg-green-400";
      case "En camino":
        return "bg-amber-400";
      default:
        return "bg-zinc-400";
    }
  };

  const currentDriver = auth.currentUser?.uid;
  const currentManifest = manifestsData.filter(
    (manifest) => manifest.idDriver === currentDriver,
  );

  const handleStateChange = (
    newState: string,
    facturaNum: number,
    manifestNum: string,
  ) => {
    updateFacturaState(manifestNum, facturaNum, newState);
  };

  return (
    <>
      <header>
        <DriverNav />
      </header>
      <main className="min-h-screen">
        <section>
          <h1 className="text-white font-bold text-2xl mt-10 text-center mb-4">
            Dashboard conductor
          </h1>
          <div className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
            {currentManifest.map((manifest) => {
              let parsedDate: Date;

              if (
                typeof manifest.fechaCreacion === "object" &&
                "toDate" in manifest.fechaCreacion
              ) {
                parsedDate = manifest.fechaCreacion;
              } else {
                parsedDate = new Date(manifest.fechaCreacion);
              }

              const formattedDate = format(parsedDate, "dd/MM/yyyy");

              return (
                <Card key={manifest.numManifiesto}>
                  <CardTitle className="p-5 flex flex-row justify-between">
                    {manifest.numManifiesto}
                    <span className="font-bold">
                      Fecha de asignación:{" "}
                      <span className="font-extralight text-sm mt-2 text-zinc-700">
                        {formattedDate}
                      </span>
                    </span>
                  </CardTitle>
                  <CardContent>
                    <div className="font-extralight text-sm mt-2 text-zinc-700">
                      <Table>
                        <TableCaption>Listado de facturas</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Factura</TableHead>
                            <TableHead>Destino</TableHead>
                            <TableHead>Bultos</TableHead>
                            <TableHead>Estado</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {manifest.facturas.map((factura) => (
                            <TableRow key={factura.numFactura}>
                              <TableCell>{factura.numFactura}</TableCell>
                              <TableCell>{factura.destino}</TableCell>
                              <TableCell>{factura.cantBultos}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Select
                                    onValueChange={(value) =>
                                      handleStateChange(
                                        value,
                                        factura.numFactura,
                                        manifest.numManifiesto,
                                      )
                                    }
                                    defaultValue={factura.estado}
                                  >
                                    <SelectTrigger
                                      className={`w-[140px] ${getStateColor(factura.estado)} text-white`}
                                    >
                                      <SelectValue placeholder="Cambiar estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {getAvailableStates(factura.estado).map(
                                        (state) => (
                                          <SelectItem
                                            key={state}
                                            value={state}
                                            className={`${getStateColor(state)} text-white`}
                                          >
                                            {state}
                                          </SelectItem>
                                        ),
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
