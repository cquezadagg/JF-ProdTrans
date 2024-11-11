import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/Card";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthUser } from "@/services/AuthUser";
import { PopupState } from "@/components/ui/ErrorMessage";
import { LineMdLoadingTwotoneLoop } from "@/components/ui/Loading";

export function Home() {
  const [loading, setLoading] = useState(false);
  const [isGood, setIsGood] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const methods = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = methods;

  const onSubmit = async () => {
    setLoading(true);
    try {
      const data = getValues();
      const loginUser = await AuthUser(data);
      setIsGood(true);
      setLoading(false);
      switch (loginUser) {
        case "driver":
          navigate("/driver-dashboard");
          break;
        case "admin":
          navigate("/admin");
          break;
        case "logsOps":
          navigate("/logOps-dashboard");
          break;
        case "client":
          navigate("/client-dashboard");
          break;
        default:
          setIsGood(false);
          setError(
            "Usuario sin rol adecuado, comuníquese con el administrador",
          );
      }
    } catch (err) {
      setLoading(false);
      setIsGood(false);
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    }
  };

  const [bgColor, txtColor] = isGood
    ? ["bg-green-100", "text-green-800"]
    : ["bg-red-100", "text-red-800"];

  return (
    <div className="min-h-screen w-full bg-[#002B5B] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-0">
        <Card className="w-full lg:w-1/2 bg-white shadow-xl">
          <CardContent className="p-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">
                J<span className="text-3xl">&</span>F
              </h1>
              <h2 className="text-2xl">TRANSPORTES</h2>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Ingrese su correo</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@empresa.cl"
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

                <div className="space-y-2">
                  <Label htmlFor="password">Ingrese su contraseña</Label>
                  <Input
                    id="password"
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

                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Iniciar Sesión
                </Button>
              </form>
            </FormProvider>
          </CardContent>
        </Card>

        <div className="w-full lg:w-1/2 flex justify-center items-center p-6">
          <div className="relative w-full max-w-md aspect-square">
            <div className="absolute inset-0 bg-sky-400/20 rounded-full animate-pulse"></div>
            <div className="relative bg-sky-400/30 rounded-full p-4 w-full h-full flex items-center justify-center">
              <div className="bg-sky-400/40 rounded-full p-4 w-5/6 h-5/6 flex items-center justify-center overflow-hidden">
                <img
                  src="/Partner.png"
                  alt="Transport Van"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
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

      {loading && <LineMdLoadingTwotoneLoop msg="Validando credenciales..." />}
    </div>
  );
}
