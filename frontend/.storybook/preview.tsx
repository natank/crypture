import "../src/index.css";
import type { Preview } from "@storybook/react-vite";
import * as React from "react";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    tags: ["autodocs"],
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-50 min-h-screen p-4">
        <Story />
      </div>
    ),
  ],
};

export default preview;
