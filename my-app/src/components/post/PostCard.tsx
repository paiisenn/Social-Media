"use client";

import { EyeOff, Undo2 } from "lucide-react";
import { usePostCard } from "./usePostCard";
import { PostCardProps } from "./PostCard.types";
import { PostCardHeader } from "./PostCardComponents/PostCardHeader";
import { PostCardContent } from "./PostCardComponents/PostCardContent";
import { PostCardActions } from "./PostCardComponents/PostCardActions";
import { PostCardComments } from "./PostCardComponents/PostCardComments";
import { PostCardModals } from "./PostCardComponents/PostCardModals";

// Helper function to generate username from name
function generateUsername(name: string): string {
  return "@" + name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

export function PostCard(props: PostCardProps) {
  const { state, actions, refs } = usePostCard(props);

  const username = props.author.username || generateUsername(props.author.name);

  if (state.isHidden) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between animate-in fade-in duration-300">
        <div className="flex items-center gap-3 text-gray-500">
          <EyeOff size={20} />
          <span className="font-medium">Bài viết đã bị ẩn</span>
        </div>
        <button
          onClick={actions.handleUndoHide}
          className="flex items-center cursor-pointer gap-2 px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
        >
          <Undo2 size={16} />
          Hoàn tác
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PostCardHeader
          author={props.author}
          timestamp={props.timestamp}
          username={username}
          isOwner={!!props.isOwner}
          isMenuOpen={state.isMenuOpen}
          onMenuToggle={() => actions.setIsMenuOpen(!state.isMenuOpen)}
          onEdit={actions.handleEditClick}
          onDelete={actions.handleDeleteClick}
          onHide={actions.handleHidePost}
          onReport={actions.handleReportClick}
          menuRef={refs.menuRef}
        />

        <PostCardContent
          content={props.content}
          image={props.image}
          video={props.video}
          isEditing={state.isEditing}
          editedContent={state.editedContent}
          isSavingEdit={state.isSavingEdit}
          onEditedContentChange={actions.setEditedContent}
          onCancelEdit={actions.handleCancelEdit}
          onSaveEdit={actions.handleSaveEdit}
          highlight={props.highlight}
        />

        <PostCardActions
          currentReaction={state.currentReaction}
          likeCount={state.likeCount}
          commentCount={state.commentCount}
          shareCount={props.shares}
          isSaved={state.isSaved}
          showComments={state.showComments}
          onReaction={actions.handleReaction}
          onCommentToggle={() => actions.setShowComments(!state.showComments)}
          onShare={actions.handleShare}
          onSave={actions.handleSave}
        />

        {state.showComments && (
          <PostCardComments
            commentsList={state.commentsList}
            commentText={state.commentText}
            isSubmittingComment={state.isSubmittingComment}
            isLoadingComments={state.isLoadingComments}
            commentSortOrder={state.commentSortOrder}
            onCommentTextChange={actions.setCommentText}
            onSubmitComment={actions.handleSubmitComment}
            onSortToggle={() => actions.setCommentSortOrder(state.commentSortOrder === "newest" ? "oldest" : "newest")}
            onCommentReaction={(id, type) => {
              // Handle comment reaction
            }}
          />
        )}
      </div>

      <PostCardModals
        showAuthModal={state.showAuthModal}
        authModalFeature={state.authModalFeature}
        showDeleteModal={state.showDeleteModal}
        isDeletingPost={state.isDeletingPost}
        showReportModal={state.showReportModal}
        reportReason={state.reportReason}
        onAuthModalClose={() => actions.setShowAuthModal(false)}
        onDeleteModalClose={() => actions.setShowDeleteModal(false)}
        onConfirmDelete={actions.confirmDelete}
        onReportModalClose={() => actions.setShowReportModal(false)}
        onReportReasonChange={actions.setReportReason}
        onConfirmReport={actions.confirmReport}
      />
    </>
  );
}
