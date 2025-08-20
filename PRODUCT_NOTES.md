# Product Notes

## Product decisions

- 1-step upload – Easy start for the user.
- Progress feedback – Step-based progress bar + looping animation so it doesn’t feel stuck.
- Mobile-friendly – Works smoothly on phone and desktop.
- File check – Show PDF name/size and option to remove before upload.
- OCR support – Handles scanned PDFs with unselectable text.
- Same-page results – Show the PDF and extracted results together on one page with highlights (no separate link).
- Resizable panels (desktop) – Users can adjust PDF vs results view.
- Delay communication – Clearly tell users about possible ~50s wait if server is active.

## Trade-offs Made

- Step-based progress bar – Easier to build than continuous tracking, but less precise. Mitigated with a looping animation.
- No save system – Users can start instantly without login, but their past progress isn’t saved. (LocalStorage could help, though it won’t sync across devices.)
- 50MB PDF size limit – Prevents running out of cloud storage, but restricts very large reports.
- Showing backend errors directly – Quicker for debugging and transparency, but exposes vulnerabilities. Acceptable for a personal/internal project.

## What’s Next

- Save system – Allow users to save past PDFs and their embeddings for easy retrieval.
- Follow-up chat – Enable Q&A with the uploaded document for deeper analysis.
- Expert/LLM evaluation – Involve subject matter experts or an LLM agent to validate extracted initiatives.
- Export option – Let users download the generated results.
- Streaming support – Show results as they’re generated instead of waiting for the full list.
- Prompt editing – Let users tweak the extraction prompt if something is missed.
- Navigation improvements – Add a way to return to the home page from the report view.
- PDF highlighting – `react-pdf-viewer` doesn’t natively support multi-line highlighting. A workaround was added, but it may fail with certain texts and needs debugging.
