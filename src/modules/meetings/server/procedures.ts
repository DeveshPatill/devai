import { z } from "zod";
import { db } from "@/db";
import { meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
// import { agentsInsertSchema } from "../schemas";
import { and, count , desc, eq, getTableColumns,ilike } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { TRPCError } from "@trpc/server";
// import { agentsUpdateSchema } from "../schemas";


export const meetingsRouter = createTRPCRouter({
    // update: protectedProcedure
    //     .input(agentsUpdateSchema)
    //     .mutation(async ({ ctx, input }) => {
    //         const [updatedAgent] = await db
    //             .update(agents)
    //             .set(input)
    //             .where(
    //                 and(
    //                     eq(agents.id, input.id),
    //                     eq(agents.userId, ctx.auth.user.id),
    //                 )
    //             )
    //             .returning();

    //         if (!updatedAgent) {
    //             throw new TRPCError({
    //                 code: "NOT_FOUND",
    //                 message: "Agent not found",
    //             }); 
    //         }
    //         return updatedAgent;
    //     }),

    // remove: protectedProcedure
    //     .input(z.object({ id: z.string() }))
    //     .mutation(async ({ctx, input}) => {
    //         const [removedAgent] = await db
    //             .delete(agents)
    //             .where(
    //                 and(
    //                     eq(agents.id, input.id),
    //                     eq(agents.userId, ctx.auth.user.id),
    //                 )
    //             )
    //             .returning();

    //         if (!removedAgent) {
    //             throw new TRPCError({
    //                 code: "NOT_FOUND",
    //                 message: "Agent not found",
    //             });
    //         }
    //         return removedAgent;
    //     }),

    getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
        const [existingMeeting] = await db
            .select({
                // TODO: Change to actuall count
                ...getTableColumns(meetings),
                // meetingCount: sql<number>`5`,
            })
            .from(meetings)
            .where(
                and(
                    eq(meetings.id, input.id),
                    eq(meetings.userId, ctx.auth.user.id),
                )
            );

            if (!existingMeeting) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" });
            }
        
        //await new Promise((resolve) => setTimeout(resolve,5000));
        // throw new TRPCError({code: "BAD_REQUEST"});

        return existingMeeting;
    }),

    getMany: protectedProcedure
    .input(z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
            .number()
            .min(MIN_PAGE_SIZE)
            .max(MAX_PAGE_SIZE)
            .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish()
    })
    )
    .query(async ({ctx, input}) => {
        const { search,  page, pageSize } = input;



        const data = await db
        .select({
            // TODO: Change to actuall count
            ...getTableColumns(meetings),
            // meetingCount: sql<number>`5`,        
        })
        .from(meetings)
        .where(
            and(
                eq(meetings.userId, ctx.auth.user.id),
                search ? ilike(meetings.name, `%${search}%`) : undefined,
            )
        )
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize)
    
    const [total] = await db 
        .select({count: count() })
        .from(meetings)
        .where(
            and(
                eq(meetings.userId, ctx.auth.user.id),
                search ? ilike(meetings.name, `%${search}%`) : undefined,
            )
        );

        const totalPages = Math.ceil(total.count / pageSize);

        return {
            items: data,
            total: total.count,
            totalPages,
        };
    
  }),

}); // ----> once u un-comment other things remove this section

//     create: protectedProcedure
//         .input(agentsInsertSchema)
//         .mutation(async({ input, ctx }) => {
//             const [createdAgent] = await db
//                 .insert(agents)
//                 .values({
//                     ...input,
//                     userId: ctx.auth.user.id,
//                 })
//                 .returning();
//             return createdAgent;
//         }),
// });
