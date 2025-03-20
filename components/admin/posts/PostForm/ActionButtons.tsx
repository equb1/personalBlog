// components/admin/posts/PostForm/ActionButtons.tsx
'use client';

import { Button } from '@/components/ui/Button';

interface ActionButtonsProps {
  isSubmitting: boolean;
  hasTitle: boolean;
  onSaveDraft: () => void;
  onSubmitReview: () => void;
  onPublish: () => void;
  isEditMode?: boolean;
}

export const ActionButtons = ({
  isSubmitting,
  hasTitle,
  onSaveDraft,
  onSubmitReview,
  onPublish,
  isEditMode = false
}: ActionButtonsProps) => (
  <div className="flex gap-4">
    <Button
      onClick={onSaveDraft}
      disabled={isSubmitting || !hasTitle}
      variant="outline"
    >
      {isSubmitting ? '保存中...' : '保存草稿'}
    </Button>

    {!isEditMode && (
      <Button
        onClick={onSubmitReview}
        disabled={isSubmitting || !hasTitle}
        variant="secondary"
      >
        {isSubmitting ? '提交中...' : '提交审核'}
      </Button>
    )}

    <Button
      onClick={onPublish}
      disabled={isSubmitting || !hasTitle}
    >
      {isSubmitting ? '发布中...' : '立即发布'}
    </Button>
  </div>
);