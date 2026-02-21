import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import { CallView } from "@/modules/call/ui/views/call-view";
import page from "@/app/(dashboard)/meetings/page";

interface Props {
  params: Promise<{
    meetingId: string;
  }>;
};

export const Page = async ({ params }: Props) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { meetingId } = await params;
  const queryClient = getQueryClient();

    void queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
    );

    return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <CallView meetingId={meetingId}/>
    </HydrationBoundary>
    );
};

export default Page;