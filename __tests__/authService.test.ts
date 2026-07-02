import AuthService from "../services/auth.service";

const mockSignInWithPassword = jest.fn();
const mockSignUp = jest.fn();
const mockSignOut = jest.fn();
const mockGetUser = jest.fn();

jest.mock("../supabase/client", () => ({
  supabase: {
    auth: {
      signInWithPassword: (...args: any[]) => mockSignInWithPassword(...args),
      signUp: (...args: any[]) => mockSignUp(...args),
      signOut: (...args: any[]) => mockSignOut(...args),
      getUser: (...args: any[]) => mockGetUser(...args),
    },
  },
}));

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("llama a signInWithPassword con email y password", async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: { user: { id: "1", email: "test@test.com" } },
        error: null,
      });
      const result = await AuthService.login("test@test.com", "123456");
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "123456",
      });
      expect(result?.user?.id).toBe("1");
    });

    it("lanza error si falla el login", async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: null,
        error: { message: "Invalid credentials" },
      });
      await expect(AuthService.login("test@test.com", "wrong")).rejects.toBeDefined();
    });
  });

  describe("register", () => {
    it("llama a signUp con nombre, email y password", async () => {
      mockSignUp.mockResolvedValue({
        data: { user: { id: "2" } },
        error: null,
      });
      const result = await AuthService.register("TestUser", "new@test.com", "123456");
      expect(mockSignUp).toHaveBeenCalledWith({
        email: "new@test.com",
        password: "123456",
        options: { data: { nombre: "TestUser" } },
      });
      expect(result?.user?.id).toBe("2");
    });

    it("lanza error si falla el registro", async () => {
      mockSignUp.mockResolvedValue({
        data: null,
        error: { message: "Email already registered" },
      });
      await expect(
        AuthService.register("Test", "existing@test.com", "123456"),
      ).rejects.toBeDefined();
    });
  });

  describe("logout", () => {
    it("llama a signOut", async () => {
      mockSignOut.mockResolvedValue({ error: null });
      await AuthService.logout();
      expect(mockSignOut).toHaveBeenCalled();
    });

    it("lanza error si falla el logout", async () => {
      mockSignOut.mockResolvedValue({ error: { message: "Session error" } });
      await expect(AuthService.logout()).rejects.toBeDefined();
    });
  });

  describe("currentUser", () => {
    it("retorna el usuario actual", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "1", email: "test@test.com" } },
        error: null,
      });
      const result = await AuthService.currentUser();
      expect(result?.email).toBe("test@test.com");
    });
  });
});
