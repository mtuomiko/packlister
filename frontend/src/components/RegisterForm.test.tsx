import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";

import RegisterForm from "./RegisterForm";
import { REGISTER } from "../graphql/mutations";

const mockHistoryReplace = jest.fn();

jest.mock("react-router-dom", () => ({
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));

describe("RegisterForm component", () => {
  test("sends fields with mutation", async () => {
    let mutationCalled = false;

    const apolloMocks = [
      {
        request: {
          query: REGISTER,
          variables: {
            username: "kosmo",
            email: "kosmo@testing.com",
            password: "osmoskosmos",
          },
        },
        result: () => {
          mutationCalled = true;
          return {
            data: {
              createUser: {
                id: "1",
              },
            },
          };
        }
      },
    ];

    render(
      <MockedProvider mocks={apolloMocks} addTypename={false}>
        <RegisterForm />
      </MockedProvider>
    );

    const usernameField = screen.getByRole("textbox", { name: /username/i });
    const emailField = screen.getByRole("textbox", { name: /email/i });
    // Password fields have no role?
    // https://github.com/testing-library/dom-testing-library/issues/567
    const passwordField = screen.getByLabelText(/password/i);

    const registerButton = screen.getByRole("button", { name: /register/i });

    userEvent.type(usernameField, "kosmo");
    userEvent.type(emailField, "kosmo@testing.com");
    userEvent.type(passwordField, "osmoskosmos");

    // Nothing done yet
    expect(mutationCalled).toBeFalsy();

    userEvent.click(registerButton);

    // Mutation not processed yet
    expect(mutationCalled).toBeFalsy();

    // Process mutation
    await act(() => {
      return new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mutationCalled).toBeTruthy();
    expect(mockHistoryReplace.mock.calls.length).toBe(1);
    expect(mockHistoryReplace.mock.calls[0][0]).toBe("/login");
  });
});