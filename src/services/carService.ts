
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

// Extend the base Car type with our custom fields
export type Car = Omit<Tables<"cars">, "features" | "image_urls"> & {
  features: string[];
  image_urls: string[];
  featured?: boolean;
};

export type CreateCarInput = Omit<Car, "id" | "created_at" | "updated_at">;

export const carService = {
  /**
   * Get all cars from the database with optional filtering
   */
  async getCars(filters?: {
    status?: string;
    make?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
  }) {
    let query = supabase.from("cars").select("*");

    // Apply filters if provided
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.make) {
      query = query.ilike("make", `%${filters.make}%`);
    }
    if (filters?.minPrice) {
      query = query.gte("price", filters.minPrice);
    }
    if (filters?.maxPrice) {
      query = query.lte("price", filters.maxPrice);
    }
    if (filters?.featured !== undefined) {
      query = query.eq("featured", filters.featured);
    }

    // Order by most recently added
    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching cars:", error);
      throw error;
    }

    return data.map(car => {
      return {
        ...car,
        features: car.features ? JSON.parse(car.features as unknown as string) : [],
        image_urls: car.image_urls ? JSON.parse(car.image_urls as unknown as string) : []
      } as Car;
    });
  },

  /**
   * Get featured cars for homepage
   */
  async getFeaturedCars(limit: number = 3) {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .eq("status", "Available")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error("Error fetching featured cars:", error);
      throw error;
    }

    return data.map(car => {
      return {
        ...car,
        features: car.features ? JSON.parse(car.features as unknown as string) : [],
        image_urls: car.image_urls ? JSON.parse(car.image_urls as unknown as string) : []
      } as Car;
    });
  },

  /**
   * Get a single car by ID
   */
  async getCar(id: string) {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching car:", error);
      throw error;
    }

    return {
      ...data,
      features: data.features ? JSON.parse(data.features as unknown as string) : [],
      image_urls: data.image_urls ? JSON.parse(data.image_urls as unknown as string) : []
    } as Car;
  },

  /**
   * Create a new car
   */
  async createCar(car: CreateCarInput) {
    // Convert arrays to JSON strings for storage
    const carToInsert = {
      ...car,
      features: car.features ? JSON.stringify(car.features) : null,
      image_urls: car.image_urls ? JSON.stringify(car.image_urls) : null,
      // Keep the first image as the main image_url for backward compatibility
      image_url: car.image_urls && car.image_urls.length > 0 ? car.image_urls[0] : car.image_url
    };

    const { data, error } = await supabase.from("cars").insert(carToInsert).select();

    if (error) {
      console.error("Error creating car:", error);
      throw error;
    }

    return {
      ...data[0],
      features: data[0].features ? JSON.parse(data[0].features as unknown as string) : [],
      image_urls: data[0].image_urls ? JSON.parse(data[0].image_urls as unknown as string) : []
    } as Car;
  },

  /**
   * Update an existing car
   */
  async updateCar(id: string, car: Partial<Car>) {
    // Convert arrays to JSON strings for storage
    const carToUpdate = {
      ...car,
      features: car.features ? JSON.stringify(car.features) : undefined,
      image_urls: car.image_urls ? JSON.stringify(car.image_urls) : undefined,
      // Keep the first image as the main image_url for backward compatibility
      image_url: car.image_urls && car.image_urls.length > 0 ? car.image_urls[0] : car.image_url
    };

    const { data, error } = await supabase
      .from("cars")
      .update(carToUpdate)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating car:", error);
      throw error;
    }

    return {
      ...data[0],
      features: data[0].features ? JSON.parse(data[0].features as unknown as string) : [],
      image_urls: data[0].image_urls ? JSON.parse(data[0].image_urls as unknown as string) : []
    } as Car;
  },

  /**
   * Delete a car
   */
  async deleteCar(id: string) {
    const { error } = await supabase.from("cars").delete().eq("id", id);

    if (error) {
      console.error("Error deleting car:", error);
      throw error;
    }

    return true;
  },

  /**
   * Upload a car image to storage
   */
  async uploadCarImage(file: File) {
    // Create a unique file name
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from("car_images")
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading car image:", error);
      throw error;
    }

    // Get the public URL for the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from("car_images")
      .getPublicUrl(filePath);

    return publicUrl;
  },

  /**
   * Upload multiple car images and return array of URLs
   */
  async uploadCarImages(files: File[]) {
    const imageUrls = [];
    
    for (const file of files) {
      const url = await this.uploadCarImage(file);
      imageUrls.push(url);
    }

    return imageUrls;
  },

  /**
   * Delete a car image from storage
   */
  async deleteCarImage(url: string) {
    // Extract the file path from the URL
    const filePath = url.split("/").pop();
    
    if (!filePath) {
      throw new Error("Invalid image URL");
    }

    const { error } = await supabase.storage
      .from("car_images")
      .remove([filePath]);

    if (error) {
      console.error("Error deleting car image:", error);
      throw error;
    }

    return true;
  },

  /**
   * Delete multiple car images from storage
   */
  async deleteCarImages(urls: string[]) {
    for (const url of urls) {
      await this.deleteCarImage(url);
    }
    return true;
  }
};
