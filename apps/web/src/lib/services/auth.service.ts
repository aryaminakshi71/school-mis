import { createHmac, randomBytes } from "crypto";
import { db, userPasswords, userSessions, users } from "@school/storage";
import { and, eq } from "drizzle-orm";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-key-change-in-production",
);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.REFRESH_TOKEN_SECRET ||
    "fallback-refresh-secret-change-in-production",
);

export type UserRole =
  | "admin"
  | "teacher"
  | "accountant"
  | "librarian"
  | "parent"
  | "student";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  studentId?: string;
  childId?: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  type: "access" | "refresh";
}

export interface AuthResult {
  success: boolean;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString("hex");
  const hash = createHmac("sha256", salt).update(password).digest("hex");
  return `${salt}:${hash}`;
};

const verifyPassword = (password: string, storedPassword: string): boolean => {
  const [salt, hash] = storedPassword.split(":");
  const computedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  return hash === computedHash;
};

export const authService = {
  async register(
    email: string,
    password: string,
    name: string,
    role: UserRole = "student",
  ): Promise<AuthResult> {
    try {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        return { success: false, error: "Email already registered" };
      }

      const hashedPassword = hashPassword(password);

      const [newUser] = await db
        .insert(users)
        .values({
          email,
          name,
          role,
          password: hashedPassword,
        })
        .returning();

      await db.insert(userPasswords).values({
        userId: newUser.id,
        passwordHash: hashedPassword,
      });

      return this.login(email, password);
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: "Registration failed" };
    }
  },

  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user) {
        return { success: false, error: "Invalid email or password" };
      }

      const [passwordRecord] = await db
        .select()
        .from(userPasswords)
        .where(eq(userPasswords.userId, user.id))
        .limit(1);

      if (
        !passwordRecord ||
        !verifyPassword(password, passwordRecord.passwordHash)
      ) {
        return { success: false, error: "Invalid email or password" };
      }

      if (!user.isActive) {
        return { success: false, error: "Account is deactivated" };
      }

      const accessToken = await new SignJWT({
        userId: user.id,
        email: user.email,
        role: user.role,
        type: "access",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(process.env.JWT_EXPIRES_IN || "7d")
        .sign(JWT_SECRET);

      const refreshToken = await new SignJWT({
        userId: user.id,
        email: user.email,
        role: user.role,
        type: "refresh",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(process.env.REFRESH_TOKEN_EXPIRES_IN || "30d")
        .sign(REFRESH_SECRET);

      await db.insert(userSessions).values({
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        userAgent:
          typeof window !== "undefined" ? window.navigator.userAgent : "server",
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
          avatar: user.image || undefined,
          phone: user.phone || undefined,
          studentId: user.studentId || undefined,
          childId: user.childId || undefined,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Login failed" };
    }
  },

  async verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return payload as unknown as TokenPayload;
    } catch {
      return null;
    }
  },

  async refreshAccessToken(refreshToken: string): Promise<AuthResult> {
    try {
      const { payload } = await jwtVerify(refreshToken, REFRESH_SECRET);

      if (payload.type !== "refresh") {
        return { success: false, error: "Invalid token type" };
      }

      const [session] = await db
        .select()
        .from(userSessions)
        .where(
          and(
            eq(userSessions.userId, payload.userId as string),
            eq(userSessions.token, refreshToken),
          ),
        )
        .limit(1);

      if (!session || session.expiresAt < new Date()) {
        return { success: false, error: "Session expired" };
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, payload.userId as string))
        .limit(1);

      if (!user || !user.isActive) {
        return { success: false, error: "User not found or inactive" };
      }

      const newAccessToken = await new SignJWT({
        userId: user.id,
        email: user.email,
        role: user.role,
        type: "access",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(process.env.JWT_EXPIRES_IN || "7d")
        .sign(JWT_SECRET);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,
          avatar: user.image || undefined,
          phone: user.phone || undefined,
        },
        accessToken: newAccessToken,
        refreshToken,
      };
    } catch (error) {
      console.error("Token refresh error:", error);
      return { success: false, error: "Token refresh failed" };
    }
  },

  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      await db
        .delete(userSessions)
        .where(
          and(
            eq(userSessions.userId, userId),
            eq(userSessions.token, refreshToken),
          ),
        );
    } else {
      await db.delete(userSessions).where(eq(userSessions.userId, userId));
    }
  },

  async getUserById(userId: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
      avatar: user.image || undefined,
      phone: user.phone || undefined,
      studentId: user.studentId || undefined,
      childId: user.childId || undefined,
    };
  },

  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<AuthResult> {
    try {
      const [passwordRecord] = await db
        .select()
        .from(userPasswords)
        .where(eq(userPasswords.userId, userId))
        .limit(1);

      if (
        !passwordRecord ||
        !verifyPassword(currentPassword, passwordRecord.passwordHash)
      ) {
        return { success: false, error: "Current password is incorrect" };
      }

      const newHashedPassword = hashPassword(newPassword);

      await db
        .update(userPasswords)
        .set({ passwordHash: newHashedPassword, updatedAt: new Date() })
        .where(eq(userPasswords.userId, userId));

      return { success: true };
    } catch (error) {
      console.error("Password update error:", error);
      return { success: false, error: "Password update failed" };
    }
  },

  async changeRole(userId: string, newRole: UserRole): Promise<AuthResult> {
    try {
      await db
        .update(users)
        .set({ role: newRole, updatedAt: new Date() })
        .where(eq(users.id, userId));

      return { success: true };
    } catch (error) {
      console.error("Role change error:", error);
      return { success: false, error: "Role change failed" };
    }
  },
};

export default authService;
