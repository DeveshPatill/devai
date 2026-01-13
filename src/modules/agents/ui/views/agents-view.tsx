"use client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
// import { ResponsiveDialog } from "@/components/responsive-dialog";
// import { Children } from "react";
// import { Button } from "@/components/ui/button";


export const AgentsView = () => {
    const trpc = useTRPC();
    const { data} = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    return(
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            {/* <ResponsiveDialog title="Responsive test" description="Responsive description" open onOpenChange={() => {}} >
                <Button>
                    Some Action
                </Button>
            </ResponsiveDialog> */}
            {/* {JSON.stringify(data, null, 2)} */}
            <DataTable data={data} columns={columns}/>
            {data.length === 0 && (
                <EmptyState title="Create your first agent" description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call. " />
            )}
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





