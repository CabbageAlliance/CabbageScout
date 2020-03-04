from typing import Any, Dict, List


def data_to_csv(data: List[Dict[str, Any]], delimiter: str = ",") -> str:
    header = delimiter.join(k.replace("_", " ").title() for k in data[0].keys())
    values = "\n".join(
        delimiter.join(
            str(v).lower()  # cast to string, lowercase for javascript booleans
            if not isinstance(v, str)
            else f'"{v}"'.replace("\n", "\\n")  # sanitize strings
            for v in e.values()
        )
        for e in data
    )

    return f"{header}\n{values}"
