export interface Manifest {
  idDriver: string;
  numManifiesto: string;
  fechaCreacion: firebase.firestore.Timestamp | string | null;
  fechaModificacion?: string;
  fechaEntrega?: string;
  facturas: Facturas[];
}
export interface Facturas {
  receptor: string;
  numFactura: number;
  nombreCliente: string;
  destino: string;
  cantBultos: number;
  estado: string;
  imagenEntrega: string;
}

export interface Drivers {
  uid: string;
  nombre: string;
  patente: string;
}

export interface Clients {
  id: number;
  nombre: string;
  destino: string;
}
