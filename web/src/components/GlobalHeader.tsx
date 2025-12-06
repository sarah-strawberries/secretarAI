export function GlobalHeader() {
    return (
        <header className="global-header">
            <a href="/" className="flex items-center gap-3">
                <img
                    src="/secretarAI_logo.png"
                    alt="secretarAI logo"
                    className="h-auto w-[50px] object-contain"
                />
                <h1 className="global-header-text">
                    secretarAI
                </h1>
            </a>
        </header>
    );
}
