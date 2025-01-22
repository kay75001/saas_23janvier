import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import StudentDashboard from "@/app/student/page";

jest.mock("next-auth/react");

describe("StudentDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders a loading message when session is loading", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "loading",
    });

    render(<StudentDashboard />);

    // Check for loading message
    expect(screen.getByText(/chargement.../i)).toBeInTheDocument();
  });

  it("renders the student dashboard for an authenticated user", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { nom: "Jane Doe" } },
      status: "authenticated",
    });

    render(<StudentDashboard />);

    // Check for the heading
    expect(
      screen.getByRole("heading", { name: /espace élève/i })
    ).toBeInTheDocument();

    // Check for the welcome message
    expect(screen.getByText(/bienvenue, jane doe!/i)).toBeInTheDocument();
  });

  it("renders without crashing for unauthenticated users", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<StudentDashboard />);

    // Ensure the heading still renders
    expect(
      screen.getByRole("heading", { name: /espace élève/i })
    ).toBeInTheDocument();

    // Ensure no user-specific text is rendered
    expect(screen.queryByText(/bienvenue,/i)).not.toBeInTheDocument();
  });
});
