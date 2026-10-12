import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnalysisInterface, type AnalysisResult } from "./AnalysisInterface";
import { sampleProfile } from "@/lib/profile";
import { opportunities } from "@/lib/opportunities";

vi.mock("@tanstack/react-router", () => ({ Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a> }));
afterEach(cleanup);
const opportunity = opportunities[0];
if (!opportunity) throw new Error("Missing test opportunity");

describe("analysis interface lifecycle", () => {
  it("does not show fabricated results when no service is configured", () => {
    const { container } = render(<AnalysisInterface profile={sampleProfile} opportunity={opportunity} />);
    expect(container.querySelectorAll("li")).toHaveLength(0);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("only displays success results after the real request resolves", async () => {
    let resolve: ((result: AnalysisResult) => void) | undefined;
    const request = vi.fn(() => new Promise<AnalysisResult>((done) => { resolve = done; }));
    const { container } = render(<AnalysisInterface profile={sampleProfile} opportunity={opportunity} request={request} />);
    expect(request).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button"));
    expect(request).toHaveBeenCalledWith(sampleProfile, opportunity);
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
    if (!resolve) throw new Error("Request did not start");
    resolve({ matches: ["Verified skill"], gaps: ["Verified gap"], steps: ["Verified recommendation"] });
    await waitFor(() => expect(container.querySelector("li")?.textContent).toBe("Verified recommendation"));
    expect(container.querySelector('[aria-busy="true"]')).not.toBeInTheDocument();
  });

  it("never calls analysis with insufficient profile data", () => {
    const request = vi.fn();
    render(<AnalysisInterface profile={{ ...sampleProfile, skills: "" }} opportunity={opportunity} request={request} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(request).not.toHaveBeenCalled();
  });

  it("clears loading and leaves results empty after a failed request", async () => {
    const request = vi.fn().mockRejectedValue(new Error("Service failed"));
    const { container } = render(<AnalysisInterface profile={sampleProfile} opportunity={opportunity} request={request} />);
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(screen.getByRole("button")).toBeEnabled());
    expect(container.querySelector('[aria-busy="true"]')).not.toBeInTheDocument();
    expect(container.querySelectorAll("li")).toHaveLength(0);
  });
});