"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, User, ArrowLeft, Clock, Share2 } from "lucide-react";
import Image from "next/image";

const BlogDetailPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        if (id) {
            const fetchBlog = async () => {
                try {
                    const res = await fetch(`/api/blogs/${id}`);
                    const data = await res.json();
                    if (data.success) {
                        setBlog(data.data);
                    }
                } catch (error) {
                    console.error("Failed to load blog", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchBlog();
        }
    }, [id]);

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${totalScroll / windowHeight}`;
            setScrollProgress(Number(scroll));
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h2>
                <button
                    onClick={() => router.back()}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                >
                    <ArrowLeft size={20} /> Go Back
                </button>
            </div>
        );
    }

    return (
        <article className="min-h-screen bg-white relative">
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 h-1 bg-blue-600 z-50 transition-all duration-150 ease-out" style={{ width: `${scrollProgress * 100}%` }} />

            {/* Hero Header */}
            <div className="relative h-[60vh] min-h-[400px] w-full bg-gray-900 group">
                {blog.image ? (
                    <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover opacity-80 fixed-bg-effect"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 to-indigo-900 opacity-90" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white/5" />

                {/* Navigation & Header Content */}
                <div className="absolute inset-0 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-8 sm:py-12">
                    {/* Top Nav */}
                    <div className="flex justify-between items-start text-white/90">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md transition-all group-hover:bg-blue-600/20 border border-white/10"
                        >
                            <ArrowLeft size={18} />
                            <span className="font-medium">Back</span>
                        </button>
                    </div>

                    {/* Title Area */}
                    <div className="max-w-4xl mx-auto w-full text-center text-white mb-8 sm:mb-12 animate-fade-in-up">
                        <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium mb-6 text-white/90">
                            <span className="bg-blue-600 px-4 py-1.5 rounded-full shadow-lg shadow-blue-900/20">
                                Latest Insight
                            </span>
                            <span className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
                                <Calendar className="w-4 h-4" />
                                {new Date(blog.createdAt).toLocaleDateString(undefined, {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </span>
                            <span className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-sm">
                                <Clock className="w-4 h-4" />
                                5 min read
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6 drop-shadow-2xl">
                            {blog.title}
                        </h1>

                        <div className="flex items-center justify-center gap-4 text-white/80">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-2 border-white/20 text-lg font-bold uppercase shadow-lg text-white">
                                {blog.author?.charAt(0) || "A"}
                            </div>
                            <div className="text-left">
                                <p className="text-xs uppercase tracking-widest opacity-80 font-semibold">Written by</p>
                                <p className="font-bold text-white text-lg leading-none">{blog.author}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
                {/* Author/Meta Bar Mobile (Optional fallback if header is too busy, but we kept header clean) */}

                <div className="prose prose-lg prose-blue max-w-none text-gray-800 leading-relaxed font-sans">
                    {/* Introduction / Description as Lead Paragraph */}
                    {blog.description && (
                        <p className="text-xl sm:text-2xl text-gray-600 font-medium leading-relaxed mb-12 border-l-4 border-blue-500 pl-6 italic bg-gray-50 py-4 pr-4 rounded-r-xl">
                            {blog.description}
                        </p>
                    )}

                    {/* Body Content */}
                    <div className="drop-cap-container">
                        {blog.content.split('\n').map((paragraph, index) => (
                            paragraph.trim() && (
                                <p key={index} className={`mb-6 text-lg leading-8 text-gray-800 ${index === 0 ? "first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-blue-600" : ""}`}>
                                    {paragraph}
                                </p>
                            )
                        ))}
                    </div>
                </div>

                {/* Footer / Share */}
                <div className="mt-20 pt-10 border-t border-gray-100">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gray-50 p-8 rounded-2xl">
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg mb-2">Enjoyed this article?</h3>
                            <p className="text-gray-600 text-sm">Share it with your network and help others learn.</p>
                        </div>
                        <div className="flex gap-3">
                            {['Twitter', 'Facebook', 'LinkedIn'].map(platform => (
                                <button key={platform} className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all text-sm font-semibold shadow-sm hover:shadow-md">
                                    {platform}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="text-gray-400 hover:text-blue-600 font-medium transition-colors flex items-center gap-2 mx-auto"
                        >
                            <ArrowLeft className="w-4 h-4 rotate-90" /> Back to Top
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default BlogDetailPage;
