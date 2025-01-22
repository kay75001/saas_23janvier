import { AuthProvider } from "@/app/providers/AuthProvider";
import { render, screen } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";

jest.mock("next-auth/react", () => ({
  SessionProvider: jest.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="session-provider">{children}</div>
  )),
}));

describe("AuthProvider", () => {
  it("renders children inside SessionProvider", () => {
    render(
      <AuthProvider>
        <div>Test Child Component</div>
      </AuthProvider>
    );

    // Check if the SessionProvider is rendered
    expect(screen.getByTestId("session-provider")).toBeInTheDocument();

    // Check if the child is rendered inside the SessionProvider
    expect(screen.getByText("Test Child Component")).toBeInTheDocument();
  });
});
