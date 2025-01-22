// __tests__/app/auth/register/page.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import RegisterPage from "@/app/auth/register/page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn();

describe("RegisterPage", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("renders the registration form correctly", () => {
    render(<RegisterPage />);

    // Check heading
    expect(
      screen.getByRole("heading", { name: /inscription/i })
    ).toBeInTheDocument();

    // Check form fields
    expect(screen.getByLabelText(/nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/prénom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/classe/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/téléphone/i)).toBeInTheDocument();

    // Check submit button
    expect(
      screen.getByRole("button", { name: /s'inscrire/i })
    ).toBeInTheDocument();
  });

  it("updates input fields correctly", () => {
    render(<RegisterPage />);

    const nomInput = screen.getByLabelText(/nom/i) as HTMLInputElement;
    const prenomInput = screen.getByLabelText(/prénom/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      /mot de passe/i
    ) as HTMLInputElement;
    const classeSelect = screen.getByLabelText(/classe/i) as HTMLSelectElement;
    const telephoneInput = screen.getByLabelText(
      /téléphone/i
    ) as HTMLInputElement;

    fireEvent.change(nomInput, { target: { value: "Doe" } });
    fireEvent.change(prenomInput, { target: { value: "John" } });
    fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(classeSelect, { target: { value: "dwwm" } });
    fireEvent.change(telephoneInput, { target: { value: "1234567890" } });

    expect(nomInput.value).toBe("Doe");
    expect(prenomInput.value).toBe("John");
    expect(emailInput.value).toBe("john.doe@example.com");
    expect(passwordInput.value).toBe("password123");
    expect(classeSelect.value).toBe("dwwm");
    expect(telephoneInput.value).toBe("1234567890");
  });

  it("handles successful registration and redirects to login page", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({}),
    });

    render(<RegisterPage />);

    const submitButton = screen.getByRole("button", { name: /s'inscrire/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("displays an error message for failed registration", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({
        error: "L'email est déjà utilisé",
      }),
    });

    render(<RegisterPage />);

    const submitButton = screen.getByRole("button", { name: /s'inscrire/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/l'email est déjà utilisé/i)).toBeInTheDocument();
    });
  });

  it("displays a generic error message for network issues", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    render(<RegisterPage />);

    const submitButton = screen.getByRole("button", { name: /s'inscrire/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/erreur lors de l'inscription/i)
      ).toBeInTheDocument();
    });
  });
});
