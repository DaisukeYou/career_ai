import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { DiagnosisPage } from "@/components/diagnosis/diagnosis-page";
import { LandingPage } from "@/components/landing/landing-page";

describe("basic accessibility", () => {
  it("renders a clear landing heading", () => {
    render(<LandingPage />);
    expect(
      screen.getByRole("heading", {
        name: "AIと話すだけで、転職の準備が前に進む",
      }),
    ).toBeInTheDocument();
  });

  it("renders diagnosis form labels and a primary action", () => {
    render(<DiagnosisPage />);
    expect(screen.getByLabelText("現職または直近職種")).toBeInTheDocument();
    expect(screen.getByLabelText("希望職種")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "1分診断を実行する" }),
    ).toBeInTheDocument();
  });

  it("shows field-level errors and supports keyboard submit", async () => {
    const user = userEvent.setup();
    render(<DiagnosisPage />);

    await user.tab();
    await user.tab();
    await user.keyboard("{Enter}");

    expect(screen.getByText("現職または直近職種を入力してください")).toBeInTheDocument();
    expect(screen.getByText("希望職種を入力してください")).toBeInTheDocument();
  });
});
