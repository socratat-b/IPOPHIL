import type { Metadata } from "next"
import { Separator } from "@/components/ui/separator";
import { DisplayForm } from "@/components/custom/settings/display-form";

export const metadata: Metadata = {
    title: "DMS | Notifications",
    description: "User Notifications",
};

export default function Page() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Display</h3>
                <p className="text-sm text-muted-foreground">
                    Turn items on or off to control what&apos;s displayed in the app.
                </p>
            </div>
            <Separator />
            <DisplayForm />
        </div>
    )
}