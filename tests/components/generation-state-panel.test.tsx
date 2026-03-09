import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GenerationStatePanel } from "@/components/common/generation-state-panel";

describe("GenerationStatePanel", () => {
  it("renders partial warnings", () => {
    render(
      <GenerationStatePanel
        status="partial"
        message="下書きは作成できました。"
        warnings={["数字を足すと精度が上がります。"]}
      />,
    );

    expect(screen.getByText("一部補足すると精度が上がります")).toBeInTheDocument();
    expect(screen.getByText("数字を足すと精度が上がります。")).toBeInTheDocument();
  });
});
