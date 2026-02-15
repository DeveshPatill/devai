import { z } from "zod";
import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
// import { agentsInsertSchema } from "../schemas";
import { and, count , desc, eq, getTableColumns,ilike, sql } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { TRPCError } from "@trpc/server";
import { meetingsInsertSchema } from "../schemas";
import { meetingsUpdateSchema } from "../schemas";
import { duration } from "drizzle-orm/gel-core";
import { MeetingStatus } from "../types";


export const meetingsRouter = createTRPCRouter({
    update: protectedProcedure
        .input(meetingsUpdateSchema)
        .mutation(async ({ ctx, input }) => {
            const [updatedMeeting] = await db
                .update(meetings)
                .set(input)
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userId, ctx.auth.user.id),
                    )
                )
                .returning();

            if (!updatedMeeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Meeting not found",
                }); 
            }
            return updatedMeeting;
        }),

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

    create: protectedProcedure
            .input(meetingsInsertSchema)
            .mutation(async({ input, ctx }) => {
                const [createdMeeting] = await db
                    .insert(meetings)
                    .values({
                        ...input,
                        userId: ctx.auth.user.id,
                    })
                    .returning();

                    //TODO: CREATE STREAM CALL, upsert stream users




                return createdMeeting;
            }),

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
        search: z.string().nullish(),
        agentId: z.string().nullish(),
        status: z
            .enum([
                MeetingStatus.Upcoming,
                MeetingStatus.Active,
                MeetingStatus.Completed,
                MeetingStatus.Processing,
                MeetingStatus.Cancelled,
            ])
            .nullish(),
    })
    )
    .query(async ({ctx, input}) => {
        const { search,  page, pageSize, status, agentId } = input;



        const data = await db
        .select({
            ...getTableColumns(meetings),
            agent: agents,
            duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),        
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
            and(
                eq(meetings.userId, ctx.auth.user.id),
                search ? ilike(meetings.name, `%${search}%`) : undefined,
                status ? eq(meetings.status, status) : undefined,
                agentId ? eq(meetings.agentId, agentId) : undefined,
            )
        )
        .orderBy(desc(meetings.createdAt), desc(meetings.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize)
    
    const [total] = await db 
        .select({count: count() })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
            and(
                eq(meetings.userId, ctx.auth.user.id),
                search ? ilike(meetings.name, `%${search}%`) : undefined,
                status ? eq(meetings.status, status) : undefined,
                agentId ? eq(meetings.agentId, agentId) : undefined,
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
