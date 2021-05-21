import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import PacklistSelector from "./PacklistSelector";
import { Packlist } from "../types";

describe("PacklistSelector component", () => {
  const packlists: Packlist[] = [
    {
      id: "1111",
      name: "First packlist",
      description: "",
      categories: [],
    },
    {
      id: "2222",
      name: "Second packlist",
      description: "",
      categories: [],
    },
    {
      id: "3333",
      name: "Third packlist",
      description: "",
      categories: [],
    },
  ];

  const mockSetState = jest.fn();

  beforeEach(() => {
    render(
      <PacklistSelector
        packlists={packlists}
        setCurrentPacklistId={mockSetState}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders packlist names", () => {
    const selectorList = screen.getByTestId("packlist-selector-list");
    packlists.forEach(p => {
      expect(selectorList).toHaveTextContent(p.name);
    });
  });

  test("calls setCurrentPacklistId prop with id when packlist is selected", () => {
    packlists.forEach(p => {
      const button = screen.getByRole("button", { name: new RegExp(p.name, "i") });

      fireEvent.click(button);
    });

    expect(mockSetState.mock.calls.length).toBe(packlists.length);

    packlists.forEach((p, i) => {
      expect(mockSetState.mock.calls[i][0]).toBe(p.id);
    });
  });
});

