import { render, screen } from "@testing-library/react";
import UnauthorizedPage from "@/app/unauthorized/page";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("UnauthorizedPage", () => {
  it("renders the page correctly", () => {
    render(<UnauthorizedPage />);

    // Check the heading
    expect(
      screen.getByRole("heading", { name: /accès refusé/i })
    ).toBeInTheDocument();

    // Check the message
    expect(
      screen.getByText(
        /vous n'avez pas les droits nécessaires pour accéder à cette page/i
      )
    ).toBeInTheDocument();

    // Check the button
    expect(
      screen.getByRole("button", { name: /retour à l'accueil/i })
    ).toBeInTheDocument();
  });

  it("renders the link to redirect to the homepage", () => {
    render(<UnauthorizedPage />);

    const link = screen.getByRole("link", { name: /retour à l'accueil/i });
    expect(link).toHaveAttribute("href", "/");
  });
});
