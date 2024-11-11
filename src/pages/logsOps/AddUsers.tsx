import { AddUsuarios } from "@/services/AddUsers";
import { FormProvider, useForm } from "react-hook-form";
export default function AddUsers() {
  const methods = useForm();
  const { register, handleSubmit, getValues } = methods;

  const onSubmit = async () => {
    const data = getValues();
    AddUsuarios(data);
  };
  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Correo</label>
          <input type="text" {...register("correo")} className="w-full mb-4" />
          <label>contraseña</label>
          <input
            type="text"
            {...register("contraseña")}
            className="w-full mb-4 "
          />
          <label>nombre</label>
          <input type="text" {...register("nombre")} className="w-full mb-4" />
          <label>rol</label>
          <select {...register("rol")} className="w-full">
            <option value="driver">Conductor</option>
            <option value="admin">Administrador</option>
            <option value="logsOps">LogsOps</option>
            <option value="client">Cliente</option>
          </select>
          <button type="submit">Submit</button>
        </form>
      </FormProvider>
    </div>
  );
}
