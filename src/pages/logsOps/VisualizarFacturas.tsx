import { LogsOpsNav } from '@/components/ui/navs/LogsOpsNav';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { useAppContext } from '@/hooks/useAppContext';

export function VisualizarFacturas() {
  const { manifestsData } = useAppContext();
  return (
    <>
      <header>
        <LogsOpsNav />
      </header>
      <main>
        <h1>Visualizar facturas</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Factura</TableHead>
              <TableHead>Conductor</TableHead>
              <TableHead>Fecha Creacion</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {manifestsData.map((manifest) =>
              manifest.facturas.map((factura) => (
                <TableRow key={factura.numFactura}>
                  <TableCell>{factura.numFactura}</TableCell>
                  <TableCell>{manifest.idDriver}</TableCell>
                  <TableCell>{factura.estado}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </main>
    </>
  );
}
