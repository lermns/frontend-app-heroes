import { CustomPagination } from "@/components/custom/CustomPagination";
import { Button } from "@/components/ui/button";
import { fireEvent, render, screen } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { MemoryRouter } from "react-router";
import { describe, expect, test, vi } from "vitest";
Button;

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: PropsWithChildren) => (
    <button {...props}>{children}</button>
  ),
}));

/**
 * Renderiza un componente de React envuelto con MemoryRouter para propósitos de prueba.
 * 
 * @param component - El componente de React a renderizar
 * @param initialEntris - Array opcional de entradas de ruta iniciales para el MemoryRouter
 * @returns El resultado de renderizar de React Testing Library
 * 
 * @example
 * const result = renderWithRouter(<MyComponent />, ['/home']);
 */

// el initial entri corresponde al valor de page en los parametros que sirve para establecernos en una página
const renderWithRouter = (
  component: React.ReactElement,
  initialEntris?: string[]
) => {
  return render(
    <MemoryRouter initialEntries={initialEntris}>{component}</MemoryRouter>
  );
};

describe("CustomPagination", () => {
  test("should render component with default values", () => {
    renderWithRouter(<CustomPagination totalPages={5} />);

    expect(screen.getByText("Previous")).toBeDefined();
    expect(screen.getByText("Next")).toBeDefined();

    expect(screen.getByText("1")).toBeDefined();
    expect(screen.getByText("2")).toBeDefined();
    expect(screen.getByText("3")).toBeDefined();
  });

  test("should disabled previous button when page is 1", () => {
    renderWithRouter(<CustomPagination totalPages={5} />);

    const previousButton = screen.getByText("Previous");
    expect(previousButton.getAttributeNames()).toContain("disabled");
  });

  test("should disabled next button when we are in the last page", () => {
    renderWithRouter(<CustomPagination totalPages={5} />, ["/?page=5"]);

    const nextButton = screen.getByText("Next");

    expect(nextButton.getAttributeNames()).toContain("disabled");
  });

  test("should disabled button 3 when we are in page 3", () => {
    renderWithRouter(<CustomPagination totalPages={5} />, ["/?page=3"]);

    const button_2 = screen.getByText("2");
    const button_3 = screen.getByText("3");

    expect(button_2.getAttribute("variant")).toBe("outline");
    expect(button_3.getAttribute("variant")).toBe("default");
  });

  test("should change page when click on number button", () => {
    renderWithRouter(<CustomPagination totalPages={5} />, ["/?page=3"]);

    const button_2 = screen.getByText("2");
    const button_3 = screen.getByText("3");
    expect(button_2.getAttribute("variant")).toBe("outline");
    expect(button_3.getAttribute("variant")).toBe("default");

    fireEvent.click(button_2);

    screen.debug();

    expect(button_2.getAttribute("variant")).toBe("default");
    expect(button_3.getAttribute("variant")).toBe("outline");
  });
});
