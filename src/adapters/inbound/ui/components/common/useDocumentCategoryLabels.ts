import { useTranslation } from "react-i18next";
import type { DocumentCategory } from "../../../../../domain/enums/DocumentCategory";

/** useDocumentCategoryLabels - libellés de catégorie de document traduits. */
export function useDocumentCategoryLabels(): Record<DocumentCategory, string> {
  const { t } = useTranslation();
  return {
    STATEMENT: t("documents.category.statement"),
    TAX: t("documents.category.tax"),
    REGULATORY: t("documents.category.regulatory"),
  };
}
