import { useState } from "react";
import { Search } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "./date-picker";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";

interface Filters {
  status: string | null;
  date: string | null;
  search: string | null;
}

interface EnhancedFilterProps {
  onFilterChange: (filters: Filters) => void;
}

export default function EnhancedFilter({
  onFilterChange,
}: EnhancedFilterProps) {
  const [status, setStatus] = useState<string>("all");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState<string>("");

  const handleFilterChange = () => {
    onFilterChange({
      status: status === "all" ? null : status,
      date: date ? format(date, "yyyy-MM-dd") : null,
      search: search.trim() || null,
    });
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md p-6 space-y-4">
      <h3 className="text-lg font-semibold">Filtros</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Estado de la factura</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Asignado">Asignado</SelectItem>
                <SelectItem value="En camino">En camino</SelectItem>
                <SelectItem value="Entregado">Entregado</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Fecha</Label>
          <DatePicker date={date} setDate={handleDateChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="search">Buscar factura o manifiesto</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Número de factura o manifiesto"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex items-end">
          <Button onClick={handleFilterChange} className="w-full">
            Aplicar filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
