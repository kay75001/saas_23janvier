// __tests__/app/page.test.tsx
import { render, screen, waitFor, getByRole, getByText } from "@testing-library/react";
// jest.setup.js
import '@testing-library/jest-dom';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import HomePage from "@/app/page";
import { Role } from "@prisma/client";

jest.mock("next-auth/react");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Home Page", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("renders the page content correctly", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<HomePage />);

    // Verify the heading
    expect(
      screen.getByRole("heading", {
        name: /bienvenue sur notre plateforme de formation/i,
      })
    ).toBeInTheDocument();

    // Verify the description
    expect(
      screen.getByText(/gérez vos cours, suivez vos apprenants/i)
    ).toBeInTheDocument();

    // Verify the login and register buttons
    expect(
      screen.getByRole("button", { name: /se connecter/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /s'inscrire/i })
    ).toBeInTheDocument();
  });

  it("redirects FORMATEUR users to /dashboard", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { role: Role.FORMATEUR } },
      status: "authenticated",
    });

    render(<HomePage />);

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/dashboard"));
  });

  it("redirects STUDENT users to /student", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { role: Role.STUDENT } },
      status: "authenticated",
    });

    render(<HomePage />);

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/student"));
  });

  it("displays a loading message while session is loading", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "loading",
    });

    render(<HomePage />);

    // Verify the loading message
    expect(screen.getByText(/chargement/i)).toBeInTheDocument();
  });
});
