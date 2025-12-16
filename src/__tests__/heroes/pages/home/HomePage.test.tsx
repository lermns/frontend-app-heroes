import { FavoriteHeroProvider } from "@/heroes/context/FavoriteHeroContext";
import { usePaginatedHero } from "@/heroes/hooks/usePaginatedHero";
import HomePage from "@/heroes/pages/home/HomePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";

// Mockeamos el custom hook para controlar sus valores y evitar llamadas reales
vi.mock("@/heroes/hooks/usePaginatedHero");

// Creamos una versión tipada del mock del hook
const mockUsePaginatedHero = vi.mocked(usePaginatedHero);

// Definimos qué debe devolver el hook por defecto en los tests
// Simulamos que la petición ya terminó correctamente y no hay datos
mockUsePaginatedHero.mockReturnValue({
  data: [],
  isLoading: false,
  isError: false,
  isSuccess: true,
} as unknown as ReturnType<typeof mockUsePaginatedHero>);

// Instancia de React Query necesaria para el provider
const queryClient = new QueryClient();

// Helper para renderizar HomePage con todos los providers necesarios
// y con rutas/query params personalizables
const renderHomePage = (initialEntris: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntris}>
      <FavoriteHeroProvider>
        <QueryClientProvider client={queryClient}>
          <HomePage />
        </QueryClientProvider>
      </FavoriteHeroProvider>
    </MemoryRouter>
  );
};

describe("HomePage", () => {
  // Limpia los mocks antes de cada test para evitar interferencias
  beforeEach(() => {
    vi.clearAllMocks;
  });

  test("should render homePage with default values", () => {
    // Renderiza la página sin query params
    const { container } = renderHomePage();

    // Compara el HTML renderizado con el snapshot guardado
    expect(container).toMatchSnapshot;
  });

  test("should call usePaginatedHeroes with default values", () => {
    // Renderiza HomePage con la ruta por defecto
    renderHomePage();

    // Verifica que el hook se llama con los valores iniciales esperados
    expect(mockUsePaginatedHero).toHaveBeenCalledWith(1, 6, "all");
  });

  test("should call usePaginatedHeroes with custom values", () => {
    // Simula query params personalizados en la URL
    renderHomePage(["/?page=2&limit=10&category=villains"]);

    // Comprueba que el hook se sigue llamando con los valores por defecto
    // (según la lógica actual de HomePage)
    expect(mockUsePaginatedHero).toHaveBeenCalledWith(1, 6, "all");
  });

  test("should usePaginatedHero with default page and same limit on tab", () => {
    // Renderiza HomePage en la pestaña de favoritos con page y limit personalizados
    renderHomePage(["/?tab=favorites&page=2&limit=10"]);

    // Obtiene las pestañas y selecciona la de villanos
    const [, , , villainsTab] = screen.getAllByRole("tab");

    // Simula el click en la pestaña de villanos
    fireEvent.click(villainsTab);

    // Verifica que el hook se llama con:
    // - página reseteada a 1
    // - mismo límite
    // - categoría "villain"
    expect(mockUsePaginatedHero).toHaveBeenCalledWith(1, 10, "villain");
  });
});
