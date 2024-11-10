"use client";

import { ClientNav } from "@/components/ui/navs/ClientNav";
import { useAppContext } from "@/hooks/useAppContext";
import { format } from "date-fns";
import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Truck,
  Calendar,
  Search,
  Package,
  MapPin,
  X,
  Filter,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";

// Esqueleto de carga
const SkeletonCard = () => (
  <div className="bg-[#141B2D] border-[#1F2937] p-4 rounded-md animate-pulse">
    <div className="flex justify-between items-start">
      <div className="w-2/3 h-5 bg-gray-700 rounded mb-2"></div>
      <div className="w-1/4 h-5 bg-gray-700 rounded"></div>
    </div>
    <div className="space-y-3 mb-4">
      <div className="w-1/2 h-5 bg-gray-700 rounded"></div>
      <div className="w-1/2 h-5 bg-gray-700 rounded"></div>
    </div>
  </div>
);

type FacturasStatus = "Asignado" | "En camino" | "Entregado";

interface Filters {
  status: string | null;
  date: string | null;
  search: string | null;
}

export function ClientDashboard() {
  const { manifestsData, driversData } = useAppContext();
  const [filters, setFilters] = useState<Filters>({
    status: null,
    date: null,
    search: null,
  });
  const [isLoading, setIsLoading] = useState(true); // Nuevo estado de carga

  const statusColor: Record<FacturasStatus, string> = {
    Asignado: "bg-blue-500/20 text-blue-500 border border-blue-500/20",
    "En camino": "bg-amber-500/20 text-amber-500 border border-amber-500/20",
    Entregado:
      "bg-emerald-500/20 text-emerald-500 border border-emerald-500/20",
  };

  const filteredManifests = useMemo(() => {
    return manifestsData.filter((manifest) => {
      if (filters.date) {
        const manifestDate = format(
          new Date(manifest.fechaCreacion.toDate()),
          "yyyy-MM-dd",
        );
        if (manifestDate !== filters.date) return false;
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const hasMatchingManifest = manifest.numManifiesto
          .toLowerCase()
          .includes(searchLower);
        const hasMatchingFactura = manifest.facturas.some((factura) =>
          factura.numFactura.toString().includes(searchLower),
        );
        if (!hasMatchingManifest && !hasMatchingFactura) return false;
      }

      if (filters.status) {
        const hasMatchingStatus = manifest.facturas.some(
          (factura) => factura.estado === filters.status,
        );
        if (!hasMatchingStatus) return false;
      }

      return true;
    });
  }, [manifestsData, filters]);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({ status: null, date: null, search: null });
  };

  // Simulación de carga (reemplazar con una lógica real en una app de producción)
  useEffect(() => {
    if (!manifestsData || !driversData) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false); // Simula que los datos se han cargado después de 2 segundos
      }, 2000);
    } else {
      setIsLoading(false);
    }
  }, [manifestsData, driversData]);

  return (
    <div className="min-h-screen ">
      <ClientNav />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Gestión de Manifiestos y Facturas
          </h1>
          <p className="text-gray-400 text-center">
            Visualiza tus manifiestos y facturas de manera eficiente
          </p>
        </div>

        {/* Filtros */}
        <Card className="mb-8 bg-[#141B2D] border-[#1F2937]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                  Estado de la factura
                </label>
                <Select
                  value={filters.status || "Todos"}
                  onValueChange={(value) =>
                    handleFilterChange({ ...filters, status: value || null })
                  }
                >
                  <SelectTrigger className="w-full bg-[#1F2937] border-[#2D3748] text-white">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1F2937] border-[#2D3748]">
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="Asignado">Asignado</SelectItem>
                    <SelectItem value="En camino">En camino</SelectItem>
                    <SelectItem value="Entregado">Entregado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                  Fecha
                </label>
                <Input
                  type="date"
                  className="bg-[#1F2937] border-[#2D3748] text-white"
                  onChange={(e) =>
                    handleFilterChange({ ...filters, date: e.target.value })
                  }
                  value={filters.date || ""}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-10 bg-[#1F2937] border-[#2D3748] text-white"
                    placeholder="Número de factura o manifiesto"
                    onChange={(e) =>
                      handleFilterChange({ ...filters, search: e.target.value })
                    }
                    value={filters.search || ""}
                  />
                </div>
              </div>

              <div className="flex items-end gap-2">
                <Button
                  variant="destructive"
                  onClick={clearFilters}
                  className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/10"
                >
                  <X className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manifiestos */}
        <ScrollArea className="h-[calc(100vh-400px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))
              : filteredManifests.map((manifest) => (
                  <motion.div
                    key={manifest.facturas.map((f) => f.numFactura).join("-")}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-[#141B2D] border-[#1F2937] hover:border-blue-500/50 transition-all duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white text-xl mb-1">
                              {manifest.numManifiesto}
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                              {format(
                                new Date(manifest.fechaCreacion.toDate()),
                                "dd/MM/yyyy HH:mm",
                              )}
                            </CardDescription>
                          </div>
                          <Badge className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
                            {manifest.facturas.length} facturas
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center text-gray-300">
                            <Truck className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="text-sm">
                              {driversData.find(
                                (d) => d.uid === manifest.idDriver,
                              )?.nombre || manifest.idDriver}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-300">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="text-sm">
                              Creado:{" "}
                              {format(
                                new Date(manifest.fechaCreacion.toDate()),
                                "dd/MM/yyyy",
                              )}
                            </span>
                          </div>
                        </div>

                        <Accordion type="single" collapsible>
                          <AccordionItem
                            value="facturas"
                            className="border-[#2D3748]"
                          >
                            <AccordionTrigger className="text-gray-300 hover:text-white hover:no-underline">
                              <span className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Ver Facturas
                              </span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-3 pt-2">
                                {manifest.facturas.map((factura) => (
                                  <Card
                                    key={factura.numFactura}
                                    className="bg-[#1F2937] border-[#2D3748]"
                                  >
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start mb-3">
                                        <span className="text-white font-medium">
                                          #{factura.numFactura}
                                        </span>
                                        <Badge
                                          className={
                                            statusColor[
                                              factura.estado as FacturasStatus
                                            ]
                                          }
                                        >
                                          {factura.estado}
                                        </Badge>
                                      </div>
                                      <div className="space-y-2 text-sm text-gray-300">
                                        <div className="flex items-center">
                                          <Package className="h-4 w-4 mr-2 text-gray-400" />
                                          <span>
                                            {factura.cantBultos} bultos
                                          </span>
                                        </div>
                                        <div className="flex items-center">
                                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                          <span>{factura.destino}</span>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
