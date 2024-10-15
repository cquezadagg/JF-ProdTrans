import { Button } from "@ui/Button";
import { Input } from "@ui/Input";
import { AuthUser } from "@/services/AuthUser";
import { PopupState } from "@ui/ErrorMessage";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LineMdLoadingTwotoneLoop } from "@/components/ui/Loading";
import PartnerImage from "@/assets/Partner.png";
import Tecno from "@/assets/tecno.png";

export function Home() {
  const [loading, setLoading] = useState(false);
  const [isGood, setIsGood] = useState(false);
  const [bgColor, txtColor] = isGood
    ? ["bg-green-199", "text-green-800"]
    : ["bg-red-199", "text-red-800"];
  const methods = useForm();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = methods;
  const [error, setError] = useState("");

  const onSubmit = async () => {
    setLoading(true);
    try {
      const data = getValues();
      const loginUser = await AuthUser(data);
      if (loginUser === "driver") {
        setLoading(false);
        setIsGood(true);
        navigate("/driver-dashboard");
      } else if (loginUser === "admin") {
        setLoading(false);
        setIsGood(true);
        navigate("/admin");
      } else if (loginUser === "logsOps") {
        setLoading(false);
        setIsGood(true);
        navigate("/logOps-dashboard");
      } else if (loginUser === "client") {
        setLoading(false);
        setIsGood(true);
        navigate("/client-dashboard");
      } else {
        setLoading(false);
        setIsGood(false);
        setError("Usuario sin rol adecuado, comuníquese con el administrador");
      }
    } catch (err) {
      setLoading(false);
      setIsGood(false);
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    }
  };

  return (
    <>
      <header className="text-white text-center mt-2">
        <h1 className="text-6xl font-bold mb-2">
          J<span className="text-5xl">&</span>F
        </h1>
        <p className="text-4xl font-light mb-6">TRANSPORTES</p>
      </header>
      <div className=" flex flex-col md:flex-row items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Iniciar Sesión
            </h2>
            <FormProvider {...methods}>
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <Input
                    label="Ingrese su correo"
                    placeholder="tu@empresa.cl"
                    type="email"
                    {...register("email", {
                      required: "Correo es requerido",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Correo no válido",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-600">
                      {errors.email.message?.toString()}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    label="Ingrese su contraseña"
                    type="password"
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Contraseña es requerida",
                    })}
                  />
                  {errors.password && (
                    <p className="text-red-600">
                      {errors.password.message?.toString()}
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <Button
                    type="submit"
                    className="w-full
                    bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Iniciar Sesión
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
        <div className="text-white text-center md:text-left md:w-1/2 mb-8 md:mb-0">
          <div className="mt-8 relative">
            <div className=" md:w-[30rem] md:h-[30rem] bg-[#5aceff] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 -z-1"></div>
            <picture>
              <img src={Tecno} alt="Tecnología" className="absolute z-8 " />
              <img
                src={PartnerImage}
                alt="Transport Van"
                className="relative z-10 "
              />
            </picture>
          </div>
        </div>

        {error && (
          <PopupState
            mensajeAlertSuc={error}
            isGood={isGood}
            txtColor={txtColor}
            bgColor={bgColor}
          />
        )}

        {loading && (
          <LineMdLoadingTwotoneLoop msg="Validando credenciales..." />
        )}
      </div>
    </>
  );
}
