import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { ConversationListItem } from '../types/conversation';
import {
  Search,
  ArrowUpDown,
  Trash2,
  Edit2,
  ExternalLink,
  Plus,
  Users,
  MessageSquare,
  AlertTriangle,
  Calendar,
  Check,
  X,
  Radio,
} from 'lucide-react';

export const History: React.FC = () => {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'gaps' | 'messages'>('newest');

  // Rename state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const loadData = () => {
    setLoading(true);
    api.getConversations().then(data => {
      setConversations(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Delete this conversation audit from history?')) {
      await api.deleteConversation(id);
      setConversations(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleStartRename = (item: ConversationListItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(item.id);
    setEditTitle(item.title);
  };

  const handleSaveRename = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (editTitle.trim()) {
      await api.renameConversation(id, editTitle.trim());
      setConversations(prev =>
        prev.map(c => (c.id === id ? { ...c, title: editTitle.trim() } : c))
      );
    }
    setEditingId(null);
  };

  const filteredAndSorted = useMemo(() => {
    let list = [...conversations];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => c.title.toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'gaps') return b.gapsCount - a.gapsCount;
      if (sortBy === 'messages') return b.messagesCount - a.messagesCount;
      return 0;
    });

    return list;
  }, [conversations, searchQuery, sortBy]);

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#babecc]/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-accent shadow-glow animate-pulse" />
            <span className="font-mono text-[11px] font-bold text-accent tracking-widest uppercase">
              ARCHIVE_STORAGE // LOG_CATALOG
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight text-embossed">
            Audit Archive
          </h1>
          <p className="text-sm text-muted mt-1 max-w-2xl">
            Inspect recorded multi-party communications, verified reasoning trails, and historical telemetry logs.
          </p>
        </div>

        <Link
          to="/analyze"
          className="btn-tactile-primary flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>NEW ANALYSIS</span>
        </Link>
      </div>

      {/* Search & Sort Module Controls */}
      <div className="p-4 bg-[#e0e5ec] shadow-card rounded-xl border border-white/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex h-11 flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search catalog by title..."
            className="input-recessed h-11 w-full rounded-xl pl-9 pr-3 text-xs text-foreground placeholder:text-muted/60"
          />
        </div>

        <div className="flex h-11 items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-muted uppercase font-bold tracking-wider">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>SORT:</span>
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="input-recessed h-11 rounded-xl px-3 text-xs text-foreground font-mono focus:outline-none"
          >
            <option value="newest">NEWEST FIRST</option>
            <option value="oldest">OLDEST FIRST</option>
            <option value="gaps">MOST GAPS DETECTED</option>
            <option value="messages">MESSAGE VOLUME</option>
          </select>
        </div>
      </div>

      {/* Grid of Conversation Cards */}
      {loading ? (
        <div className="p-16 text-center font-mono text-xs text-muted shadow-recessed rounded-xl bg-[#d1d9e6]/40">
          READING CONVERSATION LOGS FROM STORAGE CHASSIS...
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="p-12 text-center bg-[#e0e5ec] shadow-card rounded-2xl border border-white/60 space-y-4 max-w-md mx-auto corner-screws-sm">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#d1d9e6] shadow-recessed flex items-center justify-center text-muted">
            <Radio className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-base font-bold text-foreground text-embossed">
            No Records In Storage
          </h3>
          <p className="text-xs text-muted leading-relaxed">
            Ingest your first team transcript to trigger reasoning algorithms and populate the audit catalog.
          </p>
          <div className="pt-2">
            <Link
              to="/analyze"
              className="btn-tactile-primary inline-flex items-center gap-2 text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>INGEST TRANSCRIPT</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSorted.map(item => (
            <div
              key={item.id}
              className="p-5 bg-[#e0e5ec] shadow-card hover:shadow-floating rounded-xl border border-white/60 relative overflow-hidden transition-all duration-300 corner-screws-sm group flex flex-col justify-between space-y-4"
            >
              {/* Vent slots top right */}
              <div className="absolute top-3 right-4 flex gap-1">
                <div className="h-4 w-1 rounded-full bg-[#babecc]/50 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15)]" />
                <div className="h-4 w-1 rounded-full bg-[#babecc]/50 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15)]" />
                <div className="h-4 w-1 rounded-full bg-[#babecc]/50 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.15)]" />
              </div>

              <div className="space-y-3 pt-2">
                {/* Header: Title or rename input */}
                <div className="flex items-start justify-between gap-2 pr-6">
                  {editingId === item.id ? (
                    <div className="flex items-center gap-1.5 w-full">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="input-recessed px-2.5 py-1 text-xs text-foreground w-full font-mono"
                        autoFocus
                      />
                      <button
                        onClick={e => handleSaveRename(item.id, e)}
                        className="p-1.5 text-emerald-600 hover:text-emerald-700 rounded bg-[#d1d9e6] shadow-card"
                        title="Save"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 text-muted hover:text-foreground rounded bg-[#d1d9e6] shadow-card"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-accent transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={e => handleStartRename(item, e)}
                      className="p-1.5 text-muted hover:text-foreground rounded bg-[#e0e5ec] shadow-[2px_2px_4px_#babecc,-2px_-2px_4px_#ffffff] active:shadow-pressed"
                      title="Rename"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={e => handleDelete(item.id, e)}
                      className="p-1.5 text-muted hover:text-accent rounded bg-[#e0e5ec] shadow-[2px_2px_4px_#babecc,-2px_-2px_4px_#ffffff] active:shadow-pressed"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Recessed Metrics Well Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-lg bg-[#d1d9e6]/50 shadow-recessed border border-[#babecc]/30">
                    <span className="text-[10px] text-muted block font-mono font-bold uppercase tracking-wider">
                      PARTICIPANTS
                    </span>
                    <span className="font-mono font-bold text-foreground flex items-center gap-1 mt-0.5">
                      <Users className="w-3.5 h-3.5 text-accent" />
                      {item.participantsCount} USERS
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#d1d9e6]/50 shadow-recessed border border-[#babecc]/30">
                    <span className="text-[10px] text-muted block font-mono font-bold uppercase tracking-wider">
                      MSGS
                    </span>
                    <span className="font-mono font-bold text-foreground flex items-center gap-1 mt-0.5">
                      <MessageSquare className="w-3.5 h-3.5 text-foreground" />
                      {item.messagesCount} RECORDS
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-accent/10 shadow-recessed border border-accent/20">
                    <span className="text-[10px] text-accent block font-mono font-bold uppercase tracking-wider">
                      FLAGGED GAPS
                    </span>
                    <span className="font-mono font-bold text-accent flex items-center gap-1 mt-0.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {item.gapsCount} FLAGGED
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-500/10 shadow-recessed border border-emerald-500/20">
                    <span className="text-[10px] text-emerald-800 block font-mono font-bold uppercase tracking-wider">
                      CLARITY
                    </span>
                    <span className="font-mono font-extrabold text-emerald-700 mt-0.5 block">
                      {item.healthScore}%
                    </span>
                  </div>
                </div>
              </div>

              {/* View Full Report Button */}
              <Link
                to={`/results/${item.id}`}
                className="btn-tactile-chassis w-full rounded-xl py-2.5 px-3 text-xs font-mono font-bold flex items-center justify-center gap-2 group-hover:border-accent/40"
              >
                <span>OPEN FULL REPORT</span>
                <ExternalLink className="w-3.5 h-3.5 text-accent" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
