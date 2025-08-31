import { Sidebar } from "./Sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex bg-gray-50">
            <Sidebar />
            <main className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                    <div className="container mx-auto px-4 py-6 lg:px-6 lg:py-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
