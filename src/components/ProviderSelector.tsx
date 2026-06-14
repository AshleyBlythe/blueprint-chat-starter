import type { Provider } from "../lib/types";
import { PROVIDER_LABELS } from "../lib/types";

interface Props {
  provider: Provider;
  model: string;
  onProviderChange: (provider: Provider) => void;
  onModelChange: (model: string) => void;
}

const PROVIDERS: Provider[] = ["openai", "anthropic", "gemini"];

// Lets the user pick a provider and type/edit the model name.
export default function ProviderSelector({
  provider,
  model,
  onProviderChange,
  onModelChange,
}: Props) {
  return (
    <div className="field-group">
      <label className="field">
        <span className="field-label">Provider</span>
        <select
          value={provider}
          onChange={(e) => onProviderChange(e.target.value as Provider)}
        >
          {PROVIDERS.map((p) => (
            <option key={p} value={p}>
              {PROVIDER_LABELS[p]}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="field-label">Model</span>
        <input
          type="text"
          className="mono"
          value={model}
          spellCheck={false}
          onChange={(e) => onModelChange(e.target.value)}
          placeholder="model name"
        />
      </label>
    </div>
  );
}
