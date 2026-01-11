import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AlertList from "@components/AlertList";
import type { PriceAlert } from "types/alert";

// Mock alert data
const mockActiveAlert: PriceAlert = {
  id: "alert-1",
  coinId: "bitcoin",
  coinSymbol: "BTC",
  coinName: "Bitcoin",
  coinImage: "https://example.com/btc.png",
  condition: "above",
  targetPrice: 55000,
  status: "active",
  createdAt: Date.now() - 3600000, // 1 hour ago
};

const mockTriggeredAlert: PriceAlert = {
  id: "alert-2",
  coinId: "ethereum",
  coinSymbol: "ETH",
  coinName: "Ethereum",
  coinImage: "https://example.com/eth.png",
  condition: "below",
  targetPrice: 2500,
  status: "triggered",
  createdAt: Date.now() - 86400000, // 1 day ago
  triggeredAt: Date.now() - 1800000, // 30 minutes ago
};

const mockMutedAlert: PriceAlert = {
  id: "alert-3",
  coinId: "solana",
  coinSymbol: "SOL",
  coinName: "Solana",
  coinImage: "https://example.com/sol.png",
  condition: "above",
  targetPrice: 150,
  status: "muted",
  createdAt: Date.now() - 172800000, // 2 days ago
};

describe("AlertList", () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnMute = vi.fn();
  const mockOnReactivate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders empty state when no alerts", () => {
    render(
      <AlertList
        alerts={[]}
        title="Active Alerts"
        emptyMessage="No active alerts"
      />
    );

    expect(screen.getByText("Active Alerts")).toBeInTheDocument();
    expect(screen.getByText("No active alerts")).toBeInTheDocument();
  });

  it("renders list of alerts with count", () => {
    render(
      <AlertList
        alerts={[mockActiveAlert, mockTriggeredAlert]}
        title="All Alerts"
      />
    );

    expect(screen.getByText("All Alerts (2)")).toBeInTheDocument();
    expect(screen.getAllByTestId("alert-item")).toHaveLength(2);
  });

  it("displays alert coin symbol and target price", () => {
    render(
      <AlertList
        alerts={[mockActiveAlert]}
        title="Active Alerts"
      />
    );

    expect(screen.getByText("BTC")).toBeInTheDocument();
    expect(screen.getByText(/\$55,000\.00/)).toBeInTheDocument();
  });

  it("displays correct condition symbol for above", () => {
    render(
      <AlertList
        alerts={[mockActiveAlert]}
        title="Active Alerts"
      />
    );

    // Above condition should show ">"
    expect(screen.getByText(/> \$55,000\.00/)).toBeInTheDocument();
  });

  it("displays correct condition symbol for below", () => {
    render(
      <AlertList
        alerts={[mockTriggeredAlert]}
        title="Triggered Alerts"
      />
    );

    // Below condition should show "<"
    expect(screen.getByText(/< \$2,500\.00/)).toBeInTheDocument();
  });

  it("displays active status badge", () => {
    render(
      <AlertList
        alerts={[mockActiveAlert]}
        title="Active Alerts"
      />
    );

    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("displays triggered status badge", () => {
    render(
      <AlertList
        alerts={[mockTriggeredAlert]}
        title="Triggered Alerts"
      />
    );

    expect(screen.getByText("Triggered")).toBeInTheDocument();
  });

  it("displays muted status badge", () => {
    render(
      <AlertList
        alerts={[mockMutedAlert]}
        title="Muted Alerts"
      />
    );

    expect(screen.getByText("Muted")).toBeInTheDocument();
  });

  it("shows relative time for triggered alerts", () => {
    render(
      <AlertList
        alerts={[mockTriggeredAlert]}
        title="Triggered Alerts"
      />
    );

    // Should show "30m ago" for triggeredAt
    expect(screen.getByText(/30m ago/)).toBeInTheDocument();
  });

  it("opens actions menu when clicking menu button", () => {
    render(
      <AlertList
        alerts={[mockActiveAlert]}
        title="Active Alerts"
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onMute={mockOnMute}
      />
    );

    const menuButton = screen.getByRole("button", { name: /alert actions/i });
    fireEvent.click(menuButton);

    expect(screen.getByText(/edit/i)).toBeInTheDocument();
    expect(screen.getByText(/mute/i)).toBeInTheDocument();
    expect(screen.getByText(/delete/i)).toBeInTheDocument();
  });

  it("calls onEdit when edit action is clicked", () => {
    render(
      <AlertList
        alerts={[mockActiveAlert]}
        title="Active Alerts"
        onEdit={mockOnEdit}
      />
    );

    const menuButton = screen.getByRole("button", { name: /alert actions/i });
    fireEvent.click(menuButton);

    const editButton = screen.getByText(/edit/i);
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockActiveAlert);
  });

  it("calls onMute when mute action is clicked", () => {
    render(
      <AlertList
        alerts={[mockActiveAlert]}
        title="Active Alerts"
        onMute={mockOnMute}
      />
    );

    const menuButton = screen.getByRole("button", { name: /alert actions/i });
    fireEvent.click(menuButton);

    const muteButton = screen.getByText(/mute/i);
    fireEvent.click(muteButton);

    expect(mockOnMute).toHaveBeenCalledWith("alert-1");
  });

  it("calls onDelete when delete action is clicked", async () => {
    render(
      <AlertList
        alerts={[mockActiveAlert]}
        title="Active Alerts"
        onDelete={mockOnDelete}
      />
    );

    const menuButton = screen.getByRole("button", { name: /alert actions/i });
    fireEvent.click(menuButton);

    const deleteButton = screen.getByText(/delete/i);
    fireEvent.click(deleteButton);

    // Wait for modal to appear and click confirm
    const confirmButton = await screen.findByText(/confirm/i);
    fireEvent.click(confirmButton);

    expect(mockOnDelete).toHaveBeenCalledWith("alert-1");
  });

  it("calls onReactivate for muted alerts", () => {
    render(
      <AlertList
        alerts={[mockMutedAlert]}
        title="Muted Alerts"
        onReactivate={mockOnReactivate}
      />
    );

    const menuButton = screen.getByRole("button", { name: /alert actions/i });
    fireEvent.click(menuButton);

    const reactivateButton = screen.getByText(/reactivate/i);
    fireEvent.click(reactivateButton);

    expect(mockOnReactivate).toHaveBeenCalledWith("alert-3");
  });

  it("calls onReactivate for triggered alerts", () => {
    render(
      <AlertList
        alerts={[mockTriggeredAlert]}
        title="Triggered Alerts"
        onReactivate={mockOnReactivate}
      />
    );

    const menuButton = screen.getByRole("button", { name: /alert actions/i });
    fireEvent.click(menuButton);

    const reactivateButton = screen.getByText(/reactivate/i);
    fireEvent.click(reactivateButton);

    expect(mockOnReactivate).toHaveBeenCalledWith("alert-2");
  });

  it("does not show edit option for triggered alerts", () => {
    render(
      <AlertList
        alerts={[mockTriggeredAlert]}
        title="Triggered Alerts"
        onEdit={mockOnEdit}
        onReactivate={mockOnReactivate}
      />
    );

    const menuButton = screen.getByRole("button", { name: /alert actions/i });
    fireEvent.click(menuButton);

    expect(screen.queryByText(/edit/i)).not.toBeInTheDocument();
    expect(screen.getByText(/reactivate/i)).toBeInTheDocument();
  });

  it("does not show mute option for muted alerts", () => {
    render(
      <AlertList
        alerts={[mockMutedAlert]}
        title="Muted Alerts"
        onMute={mockOnMute}
        onReactivate={mockOnReactivate}
      />
    );

    const menuButton = screen.getByRole("button", { name: /alert actions/i });
    fireEvent.click(menuButton);

    // The mute button in the menu should not be present for muted alerts
    const menuItems = screen.getAllByRole("button");
    const muteMenuItem = menuItems.find(btn => btn.textContent?.includes("Mute"));
    expect(muteMenuItem).toBeUndefined();
  });

  it("closes menu when clicking outside", () => {
    render(
      <AlertList
        alerts={[mockActiveAlert]}
        title="Active Alerts"
        onEdit={mockOnEdit}
      />
    );

    const menuButton = screen.getByRole("button", { name: /alert actions/i });
    fireEvent.click(menuButton);

    // Menu should be open
    expect(screen.getByText(/edit/i)).toBeInTheDocument();

    // Click the overlay to close
    const overlay = document.querySelector(".fixed.inset-0");
    if (overlay) {
      fireEvent.click(overlay);
    }

    // Menu should be closed
    expect(screen.queryByText(/edit/i)).not.toBeInTheDocument();
  });

  it("renders coin image when provided", () => {
    render(
      <AlertList
        alerts={[mockActiveAlert]}
        title="Active Alerts"
      />
    );

    const coinImage = screen.getByAltText("Bitcoin");
    expect(coinImage).toBeInTheDocument();
    expect(coinImage).toHaveAttribute("src", "https://example.com/btc.png");
  });

  it("formats small prices with more decimal places", () => {
    const smallPriceAlert: PriceAlert = {
      ...mockActiveAlert,
      targetPrice: 0.00045,
    };

    render(
      <AlertList
        alerts={[smallPriceAlert]}
        title="Active Alerts"
      />
    );

    // Should show more decimal places for small prices
    expect(screen.getByText(/\$0\.00045/)).toBeInTheDocument();
  });
});
