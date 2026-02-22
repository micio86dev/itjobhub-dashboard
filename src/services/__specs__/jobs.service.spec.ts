import { describe, it, expect, vi } from "vitest";
import * as apiClient from "@/services/api.client";
import { getJobs, getJobsWithLocation, getTopSkills } from "@/services/jobs.service";

describe("jobs.service", () => {
  it("getJobs calls correct endpoint with params", async () => {
    const spy = vi.spyOn(apiClient, "apiFetch").mockResolvedValue({
      data: { data: [], total: 0, page: 2, limit: 10, totalPages: 0 },
    });

    await getJobs({ page: 2, limit: 10, skills: ["Vue"] });

    expect(spy).toHaveBeenCalledWith("/jobs", {
      query: { page: 2, limit: 10, skills: "Vue" },
    });
  });

  it("getJobsWithLocation filters jobs with GPS", async () => {
    vi.spyOn(apiClient, "apiFetch").mockResolvedValue({
      data: {
        data: [
          { id: "1", location_geo: { type: "Point", coordinates: [1, 1] } },
          { id: "2", location_geo: null },
        ],
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    });

    const result = await getJobsWithLocation();
    expect(result.data).toHaveLength(1);
    expect(result.data[0]?.id).toBe("1");
  });

  it("getTopSkills returns array sorted by count", async () => {
    vi.spyOn(apiClient, "apiFetch").mockResolvedValue({
      data: [
        { skill: "Vue", count: 2 },
        { skill: "React", count: 5 },
      ],
    });

    const result = await getTopSkills(2);
    expect(result[0]?.skill).toBe("React");
    expect(result[1]?.skill).toBe("Vue");
  });
});
