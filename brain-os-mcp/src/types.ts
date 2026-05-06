// Shared interface for context-loader tool return values.
// All context-loader tools must include task + instructions at minimum.
// Tool-specific fields (sections, questions, etc.) are allowed via index signature.
export interface TaskSpec {
  task: string;
  instructions: string[];
  context?: Record<string, string>;
  [key: string]: unknown;
}
