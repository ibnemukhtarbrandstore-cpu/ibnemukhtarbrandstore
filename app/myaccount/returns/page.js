import ReturnHistory from "@/components/returns/ReturnHistory";

/**
 * Customer Returns Page
 * Shows return history and allows creating new return requests
 * 
 * Route: /myaccount/returns
 */

export const metadata = {
    title: "My Returns | Ibnemukhtar Brand Store",
    description: "View and manage your return requests",
};

export default function MyReturnsPage() {
    // Note: Get user email from session/context in real implementation
    // For now, using a placeholder
    const userEmail = "customer@example.com"; // TODO: Replace with actual user session

    return (
        <section className="container mx-auto px-4 py-8 max-w-4xl">
            <ReturnHistory userEmail={userEmail} />
        </section>
    );
}
