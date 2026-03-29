import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Key,
  Phone,
  MessageSquare,
  Lock,
  CheckCircle,
  Copy,
  Save,
  RefreshCw,
  Clock,
  User,
  Zap,
  Code2,
  ChevronRight,
  Eye,
  EyeOff,
  Trash2,
  AlertCircle,
  Loader2,
  Shield,
  Star,
  History,
  Download,
  ArrowRight,
} from 'lucide-react';

type SessionType = 'gramjs' | 'telethon';
type GenStep = 'idle' | 'api_info' | 'phone' | 'code' | 'password' | 'success' | 'error';

interface HistoryEntry {
  id: string;
  type: SessionType;
  sessionString: string;
  userInfo: { name: string; phone: string; userId: string; username?: string } | null;
  createdAt: string;
  label?: string;
}

interface GeneratorState {
  step: GenStep;
  sessionId: string | null;
  sessionString: string | null;
  userInfo: { name: string; phone: string; userId: string; username?: string } | null;
  error: string | null;
  loading: boolean;
}

const INITIAL_STATE: GeneratorState = {
  step: 'idle',
  sessionId: null,
  sessionString: null,
  userInfo: null,
  error: null,
  loading: false,
};

const DEFAULT_API_ID = import.meta.env.VITE_TELEGRAM_API_ID || '28403662';
const DEFAULT_API_HASH = import.meta.env.VITE_TELEGRAM_API_HASH || '079509d4ac7f209a1a58facd00d6ff5a';
const DEFAULT_PHONE = import.meta.env.VITE_TELEGRAM_PHONE || '+917352013479';

const LS_GRAMJS = 'generator_gramjs_session';
const LS_TELETHON = 'generator_telethon_session';
const LS_HISTORY = 'session_generator_history';

function getHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(LS_HISTORY) || '[]');
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  localStorage.setItem(LS_HISTORY, JSON.stringify(entries));
}

function addToHistory(entry: HistoryEntry) {
  const history = getHistory();
  const updated = [entry, ...history].slice(0, 50);
  saveHistory(updated);
}

const STEP_LABELS: Record<GenStep, string> = {
  idle: 'Ready',
  api_info: 'API Credentials',
  phone: 'Phone Number',
  code: 'Verification Code',
  password: '2FA Password',
  success: 'Session Generated!',
  error: 'Error',
};

const STEPS_ORDER: GenStep[] = ['api_info', 'phone', 'code', 'success'];

