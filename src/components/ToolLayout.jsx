export default function ToolLayout({ title, children }) {
  return (
    <section className="flex-1 bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-4xl">
        <header className="mb-6 text-center sm:mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">FileFixer tools</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
        </header>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-8">
          {children}
        </div>
      </div>
    </section>
  );
}
