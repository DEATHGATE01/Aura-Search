export type StreamEventType =
  | 'tool_call'
  | 'tool_result'
  | 'text'
  | 'citation'
  | 'ui_component'
  | 'done'
  | 'error';

export interface ToolCall {
  id: string;
  name: string;
  message: string;
  status: 'in_progress' | 'completed' | 'failed';
}

export interface Citation {
  ref: number;
  docId: string;
  title: string;
  page: number;
  highlight?: string;
}

export interface GenerativeUIComponent {
  id: string;
  type: 'chart' | 'table' | 'card' | 'code_block';
  props: Record<string, unknown>;
}

export interface StreamEvent {
  type: StreamEventType;
  content?: string;
  tool?: string;
  message?: string;
  tool_result?: string;
  ref?: number;
  docId?: string;
  title?: string;
  page?: number;
  highlight?: string;
  componentType?: string;
  props?: Record<string, unknown>;
  status?: string;
  error?: string | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  toolCalls?: ToolCall[];
  components?: GenerativeUIComponent[];
  timestamp: Date;
}

export interface PDFViewerState {
  isOpen: boolean;
  docId: string | null;
  page: number;
  highlight: string | null;
}
