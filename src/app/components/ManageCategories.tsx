"use client";

import { FaPlus } from "react-icons/fa6";
import { CategoryBase } from '@/tools/categoryBase.model';
import { useState, useEffect, useRef } from "react";
import { sendJSONData } from "@/tools/Toolkit";

export default function ManageCategories({ categories }: { categories: { categories: CategoryBase[] } }) {
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!value.trim()) return;
        const result = await sendJSONData("/api/category/create", { name: value.trim() }, "POST")
        if (result?.status === 200) {
            setValue("");
            setIsOpen(false);
        }
    }

    return (
        <div>
            <div className="min-h-screen bg-yutaniGrey p-7">
                <div className="bg-black rounded-2xl p-8 min-h-[calc(100vh-130px)]">
                    <h2 className="text-yutaniGrey text-3xl font-light tracking-wider text-center mb-2">
                        Manage Categories
                    </h2>
                    <div className="flex flex-col">
                        <div className="relative m-4">
                            {/* Trigger */}
                            <div
                                className="text-yutaniGrey text-xl font-light tracking-wider flex flex-row cursor-pointer select-none"
                                onClick={() => setIsOpen((prev) => !prev)}
                            >
                                <div className="flex items-center pr-2">
                                    <FaPlus
                                        className={`transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                                    />
                                </div>
                                Add Category
                            </div>

                            {/* Dropdown */}
                            {isOpen && (
                                <form
                                    onSubmit={handleSubmit}
                                    className="absolute left-0 mt-2 bg-yutaniGrey border border-gray-200 rounded-lg shadow-lg p-3 z-10 flex gap-2 text-center"
                                >
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                        placeholder="Category name..."
                                        className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-black text-white text-sm px-3 py-1 rounded hover:bg-gray-800 transition-colors"
                                    >
                                        Add
                                    </button>
                                </form>
                            )}
                        </div>
                        <div className="bg-yutaniGrey rounded w-full">
                            {categories.categories.filter((category: CategoryBase) => category.allowChange === false).map((category: CategoryBase) => (
                                <div key={category._id}>
                                    {category.name}
                                </div>
                            ))}
                            {categories.categories.filter((category: CategoryBase) => category.allowChange === true).map((category: CategoryBase) => (
                                <div key={category._id}>
                                    {category.name}
                                </div>
                            ))}
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}