import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center">
      <p className="eyebrow text-brass-dark">404</p>
      <h1 className="mt-5 font-serif text-5xl">This piece has moved on.</h1>
      <p className="mt-4 text-sm text-stone">The page you were looking for isn&apos;t part of the current collection.</p>
      <Link href="/" className="btn-primary mt-10">
        Return to the collection
      </Link>
    </section>
  );
}
