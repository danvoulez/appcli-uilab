'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Send, ChevronRight, AlertTriangle,
  Plus, X, Camera, FileImage, FileVideo, FileMusic,
  FileText, File as GenericFile, Archive, FileQuestion,
} from 'lucide-react';
import type { PlaceDetail, AttachedFile, FileKind } from '@/lib/types';
import { commandClient } from '@/lib/command-client';
import { FilePreviewSheet } from './FilePreviewSheet';

// ─── File utilities ──────────────────────────────────────────────────────────

function getFileKind(mimeType: string): FileKind {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.startsWith('text/') || mimeType === 'application/json') return 'text';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (/\/(zip|x-zip|x-tar|gzip|x-gzip|x-bzip2|x-rar|x-7z-compressed)/.test(mimeType)) return 'archive';
  if (/\/(msword|vnd\.openxmlformats|vnd\.ms-excel|vnd\.ms-powerpoint|vnd\.oasis)/.test(mimeType)) return 'document';
  return 'unknown';
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function FileKindIcon({
  kind,
  size = 14,
  className = '',
}: {
  kind: FileKind;
  size?: number;
  className?: string;
}) {
  const p = { size, className };
  switch (kind) {
    case 'image':    return <FileImage {...p} />;
    case 'video':    return <FileVideo {...p} />;
    case 'audio':    return <FileMusic {...p} />;
    case 'archive':  return <Archive {...p} />;
    case 'unknown':  return <FileQuestion {...p} />;
    case 'pdf':
    case 'text':
    case 'document': return <FileText {...p} />;
    default:         return <GenericFile {...p} />;
  }
}

// ─── Chat types ───────────────────────────────────────────────────────────────

interface CardItem {
  label: string;
  value: string;
  status?: 'ok' | 'warn' | 'error' | 'idle';
}

interface AgentCard {
  type: 'data' | 'alert' | 'link';
  title: string;
  items: CardItem[];
  href?: string;
}

interface ChatMsg {
  id: string;
  role: 'user' | 'agent';
  text: string;
  card?: AgentCard;
  files?: AttachedFile[];
}

// ─── Status dot colour map ───────────────────────────────────────────────────

const statusDot: Record<string, string> = {
  ok:   'bg-emerald-400',
  warn: 'bg-amber-400',
  error:'bg-red-400',
  idle: 'bg-white/20',
};

// ─── Quick prompts ────────────────────────────────────────────────────────────

function getQuickPrompts(place: PlaceDetail): string[] {
  const prompts: string[] = [];
  const primary = place.actions.find((a) => a.variant === 'primary');
  if (primary) prompts.push(primary.label);
  if (place.attention) {
    prompts.push('What needs attention?');
  } else {
    prompts.push('Show key signals');
  }
  if (place.panels[0]) prompts.push(`Check ${place.panels[0].title.toLowerCase()}`);
  return prompts.slice(0, 3);
}

function getGreeting(place: PlaceDetail): string {
  const first = place.overview.split(/[.!?]/)[0].trim();
  return `I'm the ${place.shortLabel} agent. ${first}. What would you like to do?`;
}

function runtimeErrorCard(message: string): AgentCard {
  return {
    type: 'alert',
    title: 'Agent Runtime',
    items: [{ label: 'Status', value: message }],
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-white/35 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }}
        />
      ))}
    </div>
  );
}

