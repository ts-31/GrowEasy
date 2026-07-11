import UploadCard from "@/components/upload/UploadCard";

export default function Home() {
  return (
    <div className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
      {/* Hero */}
      <div className="text-center mb-10 w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Import your data seamlessly
        </h1>
        <p className="text-lg text-muted-foreground">
          Upload your CSV files to quickly process, validate, and import your
          data into GrowEasy.
        </p>
      </div>

      {/* Upload + Preview panel — expands to full container width when preview loads */}
      <div className="w-full max-w-5xl">
        <UploadCard />
      </div>
    </div>
  );
}
