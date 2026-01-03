import { z } from "zod";

export const createReviewSchema = z.object({
  userId:z.string(),
  roomId: z.string("you must enter the room id"),
  rating: z.number("it should be number").min(1).max(5),
  comment: z.string("you must give the comment").optional(),
});

export const updateReviewSchema = z.object({
    status: z.enum(["APPROVED", "PENDING"]).optional(),
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
});

export type createReviewDTO = z.infer<typeof createReviewSchema>
export type updateReviewDTO = z.infer<typeof updateReviewSchema>