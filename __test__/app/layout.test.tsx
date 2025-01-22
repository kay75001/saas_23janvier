import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";
import { AuthProvider } from "@/app/providers/AuthProvider";

jest.mock("@/app/providers/AuthProvider", () => ({
  AuthProvider: jest.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  )),
}));

describe("RootLayout", () => {
  it("renders the layout correctly", () => {
    render(
      <RootLayout>
        <div>Test Child Component</div>
      </RootLayout>
    );

    // Check if the <html> element has the correct lang attribute
    const htmlElement = document.querySelector("html");
    expect(htmlElement).toHaveAttribute("lang", "fr");

    // Check if AuthProvider is rendered
    expect(screen.getByTestId("auth-provider")).toBeInTheDocument();

    // Check if the children are rendered inside AuthProvider
    expect(screen.getByText("Test Child Component")).toBeInTheDocument();
  });
});
