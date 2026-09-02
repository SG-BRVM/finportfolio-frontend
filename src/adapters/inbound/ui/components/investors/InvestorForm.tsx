import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { useCreateInvestor } from "../../hooks/useInvestors";
import { getErrorMessage } from "../../utils/errorMessage";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

function buildSchema(t: TFunction) {
  return z.object({
    name: z.string().min(1, t("investors.form.nameRequired")),
    email: z.string().min(1, t("investors.form.emailRequired")).email(t("investors.form.emailInvalid")),
  });
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

interface InvestorFormProps {
  onCreated?: (investorId: string) => void;
}

/** InvestorForm - création d'un investisseur. Validation Zod + React Hook Form. */
export function InvestorForm({ onCreated }: InvestorFormProps) {
  const { t, i18n } = useTranslation();
  const schema = useMemo(() => buildSchema(t), [i18n.language]); // eslint-disable-line react-hooks/exhaustive-deps
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
    <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
      <div>
        <Label htmlFor="investor-name">{t("common.name")}</Label>
        <Input id="investor-name" {...register("name")} type="text" placeholder="Adama Coulibaly" />
        {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="investor-email">{t("common.email")}</Label>
        <Input id="investor-email" {...register("email")} type="email" placeholder="adama@example.com" />
        {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}
      </div>
      {createInvestor.isError && (
        <p className="text-sm text-rose-600">{getErrorMessage(createInvestor.error)}</p>
      )}
      <Button type="submit" disabled={createInvestor.isPending} className="w-full">
        {createInvestor.isPending ? t("investors.form.creating") : t("investors.create")}
      </Button>
    </form>
  );
}
