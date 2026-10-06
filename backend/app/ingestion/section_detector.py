import re
from typing import Optional, Tuple

SECTION_PATTERNS = [
    (r'(?i)^(?:abstract|summary)\b', "Abstract"),
    (r'(?i)^(?:1\.?|i\.?|section 1)?\s*(?:introduction|overview)\b', "1. Introduction"),
    (r'(?i)^(?:2\.?|ii\.?|section 2)?\s*(?:related work|background|literature review)\b', "2. Related Work"),
    (r'(?i)^(?:3\.?|iii\.?|section 3)?\s*(?:methodology|methods|proposed approach|system architecture|formulation)\b', "3. Methodology"),
    (r'(?i)^(?:4\.?|iv\.?|section 4)?\s*(?:experiments|experimental setup|evaluation|benchmarks)\b', "4. Experiments"),
    (r'(?i)^(?:5\.?|v\.?|section 5)?\s*(?:results|empirical results|findings)\b', "5. Results"),
    (r'(?i)^(?:6\.?|vi\.?|section 6)?\s*(?:discussion|analysis|error analysis)\b', "6. Discussion"),
    (r'(?i)^(?:7\.?|vii\.?|section 7)?\s*(?:conclusion|concluding remarks)\b', "7. Conclusion"),
    (r'(?i)^(?:limitations|ethical considerations|broader impact)\b', "Limitations"),
    (r'(?i)^(?:future work|open problems)\b', "Future Work"),
    (r'(?i)^(?:references|bibliography)\b', "References"),
]


def detect_section_header(line: str) -> Optional[str]:
    """
    Detect whether a single text line represents a standardized scientific section header.
    """
    clean_line = line.strip()
    if len(clean_line) > 80:  # Headers are rarely longer than 80 chars
        return None

    for pattern, canonical_name in SECTION_PATTERNS:
        if re.search(pattern, clean_line):
            return canonical_name

    return None
