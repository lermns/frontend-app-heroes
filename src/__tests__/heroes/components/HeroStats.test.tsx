import { HeroesStats } from "@/heroes/components/HeroesStats";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { useHeroSummary } from "@/heroes/hooks/useHeroSummary";
import type { SummaryInformationResponse } from "@/heroes/types/summary-information.response";
import { FavoriteHeroProvider } from "@/heroes/context/FavoriteHeroContext";

vi.mock("@/heroes/hooks/useHeroSummary");
const mockUseHeroSummary = vi.mocked(useHeroSummary);

// valores falseados para el mockReturnValue
const mockHero = {
  id: "1",
  name: "Clark Kent",
  slug: "clark-kent",
  alias: "Superman",
  powers: [
    "Súper fuerza",
    "Vuelo",
    "Visión de calor",
    "Visión de rayos X",
    "Invulnerabilidad",
    "Súper velocidad",
  ],
  description:
    "El Último Hijo de Krypton, protector de la Tierra y símbolo de esperanza para toda la humanidad.",
  strength: 10,
  intelligence: 8,
  speed: 9,
  durability: 10,
  team: "Liga de la Justicia",
  image: "1.jpeg",
  firstAppearance: "1938",
  status: "Active",
  category: "Hero",
  universe: "DC",
};

const mockSummaryData: SummaryInformationResponse = {
  totalHeroes: 25,
  strongestHero: mockHero,
  smartestHero: {
    id: "2",
    name: "Bruce Wayne",
    slug: "bruce-wayne",
    alias: "Batman",
    powers: [
      "Artes marciales",
      "Habilidades de detective",
      "Tecnología avanzada",
      "Sigilo",
      "Genio táctico",
    ],
    description:
      "El Caballero Oscuro de Ciudad Gótica, que utiliza el miedo como arma contra el crimen y la corrupción.",
    strength: 6,
    intelligence: 10,
    speed: 6,
    durability: 7,
    team: "Liga de la Justicia",
    image: "2.jpeg",
    firstAppearance: "1939",
    status: "Active",
    category: "Hero",
    universe: "DC",
  },
  heroCount: 18,
  villainCount: 7,
};

const queyClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Helper function que configura el mock de useHeroSummary y renderiza el componente HeroesStats
// dentro de los proveedores necesarios (QueryClientProvider y FavoriteHeroProvider) para las pruebas
const renderHeroStats = (mockData?: Partial<SummaryInformationResponse>) => {
  if (mockData) {
    mockUseHeroSummary.mockReturnValue({
      data: mockData,
    } as unknown as ReturnType<typeof useHeroSummary>);
  } else {
    mockUseHeroSummary.mockReturnValue({
      data: undefined,
    } as unknown as ReturnType<typeof useHeroSummary>);
  }

  return render(
    <QueryClientProvider client={queyClient}>
      <FavoriteHeroProvider>
        <HeroesStats />
      </FavoriteHeroProvider>
    </QueryClientProvider>
  );
};

describe("HeroStats", () => {
  test("should render component with default values", () => {
    renderHeroStats();
    expect(screen.getByText("El más Inteligente")).toBeDefined();
  });

  test("should render HeroStats with mock information", () => {
    renderHeroStats(mockSummaryData);
    expect(screen.getByText("Todos los Personajes")).toBeDefined();
  });

  test("should change the percentage of favorites when a hero is added to favs", () => {
    localStorage.setItem("favorites", JSON.stringify([mockHero]));

    renderHeroStats(mockSummaryData);

    const favoritePercentageElement = screen.getByTestId("favorite-percentage");
    expect(favoritePercentageElement.innerHTML).toContain("4.00%");

    const favoriteCountElement = screen.getByTestId("favorite-count");
    expect(favoriteCountElement.innerHTML).toContain("1");

    screen.debug();
  });
});
