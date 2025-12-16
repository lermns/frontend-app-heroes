import { use } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  FavoriteHeroContext,
  FavoriteHeroProvider,
} from "@/heroes/context/FavoriteHeroContext";
import type { Hero } from "@/heroes/types/hero-interface";

// mockeamos el valor de Hero
const mockHero = {
  id: "1",
  name: "batman",
} as Hero;

// Mockeamos el localStorage reemplazando sus métodos con funciones vi.fn() para poder verificar
// que se llamen correctamente durante los tests. Esto permite controlar el comportamiento del almacenamiento
// sin afectar el localStorage real del navegador.
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Componente de prueba que consume el contexto para verificar su funcionamiento en los tests
const TestComponent = () => {
  const { favoriteCount, favorites, isFavorite, toggleFavorite } =
    use(FavoriteHeroContext);

  return (
    <div>
      <div data-testid="favorite-count">{favoriteCount}</div>
      <div data-testid="favorite-list">
        {favorites.map((hero) => (
          <div key={hero.id} data-testid={`hero-${hero.id}`}>
            {hero.name}
          </div>
        ))}
      </div>

      <button
        data-testid="toggle-favorite"
        onClick={() => toggleFavorite(mockHero)}
      >
        Toggle Favorite
      </button>

      <div data-testid="is-favorite">{isFavorite(mockHero).toString()}</div>
    </div>
  );
};

// El provider envuelve al componente de prueba para permitir el acceso a las propiedades y acciones del contexto.
// De esta forma, el componente simulado puede interactuar correctamente con el contexto durante los tests.
const renderContextTest = () => {
  return render(
    <FavoriteHeroProvider>
      <TestComponent />
    </FavoriteHeroProvider>
  );
};

describe("FavoriteHeroContext", () => {
  // Limpia el localStorage antes de cada test para garantizar que cada uno sea independiente.
  // Esto evita que datos persistidos de tests anteriores afecten los resultados actuales.
  beforeEach(() => {
    localStorage.clear();
  });

  test("should initialize with default values", () => {
    renderContextTest();

    expect(screen.getByTestId("favorite-count").textContent).toBe("0");
    expect(screen.getByTestId("favorite-list").children.length).toBe(0);
  });

  test("should add hero to favorites when togglefavorite is called with new Hero", () => {
    renderContextTest();
    const button = screen.getByTestId("toggle-favorite");

    fireEvent.click(button);

    expect(screen.getByTestId("favorite-count").textContent).toBe("1");
    expect(screen.getByTestId("is-favorite").textContent).toBe("true");
    expect(screen.getByTestId("hero-1").textContent).toBe("batman");

    expect(localStorageMock.setItem).toHaveBeenCalled();
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "favorites",
      `[{"id":"1","name":"batman"}]`
    );
  });

  test("should remove hero to favorites when togglefavorite is called", () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([mockHero]));

    renderContextTest();
    expect(screen.getByTestId("favorite-count").textContent).toBe("1");
    expect(screen.getByTestId("is-favorite").textContent).toBe("true");
    expect(screen.getByTestId("hero-1").textContent).toBe("batman");

    const button = screen.getByTestId("toggle-favorite");
    fireEvent.click(button);

    expect(screen.getByTestId("favorite-count").textContent).toBe("0");
    expect(screen.getByTestId("is-favorite").textContent).toBe("false");
    // usamos el queryByTestId porque este si que puede devolver un null
    expect(screen.queryByTestId("hero-1")).toBeNull();

    expect(localStorageMock.setItem).toHaveBeenCalled();
    expect(localStorageMock.setItem).toHaveBeenCalledWith("favorites", "[]");
  });
});
