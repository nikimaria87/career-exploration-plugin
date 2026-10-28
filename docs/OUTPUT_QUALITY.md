# NextJobber document quality and provenance

NextJobber supports professional application writing and conservative formatting cleanup. It cannot certify that text is free of every watermark or will pass an AI detector. It does not change account settings or intercept other ChatGPT or Codex conversations.

## Automatic checks in this release

Every new or updated record saved through `save_draft` runs the same deterministic text cleanup, for resumes, cover letters, interview preparation and follow-ups. The saved content includes a `textCleanup` report with exact character counts and actions. Existing drafts are not silently rewritten.

`clean_application_text` exposes the same operation to chat without saving the text. The service makes no external rewriting or detector request. All six packaged workflows instruct the assistant to use it before delivering final application prose, preserve the user's voice and facts, avoid unnecessary generic wording, and omit unsolicited AI bylines, footers and decorative watermarks. Chat instructions remain subject to host tool availability and model execution; they are not a deterministic account-wide output filter.

The normalizer:

- Removes an initial byte-order mark, discretionary soft hyphens, NUL, selected non-printing ASCII controls and DEL.
- Converts no-break, figure and narrow no-break spaces to regular spaces.
- Normalizes CR and CRLF line endings to LF.
- Preserves punctuation, letters, numbers, URLs, ordinary tabs/newlines, script joiners, directional marks, variation selectors and emoji.
- Rejects recognized PDF, Office ZIP and image signatures rather than treating them as text.
- Reports `watermarkStatus: not_assessed` and `aiDetectorStatus: not_assessed`, including when no formatting changes were needed.

Unicode formatting characters occur in ordinary human writing. Their presence or absence does not establish AI authorship. This conservative policy deliberately preserves some invisible characters that are meaningful for language, layout and emoji.

## Scope by output type

| Output | Supported approach | Verification limit |
| --- | --- | --- |
| Application prose in chat | Preserve facts and voice; call the text tool for final copy | No control over platform statistical watermarking, subsequent generation, or detector decisions |
| Saved draft text | Automatic deterministic cleanup with an exact report | No binary file, metadata, statistical watermark or media inspection |
| DOCX and PDF | Use the document/PDF tools, preserve the original, inspect rendered output, extracted text, headers/footers and properties | A text-tool result cannot certify the exported file; signatures, embedded objects, scans and uninspected metadata need separate handling |
| Images | Inspect the specific file and distinguish visible marks, metadata and pixel signals | Metadata removal does not establish that an embedded pixel watermark is absent |
| Audio and video | Use format-specific tools and provider verification when available | No universal reliable removal or detector guarantee; transcoding can leave embedded signals |
| Other chats, accounts and previous messages | Personal instructions can request output preferences | A plugin cannot retroactively edit chat history or control every host's generation pipeline |

No file watermark remover, metadata stripper, external model, paid detector or media regeneration backend is installed by this release. The changes are a first-party text-quality feature with clear limits. They must not be presented as universal watermark removal or proof of human authorship.

## Why the proposed remover is not an account-wide guarantee

Reviewed project: https://github.com/guillaumemeyer/watermarks-remover

Its README distinguishes deterministic Unicode/metadata edits from best-effort statistical-watermark rewriting. It explicitly says it cannot certify that vendor detectors will fail and documents limits on filtering chat messages. Its service needs a separately running backend; file hooks and skills are host-specific. Installing that service does not turn every ChatGPT or Codex response into a verified, unwatermarked output. This review inspected the README and Unicode implementation; it is not a full security audit or an independent validation of its claims.

OpenAI's October 5, 2026 announcement describes eligible EU ChatGPT/Codex text watermarking as a statistical signal in word choices. It states API watermarking is opt-in for selected models and off by default. A formatting normalizer cannot verify or disable that mechanism. The app uses the existing ChatGPT workflow, not a separate configurable model API.

Official sources:

- https://openai.com/index/eu-text-provenance/
- https://developers.openai.com/api/docs/guides/content-provenance

AI detection and watermark verification are separate claims. Neither a clean formatting report nor an absence of detected provenance proves human authorship, and no hiring outcome is guaranteed. Preserve original drafts and revision history so a user can document their own experience and editing process if asked.

## Personal output preferences across chats

In ChatGPT, use **Settings → Personalization → Custom instructions** for a standing writing preference. For Codex installations you control, global `~/.codex/AGENTS.md` instructions and user skills are supported. These are instructions, not switches that disable provider watermarking or verify every format. This release does not change those personal settings or install a global hook.

Suggested preference:

> Preserve my facts and writing voice when editing. Do not add decorative watermarks, AI bylines, generated-by footers or branding unless I request them. For files, inspect the actual final export when tools are available and report exactly what was checked. Never claim an output is watermark-free or detector-proof without evidence, and explain unsupported checks.

Official customization references:

- https://learn.chatgpt.com/docs/prompting
- https://learn.chatgpt.com/docs/customization/overview
