import { useQuery } from "@tanstack/react-query";
import { TeamMember } from "@shared/schema";

export async function fetchTeam(): Promise<{ success: boolean; data: TeamMember[] }> {
  try {
    const res = await fetch("/team.json");
    if (!res.ok) throw new Error("API unavailable");
    const clone = res.clone();
    try {
      return await clone.json();
    } catch (e) {
      // If Vercel returns index.html, fall back to /api/team
      const apiRes = await fetch("/api/team", { credentials: "include" });
      return await apiRes.json();
    }
  } catch (error) {
    const apiRes = await fetch("/api/team", { credentials: "include" });
    return await apiRes.json();
  }
}

export function useTeam() {
  return useQuery<{ success: boolean; data: TeamMember[] }>({
    queryKey: ["/api/team"],
    queryFn: fetchTeam,
  });
}
