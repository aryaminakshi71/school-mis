import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { StudentsPage } from "../../routes/app.students.index";

// Mock the API
vi.mock("../../../lib/api", () => ({
  api: {
    students: {
      list: vi.fn().mockResolvedValue([
        {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          admissionNumber: "ADM001",
          className: "Class 10-A",
          email: "john@example.com",
          phone: "+1234567890",
        },
      ]),
    },
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>,
  );
};

test("renders students page with title", () => {
  renderWithProviders(<StudentsPage />);
  expect(screen.getByText("Students")).toBeInTheDocument();
});

test("displays student data after loading", async () => {
  renderWithProviders(<StudentsPage />);

  await waitFor(() => {
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  expect(screen.getByText("ADM001")).toBeInTheDocument();
  expect(screen.getByText("Class 10-A")).toBeInTheDocument();
});

test("shows loading state initially", () => {
  renderWithProviders(<StudentsPage />);
  expect(screen.getByText("Loading...")).toBeInTheDocument();
});