function CardView({ card, color }: { card: AgentCard; color: string }) {
  if (card.type === 'link' && card.href) {
    return (
      <Link
        href={card.href}
        className="mt-2 flex items-center justify-between px-4 py-3 rounded-xl border transition-all group"
        style={{ borderColor: `${color}44`, background: `${color}12` }}
      >
        <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
          {card.title}
        </span>
        <ChevronRight size={14} className="text-white/35 group-hover:text-white/65 transition-colors flex-shrink-0" />
      </Link>
    );
  }

  if (card.type === 'alert') {
    return (
      <div className="mt-2 flex gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25">
        <AlertTriangle size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-0.5">{card.title}</p>
          {card.items.map((item) => (
            <p key={item.label} className="text-[11px] text-amber-200/65 leading-snug">{item.value}</p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="mt-2 rounded-xl border overflow-hidden"
      style={{ borderColor: 'rgba(255,255,255,0.07)', borderLeft: `2px solid ${color}55` }}
    >
      <div className="px-3 py-2 border-b border-white/[0.05]">
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/30">{card.title}</p>
      </div>
      {card.items.map((item, i) => (
        <div
          key={item.label}
          className={`flex items-center justify-between px-3 py-1.5 ${i < card.items.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {item.status && (
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot[item.status] ?? 'bg-white/20'}`} />
            )}
            <span className="text-[11px] text-white/50 truncate">{item.label}</span>
          </div>
          <span className="text-[11px] font-semibold text-white/75 ml-3 flex-shrink-0 text-right">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

/** Small chip showing an attached file in a message bubble. */
function FileBubbleChip({
  file,
  onPreview,
}: {
  file: AttachedFile;
  onPreview: (f: AttachedFile) => void;
}) {
  return (
    <button
      onClick={() => onPreview(file)}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.07] border border-white/[0.09] hover:bg-white/[0.11] transition-colors max-w-[200px]"
    >
      <FileKindIcon kind={file.kind} size={11} className="flex-shrink-0 text-white/40" />
      <span className="text-[11px] text-white/60 truncate">{file.name}</span>
      <span className="text-[10px] text-white/25 flex-shrink-0">{formatSize(file.size)}</span>
    </button>
  );
}

function AgentBubble({
  msg,
  color,
  onPreview,
}: {
  msg: ChatMsg;
  color: string;
  onPreview: (f: AttachedFile) => void;
}) {
  const renderText = (text: string) =>
    text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part
    );

  return (
    <div className="flex gap-2.5 max-w-[88%]">
      <div
        className="flex-shrink-0 w-6 h-6 rounded-full mt-0.5 flex items-center justify-center text-[9px] font-black text-white/80"
        style={{ background: `${color}99` }}
      >
        ✦
      </div>
      <div className="space-y-0.5 min-w-0">
        <div
          className="px-4 py-2.5 rounded-2xl rounded-tl-sm border"
          style={{
            background: 'rgba(255,255,255,0.04)',
            borderColor: 'rgba(255,255,255,0.07)',
            borderLeft: `2px solid ${color}60`,
          }}
        >
          <p className="text-[16px] text-white/82 leading-relaxed">{renderText(msg.text)}</p>
        </div>
        {msg.card && <CardView card={msg.card} color={color} />}
        {msg.files && msg.files.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {msg.files.map((f) => (
              <FileBubbleChip key={f.id} file={f} onPreview={onPreview} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UserBubble({
  msg,
  color,
  onPreview,
}: {
  msg: ChatMsg;
  color: string;
  onPreview: (f: AttachedFile) => void;
}) {
  return (
    <div className="flex flex-col items-end gap-1.5">
      {/* File chips above the text bubble */}
      {msg.files && msg.files.length > 0 && (
        <div className="flex flex-wrap justify-end gap-1.5 max-w-[85%]">
          {msg.files.map((f) => (
            <FileBubbleChip key={f.id} file={f} onPreview={onPreview} />
          ))}
        </div>
      )}
      {msg.text && (
        <div
          className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-tr-sm text-[16px] text-white leading-relaxed"
          style={{ background: `linear-gradient(135deg, ${color}aa 0%, ${color}77 100%)` }}
        >
          {msg.text}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AgentChat({ place, initialQuery }: { place: PlaceDetail; initialQuery?: string }) {
  const color = place.accentColor;

  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: 'greeting', role: 'agent', text: getGreeting(place) },
  ]);
  const [input, setInput]             = useState('');
  const [isTyping, setIsTyping]       = useState(false);
  const [showPrompts, setShowPrompts] = useState(!initialQuery);

  // ── File state ─────────────────────────────────────────────────────────────
  const [pendingFiles, setPendingFiles]   = useState<AttachedFile[]>([]);
  const [previewFile, setPreviewFile]     = useState<AttachedFile | null>(null);
  const [showFilePicker, setShowFilePicker] = useState(false);

  // ── Refs ───────────────────────────────────────────────────────────────────
  const bottomRef    = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLTextAreaElement>(null);
  const threadRef    = useRef<HTMLDivElement>(null);
  // Three hidden inputs — cover: any file, photos/video, camera
  const fileInputRef   = useRef<HTMLInputElement>(null);
  const imageInputRef  = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const quickPrompts = getQuickPrompts(place);

  // ── File handlers ──────────────────────────────────────────────────────────

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const next: AttachedFile[] = Array.from(fileList).map((f) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: f.name,
      size: f.size,
      mimeType: f.type || 'application/octet-stream',
      kind: getFileKind(f.type),
      objectUrl: URL.createObjectURL(f),
    }));
    setPendingFiles((prev) => [...prev, ...next]);
    setShowFilePicker(false);
  }, []);

  const removeFile = useCallback((id: string) => {
    setPendingFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.objectUrl) URL.revokeObjectURL(target.objectUrl);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  // ── Send handler — declared before effects that reference it ───────────────

  const handleSend = useCallback(
    (text: string) => {
      if (!text.trim() && pendingFiles.length === 0) return;
      if (isTyping) return;

      setShowPrompts(false);
      setInput('');

      const filesToSend = [...pendingFiles];
      setPendingFiles([]);

      const userMsg: ChatMsg = {
        id: `u-${Date.now()}`,
        role: 'user',
        text: text.trim(),
        files: filesToSend.length > 0 ? filesToSend : undefined,
      };
      setMessages((prev) => [...prev, userMsg]);

      setIsTyping(true);
      void (async () => {
        try {
          await commandClient.sendChatMessage(place.id, text, filesToSend);
          setMessages((prev) => [
            ...prev,
            {
              id: `a-${Date.now()}`,
              role: 'agent',
              text: 'Command accepted by the agent runtime.',
            },
          ]);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Agent runtime failed to respond.';
          setMessages((prev) => [
            ...prev,
            {
              id: `a-${Date.now()}`,
              role: 'agent',
              text: message,
              card: runtimeErrorCard(message),
            },
          ]);
        } finally {
          setIsTyping(false);
        }
      })();
    },
    [isTyping, pendingFiles, place]
  );

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  // ── Effects ────────────────────────────────────────────────────────────────

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Auto-send initial action query from ActionRail (?q=<label>)
  const initialQueryRef = useRef(initialQuery);
  useEffect(() => {
    const q = initialQueryRef.current;
    if (!q) return;
    const timer = setTimeout(() => handleSend(q), 600);
    return () => clearTimeout(timer);
  // handleSend is stable on first render; fires once intentionally
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Textarea auto-resize
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  // ── Render ─────────────────────────────────────────────────────────────────

  const canSend = (input.trim().length > 0 || pendingFiles.length > 0) && !isTyping;

  return (
    <div className="flex flex-col bg-[#0e0e0e] overflow-hidden" style={{ height: '100dvh' }}>
      {/* Dot-grid texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header
        className="relative flex-shrink-0 flex items-center gap-3 pt-safe px-4 pb-3 z-10"
        style={{
          background: [
            `radial-gradient(ellipse 100% 120% at 0% 50%, ${color}bb 0%, transparent 55%)`,
            `linear-gradient(135deg, ${color}99 0%, ${color}66 45%, ${color}33 100%)`,
            '#141414',
          ].join(', '),
          borderBottom: `1px solid ${color}44`,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: `linear-gradient(90deg, ${color}ff, ${color}aa 40%, transparent)` }} />

        <Link
          href={`/places/${place.id}`}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/18 border border-white/15 transition-all"
          aria-label="Back to place"
        >
          <ArrowLeft size={14} className="text-white/70" />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <h1 className="text-sm font-black text-white tracking-tight leading-none truncate">
              {place.shortLabel}
            </h1>
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/40 flex-shrink-0">
              {place.descriptor}
            </span>
          </div>
          <p className="text-[10px] text-white/45 mt-0.5">Agent · always on</p>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
          />
          <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Live</span>
        </div>
      </header>

      {/* ── Message thread ───────────────────────────────────────────────── */}
      <div
        ref={threadRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-none"
      >
        {messages.map((msg) =>
          msg.role === 'agent' ? (
            <AgentBubble key={msg.id} msg={msg} color={color} onPreview={setPreviewFile} />
          ) : (
            <UserBubble key={msg.id} msg={msg} color={color} onPreview={setPreviewFile} />
          )
        )}

        {isTyping && (
          <div className="flex gap-2.5 max-w-[88%]">
            <div
              className="flex-shrink-0 w-6 h-6 rounded-full mt-0.5 flex items-center justify-center text-[9px] font-black text-white/80"
              style={{ background: `${color}99` }}
            >
              ✦
            </div>
            <div
              className="px-4 py-2.5 rounded-2xl rounded-tl-sm border"
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderColor: 'rgba(255,255,255,0.07)',
                borderLeft: `2px solid ${color}60`,
              }}
            >
              <TypingDots />
            </div>
          </div>
        )}

        {showPrompts && !isTyping && (
          <div className="flex flex-wrap gap-2 pt-1">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                className="px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-150 active:scale-[0.96]"
                style={{ border: `1px solid ${color}55`, color: `${color}ee`, background: `${color}12` }}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ────────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 px-4 pb-safe-input pt-2 border-t border-white/[0.06] relative z-10"
        style={{ background: 'rgba(14,14,14,0.98)' }}
      >
        {/* Pending file chips — horizontal scroll strip */}
        {pendingFiles.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2 max-w-2xl mx-auto">
            {pendingFiles.map((f) => (
              <div
                key={f.id}
                className="flex-shrink-0 flex items-center gap-1.5 pl-2.5 pr-1.5 py-1.5 rounded-xl bg-white/[0.07] border border-white/[0.10] max-w-[200px]"
              >
                <FileKindIcon kind={f.kind} size={12} className="flex-shrink-0 text-white/45" />
                <span className="text-xs text-white/65 truncate">{f.name}</span>
                <span className="text-[10px] text-white/25 flex-shrink-0">{formatSize(f.size)}</span>
                <button
                  onClick={() => removeFile(f.id)}
                  className="flex-shrink-0 ml-0.5 w-4 h-4 flex items-center justify-center rounded-full hover:bg-white/15 transition-colors"
                  aria-label={`Remove ${f.name}`}
                >
                  <X size={10} className="text-white/40" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input row: [+] [textarea] [send] */}
        <div className="flex gap-2.5 items-end max-w-2xl mx-auto">

          {/* + button with file picker popover */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowFilePicker((v) => !v)}
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-150 active:scale-95"
              style={{
                background: showFilePicker ? `${color}22` : 'rgba(255,255,255,0.05)',
                borderColor: showFilePicker ? `${color}55` : 'rgba(255,255,255,0.10)',
              }}
              aria-label="Attach file"
              aria-expanded={showFilePicker}
            >
              <Plus
                size={17}
                className="transition-transform duration-200"
                style={{
                  color: showFilePicker ? color : 'rgba(255,255,255,0.55)',
                  transform: showFilePicker ? 'rotate(45deg)' : 'rotate(0deg)',
                }}
              />
            </button>

            {/* Popover menu */}
            {showFilePicker && (
              <>
                {/* Invisible backdrop — click to close */}
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowFilePicker(false)}
                />
                <div
                  className="absolute bottom-full left-0 mb-2.5 z-40 flex flex-col gap-0.5 rounded-2xl overflow-hidden shadow-2xl border border-white/[0.10]"
                  style={{ background: '#242426', minWidth: 190 }}
                >
                  {/* Option: any file */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-3 px-4 py-3 text-left text-sm text-white/80 hover:bg-white/[0.07] transition-colors"
                  >
                    <GenericFile size={15} className="text-white/40 flex-shrink-0" />
                    <span>Browse files</span>
                  </button>
                  {/* Option: photos & video */}
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="flex items-center gap-3 px-4 py-3 text-left text-sm text-white/80 hover:bg-white/[0.07] transition-colors"
                  >
                    <FileImage size={15} className="text-white/40 flex-shrink-0" />
                    <span>Photos &amp; video</span>
                  </button>
                  {/* Option: camera — opens camera directly on mobile */}
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center gap-3 px-4 py-3 text-left text-sm text-white/80 hover:bg-white/[0.07] transition-colors"
                  >
                    <Camera size={15} className="text-white/40 flex-shrink-0" />
                    <span>Camera</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Textarea */}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`Ask ${place.shortLabel} agent anything…`}
            rows={1}
            className="flex-1 bg-white/[0.05] border border-white/[0.10] rounded-2xl px-4 py-2.5 text-white placeholder-white/28 resize-none outline-none transition-colors scrollbar-none leading-relaxed"
            style={{
              maxHeight: '120px',
              // 16px minimum prevents iOS Safari from zooming the viewport on focus
              fontSize: '16px',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = `${color}55`)}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)')}
          />

          {/* Send button */}
          <button
            onClick={() => handleSend(input)}
            disabled={!canSend}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 disabled:opacity-35 active:scale-95"
            style={{ background: `linear-gradient(135deg, ${color}cc 0%, ${color}99 100%)` }}
            aria-label="Send"
          >
            <Send size={15} className="text-white" style={{ transform: 'translateX(1px)' }} />
          </button>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.currentTarget.value = ''; }}
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.currentTarget.value = ''; }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.currentTarget.value = ''; }}
        />
      </div>

      {/* ── File preview sheet ───────────────────────────────────────────── */}
      {previewFile && (
        <FilePreviewSheet file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  );
}
