import type { Meta, StoryObj } from "@storybook/react";
import { ConnectionManager } from "./connection-manager";

const meta: Meta<typeof ConnectionManager> = {
    title: "ConnectionManager",
    component: ConnectionManager,
};

export default meta;

type Story = StoryObj<typeof ConnectionManager>;

export const Primary: Story = {
    args: {},
};
