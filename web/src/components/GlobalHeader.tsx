export function GlobalHeader() {
    return (
        <header className="flex items-center gap-4 bg-[var(--coolgrey-600)] px-4 py-6 text-[var(--coolgrey-110)] sm:px-8">
            <a href="/" className="flex items-center gap-3">
                <img
                    src="/secretarAI_logo.png"
                    alt="secretarAI logo"
                    className="h-auto w-[50px] object-contain"
                />
                <h1
                    className="text-3xl font-semibold tracking-tight"
                    style={{ textShadow: "1px 1px 0 var(--coolgrey-700)" }}
                >
                    secretarAI
                </h1>
            </a>
        </header>
    );
}
