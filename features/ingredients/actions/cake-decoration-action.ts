"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import {
  ApiListResponse,
  apiRequest,
  fetchListData,
  Result,
  ApiSingleResponse,
  fetchSingleData,
} from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { ICakeDecorationType } from "../types/cake-decoration-type";
import { axiosAuth } from "@/lib/api/api-interceptor/api";
import { auth } from "@/lib/next-auth/auth";

// Default decoration categories that all bakeries should have
const defaultDecorationTypes = [
  "Sprinkles",
  "Decoration",
  "Bling",
  "TallSkirt",
  "Drip",
  "ShortSkirt",
];

export const getCakeDecorations = async (
  searchParams: SearchParams
): Promise<ApiListResponse<ICakeDecorationType>> => {
  noStore();
  const session = await auth();

  const result = await fetchListData<ICakeDecorationType>(
    `/decoration_options?bakeryId=${session?.user.entity.id}`,
    searchParams
  );

  if (!result.success) {
    console.error("Failed to fetch list ICakeDecorationType:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};

export const updateCakeDecoration = async (
  data: any,
  id: string
): Promise<Result<void>> => {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.put(`/decoration_options/${id}`, data)
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard/ingredients");

  return { success: true, data: result.data };
};

export const createCakeDecoration = async (
  data: any
): Promise<Result<void>> => {
  noStore();
  console.log("data", data);
  const result = await apiRequest(() =>
    axiosAuth.post("/decoration_options", data)
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard/ingredients");
  return { success: true, data: result.data };
};

export const deleteCakeDecoration = async (
  id: string
): Promise<Result<void>> => {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.delete(`/decoration_options/${id}`)
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard/ingredients");
  return { success: true, data: result.data };
};

// Initialize default decoration types for a new bakery
export const initializeDefaultDecorations = async (
  bakeryId: string
): Promise<Result<void>> => {
  noStore();

  try {
    // Create default decoration types for the bakery
    for (const decorationType of defaultDecorationTypes) {
      await apiRequest(() =>
        axiosAuth.post("/decoration_options", {
          type: decorationType,
          bakeryId: bakeryId,
          items: [], // Initially empty items, bakery will add their own items
        })
      );
    }

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to initialize default decorations:", error);
    return {
      success: false,
      error: "Failed to initialize default decorations",
    };
  }
};

export const getDecorationOptionById = async (id: string): Promise<ApiSingleResponse<any>> => {
  noStore();
  
  try {
    const result = await fetchSingleData<any>(`/decoration_options/${id}`);
    
    if (!result.success) {
      console.error(`Failed to fetch decoration option with ID ${id}:`, result.error);
      return { data: null, error: result.error };
    }
    
    return result.data;
  } catch (error) {
    console.error(`Error fetching decoration option with ID ${id}:`, error);
    return { data: null, error: String(error) };
  }
};

