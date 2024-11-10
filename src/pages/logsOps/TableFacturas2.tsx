import React from 'react';

const TableFacturas = ({ facturasNuevas, setFacturasNuevas }) => {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-800 bg-white rounded-lg">
        <thead className="text-xs text-white uppercase bg-gray-700">
          <tr>
            <th className="px-6 py-3">N° Pedido</th>
            <th className="px-6 py-3">Cliente</th>
            <th className="px-6 py-3">Avisar a</th>
            <th className="px-6 py-3">Ciudad</th>
            <th className="px-6 py-3">Bultos</th>
            <th className="px-6 py-3">Unidades</th>
            <th className="px-6 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facturasNuevas.map((factura, index) => (
            <tr key={index} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4">{factura.numero_factura}</td>
              <td className="px-6 py-4">{factura.nombre_cliente}</td>
              <td className="px-6 py-4">
                <input
                  type="text"
                  className="w-full px-2 py-1 border rounded"
                  placeholder="Contacto"
                  value={factura.avisar_a || ''}
                  onChange={(e) => {
                    const newFacturas = [...facturasNuevas];
                    newFacturas[index].avisar_a = e.target.value;
                    setFacturasNuevas(newFacturas);
                  }}
                />
              </td>
              <td className="px-6 py-4">
                <input
                  type="text"
                  className="w-full px-2 py-1 border rounded"
                  placeholder="Ciudad"
                  value={factura.ciudad || ''}
                  onChange={(e) => {
                    const newFacturas = [...facturasNuevas];
                    newFacturas[index].ciudad = e.target.value;
                    setFacturasNuevas(newFacturas);
                  }}
                />
              </td>
              <td className="px-6 py-4">{factura.bultos}</td>
              <td className="px-6 py-4">
                <input
                  type="number"
                  className="w-full px-2 py-1 border rounded"
                  placeholder="Unidades"
                  value={factura.unidades || ''}
                  onChange={(e) => {
                    const newFacturas = [...facturasNuevas];
                    newFacturas[index].unidades = e.target.value;
                    setFacturasNuevas(newFacturas);
                  }}
                />
              </td>
              <td className="px-6 py-4">
                <button
                  className="text-red-600 hover:text-red-900"
                  onClick={() => {
                    const newFacturas = facturasNuevas.filter((_, i) => i !== index);
                    setFacturasNuevas(newFacturas);
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableFacturas;
