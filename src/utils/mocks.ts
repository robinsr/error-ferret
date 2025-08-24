import type { FeedbackItem } from '@/types';

export const mockFeedbackItems: FeedbackItem[] = [
  {
    line: 7,
    column: 1,
    snippet: 'import sys\r\nimport chromadb\r\nimport typer\r\n\r',
    feedback: 'Consider using a configuration management approach for constants like VAULT and CHROMA_DB_DIR. Hardcoding values can lead to difficulties in managing different environments (e.g., development, staging, production). You might want to use environment variables or a configuration file.'
  },
  {
    line: 19,
    column: 1,
    snippet: '\r\n' +
      'console = Console()\r\n' +
      'error_console = Console(stderr=True)\r\n' +
      'app = typer.Typer()\r',
    feedback: "The function 'eprint' is a good utility for error printing, but consider raising exceptions instead of calling sys.exit(1). This allows for better error handling and testing, as it can be caught by calling code."
  },
  {
    line: 27,
    column: 1,
    snippet: 'VAULT = "ryaaan-tech" # TODO: configurable\r\n' +
      'CHROMA_DB_DIR = "embeddings"   # Where you persist the ChromaDB\r\n' +
      'COLLECTION_NAME = "obsidian_notes"\r\n' +
      'EMBEDDING_MODEL = "all-MiniLM-L6-v2"\r',
    feedback: "The 'load' function is doing multiple things (loading the model and connecting to the database). Consider separating these concerns into distinct functions for better readability and maintainability."
  },
  {
    line: 35,
    column: 1,
    snippet: '    error_console.print(f"[bold red]Error[/bold red] {msg}")\r\n\r\n\r\n\r',
    feedback: "The 'encode_uri' function can be improved by using urllib.parse.quote instead of manual replacements. This will handle more edge cases and is more idiomatic."
  },
  {
    line: 45,
    column: 1,
    snippet: '    stat.update(">> Connecting to ChromaDB...")\r\n' +
      '    client = chromadb.PersistentClient(path=CHROMA_DB_DIR)\r\n' +
      '\r\n' +
      '    # Get collection\r',
    feedback: "In the 'query' function, instead of checking if 'query' is empty with 'if not query or len(query) == 0:', you can simplify this to 'if not query:'. This is more Pythonic and concise."
  },
  {
    line: 56,
    column: 1,
    snippet: '\r\n' +
      '\r\n' +
      '# Removes path components up to vault name\r\n' +
      'def relative_note_path(filepath):\r',
    feedback: 'When printing results, consider checking if results contain any documents before iterating over them. This avoids potential index errors if the query returns no results.'
  },
  {
    line: 60,
    column: 1,
    snippet: "    pattern = r'^.*/{}/'.format(re.escape(VAULT))\r\n" +
      "    return re.sub(pattern, '', filepath)\r\n" +
      '\r\n' +
      '\r',
    feedback: "The use of 'console.print()' for displaying results is good, but consider consolidating the printing logic into a separate function. This will help keep the 'query' function focused on its primary responsibility."
  },
  {
    line: 66,
    column: 1,
    snippet: '    vault = re.escape(VAULT)\r\n' +
      '    file = encode_uri(relative_note_path(filepath))\r\n' +
      '    return f"obsidian://open?vault={vault}&file={file}"\r\n' +
      '\r',
    feedback: "The use of 'typer.run(query)' is appropriate for a CLI application. However, consider adding a main guard to allow for easier testing of the 'query' function independently."
  }
]