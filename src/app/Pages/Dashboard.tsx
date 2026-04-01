import { OrganizationDashboard } from "../components/OrganizationDashboard";
import { IndividualDashboard } from "../components/IndividualDashboard";

export default function Dashboard() {
  const userType = localStorage.getItem("userType") || "individual";
  return (
    <div>
      {userType === "individual" ? (
        <IndividualDashboard />
      ) : (
        <OrganizationDashboard />
      )}
    </div>
  );
}
