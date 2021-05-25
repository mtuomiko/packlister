import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import PacklistSelector from "./PacklistSelector";
import { Packlist } from "../types";
import { MockedProvider } from "@apollo/client/testing";

const mockSetFieldValue = jest.fn();

jest.mock("formik", () => ({
  useFormikContext: () => ({
    setFieldValue: mockSetFieldValue,
    values: {},
  }),
}));

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

  beforeEach(() => {
    render(
      <MockedProvider addTypename={false}>
        <PacklistSelector
          packlists={packlists}
        />
      </MockedProvider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders packlist names", () => {
    const packlistList = screen.getByTestId("packlist-list");
    packlists.forEach(p => {
      expect(packlistList).toHaveTextContent(p.name);
    });
  });

  test("calls Formik setFieldValue with packlist data when packlist is selected", () => {
    packlists.forEach(p => {
      const button = screen.getByRole("menuitem", { name: new RegExp(p.name, "i") });

      fireEvent.click(button);
    });

    expect(mockSetFieldValue.mock.calls.length).toBe(packlists.length);

    packlists.forEach((p, i) => {
      expect(mockSetFieldValue.mock.calls[i][0]).toBe("packlist");
      expect(mockSetFieldValue.mock.calls[i][1]).toEqual(p);
    });
  });
});

