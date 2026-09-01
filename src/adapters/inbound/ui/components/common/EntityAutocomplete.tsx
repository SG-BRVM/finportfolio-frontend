import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Popover, PopoverAnchor, PopoverContent } from "../ui/popover";
import { Label } from "../ui/label";

export interface AutocompleteOption {
  id: string;
  label: string;
  sublabel?: string;
}

interface EntityAutocompleteProps {
  /** Valeur actuelle du champ id (contrôlée par react-hook-form). */
  value: string;
  /** Appelé avec l'id choisi (ou la saisie brute si l'utilisateur tape un id directement). */
  onChange: (id: string) => void;
  onBlur?: () => void;
  options: AutocompleteOption[];
  isLoading?: boolean;
  placeholder?: string;
  label: string;
  error?: string;
  /** Texte affiché quand une option est sélectionnée (nom au lieu de l'id brut). */
  resolvedLabel?: string;
  emptyHint?: string;
}

/**
 * EntityAutocomplete - champ de saisie générique pour "chercher une entité
 * par nom, sélectionner, et remplir l'id attendu par le formulaire".
 *
 * La liste de suggestions est un Popover Radix ancré sur le champ : le
 * portail, le positionnement et la fermeture (Échap, clic extérieur) sont
 * gérés par Radix plutôt que par un listener document manuel. Reste un
 * composant d'UI pur : il ne connaît ni React Hook Form ni les Use Cases -
 * c'est l'appelant (ex: CreateOrderForm) qui lui fournit les options déjà
 * chargées via un hook `useXxxSearch`, et récupère l'id sélectionné via
 * `onChange`. L'utilisateur peut toujours saisir/coller un id directement :
 * le champ ne bloque pas la saisie libre.
 */
export function EntityAutocomplete({
  value,
  onChange,
  onBlur,
  options,
  isLoading,
  placeholder,
  label,
  error,
  resolvedLabel,
  emptyHint,
}: EntityAutocompleteProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(resolvedLabel ?? value ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Si le formulaire réinitialise/pré-remplit la valeur depuis l'extérieur
  // (ex: reset() après soumission), on resynchronise l'affichage.
  useEffect(() => {
    setInputValue(resolvedLabel ?? value ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleSelect = (option: AutocompleteOption) => {
    setInputValue(option.label);
    onChange(option.id);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (raw: string) => {
    setInputValue(raw);
    // Tant que l'utilisateur n'a pas cliqué une suggestion, on considère la
    // saisie comme l'id lui-même (permet le collage direct d'un id existant).
    onChange(raw);
    setIsOpen(true);
  };

  return (
    <div>
      <Label>{label}</Label>
      <Popover open={isOpen && inputValue.length > 0} onOpenChange={setIsOpen}>
        <PopoverAnchor asChild>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            placeholder={placeholder}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={onBlur}
            autoComplete="off"
            className="w-full rounded-lg border border-ink-200 px-3 py-2 font-ledger text-sm focus:border-brand-400"
          />
        </PopoverAnchor>
        <PopoverContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            // Laisse le clic sur l'input lui-même rouvrir/garder le popover
            // ouvert au lieu de le faire clignoter fermé puis rouvert.
            if (e.target === inputRef.current) e.preventDefault();
          }}
        >
          <ul className="py-1 text-sm">
            {isLoading && <li className="px-3 py-2 text-ink-400">{t("autocomplete.searching")}</li>}
            {!isLoading && options.length === 0 && (
              <li className="px-3 py-2 text-ink-400">
                {emptyHint ?? t("autocomplete.noResultsUseAsIs")}
              </li>
            )}
            {!isLoading &&
              options.map((option) => (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    className="block w-full px-3 py-2 text-left hover:bg-brand-50"
                  >
                    <span className="block text-ink-800">{option.label}</span>
                    {option.sublabel && (
                      <span className="block text-xs text-ink-400">{option.sublabel}</span>
                    )}
                  </button>
                </li>
              ))}
          </ul>
        </PopoverContent>
      </Popover>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
