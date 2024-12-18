import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LogsOpsNav } from "@/components/ui/navs/LogsOpsNav";
import { useAppContext } from "@/hooks/useAppContext";
import { Drivers } from "@/types/types";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AddFacturas } from "./AddFacturas";
import { Alert } from "@/components/ui/Alert";
import { Label } from "@/components/ui/label";

export function AddManifest() {
  const [selectedDriver, setSelectedDriver] = useState<Drivers | null>(null);
  const { driversData } = useAppContext();
  const methods = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
  } = methods;
  const handleFacturas = async () => {
    const data = getValues();
    const selected = driversData.find(
      (driver) => driver.nombre === data.nombreConductor,
    );
    if (selected) {
      setSelectedDriver(selected);
    } else {
      await trigger(["nombreConductor"]);
      setSelectedDriver(null);
    }
  };

  const onSubmit = async () => {
    const data = getValues();
    console.log(data);
  };
  const resetForm = () => {
    setSelectedDriver(null);
    methods.reset();
  };
  return (
    <>
      <header>
        <LogsOpsNav />
      </header>
      <main className="grid items-center justify-center pt-3 min-h-screen">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-4 items-center justify-start rounded-lg border border-zinc-300 bg-gray-900 p-6 md:p-10 transition-all duration-300"
          >
            {!selectedDriver ? (
              <>
                <h1 className="text-2xl font-bold pb-3 text-white">
                  Nuevo manifiesto
                </h1>
                <article className="grid gap-4 w-full">
                  {errors.nombreConductor && (
                    <Alert
                      message={errors.nombreConductor.message?.toString()}
                      txtColor="text-red-500"
                    />
                  )}
                  <Label
                    className="font-extralight text-white"
                    htmlFor="nombreConductor"
                  >
                    Nombre conductor
                  </Label>
                  <select
                    className="w-full rounded-lg border border-zinc-300 p-2 font-extralight"
                    {...register("nombreConductor", {
                      required: {
                        value: true,
                        message: "Nombre conductor es requerido",
                      },
                    })}
                    onChange={(e) =>
                      setValue(
                        "nombreConductor",
                        e.target.options[e.target.selectedIndex].text,
                      )
                    }
                  >
                    <option value="">Seleccione un nombre</option>
                    {driversData.map((driver) => (
                      <option key={driver.uid} value={driver.nombre}>
                        {driver.nombre}
                      </option>
                    ))}
                  </select>
                </article>
                <article className="grid gap-2">
                  <Label className="font-extralight text-white">Fecha</Label>
                  <Input
                    className="w-full rounded-lg border border-zinc-300 p-2 font-extralight text-black bg-white "
                    value={new Date().toLocaleDateString("es-ES")}
                    readOnly
                    {...register("fechaCreacion")}
                  />
                </article>
                <Button
                  type="button"
                  onClick={handleFacturas}
                  className="w-full bg-blue-500 hover:bg-blue-600 "
                >
                  Agregar facturas
                </Button>
              </>
            ) : (
              <AddFacturas
                selectedDriver={selectedDriver}
                onReset={resetForm}
              />
            )}
          </form>
        </FormProvider>
      </main>
    </>
  );
}
