export const ContactHoneypot = () => (
  <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
    <label>
      Website
      <input type="text" name="website" tabIndex={-1} autoComplete="off" />
    </label>
  </div>
);
