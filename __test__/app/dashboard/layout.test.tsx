import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/app/dashboard/layout";

jest.mock("next-auth/react");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/app/(dashboard)/components/Header", () => () => (
  <div data-testid="header">Header Component</div>
));
jest.mock("@/app/(dashboard)/components/Sidebar", () => () => (
  <div data-testid="sidebar">Sidebar Component</div>
));

describe("DashboardLayout", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("renders a loading message when session is loading", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "loading",
    });

    render(
      <DashboardLayout>
        <div>Test Child Content</div>
      </DashboardLayout>
    );

    // Verify loading message
    expect(screen.getByText(/chargement.../i)).toBeInTheDocument();
  });

  it("redirects to /unauthorized if the user is not authenticated", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "authenticated",
    });

    render(
      <DashboardLayout>
        <div>Test Child Content</div>
      </DashboardLayout>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/unauthorized");
    });
  });

  it("redirects to /unauthorized if the user role is not FORMATEUR", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { role: "STUDENT" } },
      status: "authenticated",
    });

    render(
      <DashboardLayout>
        <div>Test Child Content</div>
      </DashboardLayout>
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/unauthorized");
    });
  });

  it("renders the layout with Header, Sidebar, and child content for FORMATEUR users", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { role: "FORMATEUR" } },
      status: "authenticated",
    });

    render(
      <DashboardLayout>
        <div>Test Child Content</div>
      </DashboardLayout>
    );

    // Verify Sidebar is rendered
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();

    // Verify Header is rendered
    expect(screen.getByTestId("header")).toBeInTheDocument();

    // Verify child content is rendered
    expect(screen.getByText("Test Child Content")).toBeInTheDocument();
  });
});
