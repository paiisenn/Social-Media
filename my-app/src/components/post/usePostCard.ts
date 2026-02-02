"use client";

import { useState, useRef, useEffect } from "react";
import { postAPI } from "@/services/post.service";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { PostCardProps, Comment } from "./PostCard.types";

export function usePostCard(props: PostCardProps) {
    const { id, initialIsLiked, initialLikes, reactionType: initialReactionType, content, onDelete, onEdit, onReport } = props as any;
    const { toast } = useToast();
    const { isAuthenticated } = useAuth();

    // Reaction state
    const [currentReaction, setCurrentReaction] = useState<string | null>(
        initialReactionType || (initialIsLiked ? "LIKE" : null)
    );
    const [likeCount, setLikeCount] = useState(initialLikes || props.likes);
    const [isReacting, setIsReacting] = useState(false);

    // General state
    const [isSaved, setIsSaved] = useState(false);
    const [commentCount, setCommentCount] = useState(props.comments);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(content);
    const [isHidden, setIsHidden] = useState(false);
    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const [isDeletingPost, setIsDeletingPost] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    // Auth modal state
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalFeature, setAuthModalFeature] = useState("");

    // Modals state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState("spam");

    // Comment states
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [commentsList, setCommentsList] = useState<Comment[]>([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [commentSortOrder, setCommentSortOrder] = useState<"newest" | "oldest">("newest");

    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsSaved(postAPI.isPostSaved(id));
        const localReaction = postAPI.getLocalReaction(id);
        if (localReaction) {
            setCurrentReaction(localReaction === "NONE" ? null : localReaction);
        }
    }, [id]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (showComments && commentsList.length === 0 && commentCount > 0) {
            const fetchComments = async () => {
                setIsLoadingComments(true);
                try {
                    const response = await postAPI.getComments(id);
                    const data = Array.isArray(response) ? response : (response as any).data || [];

                    const mappedComments = data.map((c: any) => ({
                        id: c.id,
                        author: {
                            id: c.author?.id,
                            name: c.author?.name || "Người dùng",
                            avatar: c.author?.avatarUrl || "/userAvatar.png"
                        },
                        content: c.content,
                        createdAt: c.createdAt,
                        timestamp: new Date(c.createdAt).toLocaleString("vi-VN"),
                        likes: c._count?.reactions || 0,
                        reactionType: c.reactions?.[0]?.type || null,
                        isLiked: !!c.reactions?.[0]
                    }));
                    setCommentsList(mappedComments);
                } catch (error) {
                    console.error("Error fetching comments:", error);
                } finally {
                    setIsLoadingComments(false);
                }
            };
            fetchComments();
        }
    }, [showComments, id, commentCount, commentsList.length]);

    const sortedComments = [...commentsList].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return commentSortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    const handleReaction = async (type: string = "LIKE") => {
        if (!isAuthenticated) {
            setAuthModalFeature("bày tỏ cảm xúc");
            setShowAuthModal(true);
            return;
        }

        if (isReacting) return;
        setIsReacting(true);

        const previousReaction = currentReaction;
        const isRemove = previousReaction === type;
        const newReaction = isRemove ? null : type;

        try {
            setCurrentReaction(newReaction);
            if (isRemove) {
                setLikeCount((prev: number) => Math.max(0, prev - 1));
            } else if (!previousReaction) {
                setLikeCount((prev: number) => prev + 1);
            }
            await postAPI.toggleReaction(id, isRemove ? type : newReaction!);
            postAPI.setLocalReaction(id, newReaction);
        } catch (error) {
            setCurrentReaction(previousReaction);
            if (isRemove) {
                setLikeCount((prev: number) => prev + 1);
            } else if (!previousReaction) {
                setLikeCount((prev: number) => Math.max(0, prev - 1));
            }
            console.error("Error reacting to post:", error);
            toast("Có lỗi xảy ra. Vui lòng thử lại.", "error");
        } finally {
            setIsReacting(false);
        }
    };

    const handleSave = async () => {
        if (!isAuthenticated) {
            setAuthModalFeature("lưu bài viết");
            setShowAuthModal(true);
            return;
        }

        try {
            const newSavedState = await postAPI.toggleSavePost(id);
            setIsSaved(newSavedState);
            toast(newSavedState ? "Đã lưu bài viết" : "Đã bỏ lưu bài viết", "success");
        } catch (error) {
            toast("Có lỗi xảy ra khi lưu bài viết", "error");
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedContent(content);
        setIsMenuOpen(false);
    };

    const handleSaveEdit = async () => {
        if (onEdit) {
            setIsSavingEdit(true);
            try {
                await onEdit(editedContent);
                setIsEditing(false);
            } catch (error) {
                console.error("Failed to save edit:", error);
            } finally {
                setIsSavingEdit(false);
            }
        } else {
            setIsEditing(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedContent(content);
    };

    const handleHidePost = () => {
        if (!isAuthenticated) {
            setAuthModalFeature("ẩn bài viết");
            setShowAuthModal(true);
            return;
        }
        setIsHidden(true);
        setIsMenuOpen(false);
    };

    const handleUndoHide = () => {
        setIsHidden(false);
    };

    const handleReportClick = () => {
        if (!isAuthenticated) {
            setAuthModalFeature("báo cáo bài viết");
            setShowAuthModal(true);
            return;
        }
        setIsMenuOpen(false);
        setShowReportModal(true);
    };

    const confirmReport = () => {
        onReport?.();
        setShowReportModal(false);
        toast("Đã gửi báo cáo vi phạm thành công! Chúng tôi sẽ xem xét lại bài viết này.", "success");
    };

    const handleDeleteClick = () => {
        setIsMenuOpen(false);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (onDelete) {
            setIsDeletingPost(true);
            try {
                await onDelete();
                setShowDeleteModal(false);
            } catch (error) {
                console.error("Failed to delete post:", error);
            } finally {
                setIsDeletingPost(false);
            }
        } else {
            setShowDeleteModal(false);
        }
    };

    const handleSubmitComment = async () => {
        if (!isAuthenticated) {
            setAuthModalFeature("bình luận trên bài viết");
            setShowAuthModal(true);
            return;
        }
        if (!commentText.trim() || isSubmittingComment) return;

        setIsSubmittingComment(true);
        try {
            const response = await postAPI.addComment(id, commentText);
            const newComment: Comment = {
                id: response?.id || Date.now().toString(),
                author: { name: "Bạn", avatar: "/userAvatar.png" },
                content: commentText,
                createdAt: new Date().toISOString(),
                timestamp: "Vừa xong",
                likes: 0,
                isLiked: false,
                reactionType: null
            };

            setCommentsList((prev) => [newComment, ...prev]);
            setCommentCount((prev) => prev + 1);
            setCommentText("");
            toast("Bình luận thành công!", "success");
        } catch (error) {
            console.error("Error adding comment:", error);
            toast("Không thể thêm bình luận. Vui lòng thử lại.", "error");
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleShare = () => {
        if (!isAuthenticated) {
            setAuthModalFeature("chia sẻ bài viết");
            setShowAuthModal(true);
            return;
        }
        // Implement share logic here
        toast("Tính năng chia sẻ đang được phát triển", "info");
    };

    return {
        state: {
            currentReaction,
            likeCount,
            isSaved,
            commentCount,
            isMenuOpen,
            isEditing,
            editedContent,
            isHidden,
            isSavingEdit,
            isDeletingPost,
            isSubmittingComment,
            showAuthModal,
            authModalFeature,
            showDeleteModal,
            showReportModal,
            reportReason,
            showComments,
            commentText,
            commentsList,
            isLoadingComments,
            commentSortOrder,
            sortedComments
        },
        actions: {
            setCurrentReaction,
            setLikeCount,
            setIsSaved,
            setCommentCount,
            setIsMenuOpen,
            setIsEditing,
            setEditedContent,
            setIsHidden,
            setShowAuthModal,
            setShowDeleteModal,
            setShowReportModal,
            setReportReason,
            setShowComments,
            setCommentText,
            setCommentSortOrder,
            handleReaction,
            handleSave,
            handleEditClick,
            handleSaveEdit,
            handleCancelEdit,
            handleHidePost,
            handleUndoHide,
            handleReportClick,
            confirmReport,
            handleDeleteClick,
            confirmDelete,
            handleSubmitComment,
            handleShare
        },
        refs: {
            menuRef
        }
    };
}
