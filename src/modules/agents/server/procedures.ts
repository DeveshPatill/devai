import { z } from "zod";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../schemas";
// import { Input } from "@/components/ui/input";
import { eq, getTableColumns,sql } from "drizzle-orm";
// import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
    //TODO: Change 'getOne' to use 'ProtectedProcedure' 
    getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
        const [existingAgent] = await db
            .select({
                // TODO: Change to actuall count
                ...getTableColumns(agents),
                meetingCount: sql<number>`5`,
            })
            .from(agents)
            .where(eq(agents.id, input.id))
        
        //await new Promise((resolve) => setTimeout(resolve,5000));
        // throw new TRPCError({code: "BAD_REQUEST"});

        return existingAgent;
    }),

    getMany: protectedProcedure.query(async () => {
    return await db.select().from(agents);
  }),

    create: protectedProcedure
        .input(agentsInsertSchema)
        .mutation(async({ input, ctx }) => {
            const [createdAgent] = await db
                .insert(agents)
                .values({
                    ...input,
                    userId: ctx.auth.user.id,
                })
                .returning();
            return createdAgent;
        }),
});


