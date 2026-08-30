import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useAddGoal } from "../../hooks/useGoals";

/**
 * AddGoalDialog - "Ajouter un objectif". Persisté côté backend via
 * POST /api/v1/goals (voir hooks/useGoals.ts).
 */
export function AddGoalDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const addGoal = useAddGoal();

  const isValid =
    name.trim().length > 0 && Number(targetAmount) > 0 && Number(currentAmount) >= 0;

  const reset = () => {
    setName("");
    setTargetAmount("");
    setCurrentAmount("");
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    await addGoal.mutateAsync({
      name: name.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount),
      currency: "XOF",
    });
    reset();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Ajouter un objectif
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un objectif</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Définissez un nouvel objectif financier à suivre dans le temps.
        </DialogDescription>

        <div className="space-y-4">
          <div>
            <Label>Nom de l'objectif</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex. Voyage, études des enfants…"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Montant déjà atteint (XOF)</Label>
              <Input
                type="text"
                inputMode="decimal"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                placeholder="0"
                className="font-ledger"
              />
            </div>
            <div>
              <Label>Montant cible (XOF)</Label>
              <Input
                type="text"
                inputMode="decimal"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="10 000 000"
                className="font-ledger"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || addGoal.isPending}>
            {addGoal.isPending ? "En cours…" : "Ajouter l'objectif"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
