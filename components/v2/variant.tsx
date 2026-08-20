import { createContext, FC, PropsWithChildren, useContext, useMemo } from "react";

/**
 * The v2 design ships as two variants. They share one component tree;
 * everything visual that differs between them is expressed as a CSS custom
 * property in styles/v2-theme.css.
 *
 * This module holds the small remainder that CSS cannot express — copy that
 * differs per variant, and whether eyebrows are numbered. If you find
 * yourself adding a `variant === "signal"` check inside a component, it
 * belongs here or in the token layer instead.
 */
export type V2Variant = "signal" | "graphite";

type V2VariantTraits = {
  /** Signal prefixes each section eyebrow with its running order ("01 / intro"). */
  readonly numberedEyebrows: boolean;
};

export const V2_VARIANT_TRAITS: Record<V2Variant, V2VariantTraits> = {
  signal: { numberedEyebrows: true },
  graphite: { numberedEyebrows: false },
};

const V2VariantContext = createContext<V2Variant | null>(null);

export const V2VariantProvider: FC<PropsWithChildren<{ variant: V2Variant }>> = ({
  variant,
  children,
}) => {
  const value = useMemo(() => variant, [variant]);
  return <V2VariantContext.Provider value={value}>{children}</V2VariantContext.Provider>;
};

export const useV2Variant = (): V2Variant => {
  const variant = useContext(V2VariantContext);
  if (!variant) {
    throw new Error("useV2Variant must be used inside a <V2VariantProvider>");
  }
  return variant;
};

export const useV2VariantTraits = (): V2VariantTraits => V2_VARIANT_TRAITS[useV2Variant()];
