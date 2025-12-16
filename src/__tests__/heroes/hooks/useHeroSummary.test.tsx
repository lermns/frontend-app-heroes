import { type PropsWithChildren } from "react";
import { describe, expect, test, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useHeroSummary } from "@/heroes/hooks/useHeroSummary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getSummaryAction } from "@/heroes/actions/get-summary.action";
import type { SummaryInformationResponse } from "@/heroes/types/summary-information.response";

// Sustituye la función real getSummaryAction por una función mock controlada por vitest
// vi.mock('ruta', factory) le dice a Vitest: reemplaza ese módulo por lo que devuelva factory
// cualquier import que haga referencia a getSummaryAction terminará apuntando a esa función mock
// en vez de a la implementación real de red.
vi.mock("@/heroes/actions/get-summary.action", () => ({
  getSummaryAction: vi.fn(),
}));

const mockGetSummaryAction = vi.mocked(getSummaryAction);

// este componente va a envolver nuestro custom hook del primer test....
// ya que para usar React Query necesitas envolverlo en un QueryClientProvider
// y en los tests no es la excepcíon.
const tanStackCustomProvider = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useHeroSummary", () => {
  test("should return the initial state (isLoading)", () => {
    // Para poder falsear el useQuery es necesario pasarle el QueryClientProvider, por eso lo falseamos y se lo pasamos
    const { result } = renderHook(() => useHeroSummary(), {
      wrapper: tanStackCustomProvider(),
    });

    expect(result.current.isLoading).toBeTruthy();
    expect(result.current.isError).toBeFalsy();
    expect(result.current.data).toBeUndefined();
  });

  test("should return state with data when API call succeds", async () => {
    // respuesta resuelta que devolveremos al llamado falso de la api
    const mockSummaryData = {
      totalHeroes: 10,
      strongestHero: {
        id: "1",
        name: "SuperMan",
      },
      smartestHero: {
        id: "2",
        name: "Batman",
      },
      heroCount: 18,
      villainCount: 7,
    } as SummaryInformationResponse;

    // devuelve una respuesta resuelta y esa respuesta es el mockSummaryData hardcodeado
    mockGetSummaryAction.mockResolvedValue(mockSummaryData);

    const { result } = renderHook(() => useHeroSummary(), {
      wrapper: tanStackCustomProvider(),
    });

    // Esto espera a que React Query haya procesado la promesa mock y haya cambiado sus
    // flags (isSuccess, isError, etc.)
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.isError).toBe(false);
    expect(mockGetSummaryAction).toHaveBeenCalled();
  });

  test("should return error state when API call fails", async () => {
    // falseamos el mensaje de error
    const mockError = new Error("Failed to fetch summary");
    // devolvemos una respuesta pero en este caso una de error
    mockGetSummaryAction.mockRejectedValue(mockError);

    const { result } = renderHook(() => useHeroSummary(), {
      wrapper: tanStackCustomProvider(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    console.log(result.current.error?.message);

    expect(result.current.error).toBeDefined();
    expect(result.current.isLoading).toBe(false);
    expect(mockGetSummaryAction).toHaveBeenCalled();
    expect(result.current.error?.message).toBe("Failed to fetch summary");
  });
});
