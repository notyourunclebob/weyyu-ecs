"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryBase } from "@/tools/categoryBase.model";
import { sendJSONData } from "@/tools/Toolkit";

export default function EditCategory({ category }: { category: CategoryBase }) {
    const [formData, setFormData] = useState<CategoryBase>({
        ...category,
        name: category.name ?? "",
    });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState<string>("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setStatus("loading");
        setMessage("");
        try {
            const result = await sendJSONData(
                `/api/category/edit/${category._id}/`,
                { name: formData.name },
                "PUT"
            );

            if (!result) {
                setStatus("error");
                setMessage("No response from server");
                return;
            }

            if (result.status === 200) {
                setStatus("success");
                setMessage("Category updated successfully");
                await new Promise(resolve => setTimeout(resolve, 1000));
                router.push("/manageCategories")
            } else {
                setStatus("error");
                setMessage(`Server error (${result.status})`);
            }
        } catch (error: any) {
            setStatus("error");
            setMessage("An unexpected error occurred");
        }
    };

    return (
        <div>
            <div className="min-h-screen bg-yutaniGrey p-7">
                <div className="bg-black rounded-2xl p-8 min-h-[calc(100vh-130px)]">
                    <h2 className="text-yutaniGrey text-3xl font-light tracking-wider text-center mb-2">
                        Edit Category
                    </h2>
                    <div>
                        <div>
                            <label className="block text-yutaniGrey text-sm mb-2 font-light">Category Name</label>
                            <input
                                type="text"
                                name="name"
                                className="w-full px-4 py-3 bg-yutaniGrey rounded text-black focus:outline-none focus:ring-2 focus:ring-yutaniYellow"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        {message && (
                            <p className={`mt-3 text-sm font-light ${status === "success" ? "text-yutaniYellow" : "text-red-400"}`}>
                                {message}
                            </p>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={status === "loading"}
                            className="mt-6 w-full py-3 bg-yutaniYellow text-black font-light tracking-wider rounded hover:opacity-90 disabled:opacity-50 transition-opacity"
                        >
                            {status === "loading" ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}