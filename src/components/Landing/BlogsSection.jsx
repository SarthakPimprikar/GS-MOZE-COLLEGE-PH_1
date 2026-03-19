"use client";
import React, { useEffect, useState } from "react";
import { ArrowRight, Calendar, User, X, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BlogsSection = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Simple fade-in animation style
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up {
                animation: fadeInUp 0.6s ease-out forwards;
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch("/api/blogs?public=true");
                const data = await res.json();
                if (data.success) {
                    setBlogs(data.data);
                }
            } catch (error) {
                console.error("Failed to load blogs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    if (loading) return null;
    if (!blogs.length) return null;

    return (
        <section className="py-24 bg-gray-50/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-3 block">
                        Our Blog
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        Latest Insights & News
                    </h2>
                    <p className="text-gray-600 text-xl leading-relaxed">
                        Stay updated with the latest trends, expert tips, and announcements from our team.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {blogs.map((blog, index) => (
                        <Link
                            href={`/blogs/${blog._id}`}
                            key={blog._id}
                            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col h-full animate-fade-in-up opacity-0"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="relative h-64 overflow-hidden cursor-pointer">
                                {blog.image ? (
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                                        <Image className="w-16 h-16 text-blue-200" size={64} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0 text-white">
                                    <span className="text-sm font-medium backdrop-blur-md bg-white/20 px-3 py-1 rounded-full">
                                        Read Article
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 font-medium">
                                    <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(blog.createdAt).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    <span className="flex items-center gap-1.5 font-medium">
                                        <User className="w-3.5 h-3.5" />
                                        {blog.author}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors cursor-pointer">
                                    {blog.title}
                                </h3>

                                <p className="text-gray-600 mb-6 line-clamp-3 text-base leading-relaxed flex-1">
                                    {blog.description}
                                </p>

                                <div className="pt-6 border-t border-gray-50 flex items-center text-blue-600 font-bold group/btn cursor-pointer">
                                    Read Full Story
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-2 transition-transform duration-300" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogsSection;
