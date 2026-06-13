import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AddAdForm } from "@/components/forms/AddAdForm";

export const metadata = { title: "أضف إعلان | منصة الخليج للخدمات اللوجستية" };

export default function AddAdPage() {
  return (
    <>
      <PageHero
        title="أضف إعلانك"
        subtitle="انشر إعلان نقل أو تخليص أو بيع، وسيظهر مباشرة لآلاف المستخدمين."
        icon="megaphone"
      />
      <Container className="py-10">
        <div className="mx-auto max-w-2xl">
          <RequireAuth>
            <AddAdForm />
          </RequireAuth>
        </div>
      </Container>
    </>
  );
}
