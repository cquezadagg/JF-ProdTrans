import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { auth } from "@/firebase/client";
import { useAppContext } from "@/hooks/useAppContext";
import { DriverNav } from "@/components/ui/navs/DriverNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Package, Truck, CheckCircle2, Camera, Filter } from "lucide-react";
import { SkeletonCard } from "@/components/skeletons/SkeletonCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_COLORS = {
  Asignado: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  "En camino": "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  Entregado: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
};

type DeliveryStatus = "Asignado" | "En camino" | "Entregado";

export function DriverDashboard() {
  const { manifestsData, updateFacturaState } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDelivery, setCurrentDelivery] = useState<any | null>(null);
  const [receptor, setReceptor] = useState("");
  const [imagenEntrega, setImagenEntrega] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | "all">(
    "all",
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const getStatusIcon = (status: DeliveryStatus) => {
    switch (status) {
      case "Asignado":
        return <Package className="h-4 w-4" />;
      case "En camino":
        return <Truck className="h-4 w-4" />;
      case "Entregado":
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  const handleStatusChange = (
    newStatus: DeliveryStatus,
    facturaNum: number,
    manifestNum: string,
  ) => {
    if (newStatus === "Entregado") {
      setCurrentDelivery({ facturaNum, manifestNum });
      setIsModalOpen(true);
    } else {
      updateFacturaState(manifestNum, facturaNum, newStatus);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenEntrega(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitEntrega = () => {
    if (currentDelivery) {
      updateFacturaState(
        currentDelivery.manifestNum,
        currentDelivery.facturaNum,
        "Entregado",
        receptor,
        imagenEntrega || undefined,
      );
      setIsModalOpen(false);
      setReceptor("");
      setImagenEntrega(null);
    }
  };

  const currentDriver = auth.currentUser?.uid;
  const currentManifest = manifestsData.filter(
    (manifest) => manifest.idDriver === currentDriver,
  );

  const sortedAndFilteredManifests = useMemo(() => {
    return currentManifest
      .map((manifest) => ({
        ...manifest,
        facturas: manifest.facturas
          .filter(
            (factura) =>
              statusFilter === "all" || factura.estado === statusFilter,
          )
          .sort((a, b) => {
            const order = { Asignado: 0, "En camino": 1, Entregado: 2 };
            return (
              order[a.estado as DeliveryStatus] -
              order[b.estado as DeliveryStatus]
            );
          }),
      }))
      .filter((manifest) => manifest.facturas.length > 0);
  }, [currentManifest, statusFilter]);

  return (
    <>
      <header>
        <DriverNav />
      </header>
      <main className="min-h-screen ">
        <div className="mb-6 flex items-center justify-evenly bg-white p-2 rounded">
          <h2 className="text-xl font-semibold text-[#002B5B]">Manifiestos</h2>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-[#002B5B]" />
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as DeliveryStatus | "all")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Asignado">Asignado</SelectItem>
                <SelectItem value="En camino">En camino</SelectItem>
                <SelectItem value="Entregado">Entregado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="container mx-auto p-6">
          <div
            className={`grid gap-6 ${sortedAndFilteredManifests.length > 0 ? "md:grid-cols-2 lg:grid-cols-3" : ""}`}
          >
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : sortedAndFilteredManifests.length === 0 ? (
              <Card>
                <CardContent className="text-center p-6">
                  <p className="text-gray-700 font-semibold">
                    No hay manifiestos que coincidan con el filtro seleccionado
                  </p>
                </CardContent>
              </Card>
            ) : (
              sortedAndFilteredManifests.map((manifest) => {
                let parsedDate: Date;

                if (
                  typeof manifest.fechaCreacion === "object" &&
                  "toDate" in manifest.fechaCreacion
                ) {
                  parsedDate = manifest.fechaCreacion.toDate();
                } else {
                  parsedDate = new Date(manifest.fechaCreacion);
                }

                const formattedDate = format(parsedDate, "dd/MM/yyyy");

                return (
                  <Card
                    key={manifest.numManifiesto}
                    className="transition-all hover:shadow-lg"
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xl font-bold text-[#002B5B]">
                        {manifest.numManifiesto}
                      </CardTitle>
                      <span className="text-sm font-medium text-muted-foreground">
                        Fecha de asignación: {formattedDate}
                      </span>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {manifest.facturas.map((factura) => (
                          <div key={factura.numFactura} className="grid gap-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                Factura: {factura.numFactura}
                              </span>
                              <Badge
                                variant="secondary"
                                className={`${STATUS_COLORS[factura.estado as DeliveryStatus]} flex items-center gap-1`}
                              >
                                {getStatusIcon(
                                  factura.estado as DeliveryStatus,
                                )}
                                {factura.estado}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <p>Destino: {factura.destino}</p>
                              <p>Bultos: {factura.cantBultos}</p>
                            </div>
                            {factura.estado !== "Entregado" && (
                              <Button
                                onClick={() =>
                                  handleStatusChange(
                                    factura.estado === "Asignado"
                                      ? "En camino"
                                      : "Entregado",
                                    factura.numFactura,
                                    manifest.numManifiesto,
                                  )
                                }
                                className={
                                  factura.estado === "Asignado"
                                    ? "bg-blue-500 hover:bg-blue-600"
                                    : "bg-green-500 hover:bg-green-600"
                                }
                              >
                                Marcar{" "}
                                {factura.estado === "Asignado"
                                  ? "En Camino"
                                  : "Entregado"}
                              </Button>
                            )}
                            {factura.estado === "Entregado" &&
                              factura.receptor && (
                                <div className="mt-2 text-sm">
                                  <p>
                                    <strong>Receptor:</strong>{" "}
                                    {factura.receptor}
                                  </p>
                                  {factura.imagenEntrega && (
                                    <img
                                      src={factura.imagenEntrega}
                                      alt="Prueba de entrega"
                                      className="mt-2 rounded-md"
                                    />
                                  )}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Entrega</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="receptor" className="text-right">
                Receptor
              </Label>
              <Input
                id="receptor"
                value={receptor}
                onChange={(e) => setReceptor(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imagen" className="text-right">
                Imagen
              </Label>
              <div className="col-span-3">
                <Input
                  id="imagen"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Label
                  htmlFor="imagen"
                  className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
                >
                  {imagenEntrega ? (
                    <img
                      src={imagenEntrega}
                      alt="Vista previa"
                      className="max-h-full"
                    />
                  ) : (
                    <span className="flex items-center space-x-2">
                      <Camera className="w-6 h-6 text-gray-600" />
                      <span className="font-medium text-gray-600">
                        Añadir imagen
                      </span>
                    </span>
                  )}
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmitEntrega}>
              Confirmar Entrega
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
