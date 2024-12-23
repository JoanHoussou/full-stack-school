import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de Bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Élèves</h2>
          <p>Gérez les informations des élèves</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Enseignants</h2>
          <p>Gérez les informations des enseignants</p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Parents</h2>
          <p>Gérez les informations des parents</p>
        </Card>
      </div>
    </div>
  );
}
