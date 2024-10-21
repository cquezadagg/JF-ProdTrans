import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAppContext } from "@/hooks/useAppContext";
import { Drivers, Manifest } from "@/types/types";
import { useEffect, useState } from "react";
import { FieldValues, useFormContext } from "react-hook-form";
import { TableFacturas } from "./TableFacturas";
import { Alert } from "@/components/ui/Alert";
import { LineMdLoadingTwotoneLoop } from "@/components/ui/Loading";
import { addManifestData } from "@/services/AddManifests";
import { PopupState } from "@/components/ui/ErrorMessage";
import { useNavigate } from "react-router-dom";
import { Label } from "@radix-ui/react-select";

interface AddFacturasProps {
  selectedDriver: Drivers | null;
}

export function AddFacturas({ selectedDriver }: AddFacturasProps) {
  const { clientData } = useAppContext();
  const [facturasData, setFacturasData] = useState<FieldValues[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [destino, setDestino] = useState("");
  const [isGood, setIsGood] = useState(false);
  const [bgColor, txtColor] = isGood
    ? ["bg-green-200", "text-green-800"]
    : ["bg-red-200", "text-red-800"];
  const {
    register,
    watch,
    formState: { errors },
    trigger,
    getValues,
    reset,
  } = useFormContext();

  // Observar el valor seleccionado en el select del cliente
  const selectedClientName = watch("nombre_cliente");
  useEffect(() => {
    const selectedClient = clientData.find(
      (client) => client.nombre === selectedClientName,
    );
    if (selectedClient) {
      setDestino(selectedClient.destino || ""); // Actualizamos el estado de destino
    }
  }, [selectedClientName, clientData]);

  const handleAddFacturas = async () => {
    const isValid = await trigger([
      "numero_factura",
      "nombre_cliente",
      "bultos",
    ]);
    if (isValid) {
      const data = getValues();
      const facturaData = { ...data, destino };
      setFacturasData([...facturasData, facturaData]);
      reset();
    }
  };

  // Buscar el cliente seleccionado en los datos de cliente para obtener su destino
  const selectedClient = clientData.find(
    (client) => client.nombre === selectedClientName,
  );
  useEffect(() => {
    if (error) {
      // Muestra el mensaje de error y luego lo resetea
      setTimeout(() => {
        setError(""); // Resetea el error después de un pequeño retraso
      }, 3000);
    }
  }, [error]);

  const handleSubmitFacturas = async () => {
    setLoading(true);
    if (facturasData.length > 0) {
      if (selectedDriver) {
        const manifestData: Manifest["facturas"] = facturasData.map(
          (factura) => ({
            numFactura: factura.numero_factura,
            destino: factura.destino,
            nombreCliente: factura.nombre_cliente,
            cantBultos: factura.bultos,
            estado: "Asignado",
          }),
        );
        const responsePrueba = await addManifestData(
          manifestData,
          selectedDriver,
        );
        if (responsePrueba.success) {
          setLoading(false);
          setIsGood(true);
          setError(responsePrueba.message.toString()); // Aquí se establece el mensaje de éxito
          navigate("/agregar-manifiesto");
        } else {
          setLoading(false);
          setIsGood(false);
          setError(responsePrueba.message.toString()); // Aquí se establece el mensaje de error
        }
      }
    } else {
      setLoading(false);
      console.log("No hay facturas para enviar.");
      setError("No hay facturas para enviar.");
    }
  };

  return (
    <>
      <article
        className={`w-full grid justify-items-center gap-4 p-4 rounded-lg bg-gray-700  ${facturasData.length > 0 ? "md:grid-cols-2" : ""}`}
      >
        <div className="w-full max-w-2xl">
          <section className="grid justify-items-center place-items-center">
            <h2 className="text-2xl font-bold mb-3 text-white">
              Datos conductor
            </h2>
            <section className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-extralight text-gray-300">Nombre</p>
                <p className="w-full rounded-lg border border-zinc-300 p-3 font-extralight text-center bg-gray-800 text-white">
                  {selectedDriver?.nombre}
                </p>
              </div>
              <div>
                <p className="font-extralight text-gray-300">Patente</p>
                <p className="w-full rounded-lg border border-zinc-300 p-3 font-extralight text-center bg-gray-800 text-white">
                  {selectedDriver?.patente}
                </p>
              </div>
            </section>
          </section>
          <section className="mt-4">
            <h2 className="text-xl font-bold mb-2 text-white">
              Ingresar facturas
            </h2>
            <div>
              {errors.numero_factura && (
                <Alert
                  message={errors.numero_factura.message?.toString()}
                  txtColor="text-red-500"
                />
              )}
              <Label>Numero factura</Label>
              <Input
                type="text"
                placeholder="1234-5"
                className="mb-4 rounded-lg p-1 text-center"
                {...register("numero_factura", {
                  required: {
                    value: true,
                    message: "Número de factura requerido",
                  },
                  pattern: {
                    value: /^[1-9]\d*(-\d+)?$/,
                    message:
                      "Formato de factura inválido. Use números positivos con un guion opcional (ej: 1234 o 1234-5)",
                  },
                  validate: (value) => {
                    if (value.startsWith("0")) {
                      return "El número de factura no puede empezar con 0";
                    }
                    if (value.endsWith("-")) {
                      return "El número de factura no puede terminar con un guion";
                    }
                    return true;
                  },
                })}
                onKeyPress={(e) => {
                  const keyCode = e.which ? e.which : e.keyCode;
                  if (keyCode !== 45 && (keyCode < 48 || keyCode > 57)) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.nombre_cliente && (
                <Alert
                  message={errors.nombre_cliente.message?.toString()}
                  txtColor="text-red-500"
                />
              )}
              <p className="font-extralight text-white">Cliente</p>
              <select
                className="w-full mt-2 rounded-lg border border-zinc-300 p-2 font-extralight bg-gray-800 text-white"
                {...register("nombre_cliente", {
                  required: {
                    value: true,
                    message: "Debe seleccionar un cliente",
                  },
                })}
              >
                <option value="">Seleccione un cliente</option>
                {clientData.map((client, index) => (
                  <option key={index} value={client.nombre}>
                    {client.nombre}
                  </option>
                ))}
              </select>
              {errors.destino && (
                <Alert
                  message={errors.destino.message?.toString()}
                  txtColor="text-red-500"
                />
              )}
              <Label>Destino</Label>
              <Input
                type="text"
                readOnly
                value={selectedClient?.destino || ""}
                className="rounded-lg text-center p-1"
                {...register("destino", {
                  required: { value: true, message: "Destino requerido" },
                })}
              />
              {errors.bultos && (
                <Alert
                  message={errors.bultos.message?.toString()}
                  txtColor="text-red-500"
                />
              )}
              <Label>Bultos</Label>
              <Input
                type="number"
                placeholder="10"
                className="mb-4 rounded-lg p-1 text-center"
                {...register("bultos", {
                  required: {
                    value: true,
                    message: "Debe ingresar el número de bultos",
                  },
                  min: {
                    value: 0,
                    message: "El número de bultos debe ser mayor a 0",
                  },
                })}
              />
              <Button
                type="button"
                className={`w-full p-3 rounded-lg bg-sky-500 text-white hover:bg-sky-700 disabled:bg-gray-400 disabled:text-white ${facturasData.length > 0 ? "bg-sky-950" : ""}`}
                onClick={handleAddFacturas}
              >
                Agregar factura
              </Button>
              {facturasData.length > 0 && (
                <Button
                  type="button"
                  className="w-full mt-2 p-3 rounded-lg bg-green-500 text-white
                  hover:bg-green-700"
                  onClick={handleSubmitFacturas}
                >
                  Enviar todas las facturas
                </Button>
              )}
            </div>
          </section>
        </div>
        {loading && (
          <LineMdLoadingTwotoneLoop msg="Verificando datos ingresados..." />
        )}
        {facturasData.length > 0 && (
          <article>
            <TableFacturas
              facturasNuevas={facturasData}
              setFacturasNuevas={setFacturasData}
            />
          </article>
        )}

        {error && (
          <PopupState
            mensajeAlertSuc={error}
            isGood={isGood}
            txtColor={txtColor}
            bgColor={bgColor}
          />
        )}
      </article>
    </>
  );
}
