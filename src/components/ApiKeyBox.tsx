interface Props {
  apiKey: string;
  remember: boolean;
  onApiKeyChange: (key: string) => void;
  onRememberChange: (remember: boolean) => void;
}

// BYOK (Bring Your Own Key) input. The key is sent to the local backend only
// for each request. It is NOT stored on the server. Persisting it in the
// browser is opt-in via the "remember" checkbox.
export default function ApiKeyBox({
  apiKey,
  remember,
  onApiKeyChange,
  onRememberChange,
}: Props) {
  return (
    <div className="field">
      <span className="field-label">API key (BYOK)</span>
      <input
        type="password"
        className="mono"
        value={apiKey}
        spellCheck={false}
        autoComplete="off"
        placeholder="Paste your provider API key"
        onChange={(e) => onApiKeyChange(e.target.value)}
      />
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => onRememberChange(e.target.checked)}
        />
        <span>Remember key in this browser (local/personal use only)</span>
      </label>
      <p className="hint warn">
        For local learning/testing. Do not deploy publicly with client-entered
        keys unless you understand the risks. Browser storage is not secure
        storage.
      </p>
    </div>
  );
}
