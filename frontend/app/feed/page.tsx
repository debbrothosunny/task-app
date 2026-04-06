"use client";

import React, { useEffect, useState, useCallback } from 'react';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer'; 

import PostForm from '@/components/feed/PostForm';
import PostCard from '@/components/feed/PostCard';

import Navbar from '@/components/feed/Navbar';
import LeftSidebar from '@/components/feed/LeftSidebar';
import RightSidebar from '@/components/feed/RightSidebar';
import Stories from '@/components/feed/Stories';
import MobileBottomNav from '@/components/feed/MobileBottomNav';

// Interfaces
interface User {
    id: number;
    first_name: string;
    last_name: string;
    avatar?: string;
}

interface Post {
    id: number;
    content: string;
    image?: string; 
    visibility: 'public' | 'private';
    created_at: string;
    user: User;
    likes_count: number;
    comments_count: number;
    is_liked: boolean;
    comments: any[]; 
    onCommentLike: (id: number, type: 'comment' | 'reply', postId: number) => void;
}

export default function FeedPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [likedUsers, setLikedUsers] = useState<User[]>([]);
    const [showLikeModal, setShowLikeModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [nextCursorUrl, setNextCursorUrl] = useState<string | null>(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [postSubmitting, setPostSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const router = useRouter();
    const { ref, inView } = useInView({ threshold: 0, rootMargin: '400px' });

    // Function to show toast notification
    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    // ================== FETCH POSTS ==================
    const fetchPosts = async (url = '/api/feed') => {
        if (loadingMore) return; 
        
        try {
            const isInitial = url === '/api/feed';
            if (isInitial) setInitialLoading(true);
            else setLoadingMore(true);

            // Extract only query parameters from full URL
            let requestUrl = url;
            if (url.includes('?cursor=')) {
                const urlObj = new URL(url);
                requestUrl = `/api/feed${urlObj.search}`; 
            }

            console.log("Fetching from:", requestUrl);

            const response = await axios.get(requestUrl);
            const newPosts = response.data.data; 
            const nextUrl = response.data.next_page_url;

            setPosts((prev) => {
                if (isInitial) return newPosts;
                // Filter duplicate IDs
                const existingIds = new Set(prev.map(p => p.id));
                const filtered = newPosts.filter(p => !existingIds.has(p.id));
                return [...prev, ...filtered]; 
            });

            setNextCursorUrl(nextUrl);
        } catch (error) {
            console.error("Pagination Error:", error);
        } finally {
            setInitialLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        if (inView) {
            console.log("LOG: Bottom reached, fetching more...");
            if (nextCursorUrl && !loadingMore) {
                fetchPosts(nextCursorUrl);
            }
        }
    }, [inView, nextCursorUrl, loadingMore]);

    // ================== LIKE HANDLER ==================

    const handleToggleLike = async (id: number, type: string, postId: number) => {
        try {
            const response = await axios.post(`/api/like/${id}/${type}`);
            
            if (type === 'post' || type === 'comment') {
                setPosts(prev => prev.map(post => {
                    if (post.id === postId) {
                        if (type === 'post' && post.id === id) {
                            return {
                                ...post,
                                is_liked: response.data.liked,
                                likes_count: response.data.likes_count
                            };
                        }
                        
                        if (type === 'comment') {
                            return {
                                ...post,
                                comments: post.comments?.map(comment => {
                                    if (comment.id === id) {
                                        return {
                                            ...comment,
                                            is_liked: response.data.liked,
                                            likes_count: response.data.likes_count
                                        };
                                    }
                                    return comment;
                                })
                            };
                        }
                    }
                    return post;
                }));
            }

        } catch (error) {
            console.error("Like failed:", error);
        }
    };

    // MEMOIZED: Handle post like callback
    const onLike = useCallback((id: number, type: 'post' | 'comment' | 'reply', postId: number) => {
        handleToggleLike(id, type, postId);
    }, [handleToggleLike]); 

    // MEMOIZED: Handle comment like callback
    const onCommentLike = useCallback((commentId: number, postId: number) => {
        handleToggleLike(commentId, 'comment', postId);
    }, []);

    // ================== OTHER HANDLERS ==================
    const handlePostSubmit = async (formData: FormData) => {
        setPostSubmitting(true); 
        
        try {
            const response = await axios.post('/api/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            // Add new post to the beginning of the list
            const createdPost = response.data;
            
            setPosts(prev => [createdPost, ...prev]);
            showToast("Post created successfully!", "success");
        } catch (error) {
            console.error("Post creation failed:", error);
            showToast("Error creating post", "error");
        } finally {
            setPostSubmitting(false); // Reset state after submission
        }
    };

    const handleCommentSubmit = async (
        postId: number, 
        parentId: number | null = null, 
        content: string
    ) => {
        if (!content?.trim()) return; // Empty check

        try {
            const response = await axios.post(`/api/posts/${postId}/comments`, { 
                content, 
                parent_id: parentId 
            });
            
            const newComment = {
                ...response.data.comment,
                replies: response.data.comment.replies || [] // Ensure replies array exists
            };
            const serverCount = response.data.latest_comments_count;

            setPosts(prevPosts => prevPosts.map(post => {
                if (post.id !== postId) return post;

                if (!parentId) {
                    return {
                        ...post,
                        comments_count: serverCount,
                        comments: [newComment, ...(post.comments || [])]
                    };
                }

                const updateReplies = (comments: any[]): any[] => {
                    return comments.map(comment => {
                        if (comment.id === parentId) {
                            return { 
                                ...comment, 
                                replies_count: (comment.replies_count || 0) + 1,
                                replies: [newComment, ...(comment.replies || [])]
                            };
                        }
                        if (comment.replies?.length > 0) {
                            return { ...comment, replies: updateReplies(comment.replies) };
                        }
                        return comment;
                    });
                };

                return {
                    ...post,
                    comments_count: serverCount,
                    comments: updateReplies(post.comments || [])
                };
            }));

            return newComment;

        } catch (error) {
            console.error(error);
            showToast("Could not post comment", "error"); // Error toast
        }
    };

    const openLikeModal = async (id: number, type: string) => {
        setShowLikeModal(true);
        setModalLoading(true);
        try {
            const res = await axios.get(`/api/likes/${id}/${type}/users`);
            setLikedUsers(res.data);
        } catch (error) { 
            console.error(error); 
        } finally { 
            setModalLoading(false); 
        }
    };

    const getImageUrl = (imagePath: string | null) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'}/storage/${imagePath}`;
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <div className="relative w-16 h-16 mb-6">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-violet-500 animate-spin opacity-80 blur-[2px]"></div>
                    <div className="absolute inset-2 bg-white rounded-full"></div>
                </div>
                <p className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-violet-700 bg-clip-text text-transparent animate-pulse">
                    Loading Social Feed...
                </p>
            </div>
        );
    }

    return (
        <div className="_layout _layout_main_wrapper">

            <Navbar />

            <div className="_main_layout">
                <div className="container _custom_container">
                    <div className="_layout_inner_wrap">
                        <div className="row">

                            <LeftSidebar />

                            {/* ================== MIDDLE FEED ================== */}
                            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                <div className="_layout_middle_wrap">
                                    <div className="_layout_middle_inner">

                                        <Stories />

                                        <div className="_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
                                            <PostForm 
                                                onPostSubmit={handlePostSubmit} 
                                                loading={loadingMore} 
                                                showToast={showToast}
                                            />
                                        </div>

                                        {posts.length > 0 ? (
                                            posts.map((post) => (
                                                <div key={post.id} className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
                                                    <PostCard 
                                                        post={post}
                                                        getImageUrl={getImageUrl}
                                                        onLike={onLike}
                                                        onCommentLike={onCommentLike}
                                                        onCommentSubmit={handleCommentSubmit}
                                                        openLikeModal={openLikeModal}
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 text-center py-20 text-gray-400">
                                                No posts yet. Be the first to share something!
                                            </div>
                                        )}

                                        {/* Infinite Loading Target */}
                                        <div 
                                            ref={ref} 
                                            className="w-full flex justify-center items-center" 
                                            style={{ minHeight: '50px', margin: '20px 0' }}
                                        >
                                            {loadingMore ? (
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                                    <p className="text-xs font-medium text-gray-500">Loading more posts...</p>
                                                </div>
                                            ) : (
                                                !nextCursorUrl && posts.length > 0 && <p className="text-gray-400 text-sm italic">You've reached the end of the feed.</p>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <RightSidebar />

                        </div>
                    </div>
                </div>
            </div>

            <MobileBottomNav />

            {/* ================== MODERN FLOATING TOAST ================== */}
            {toast && (
                <div className="fixed top-24 right-6 z-[200] animate-in fade-in slide-in-from-right-8 duration-500 ease-out">
                    <div className={`px-5 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-md flex items-start gap-4 border transition-all ${
                        toast.type === 'error' 
                            ? 'bg-red-50/95 border-red-100 text-red-900' 
                            : 'bg-emerald-50/95 border-emerald-100 text-emerald-900'
                    }`}>
                        <div className={`mt-0.5 flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                            toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                        }`}>
                            <span className="text-xl leading-none">{toast.type === 'error' ? '✕' : '✓'}</span>
                        </div>

                        <div className="flex flex-col gap-0.5 pr-4">
                            <span className={`text-sm font-black uppercase tracking-wider ${
                                toast.type === 'error' ? 'text-red-600' : 'text-emerald-600'
                            }`}>
                                {toast.type === 'error' ? 'Action Failed' : 'Success'}
                            </span>
                            <p className="text-[15px] font-medium leading-tight opacity-80">
                                {toast.message}
                            </p>
                        </div>

                        <div className={`absolute bottom-0 left-0 h-1 rounded-full ${
                            toast.type === 'error' ? 'bg-red-200' : 'bg-emerald-200'
                        }`} style={{ width: '100%' }}></div>
                    </div>
                </div>
            )}

            {/* Like Modal */}
            {showLikeModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">Liked by</h3>
                            <button 
                                onClick={() => setShowLikeModal(false)} 
                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {modalLoading ? (
                                <div className="py-12 flex justify-center">
                                    <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : likedUsers.length > 0 ? (
                                <div>
                                    {likedUsers.map((user) => (
                                        <div key={user.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                {user.first_name?.[0]?.toUpperCase() || user.last_name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 text-sm">
                                                    {user.first_name} {user.last_name}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <p className="text-gray-400 text-sm">No likes yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}