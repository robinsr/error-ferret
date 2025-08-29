import type { ModelFindings } from '@errorferret/schemas';

export const mockChoices = [
  {
    index: 0,
    message: {
      role: 'assistant',
      content: '[\n' +
        '  {\n' +
        '    "line": "    vault = re.escape(VAULT)",\n' +
        '    "lineNumber": 64,\n' +
        '    "feedback": "Do not use re.escape for URL construction; it escapes for regex, not URIs, and can produce malformed or unsafe links. Use urllib.parse.quote for the vault value or build the query with urllib.parse.urlencode."\n' +
        '  },\n' +
        '  {\n' +
        '    "line": "    return uri.replace(\\" \\", \\"%20\\").replace(\\"/\\", \\"%2F\\")",\n' +
        '    "lineNumber": 53,\n' +
        '    "feedback": "Manual URL encoding is incomplete and error-prone (e.g., does not encode &, ?, #, %). Use urllib.parse.quote for path segments to prevent URI injection or broken links."\n' +
        '  },\n' +
        '  {\n' +
        '    "line": "        console.print(Markdown(doc.strip()))",\n' +
        '    "lineNumber": 108,\n' +
        '    "feedback": "Rendering untrusted content as Markdown can allow terminal control sequences or malicious links to be displayed. Sanitize input (strip control chars), and consider rendering as plain Text or a safe subset rather than arbitrary Markdown."\n' +
        '  },\n' +
        '  {\n' +
        `    "line": "        console.rule(f\\"Result {i+1} ({meta['source']})\\")",\n` +
        '    "lineNumber": 106,\n' +
        '    "feedback": "Interpolating untrusted strings into Rich output can enable markup/ANSI injection. Escape or disable markup for this value (e.g., wrap in rich.text.Text to avoid markup parsing or disable markup for this call)."\n' +
        '  },\n' +
        '  {\n' +
        '    "line": "    typer.run(query)",\n' +
        '    "lineNumber": 115,\n' +
        '    "feedback": "Uncaught exceptions will print full tracebacks revealing filesystem paths and internals. Wrap the CLI entrypoint or query logic in try/except to emit a concise error (optionally behind a --debug flag) and exit with a nonzero status."\n' +
        '  },\n' +
        '  {\n' +
        '    "line": "    client = chromadb.PersistentClient(path=CHROMA_DB_DIR)",\n' +
        '    "lineNumber": 44,\n' +
        '    "feedback": "Persistent storage may include sensitive embeddings; ensure the directory is created with restrictive permissions (e.g., 0700) before use and verify permissions at startup to prevent other users from reading the data."\n' +
        '  },\n' +
        '  {\n' +
        '    "line": "    query_embedding = embedder.encode(query)",\n' +
        '    "lineNumber": 82,\n' +
        '    "feedback": "Embedding arbitrarily long input can be abused for DoS. Enforce a maximum query length and reject or truncate overly long inputs to limit CPU/memory usage."\n' +
        '  },\n' +
        '  {\n' +
        '    "line": "    embedder = SentenceTransformer(EMBEDDING_MODEL)",\n' +
        '    "lineNumber": 40,\n' +
        '    "feedback": "Loading models from remote hubs without pinning increases supply-chain risk. Pin a specific model revision and dependency versions, verify checksums, and prefer offline cache/local files to avoid unexpected model/code changes."\n' +
        '  }\n' +
        ']',
      refusal: null,
      annotations: []
    },
    finish_reason: 'stop'
  }
]

export const mockGtp5Response: ModelFindings = [
  {
    file: 'text',
    lineIds: [ 'L-1b6esw7', 'L-d2ku5c' ],
    severity: 'high',
    focus: 'performance',
    message: 'Synchronous filesystem calls inside a request handler block the event loop; switch to async fs APIs and batch work (e.g., Promise.all) to avoid per-request blocking.',
    codeQuote: 'readdirSync'
  },
  {
    file: 'text',
    lineIds: [ 'L-fu0j8v' ],
    severity: 'high',
    focus: 'performance',
    message: 'The 1e8 iteration loop is CPU-bound and will block the event loop under load; offload this work to a Worker Thread or a background job.',
    codeQuote: 'for (let i = 0; i < 1e8; i++) sum += i;'
  },
  {
    file: 'text',
    lineIds: [ 'L-utw3o3' ],
    severity: 'high',
    focus: 'clarity',
    message: 'Evaluating request-provided code makes behavior opaque and unpredictable; replace eval with explicit, well-defined operations.',
    codeQuote: 'eval(req.body.fn'
  },
  {
    file: 'text',
    lineIds: [ 'L-48vexp', 'L-hgrl59', 'L-ro70ut' ],
    severity: 'medium',
    focus: 'clarity',
    message: 'Using @ts-ignore suppresses type checking and hides real issues, reducing maintainability; prefer proper typing or targeted casts.',
    codeQuote: '@ts-ignore'
  },
  {
    file: 'text',
    lineIds: [ 'L-7o0l6q', 'L-1t41gas', 'L-yp76u' ],
    severity: 'high',
    focus: 'performance',
    message: 'Process-global cache without bounds or TTL can grow unbounded, causing memory bloat and GC pressure; use a bounded cache (e.g., LRU) with eviction and TTL.',
    codeQuote: 'global.cache'
  },
  {
    file: 'text',
    lineIds: [ 'L-1jvnvef' ],
    severity: 'medium',
    focus: 'performance',
    message: 'Selecting all columns and constructing ad-hoc SQL prevents statement reuse and fetches unnecessary data; select only needed columns and use parameterized queries for better plan caching.',
    codeQuote: 'SELECT * FROM users'
  },
  {
    file: 'text',
    lineIds: [ 'L-yziev1' ],
    severity: 'medium',
    focus: 'performance',
    message: 'The files endpoint returns the entire directory listing and metadata; for large directories this causes latency and memory spikes—add pagination/limits and consider lazy-loading metadata.',
    codeQuote: '/files'
  },
  {
    file: 'text',
    lineIds: [
      'L-1id413q',
      'L-1j09141',
      'L-1ubmyvp',
      'L-4pbyxy',
      'L-69tnpe',
      'L-xs0suj',
      'L-kyshef'
    ],
    severity: 'medium',
    focus: 'clarity',
    message: 'Fire-and-forget slowSideEffect obscures control flow and error handling; either await it (with timeout/retries) or explicitly decouple via a job queue and handle failures.',
    codeQuote: 'slowSideEffect(req.body?.payload)'
  }
]