function StepIndicator({ step }: { step: GenStep }) {
  const steps = [
    { key: 'api_info', icon: Key, label: 'API Info' },
    { key: 'phone', icon: Phone, label: 'Phone' },
    { key: 'code', icon: MessageSquare, label: 'OTP' },
    { key: 'success', icon: CheckCircle, label: 'Done' },
  ];

  const currentIdx = STEPS_ORDER.indexOf(step);

  return (
    <div className="flex items-center justify-between mb-6 px-2">
      {steps.map((s, idx) => {
        const Icon = s.icon;
        const isActive = s.key === step;
        const isDone = currentIdx > idx || step === 'success';
        const isError = step === 'error';

        return (
          <React.Fragment key={s.key}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDone
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                    : isActive
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-2 ring-primary/50 ring-offset-2'
                    : 'bg-muted text-muted-foreground'
                } ${isError && isActive ? 'bg-red-500 text-white' : ''}`}
              >
                {isDone && !isActive ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? 'text-primary' : isDone ? 'text-green-500' : 'text-muted-foreground'
                }`}
              >
                {s.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                  currentIdx > idx ? 'bg-green-500' : 'bg-muted'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function SessionStringDisplay({
  sessionString,
  type,
  userInfo,
  onStorePermament,
  onReplaceAll,
}: {
  sessionString: string;
  type: SessionType;
  userInfo: { name: string; phone: string; userId: string; username?: string } | null;
  onStorePermament: () => void;
  onReplaceAll: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sessionString);
    toast({ title: 'Copied!', description: 'Session string copied to clipboard' });
  };

  const displayStr = revealed
    ? sessionString
    : sessionString.substring(0, 20) + '••••••••••••••••••••••••••••••••••••••••••••••' + sessionString.slice(-10);

  return (
    <div className="space-y-4">
      {/* User Info */}
      {userInfo && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <User className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{userInfo.name || 'Unknown'}</p>
            <p className="text-xs text-muted-foreground">{userInfo.phone}</p>
            {userInfo.username && (
              <p className="text-xs text-muted-foreground">@{userInfo.username}</p>
            )}
          </div>
          <Badge variant="outline" className="text-green-400 border-green-400/40 shrink-0">
            ID: {userInfo.userId}
          </Badge>
        </div>
      )}

      {/* Session String */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          Generated {type === 'gramjs' ? 'GramJS' : 'Telethon'} Session String
        </Label>
        <div className="relative">
          <div
            className="font-mono text-xs p-3 rounded-lg border bg-muted/50 break-all leading-relaxed min-h-[80px] pr-10"
            style={{ wordBreak: 'break-all' }}
          >
            {displayStr}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-7 w-7 p-0"
            onClick={() => setRevealed(!revealed)}
            title={revealed ? 'Hide' : 'Reveal'}
          >
            {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Length: {sessionString.length} characters
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 gap-2">
        <Button
          onClick={copyToClipboard}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/25"
          size="sm"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Session String
        </Button>
        <Button
          onClick={onStorePermament}
          variant="outline"
          className="w-full border-green-500/40 text-green-400 hover:bg-green-500/10"
          size="sm"
        >
          <Save className="w-4 h-4 mr-2" />
          Store Permanently
        </Button>
        <Button
          onClick={onReplaceAll}
          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25"
          size="sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Replace All {type === 'gramjs' ? 'GramJS' : 'Telethon'} Defaults
        </Button>
      </div>
    </div>
  );
}

function HistoryPanel({ history, onDelete }: { history: HistoryEntry[]; onDelete: (id: string) => void }) {
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyEntry = (entry: HistoryEntry) => {
    navigator.clipboard.writeText(entry.sessionString);
    toast({ title: 'Copied!', description: 'Session string copied to clipboard' });
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-10">
        <History className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No session history yet</p>
        <p className="text-xs text-muted-foreground mt-1">Generated sessions will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((entry) => {
        const isRevealed = revealedIds.has(entry.id);
        const displayStr = isRevealed
          ? entry.sessionString
          : entry.sessionString.substring(0, 24) + '••••••••••••' + entry.sessionString.slice(-8);

        return (
          <div
            key={entry.id}
            className="p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors space-y-2"
          >
            <div className="flex items-center gap-2">
              <Badge
                className={`text-xs shrink-0 ${
                  entry.type === 'gramjs'
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                }`}
                variant="outline"
              >
                {entry.type === 'gramjs' ? (
                  <><Zap className="w-3 h-3 mr-1" />GramJS</>
                ) : (
                  <><Code2 className="w-3 h-3 mr-1" />Telethon</>
                )}
              </Badge>
              {entry.userInfo && (
                <span className="text-xs font-medium truncate flex-1">
                  {entry.userInfo.name} • {entry.userInfo.phone}
                </span>
              )}
              <div className="flex items-center gap-1 shrink-0 ml-auto">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {new Date(entry.createdAt).toLocaleDateString()} {new Date(entry.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="font-mono text-xs p-2 rounded bg-muted/50 break-all pr-16 text-muted-foreground">
                {displayStr}
              </div>
              <div className="absolute top-1.5 right-1.5 flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => toggleReveal(entry.id)}
                  title={isRevealed ? 'Hide' : 'Reveal'}
                >
                  {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => copyEntry(entry)}
                  title="Copy"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  onClick={() => onDelete(entry.id)}
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {entry.userInfo?.userId && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">User ID:</span>
                <span className="text-xs font-mono">{entry.userInfo.userId}</span>
                {entry.userInfo.username && (
                  <span className="text-xs text-muted-foreground">@{entry.userInfo.username}</span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function GeneratorTab({ type }: { type: SessionType }) {
  const [state, setState] = useState<GeneratorState>(INITIAL_STATE);
  const [apiId, setApiId] = useState(DEFAULT_API_ID);
  const [apiHash, setApiHash] = useState(DEFAULT_API_HASH);
  const [phone, setPhone] = useState(DEFAULT_PHONE);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  const pollStatus = useCallback(
    (sessionId: string) => {
      stopPolling();
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/session-generator/${type}/status/${sessionId}`);
          const data = await res.json();

          if (data.status === 'waiting_code') {
            setState((prev) => ({ ...prev, step: 'code', loading: false }));
            stopPolling();
          } else if (data.status === 'waiting_password') {
            setState((prev) => ({ ...prev, step: 'password', loading: false }));
            stopPolling();
          } else if (data.status === 'done') {
            stopPolling();
            const entry: HistoryEntry = {
              id: `${type}_${Date.now()}`,
              type,
              sessionString: data.sessionString,
              userInfo: data.userInfo || null,
              createdAt: new Date().toISOString(),
            };
            addToHistory(entry);
            setState((prev) => ({
              ...prev,
              step: 'success',
              sessionString: data.sessionString,
              userInfo: data.userInfo || null,
              loading: false,
            }));
            toast({
              title: '✅ Session Generated!',
              description: `${type === 'gramjs' ? 'GramJS' : 'Telethon'} session string created successfully`,
            });
          } else if (data.status === 'error') {
            stopPolling();
            setState((prev) => ({
              ...prev,
              step: 'error',
              error: data.error || 'Unknown error occurred',
              loading: false,
            }));
          }
        } catch (_) {}
      }, 1000);
    },
    [type, stopPolling, toast]
  );

  const handleStart = async () => {
    if (!apiId || !apiHash || !phone) {
      toast({ variant: 'destructive', title: 'Missing fields', description: 'Please fill in API ID, API Hash, and Phone' });
      return;
    }
    setState({ ...INITIAL_STATE, step: 'phone', loading: true });

    try {
      const res = await fetch(`/api/session-generator/${type}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiId, apiHash, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start');

      setState((prev) => ({ ...prev, sessionId: data.sessionId, loading: true }));
      pollStatus(data.sessionId);
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        step: 'error',
        error: err.message,
        loading: false,
      }));
    }
  };

  const handleSendCode = async () => {
    if (!code.trim()) {
      toast({ variant: 'destructive', title: 'Enter code', description: 'Please enter the verification code' });
      return;
    }
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await fetch(`/api/session-generator/${type}/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: state.sessionId, code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send code');

      setState((prev) => ({ ...prev, loading: true }));
      pollStatus(state.sessionId!);
    } catch (err: any) {
      setState((prev) => ({ ...prev, step: 'error', error: err.message, loading: false }));
    }
  };

  const handleSendPassword = async () => {
    if (!password.trim()) {
      toast({ variant: 'destructive', title: 'Enter password', description: 'Please enter your 2FA password' });
      return;
    }
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const res = await fetch(`/api/session-generator/${type}/send-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: state.sessionId, password: password.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send password');

      setState((prev) => ({ ...prev, loading: true }));
      pollStatus(state.sessionId!);
    } catch (err: any) {
      setState((prev) => ({ ...prev, step: 'error', error: err.message, loading: false }));
    }
  };

  const handleStorePermanent = async () => {
    if (!state.sessionString) return;
    try {
      const res = await fetch('/api/session-generator/store-permanent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, sessionString: state.sessionString, userInfo: state.userInfo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to store');

      const lsKey = type === 'gramjs' ? LS_GRAMJS : LS_TELETHON;
      localStorage.setItem(lsKey, state.sessionString);
      toast({
        title: '✅ Stored Permanently',
        description: `${type === 'gramjs' ? 'GramJS' : 'Telethon'} session saved to config and localStorage`,
      });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Failed to store', description: err.message });
    }
  };

  const handleReplaceAll = () => {
    if (!state.sessionString) return;
    const lsKey = type === 'gramjs' ? LS_GRAMJS : LS_TELETHON;
    localStorage.setItem(lsKey, state.sessionString);
    toast({
      title: '🔄 Defaults Updated',
      description: `All ${type === 'gramjs' ? 'GramJS' : 'Telethon'} session defaults replaced. Reload affected screens to apply.`,
    });
  };

  const handleReset = () => {
    stopPolling();
    setCode('');
    setPassword('');
    setState(INITIAL_STATE);
  };

  const isGramJS = type === 'gramjs';

  return (
    <div className="space-y-4">
      {/* Step Indicator - only shown when active */}
      {state.step !== 'idle' && <StepIndicator step={state.step} />}

      {/* Step Content */}
      {state.step === 'idle' && (
        <div className="space-y-4">
          {/* API Credentials */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm font-semibold">API Credentials</Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">API ID</Label>
                <Input
                  value={apiId}
                  onChange={(e) => setApiId(e.target.value)}
                  placeholder="28403662"
                  className="font-mono text-sm h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">API Hash</Label>
                <Input
                  value={apiHash}
                  onChange={(e) => setApiHash(e.target.value)}
                  placeholder="your_api_hash"
                  className="font-mono text-sm h-9"
                  type="password"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Phone className="w-3 h-3" />
                Phone Number (with country code)
              </Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+917352013479"
                className="font-mono text-sm h-9"
              />
            </div>
          </div>

          <Button
            onClick={() => setState((prev) => ({ ...prev, step: 'api_info' }))}
            className={`w-full text-white shadow-lg ${
              isGramJS
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-blue-500/25'
                : 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-purple-500/25'
            }`}
          >
            {isGramJS ? <Zap className="w-4 h-4 mr-2" /> : <Code2 className="w-4 h-4 mr-2" />}
            Generate {isGramJS ? 'GramJS' : 'Telethon'} Session
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {state.step === 'api_info' && (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm font-semibold">Confirm API Credentials</Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">API ID</Label>
                <Input
                  value={apiId}
                  onChange={(e) => setApiId(e.target.value)}
                  placeholder="28403662"
                  className="font-mono text-sm h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">API Hash</Label>
                <Input
                  value={apiHash}
                  onChange={(e) => setApiHash(e.target.value)}
                  placeholder="your_api_hash"
                  className="font-mono text-sm h-9"
                  type="password"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Phone className="w-3 h-3" />
                Phone Number (with country code)
              </Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+917352013479"
                className="font-mono text-sm h-9"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} className="flex-1" size="sm">
              Cancel
            </Button>
            <Button
              onClick={handleStart}
              disabled={state.loading}
              className={`flex-1 text-white ${
                isGramJS
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600'
                  : 'bg-gradient-to-r from-purple-600 to-violet-600'
              }`}
              size="sm"
            >
              {state.loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ChevronRight className="w-4 h-4 mr-2" />}
              Send OTP
            </Button>
          </div>
        </div>
      )}

      {(state.step === 'phone' && state.loading) && (
        <div className="text-center py-8 space-y-3">
          <div className="relative w-16 h-16 mx-auto">
            <div className={`absolute inset-0 rounded-full opacity-20 animate-ping ${isGramJS ? 'bg-blue-500' : 'bg-purple-500'}`} />
            <div className={`relative w-16 h-16 rounded-full flex items-center justify-center ${isGramJS ? 'bg-blue-500/20' : 'bg-purple-500/20'}`}>
              <Phone className={`w-7 h-7 ${isGramJS ? 'text-blue-400' : 'text-purple-400'}`} />
            </div>
          </div>
          <div>
            <p className="font-semibold">Sending verification code...</p>
            <p className="text-sm text-muted-foreground mt-1">Connecting to Telegram servers</p>
          </div>
          <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
        </div>
      )}

      {state.step === 'code' && (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2 py-3">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isGramJS ? 'bg-blue-500/20' : 'bg-purple-500/20'}`}>
              <MessageSquare className={`w-7 h-7 ${isGramJS ? 'text-blue-400' : 'text-purple-400'}`} />
            </div>
            <p className="font-semibold">Enter Verification Code</p>
            <p className="text-sm text-muted-foreground text-center">
              Check your Telegram app for a code sent to <strong>{phone}</strong>
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">OTP Code</Label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="• • • • • •"
              className="text-center text-2xl font-mono tracking-[0.5em] h-12"
              maxLength={6}
              onKeyDown={(e) => e.key === 'Enter' && handleSendCode()}
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} className="flex-1" size="sm">
              Cancel
            </Button>
            <Button
              onClick={handleSendCode}
              disabled={state.loading || code.length < 5}
              className={`flex-1 text-white ${
                isGramJS
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600'
                  : 'bg-gradient-to-r from-purple-600 to-violet-600'
              }`}
              size="sm"
            >
              {state.loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ChevronRight className="w-4 h-4 mr-2" />}
              Verify Code
            </Button>
          </div>
        </div>
      )}

      {(state.step === 'sending_code' as any) && state.loading && (
        <div className="text-center py-6 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Verifying code...</p>
        </div>
      )}

      {state.step === 'password' && (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2 py-3">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isGramJS ? 'bg-blue-500/20' : 'bg-purple-500/20'}`}>
              <Lock className={`w-7 h-7 ${isGramJS ? 'text-blue-400' : 'text-purple-400'}`} />
            </div>
            <p className="font-semibold">Two-Factor Authentication</p>
            <p className="text-sm text-muted-foreground text-center">
              Your account has 2FA enabled. Enter your cloud password.
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Cloud Password</Label>
            <div className="relative">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter 2FA password"
                type={showPassword ? 'text' : 'password'}
                className="pr-10 h-10"
                onKeyDown={(e) => e.key === 'Enter' && handleSendPassword()}
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} className="flex-1" size="sm">
              Cancel
            </Button>
            <Button
              onClick={handleSendPassword}
              disabled={state.loading || !password.trim()}
              className={`flex-1 text-white ${
                isGramJS
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600'
                  : 'bg-gradient-to-r from-purple-600 to-violet-600'
              }`}
              size="sm"
            >
              {state.loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
              Submit Password
            </Button>
          </div>
        </div>
      )}

      {state.step === 'success' && state.sessionString && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
            <p className="text-sm font-medium text-green-400">Session generated successfully!</p>
          </div>
          <SessionStringDisplay
            sessionString={state.sessionString}
            type={type}
            userInfo={state.userInfo}
            onStorePermament={handleStorePermanent}
            onReplaceAll={handleReplaceAll}
          />
          <Button variant="outline" onClick={handleReset} className="w-full" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate New Session
          </Button>
        </div>
      )}

      {state.step === 'error' && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-red-400">Generation Failed</p>
              <p className="text-xs text-muted-foreground mt-1">{state.error}</p>
            </div>
          </div>
          <Button onClick={handleReset} variant="outline" className="w-full" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}

export function SessionGenerator() {
  const [activeType, setActiveType] = useState<SessionType>('gramjs');
  const [history, setHistory] = useState<HistoryEntry[]>(getHistory());
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();

  const refreshHistory = () => setHistory(getHistory());

  const deleteHistoryEntry = (id: string) => {
    const updated = history.filter((e) => e.id !== id);
    saveHistory(updated);
    setHistory(updated);
    toast({ title: 'Deleted', description: 'History entry removed' });
  };

  const clearAllHistory = () => {
    saveHistory([]);
    setHistory([]);
    toast({ title: 'Cleared', description: 'All session history cleared' });
  };

  // Refresh history when new entries are added
  useEffect(() => {
    const interval = setInterval(() => {
      const fresh = getHistory();
      if (fresh.length !== history.length) setHistory(fresh);
    }, 2000);
    return () => clearInterval(interval);
  }, [history.length]);

  const gramjsStored = localStorage.getItem(LS_GRAMJS);
  const telethonStored = localStorage.getItem(LS_TELETHON);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="mb-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Key className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Session Generator
            </h2>
            <p className="text-sm text-muted-foreground">
              Generate Telethon & GramJS string sessions via mobile login
            </p>
          </div>
        </div>

        {/* Stored Sessions Status */}
        {(gramjsStored || telethonStored) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {gramjsStored && (
              <Badge variant="outline" className="text-blue-400 border-blue-500/30 bg-blue-500/5 text-xs">
                <CheckCircle className="w-3 h-3 mr-1 text-green-400" />
                GramJS session active ({gramjsStored.length} chars)
              </Badge>
            )}
            {telethonStored && (
              <Badge variant="outline" className="text-purple-400 border-purple-500/30 bg-purple-500/5 text-xs">
                <CheckCircle className="w-3 h-3 mr-1 text-green-400" />
                Telethon session active ({telethonStored.length} chars)
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* What each type is used for */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
            activeType === 'gramjs'
              ? 'border-blue-500/60 bg-blue-500/10 shadow-sm shadow-blue-500/20'
              : 'border-border hover:border-blue-500/30 hover:bg-blue-500/5'
          }`}
          onClick={() => setActiveType('gramjs')}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
            <span className="font-semibold text-sm">GramJS</span>
            {activeType === 'gramjs' && <Star className="w-3 h-3 text-blue-400 ml-auto" />}
          </div>
          <p className="text-xs text-muted-foreground">Used by: JS Copier, Auth Default</p>
        </div>

        <div
          className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
            activeType === 'telethon'
              ? 'border-purple-500/60 bg-purple-500/10 shadow-sm shadow-purple-500/20'
              : 'border-border hover:border-purple-500/30 hover:bg-purple-500/5'
          }`}
          onClick={() => setActiveType('telethon')}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-purple-400" />
            </div>
            <span className="font-semibold text-sm">Telethon</span>
            {activeType === 'telethon' && <Star className="w-3 h-3 text-purple-400 ml-auto" />}
          </div>
          <p className="text-xs text-muted-foreground">Used by: Python Copier, Live Cloning</p>
        </div>
      </div>

      {/* Active Generator Card */}
      <Card
        className={`border-2 transition-all duration-300 ${
          activeType === 'gramjs'
            ? 'border-blue-500/30 shadow-lg shadow-blue-500/10'
            : 'border-purple-500/30 shadow-lg shadow-purple-500/10'
        }`}
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            {activeType === 'gramjs' ? (
              <>
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span>GramJS Session Generator</span>
                <Badge className="ml-auto bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs" variant="outline">
                  JavaScript
                </Badge>
              </>
            ) : (
              <>
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-white" />
                </div>
                <span>Telethon Session Generator</span>
                <Badge className="ml-auto bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs" variant="outline">
                  Python
                </Badge>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GeneratorTab key={activeType} type={activeType} />
        </CardContent>
      </Card>

      {/* Usage Info */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4 pb-4">
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
            Which session goes where?
          </p>
          <div className="space-y-1.5">
            <div className="flex items-start gap-2">
              <Zap className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-400 font-medium">GramJS</span> → JS Copier (⚡), Auth Modal default session
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Code2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                <span className="text-purple-400 font-medium">Telethon</span> → Python Copier (🐍), Live Cloning (⚡), Python settings.py
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session History */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="w-5 h-5 text-muted-foreground" />
              Session History
              {history.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {history.length}
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              {history.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                  onClick={clearAllHistory}
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clear All
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => { refreshHistory(); setShowHistory(!showHistory); }}
              >
                {showHistory ? 'Hide' : 'Show'}
              </Button>
            </div>
          </div>
        </CardHeader>
        {showHistory && (
          <CardContent>
            <HistoryPanel history={history} onDelete={deleteHistoryEntry} />
          </CardContent>
        )}
      </Card>
    </div>
  );
}
