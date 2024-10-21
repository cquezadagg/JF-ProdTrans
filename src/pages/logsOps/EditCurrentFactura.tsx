import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAppContext } from "@/hooks/useAppContext";
import { Label } from "@radix-ui/react-select";
import { FieldValues, useForm } from "react-hook-form";

interface EditCurrentFacturaProps {
  currentFactura: FieldValues | null;
  onVolver: () => void;
  onUpdate: (data: FieldValues) => void; // Recibiendo la función
}

export function EditCurrentFactura({
  currentFactura,
  onVolver,
  onUpdate,
}: EditCurrentFacturaProps) {
  const { clientData } = useAppContext();
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: currentFactura || {},
  });

  const onSubmit = (data: FieldValues) => {
    onUpdate(data); // Call onUpdate when form is submitted
    onVolver();
  };

  return (
    <>
      {currentFactura && (
        <article className="z-50 fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <section className="bg-zinc-900 rounded-lg p-4 w-full max-w-md">
            <h1 className="text-white font-2xl text-center">
              Datos de la factura
            </h1>
            <section>
              <Label>Numero factura</Label>
              <Input
                {...register("numero_factura", {
                  onChange: (e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setValue("numero_factura", value);
                  },
                })}
              />
            </section>
            <section className="mt-4">
              <p className="font-extralight text-white">Cliente</p>
              <select
                className="w-full mt-2 rounded-lg p-2"
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
            </section>
            <section>
              <Label>Bultos</Label>
              <Input {...register("bultos")} />
            </section>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button
                variant="secondary"
                type="submit"
                onClick={handleSubmit(onSubmit)}
              >
                Guardar
              </Button>
              <Button variant="destructive" type="button" onClick={onVolver}>
                Volver
              </Button>
            </div>
          </section>
        </article>
      )}
    </>
  );
}
