import { Sidebar } from "./Sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex bg-money-pattern">
            <Sidebar />
            <main className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                    <div className="container mx-auto px-4 py-6 lg:px-6 lg:py-8 max-w-7xl">
                        <div className="relative">
                            {/* Background decoration */}
                            <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-gold opacity-10 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute top-1/2 -left-8 w-24 h-24 bg-gradient-primary opacity-10 rounded-full blur-2xl pointer-events-none" />
                            
                            {/* Content */}
                            <div className="relative z-10">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
