import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Create a custom render function that includes providers if needed
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return {
    user: userEvent.setup(),
    ...render(ui, {
      // Add providers here if needed
      ...options,
    }),
  };
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override the render method with our custom one
export { customRender as render };
