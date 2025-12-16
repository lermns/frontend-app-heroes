import SearchPage from "@/heroes/pages/search/SearchPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { searchHeroesAction } from "@/heroes/actions/search-heroes.action";
import type { Hero } from "@/heroes/types/hero-interface";

vi.mock("@/heroes/pages/search/ui/SearchControls", () => ({
  SearchControls: () => <div data-testid="search-controls"></div>,
}));

vi.mock("@/heroes/actions/search-heroes.action");
const mockSearchHeroesAction = vi.mocked(searchHeroesAction);

vi.mock("@/components/custom/CustomJumbotron", () => ({
  CustomJumbotron: () => <div data-testid="custom-jumbotron"></div>,
}));

vi.mock("@/heroes/components/HeroGrid", () => ({
  HeroGrid: (props: { heroes: Hero[] }) => (
    <div data-testid="hero-grid">
      {props.heroes.map((hero) => (
        <div key={hero.id}>{hero.name}</div>
      ))}
    </div>
  ),
}));

const queryClient = new QueryClient();

const renderSearchPage = (initialEntris: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntris}>
      <QueryClientProvider client={queryClient}>
        <SearchPage />
      </QueryClientProvider>
    </MemoryRouter>
  );
};

describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should render SearchPage with default values", () => {
    const { container } = renderSearchPage();

    expect(mockSearchHeroesAction).toHaveBeenCalledWith({
      name: undefined,
      strength: undefined,
    });

    expect(container).toMatchSnapshot();
  });

  test("should call search action with name parameter", () => {
    const { container } = renderSearchPage(["/search?name=superman"]);

    expect(mockSearchHeroesAction).toHaveBeenCalledWith({
      name: "superman",
      strength: undefined,
    });

    expect(container).toMatchSnapshot();
  });

  test("should call search action with strength parameter", () => {
    const { container } = renderSearchPage(["/search?strength=6"]);

    expect(mockSearchHeroesAction).toHaveBeenCalledWith({
      name: undefined,
      strength: "6",
    });

    expect(container).toMatchSnapshot();
  });

  test("should call search action with strength and name parameter", () => {
    const { container } = renderSearchPage(["/search?strength=6&name=joker"]);

    expect(mockSearchHeroesAction).toHaveBeenCalledWith({
      name: "joker",
      strength: "6",
    });

    expect(container).toMatchSnapshot();
  });

  test("should render heroGrid with SearchResults", async () => {
    const mockHeroes = [
      { id: "1", name: "Clarck Kent" } as unknown as Hero,
      { id: "2", name: "Joker" } as unknown as Hero,
    ];

    mockSearchHeroesAction.mockResolvedValue(mockHeroes);

    renderSearchPage();

    await waitFor(() => {
      expect(screen.getByText("Clarck Kent")).toBeDefined();
      expect(screen.getByText("Joker")).toBeDefined();
    });
  });
});
