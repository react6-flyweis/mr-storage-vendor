import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="px-6 py-10 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" />
      <div className="relative w-full max-w-2xl bg-white rounded p-8 md:p-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F0FF] text-[#155DFC] text-3xl font-semibold">
          404
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#051321]">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm md:text-base leading-6 text-[#5D6772]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-[#155DFC] px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0f4ad0]"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
