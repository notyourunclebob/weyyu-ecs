"use client";

import { FaPencilAlt } from "react-icons/fa";
import { FaPlus, FaTrashCan } from "react-icons/fa6";
import { CategoryBase } from '@/tools/categoryBase.model';
import { useState, useEffect, useRef } from "react";
import { sendJSONData } from "@/tools/Toolkit";
import { useRouter } from "next/navigation"
import Link from "next/link";

export default function ManageCategories({ categories }: { categories: { categories: CategoryBase[] } }) {
    const [isOpen, setIsOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [value, setValue] = useState("");
    const [categoryList, setCategoryList] = useState(categories.categories)
    const inputRef = useRef<HTMLInputElement>(null);

    const router = useRouter();


    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!value.trim()) return;
        const result = await sendJSONData("/api/category/create", { name: value.trim() }, "POST")
        if (result?.status === 200) {
            const newCategory: CategoryBase = {
                _id: result.data.result.insertedId,
                name: value.trim(),
                allowChange: true,
            };
            setCategoryList((prev) => [...prev, newCategory]);
            setValue("");
            setIsOpen(false);
        }
    }

    async function handleDelete(id: string) {
        const result = await sendJSONData("/api/category/delete", { _id: id }, "DELETE");
        if (result?.status === 200) {
            setCategoryList((prev) => prev.filter((category) => category._id !== id));
            setPendingDeleteId(null);
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
                            {categoryList.filter((category: CategoryBase) => category.allowChange === false).map((category: CategoryBase) => (
                                <div key={category._id} className="py-1 pl-2">
                                    {category.name}
                                </div>
                            ))}
                            {categoryList.filter((category: CategoryBase) => category.allowChange === true).map((category: CategoryBase) => (
                                <div key={category._id} className="flex py-1 pl-2">
                                    {category.name}
                                    <div className="flex flex-row ">
                                        <div className="px-2">
                                            <Link href={`/editCategory/${category._id}`}>
                                                <FaPencilAlt />
                                            </Link>
                                        </div>
                                        {pendingDeleteId === category._id ? (
                                            <div className="flex gap-2 items-center">
                                                <span className="text-sm text-gray-500">Delete?</span>
                                                <button
                                                    onClick={() => handleDelete(category._id)}
                                                    className="text-red-500 text-sm hover:text-red-700"
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    onClick={() => setPendingDeleteId(null)}
                                                    className="text-gray-500 text-sm hover:text-gray-700"
                                                >
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <div onClick={() => setPendingDeleteId(category._id)} className="cursor-pointer">
                                                <FaTrashCan />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div >
                            <button onClick={() => router.push('/dashboard')} className="px-12 py-3 mt-2 bg-gray-300 border-2 border-gray-300 text-black font-light rounded hover:bg-gray-400 transition">Back</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}