// __tests__/app/dashboard/page.test.tsx
import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import DashboardFormateur from "@/app/dashboard/page";

jest.mock("next-auth/react");

describe("Dashboard Formateur", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a loading message while the session is loading", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "loading",
    });

    render(<DashboardFormateur />);

    // Check if the loading message is displayed
    expect(screen.getByText(/chargement.../i)).toBeInTheDocument();
  });

  it("renders the dashboard for an authenticated user", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { nom: "John Doe" } },
      status: "authenticated",
    });

    render(<DashboardFormateur />);

    // Check if the dashboard heading is displayed
    expect(
      screen.getByRole("heading", { name: /dashboard formateur/i })
    ).toBeInTheDocument();

    // Check if the user's name is displayed
    expect(screen.getByText(/bienvenue, john doe!/i)).toBeInTheDocument();
  });

  it("renders without crashing for unauthenticated users", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<DashboardFormateur />);

    // Check if the dashboard still renders with default content
    expect(screen.queryByText(/bienvenue,/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /dashboard formateur/i })
    ).toBeInTheDocument();
  });
});
