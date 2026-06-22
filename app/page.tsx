import MainLayout from "@/components/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <div className="border-b border-border ">
        <div className="p-4">
          <h1 className="text-xl font-bold">Home</h1>
        </div>
      </div>

      {/* twitter composer  */}

      {/* twitter feed */}

      <div className="divide-y divide-border">
        <div className="p-8 text-center text-muted-foreground">
          <p>No tweets yet. Be the first to tweet!</p>
        </div>
      </div>
    </MainLayout>
  );
}
