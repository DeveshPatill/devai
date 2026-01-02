"use client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
// import { ResponsiveDialog } from "@/components/responsive-dialog";
// import { Children } from "react";
// import { Button } from "@/components/ui/button";

export const AgentsView = () => {
    const trpc = useTRPC();
    const { data} = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    return(
        <div>
            {/* <ResponsiveDialog title="Responsive test" description="Responsive description" open onOpenChange={() => {}} >
                <Button>
                    Some Action
                </Button>
            </ResponsiveDialog> */}
            {JSON.stringify(data, null, 2)}
        </div>
    );
};

export const AgentsViewLoading = () => {
    return(
        <LoadingState title="Loading Agents" description="This may take a few seconds"/>
    );
};

export const AgentsViewError = () => {
    return(
        <ErrorState title="Error Loading Agents" description="Please try again later" />
    );
};





