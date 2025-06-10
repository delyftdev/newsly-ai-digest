
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useCompanyStore } from "@/stores/companyStore";
import { useReleaseStore } from "@/stores/releaseStore";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardOverview from "@/components/DashboardOverview";

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { fetchCompany } = useCompanyStore();
  const { fetchReleases } = useReleaseStore();

  useEffect(() => {
    if (user) {
      fetchCompany();
      fetchReleases();
    }
  }, [user, fetchCompany, fetchReleases]);

  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  );
};

export default DashboardPage;
