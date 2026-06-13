import { RequireAuth } from "@/components/auth/RequireAuth";
import { AdDetails } from "./AdDetails";

export default function AdDetailsPage() {
  return (
    <RequireAuth>
      <AdDetails />
    </RequireAuth>
  );
}
