// __tests__/middleware.test.ts
import { NextRequest, NextResponse } from "next/server";
import { middleware } from "../middleware";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

describe("Middleware", () => {
  const mockRedirect = jest.fn();
  const mockNext = jest.fn();
  const createMockRequest = (url: string, token?: string) => {
    const req = {
      nextUrl: { pathname: url },
      cookies: {
        get: jest.fn().mockImplementation((key) => {
          if (key === "authToken") return { value: token };
          return null;
        }),
      },
    } as unknown as NextRequest;
    return req;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (NextResponse.redirect as jest.Mock) =
      mockRedirect.mockReturnValue("redirect");
    (NextResponse.next as jest.Mock) = mockNext.mockReturnValue("next");
  });

  test("redirects unauthenticated users to login", async () => {
    const req = createMockRequest("/dashboard");
    const response = middleware(req);

    expect(response).toBe("redirect");
    expect(mockRedirect).toHaveBeenCalledWith(
      new URL("/login", req.nextUrl.pathname)
    );
  });

  test("allows authorized FORMATEUR users to access dashboard", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({
      role: "FORMATEUR",
      sub: "123",
    });
    const req = createMockRequest("/dashboard", "validToken");
    const response = middleware(req);

    expect(response).toBe("next");
    expect(mockNext).toHaveBeenCalled();
  });

  test("redirects unauthorized users (wrong role) accessing dashboard", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ role: "STUDENT", sub: "123" });
    const req = createMockRequest("/dashboard", "validToken");
    const response = middleware(req);

    expect(response).toBe("redirect");
    expect(mockRedirect).toHaveBeenCalledWith(
      new URL("/unauthorized", req.nextUrl.pathname)
    );
  });

  test("redirects unauthorized users (wrong role) accessing student path", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({
      role: "FORMATEUR",
      sub: "123",
    });
    const req = createMockRequest("/student", "validToken");
    const response = middleware(req);

    expect(response).toBe("redirect");
    expect(mockRedirect).toHaveBeenCalledWith(
      new URL("/unauthorized", req.nextUrl.pathname)
    );
  });

  test("redirects invalid tokens to login", async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });
    const req = createMockRequest("/dashboard", "invalidToken");
    const response = middleware(req);

    expect(response).toBe("redirect");
    expect(mockRedirect).toHaveBeenCalledWith(
      new URL("/login", req.nextUrl.pathname)
    );
  });
});
