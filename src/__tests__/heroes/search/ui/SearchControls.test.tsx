import { SearchControls } from "@/heroes/pages/search/ui/SearchControls";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, test } from "vitest";

// Comprobamos si ResizeObserver NO existe en el entorno actual.
//
// En los tests se usa jsdom, que no implementa ResizeObserver por defecto.
// Algunos componentes de UI (shadcn/ui, Radix, etc.) lo usan internamente,
// por lo que sin este mock los tests fallarían.
//
// Este `if` evita sobrescribir ResizeObserver si ya existe
// (por ejemplo, si otro test o setup global ya lo ha definido).
if (typeof window.ResizeObserver === "undefined") {
  // Mock mínimo de ResizeObserver.
  // No implementa comportamiento real, solo evita errores en los tests.
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  // Se asigna el mock al objeto global `window`
  // para que los componentes lo encuentren como si fuera del navegador.
  window.ResizeObserver = ResizeObserver;
}


// Helper reutilizable para renderizar SearchControls en los tests.
//
// - Se envuelve el componente con MemoryRouter porque SearchControls
//   depende del router (query params, navegación, etc.).
// - `initialEntries` permite simular diferentes URLs iniciales
//   en cada test sin repetir código.
//
// Esto simplifica los tests y evita duplicar lógica de renderizado.
const renderSearchControls = (initialEntris: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntris}>
      <SearchControls />
    </MemoryRouter>
  );
};


describe("SearchControls", () => {
  test("should render searchControl with default values", () => {
    const { container } = renderSearchControls();
    expect(container).toMatchSnapshot();
  });

  test("should set input value when search param name is set", () => {
    renderSearchControls(["/?name=Joker"]);
    const input = screen.getByPlaceholderText(
      "Search heroes, villains, powers, teams..."
    );

    expect(input.getAttribute("value")).toBe("Joker");
  });

  test("should change params when input is changed and enter is pressed", () => {
    renderSearchControls(["/?name=Joker"]);

    const input = screen.getByPlaceholderText(
      "Search heroes, villains, powers, teams..."
    );

    expect(input.getAttribute("value")).toBe("Joker");

    fireEvent.change(input, { target: { value: "Luthor" } });

    fireEvent.keyDown(input, { key: "Enter" });

    expect(input.getAttribute("value")).toBe("Luthor");
  });

  test("should change params stregth when slider is changed", () => {
    renderSearchControls(["/?name=Joker&active-accordion=advance-filters"]);

    const slider = screen.getByRole("slider");

    expect(slider.getAttribute("aria-valuenow")).toBe("0");

    fireEvent.keyDown(slider, { key: "ArrowRight" });

    expect(slider.getAttribute("aria-valuenow")).toBe("1");
  });

  test("should accordion be open when active-accordion param is set", () => {
    renderSearchControls(["/?name=Joker&active-accordion=advance-filters"]);

    const accordion = screen.getByTestId("accordion");
    const accordionItem = accordion.querySelector("div");

    expect(accordionItem?.getAttribute("data-state")).toBe("open");
  });
  
  test("should accordion be closed when active-accordion param is set", () => {
    renderSearchControls(["/?name=Joker"]);

    const accordion = screen.getByTestId("accordion");
    const accordionItem = accordion.querySelector("div");

    expect(accordionItem?.getAttribute("data-state")).toBe("closed");
  });
});
