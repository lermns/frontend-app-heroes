import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { usePaginatedHero } from "../../../heroes/hooks/usePaginatedHero";
import { getHeroesByPage } from "../../../heroes/actions/get-heroes-by-page.action";

vi.mock("../../../heroes/actions/get-heroes-by-page.action", () => ({
  getHeroesByPage: vi.fn(),
}));

const mockGetSummaryAction = vi.mocked(getHeroesByPage);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const tanStackCustomProvider = () => {
  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("usePaginatedHero", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  test("should return the initial state (isLoading)", () => {
    // Para poder falsear el useQuery es necesario pasarle el QueryClientProvider, por eso lo falseamos y se lo pasamos
    const { result } = renderHook(() => usePaginatedHero(1, 6), {
      wrapper: tanStackCustomProvider(),
    });

    expect(result.current.isLoading).toBeTruthy();
    expect(result.current.isError).toBeFalsy();
    expect(result.current.data).toBeUndefined();
  });

  test("should call getHeroesByPageAction with arguments", async () => {
    const mockHeroesData = {
      total: 20,
      pages: 4,
      heroes: [],
    };

    mockGetSummaryAction.mockResolvedValue(mockHeroesData);

    const { result } = renderHook(() => usePaginatedHero(1, 6, "heroesABC"), {
      wrapper: tanStackCustomProvider(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.status).toBe("success");
    expect(mockGetSummaryAction).toHaveBeenCalled();
    expect(mockGetSummaryAction).toHaveBeenCalledWith(1, 6, "heroesABC");
  });
});
