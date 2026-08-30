import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateInvestor } from "../../hooks/useInvestors";
import { getErrorMessage } from "../../utils/errorMessage";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const schema = z.object({
  name: z.string().min(1, "Le nom est requis."),
  email: z.string().min(1, "L'email est requis.").email("Adresse email invalide."),
});

type FormValues = z.infer<typeof schema>;

interface InvestorFormProps {
  onCreated?: (investorId: string) => void;
}

/** InvestorForm - création d'un investisseur. Validation Zod + React Hook Form. */
export function InvestorForm({ onCreated }: InvestorFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const createInvestor = useCreateInvestor();

  const onSubmit = handleSubmit(async (values) => {
    const investor = await createInvestor.mutateAsync(values);
    reset();
    onCreated?.(investor.id);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-xl border border-ink-100 bg-white p-5">
      <div>
        <Label htmlFor="investor-name">Nom</Label>
        <Input id="investor-name" {...register("name")} type="text" placeholder="Adama Coulibaly" />
        {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="investor-email">Email</Label>
        <Input id="investor-email" {...register("email")} type="email" placeholder="adama@example.com" />
        {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}
      </div>
      {createInvestor.isError && (
        <p className="text-sm text-rose-600">{getErrorMessage(createInvestor.error)}</p>
      )}
      <Button type="submit" disabled={createInvestor.isPending} className="w-full">
        {createInvestor.isPending ? "Création…" : "Créer l'investisseur"}
      </Button>
    </form>
  );
}
