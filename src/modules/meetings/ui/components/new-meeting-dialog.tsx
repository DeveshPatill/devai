import { ResponsiveDialog } from "@/components/responsive-dialog";
// import { Props } from "recharts/types/container/Surface";
// import { AgentForm } from "./agent-form";
import { MeetingForm } from "./meeting-form"; 
import { useRouter } from "next/navigation";


interface NewMeetingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export const NewMeetingDialog = ({
    open,
    onOpenChange,
}:NewMeetingDialogProps) => {
    const router = useRouter();


    return (
        <ResponsiveDialog
            title="New Meeting"
            description="Create a new Meeting"
            open={open}
            onOpenChange={onOpenChange}
        >
          {/* <AgentForm 
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}

          />  */}
          <MeetingForm
          onSuccess={(id) => {
            onOpenChange(false);
            router.push(`/meetings/${id}`);
          }}
          onCancel={() => onOpenChange}
          />
        </ResponsiveDialog>
    )

}