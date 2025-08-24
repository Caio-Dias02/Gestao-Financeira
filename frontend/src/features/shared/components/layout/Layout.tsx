import { TopBar } from "./TopBar";

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <TopBar />
            <main className="flex-1 p-6 bg-gray-50">{children}</main>
        </div>
    );
}
