"use client";
import { useEffect, useState } from "react";

export function useNotificationCount() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await fetch("/api/admin/notifications/count", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token })
                });

                if (res.ok) {
                    const data = await res.json();
                    setCount(data.count || 0);
                }
            } catch (error) {
                console.error("Failed to fetch notification count:", error);
            }
        };

        fetchCount();
        const interval = setInterval(fetchCount, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    return count;
}
