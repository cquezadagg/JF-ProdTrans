import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Delete } from "lucide-react";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { EditCurrentFactura } from "./EditCurrentFactura";
import { TablerEdit } from "@/components/icons/TablerEdit";

interface TableFacturasProps {
  facturasNuevas: FieldValues[];
  setFacturasNuevas: (facturas: FieldValues[]) => void; // New prop to update state
}

export function TableFacturas({
  facturasNuevas,
  setFacturasNuevas,
}: TableFacturasProps) {
  const [showEdit, setShowEdit] = useState<FieldValues | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null); // Track the index of the edited factura

  const handleEdit = (numeroFactura: string) => {
    const facturaToEdit = facturasNuevas.find(
      (factura) => factura.numero_factura === numeroFactura,
    );
    if (facturaToEdit) {
      setShowEdit(facturaToEdit);
    }
  };

  const handleDelete = (numeroFactura: string) => {
    const updatedFacturas = facturasNuevas.filter(
      (factura) => factura.numero_factura !== numeroFactura,
    );
    setFacturasNuevas(updatedFacturas);
  };

  const handleVolver = () => {
    setShowEdit(null);
    setEditIndex(null);
  };

  const handleUpdate = (data: FieldValues) => {
    if (editIndex !== null) {
      const updatedFacturas = facturasNuevas.map((factura, index) =>
        index === editIndex ? { ...factura, ...data } : factura,
      );
      setFacturasNuevas(updatedFacturas);
      setShowEdit(null); // Close the edit modal
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Factura</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Destino</TableHead>
            <TableHead>Bultos</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-zinc-300">
          {facturasNuevas.map((facttN) => (
            <TableRow key={facttN.numero_factura}>
              <TableCell>{facttN.numero_factura}</TableCell>
              <TableCell>{facttN.nombre_cliente}</TableCell>
              <TableCell>{facttN.destino}</TableCell>
              <TableCell>{facttN.bultos}</TableCell>
              <TableCell className="grid  gap-7 mt-1">
                <button
                  type="button"
                  onClick={() => handleEdit(facttN.numero_factura)}
                >
                  <TablerEdit />
                </button>
                {/* <button */}
                {/*   onClick={() => handleDelete(facttN.numero_factura)} */}
                {/*   type="button" */}
                {/* > */}
                {/*   <Delete /> */}
                {/* </button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {showEdit && (
        <EditCurrentFactura
          currentFactura={showEdit}
          onVolver={handleVolver}
          onUpdate={handleUpdate}
        />
      )}
    </>
  );
}
