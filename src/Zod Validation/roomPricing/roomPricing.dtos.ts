import { z } from "zod";

export const createRoomPricingSchema = z.object({
  roomType: z.enum(["SINGLE", "DOUBLE_SHARING", "TRIPLE_SHARING", "QUAD_SHARING", "QUINT_SHARING", "VIP_SUIT"], {
    errorMap: () => ({ message: "Invalid room type" }),
  }),
  stayType: z.enum(["SHORT_TERM", "LONG_TERM"], {
    errorMap: () => ({ message: "Invalid stay type" }),
  }),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  isActive: z.boolean().optional(),
});

export const updateRoomPricingSchema = z.object({
  roomType: z.enum(["SINGLE", "DOUBLE_SHARING", "TRIPLE_SHARING", "QUAD_SHARING", "QUINT_SHARING", "VIP_SUIT"], {
    errorMap: () => ({ message: "Invalid room type" }),
  }).optional(),
  stayType: z.enum(["SHORT_TERM", "LONG_TERM"], {
    errorMap: () => ({ message: "Invalid stay type" }),
  }).optional(),
  price: z.number().min(0, "Price must be greater than or equal to 0").optional(),
  isActive: z.boolean().optional(),
});

/**
 * DTO (compile-time type)
 */
export type CreateRoomPricingDTO = z.infer<typeof createRoomPricingSchema>;
export type UpdateRoomPricingDTO = z.infer<typeof updateRoomPricingSchema>;
