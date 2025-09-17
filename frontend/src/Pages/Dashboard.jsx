import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { SuperAdminHome } from "./SuperAdminHome";
import { AdminHome } from "./AdminHome";
import { ResellerHome } from "./ResellerHome";
import { KurirHome } from "./KurirHome";
import Navigation from "../Components/Navigation";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  if (!user) return null; 

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <div className="flex-1 p-6">
        {/* Konten dashboard per role */}
        {(() => {
          switch (user.role) {
            case "ADMIN":
              return <AdminHome />;
            case "SUPERADMIN":
              return <SuperAdminHome />;
            case "RESELLER":
              return <ResellerHome />;
            case "KURIR":
              return <KurirHome />;
            default:
              return <div>Akses ditolak</div>;
          }
        })()}
      </div>
    </div>
  );
}
