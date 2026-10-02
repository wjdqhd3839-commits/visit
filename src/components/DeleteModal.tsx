import React, { useState } from 'react';
import { Trash2, X, Lock, AlertCircle } from 'lucide-react';
import { GuestbookMessage } from '../types/guestbook';

interface DeleteModalProps {
  message: GuestbookMessage | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (messageId: string) => Promise<void>;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  message,
  isOpen,
  onClose,
  onConfirmDelete,
}) => {
  const [inputPassword, setInputPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !message) return null;

  const hasPassword = Boolean(message.password);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (hasPassword) {
      if (inputPassword.trim() !== message.password) {
        setError('비밀번호가 일치하지 않습니다.');
        return;
      }
    }

    try {
      setIsDeleting(true);
      await onConfirmDelete(message.id);
      setInputPassword('');
      onClose();
    } catch (err: any) {
      setError(err.message || '삭제 중 문제가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">메시지 삭제</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message preview snippet */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4 text-xs">
          <p className="font-bold text-slate-700 mb-0.5">{message.nickname}</p>
          <p className="text-slate-600 line-clamp-2">{message.content}</p>
        </div>

        <form onSubmit={handleDelete} className="space-y-4">
          {hasPassword ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                작성 시 설정한 비밀번호를 입력해주세요
              </label>
              <input
                type="password"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                placeholder="비밀번호 입력"
                required
                autoFocus
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
              />
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              비밀번호 없이 작성된 방명록입니다. 이 메시지를 정말 삭제하시겠습니까?
            </p>
          )}

          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isDeleting || (hasPassword && !inputPassword.trim())}
              className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isDeleting ? '삭제 중...' : '삭제하기'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
