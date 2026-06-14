interface Props {
  value: string;
  onChange: (value: string) => void;
}

// Editable system prompt — the "instruction sheet" behind every reply.
export default function SystemPromptEditor({ value, onChange }: Props) {
  return (
    <div className="field">
      <span className="field-label">System prompt</span>
      <textarea
        className="system-prompt"
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="hint">
        The system prompt is the instruction sheet the AI reads before every
        reply. Edit it to change the assistant's tone, role, or rules.
      </p>
    </div>
  );
}
